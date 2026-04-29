'use server';

/**
 * Digital Godfather - Agent Server Actions
 * 
 * Handles Start/Stop Agent commands from the UI.
 */

import { 
  createAgent, 
  createMission, 
  executeMission,
  AGENT_TEMPLATES,
  AgentConfig,
  MissionConfig
} from '@/lib/agents/engines';
import { saveToAgentMemory, saveSyndicateExecution, updateSyndicateExecution } from '@/lib/agents/engines/memory';
import { AgentExecution, AgentType, AgentLog } from '@/types';

// Response type
interface ActionResponse {
  success: boolean;
  message: string;
  data?: AgentExecution;
}

/**
 * Execute agent command
 */
export async function executeAgentCommand(
  command: string,
  targetAgent: AgentType | 'godfather' = 'godfather'
): Promise<ActionResponse> {
  try {
    // Get agent based on type
    let agent: AgentConfig;
    
    switch (targetAgent) {
      case 'openclaw':
        agent = AGENT_TEMPLATES.researchAnalyst();
        break;
      case 'autogpt':
      case 'plandex':
        agent = AGENT_TEMPLATES.codeDeveloper();
        break;
      default:
        agent = AGENT_TEMPLATES.opsManager();
    }

    // Create mission
    const mission = createMission(command);

    // Execute
    const result = await executeMission(agent, mission);

    // Save to memory if successful
    if (result.status === 'completed') {
      await saveToAgentMemory(
        agent.id,
        agent.name,
        agent.role,
        command,
        result.output || ''
      );
    }

    return {
      success: result.status === 'completed',
      message: result.status === 'completed' ? 'Mission completed' : 'Mission failed',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get agent status
 */
export async function getAgentStatus(agentType: string): Promise<{
  status: string;
  memory: number;
}> {
  return {
    status: 'idle',
    memory: 0,
  };
}

/**
 * Get available agents
 */
export async function getAvailableAgents(): Promise<AgentConfig[]> {
  return [
    AGENT_TEMPLATES.researchAnalyst(),
    AGENT_TEMPLATES.codeDeveloper(),
    AGENT_TEMPLATES.contentWriter(),
    AGENT_TEMPLATES.dataAnalyst(),
    AGENT_TEMPLATES.opsManager(),
  ];
}