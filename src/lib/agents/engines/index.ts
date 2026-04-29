/**
 * Digital Godfather - Agent Brain
 * Engine for AI agent execution
 */

import { AgentLog, AgentExecution } from '@/types';

// Agent configuration
export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  tools: string[];
  verbose: boolean;
  maxIterations: number;
  allowDelegation: boolean;
  memory: { mission: string; result: string; timestamp: string }[];
}

// Mission configuration
export interface MissionConfig {
  id: string;
  description: string;
  expectedOutput?: string;
  agentId?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string;
}

// Generate unique ID
const generateId = (prefix: string) => 
  `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

// Simple delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Execute agent mission
 */
export async function executeMission(
  agent: AgentConfig,
  mission: MissionConfig,
  onLog?: (log: AgentLog) => void,
  onThink?: (thought: string) => void
): Promise<AgentExecution> {
  const execution: AgentExecution = {
    id: generateId('exec'),
    agentId: agent.id,
    command: mission.description,
    status: 'running',
    startTime: new Date(),
  };

  onLog?.({
    id: generateId('log'),
    timestamp: new Date(),
    level: 'info',
    message: `[${agent.name}] Starting mission`,
    source: agent.name,
  });

  try {
    onThink?.(`Processing...`);
    
    // Simulate processing
    for (let i = 1; i <= Math.min(3, agent.maxIterations); i++) {
      await delay(400 + Math.random() * 600);
      onLog?.({
        id: generateId('log'),
        timestamp: new Date(),
        level: 'debug',
        message: `[${agent.name}] Iteration ${i}`,
        source: agent.name,
      });
    }

    // Generate response
    const responses = [
      `[${agent.name}] Mission complete!\n\nTask: ${mission.description}\n\nStatus: SUCCESS\nAll objectives achieved.`,
      `[${agent.name}] Execution finished\n\nProcessed: ${mission.description}\n\nResults delivered successfully.`,
      `[${agent.name}] Done!\n\n${mission.description}\n\nReady for next task.`,
    ];
    
    execution.output = responses[Math.floor(Math.random() * responses.length)];
    execution.status = 'completed';

    // Save to memory
    agent.memory.push({
      mission: mission.description,
      result: execution.output,
      timestamp: new Date().toISOString(),
    });
    
    // Keep last 50
    if (agent.memory.length > 50) {
      agent.memory = agent.memory.slice(-50);
    }

  } catch (error) {
    execution.status = 'error';
    execution.output = error instanceof Error ? error.message : 'Unknown error';
  }

  execution.endTime = new Date();
  return execution;
}

/**
 * Create agent
 */
export function createAgent(
  name: string,
  role: string,
  goal: string,
  backstory: string,
  tools: string[] = [],
  options?: { verbose?: boolean; maxIterations?: number; allowDelegation?: boolean }
): AgentConfig {
  return {
    id: generateId('agent'),
    name,
    role,
    goal,
    backstory,
    tools,
    verbose: options?.verbose ?? true,
    maxIterations: options?.maxIterations ?? 25,
    allowDelegation: options?.allowDelegation ?? true,
    memory: [],
  };
}

/**
 * Create mission
 */
export function createMission(
  description: string,
  expectedOutput?: string,
  agentId?: string
): MissionConfig {
  return {
    id: generateId('mission'),
    description,
    expectedOutput,
    agentId,
    status: 'pending',
  };
}

// Agent templates
export const AGENT_TEMPLATES = {
  researchAnalyst: () => createAgent(
    'Godfather Research Analyst',
    'Research Analyst',
    'Find and synthesize information accurately',
    'Expert researcher with analytical skills',
    ['Web Search', 'Data Analysis', 'Fact Checking']
  ),
  codeDeveloper: () => createAgent(
    'Godfather Code Developer',
    'Code Developer',
    'Write clean, efficient code',
    'Senior software engineer',
    ['Code Writing', 'Debugging', 'Testing']
  ),
  contentWriter: () => createAgent(
    'Godfather Content Writer',
    'Content Writer',
    'Create engaging content',
    'Professional writer',
    ['Writing', 'Editing', 'SEO']
  ),
  dataAnalyst: () => createAgent(
    'Godfather Data Analyst',
    'Data Analyst',
    'Extract insights from data',
    'Statistical expert',
    ['Data Processing', 'Visualization', 'Reporting']
  ),
  opsManager: () => createAgent(
    'Godfather Ops Manager',
    'Ops Manager',
    'Coordinate workflows',
    'Operations specialist',
    ['Workflow Design', 'Monitoring', 'Automation']
  ),
};