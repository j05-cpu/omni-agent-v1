import { useGodfatherStore } from './store';
import { getAllAgents, getAgentByType, createGodfatherAgent } from '@/lib/agents';
import { AgentLog, AgentExecution, AgentType } from '@/types';

class ExecutionService {
  private logCallback(log: AgentLog) {
    useGodfatherStore.getState().addLog(log);
  }

  async executeCommand(command: string, targetAgent?: AgentType): Promise<AgentExecution> {
    const trimmed = command.trim();
    
    if (!trimmed) {
      throw new Error('Command cannot be empty');
    }

    // If no specific agent, use Godfather as orchestrator
    const agentType = targetAgent || 'godfather';
    
    // Get the appropriate agent
    const agent = agentType === 'godfather' 
      ? createGodfatherAgent(this.logCallback.bind(this))
      : getAgentByType(agentType, this.logCallback.bind(this));

    if (!agent) {
      throw new Error(`Unknown agent type: ${agentType}`);
    }

    // Update agent status to running
    useGodfatherStore.getState().setAgentStatus(agent.id, 'running');

    // Update neural node status
    useGodfatherStore.getState().updateNeuralNode(
      agentType === 'godfather' ? 'root' : agentType,
      { status: 'running' }
    );

    try {
      // Execute the command
      const result = await agent.execute(trimmed);
      
      // Update execution state
      useGodfatherStore.getState().addExecution(result);
      useGodfatherStore.getState().setActiveExecution(result);
      
      // Update agent status to completed
      useGodfatherStore.getState().setAgentStatus(agent.id, 'completed');
      
      // Update neural node status
      useGodfatherStore.getState().updateNeuralNode(
        agentType === 'godfather' ? 'root' : agentType,
        { status: 'completed' }
      );

      // Add to command history
      useGodfatherStore.getState().addCommandToHistory(trimmed);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Update agent status to error
      useGodfatherStore.getState().setAgentStatus(agent.id, 'error');
      
      // Update neural node status
      useGodfatherStore.getState().updateNeuralNode(
        agentType === 'godfather' ? 'root' : agentType,
        { status: 'error' }
      );

      this.logCallback({
        id: Math.random().toString(36).substring(2, 15),
        timestamp: new Date(),
        level: 'error',
        message: `[Error] ${errorMessage}`,
        source: agentType,
      });

      throw error;
    }
  }

  getAvailableAgents() {
    return getAllAgents(this.logCallback.bind(this));
  }

  resetAgentStatuses() {
    const store = useGodfatherStore.getState();
    store.setAgentStatus('godfather-001', 'running');
    store.setAgentStatus('openclaw-001', 'idle');
    store.setAgentStatus('autogpt-001', 'idle');
    store.setAgentStatus('plandex-001', 'idle');
  }
}

export const executionService = new ExecutionService();