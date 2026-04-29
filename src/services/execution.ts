/**
 * Execution Service
 * Provides executionService for CLI components
 */

import { useGodfatherStore } from './store';
import { AgentExecution, AgentLog, AgentType } from '@/types';

// Re-export from new actions module
import { executeAgentCommand } from '@/app/actions';

/**
 * Execute command using server action
 */
export const executionService = {
  async executeCommand(command: string, targetAgent?: AgentType): Promise<AgentExecution> {
    const result = await executeAgentCommand(command, targetAgent || 'godfather');
    return result.data || {
      id: `exec-${Date.now()}`,
      agentId: targetAgent || 'godfather',
      command,
      status: 'error',
      startTime: new Date(),
      endTime: new Date(),
      output: result.message,
    };
  },

  getAvailableAgents() {
    return [
      { id: 'researcher-001', name: 'Godfather Researcher', role: 'researcher' },
      { id: 'architect-001', name: 'Godfather Architect', role: 'architect' },
      { id: 'syndicate-001', name: 'Digital Godfather', role: 'syndicate' },
    ];
  },

  async resetAgentStatuses() {
    // Reset to idle
  },
};