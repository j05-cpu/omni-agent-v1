import { useGodfatherStore } from './store';
import { AgentFactory, IAgent } from '@/lib/agents/engines/AgentFactory';
import { db } from '@/lib/supabaseClient';
import { AgentLog, AgentExecution, AgentType } from '@/types';

/**
 * Execution Service - Uses Agent Factory with stealth mapping
 * No external agent names are exposed to users
 */
class ExecutionService {
  private logCallback(log: AgentLog) {
    useGodfatherStore.getState().addLog(log);
  }

  /**
   * Map AgentType to internal engine role
   */
  private mapAgentTypeToRole(type?: AgentType | 'godfather'): 'researcher' | 'architect' | 'syndicate' {
    switch (type) {
      case 'openclaw':
        return 'researcher';
      case 'autogpt':
      case 'plandex':
        return 'architect';
      case 'godfather':
      default:
        return 'architect';
    }
  }

  async executeCommand(command: string, targetAgent?: AgentType): Promise<AgentExecution> {
    const trimmed = command.trim();
    
    if (!trimmed) {
      throw new Error('Command cannot be empty');
    }

    // Map agent type to factory role (stealth mapping)
    const role = this.mapAgentTypeToRole(targetAgent);
    const agent = AgentFactory.getAgentByRole(role, this.logCallback.bind(this));

    // Update agent status
    useGodfatherStore.getState().setAgentStatus(agent.id, 'running');
    
    // Update neural node status
    useGodfatherStore.getState().updateNeuralNode(
      role === 'architect' ? 'root' : role,
      { status: 'running' }
    );

    // Save to database
    await db.updateAgentStatus(agent.id, 'running');

    try {
      // Execute using factory agent (stealth mode)
      const result = await agent.execute(trimmed);
      
      // Update execution state
      useGodfatherStore.getState().addExecution(result);
      useGodfatherStore.getState().setActiveExecution(result);
      
      // Update agent status
      useGodfatherStore.getState().setAgentStatus(agent.id, result.status);
      
      // Update neural node status
      useGodfatherStore.getState().updateNeuralNode(
        role === 'architect' ? 'root' : role,
        { status: result.status }
      );

      // Save to database
      await db.updateAgentStatus(agent.id, result.status);
      await db.saveMemory(agent.id, 'user', trimmed);
      if (result.output) {
        await db.saveMemory(agent.id, 'assistant', result.output);
      }

      // Add to command history
      useGodfatherStore.getState().addCommandToHistory(trimmed);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Update agent status to error
      useGodfatherStore.getState().setAgentStatus(agent.id, 'error');
      
      useGodfatherStore.getState().updateNeuralNode(
        role === 'architect' ? 'root' : role,
        { status: 'error' }
      );

      await db.updateAgentStatus(agent.id, 'error');

      this.logCallback({
        id: Math.random().toString(36).substring(2, 15),
        timestamp: new Date(),
        level: 'error',
        message: `[Error] ${errorMessage}`,
        source: agent.name,
      });

      throw error;
    }
  }

  /**
   * Get all available Digital Godfather agents (stealth names only)
   */
  getAvailableAgents() {
    return AgentFactory.getAllAgents(this.logCallback.bind(this));
  }

  /**
   * Reset agent statuses
   */
  async resetAgentStatuses() {
    const store = useGodfatherStore.getState();
    store.setAgentStatus('researcher-001', 'idle');
    store.setAgentStatus('architect-001', 'idle');
    store.setAgentStatus('syndicate-001', 'idle');
    
    await db.updateAgentStatus('researcher-001', 'idle');
    await db.updateAgentStatus('architect-001', 'idle');
    await db.updateAgentStatus('syndicate-001', 'idle');
  }
}

export const executionService = new ExecutionService();