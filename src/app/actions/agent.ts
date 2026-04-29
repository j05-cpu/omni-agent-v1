'use server';

import { AgentFactory, IAgent } from '@/lib/agents/engines/AgentFactory';
import { db } from '@/lib/supabaseClient';
import { AgentLog, AgentExecution, AgentType, AgentStatus } from '@/types';

/**
 * Digital Godfather - Server Actions
 * 
 * Handles Start/Stop Agent commands from the UI.
 * Uses the Agent Factory internally with stealth mapping.
 */

// Types for action responses
interface ActionResponse {
  success: boolean;
  message: string;
  data?: AgentExecution;
}

// Map agent types to internal engines (stealth mapping)
function mapAgentTypeToEngine(type: AgentType | 'godfather'): 'researcher' | 'architect' | 'syndicate' {
  switch (type) {
    case 'openclaw':
      return 'researcher';
    case 'autogpt':
    case 'plandex':
      return 'architect';
    case 'godfather':
    default:
      return 'syndicate'; // Default to syndicate for orchestration
  }
}

/**
 * Start an agent execution
 */
export async function executeAgentCommand(
  command: string,
  targetAgent: AgentType | 'godfather' = 'godfather'
): Promise<ActionResponse> {
  try {
    // Get the appropriate agent role from the target
    const role = mapAgentTypeToEngine(targetAgent);
    
    // Create callback to log to database
    const logCallback = async (log: AgentLog) => {
      await db.insertExecutionLog({
        execution_id: '', // Will be set after execution
        agent_id: `${role}-001`,
        level: log.level,
        message: log.message,
      });
    };

    // Create agent using factory (stealth mode - no external names)
    const agent = AgentFactory.getAgentByRole(role, logCallback);
    
    // Update status in database
    await db.updateAgentStatus(agent.id, 'running');
    
    // Execute the command
    const result = await agent.execute(command);
    
    // Update status in database
    await db.updateAgentStatus(agent.id, result.status);
    
    // Save to memory
    await db.saveMemory(agent.id, 'user', command);
    await db.saveMemory(agent.id, 'assistant', result.output || 'Execution complete');
    
    return {
      success: true,
      message: `${agent.name} completed successfully`,
      data: result,
    };
  } catch (error) {
    console.error('[Digital Godfather] Execute error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Start an agent (alias for executeAgentCommand)
 */
export async function startAgent(
  agentType: AgentType | 'godfather',
  task?: string
): Promise<ActionResponse> {
  return executeAgentCommand(task || 'Execute default task', agentType);
}

/**
 * Stop an agent execution
 */
export async function stopAgent(agentId: string): Promise<ActionResponse> {
  try {
    // Update agent status to idle
    const success = await db.updateAgentStatus(agentId, 'idle');
    
    return {
      success,
      message: success ? 'Agent stopped successfully' : 'Failed to stop agent',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get all available agents
 */
export async function getAgents(): Promise<IActionResponse> {
  try {
    const agents = await db.getAgents();
    return {
      success: true,
      message: 'Agents fetched',
      data: agents as unknown as AgentExecution,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch agents',
    };
  }
}

interface IActionResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * Get agent status from database
 */
export async function getAgentStatus(agentId: string): Promise<AgentStatus> {
  const agents = await db.getAgents();
  const agent = agents.find(a => a.id === agentId);
  return agent?.status || 'idle';
}

/**
 * Get agent statuses for dashboard
 */
export async function getAllAgentStatuses(): Promise<Record<string, AgentStatus>> {
  const agents = await db.getAgents();
  const statuses: Record<string, AgentStatus> = {};
  
  agents.forEach(agent => {
    statuses[agent.id] = agent.status;
  });
  
  return statuses;
}