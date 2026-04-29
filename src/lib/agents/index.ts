import { AgentConfig, AgentLog, AgentExecution, AgentType, AgentStatus } from '@/types';

export interface MockAgent extends AgentConfig {
  execute(command: string): Promise<AgentExecution>;
  getStatus(): AgentStatus;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createOpenClawAgent = (onLog?: (log: AgentLog) => void): MockAgent => ({
  id: 'openclaw-001',
  name: 'OpenClaw',
  type: 'openclaw',
  description: 'Autonomous web crawling and data extraction agent with advanced scraping capabilities',
  version: '2.4.1',
  capabilities: [
    'Web scraping',
    'Data extraction',
    'PDF parsing',
    'JavaScript rendering',
    'Rate limiting',
  ],
  
  getStatus: () => 'idle',
  
  execute: async (command: string) => {
    const execution: AgentExecution = {
      id: generateId(),
      agentId: 'openclaw-001',
      command,
      status: 'running',
      startTime: new Date(),
    };

    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'info',
      message: `[OpenClaw] Starting crawl task: ${command}`,
      source: 'openclaw',
    });

    await delay(500);
    
    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: '[OpenClaw] Initializing Puppeteer engine...',
      source: 'openclaw',
    });

    await delay(800);
    
    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: '[OpenClaw] Fetching target URLs...',
      source: 'openclaw',
    });

    await delay(600);
    
    const mockOutput = `[OpenClaw] Crawl Complete
─────────────────
✓ URLs discovered: 247
✓ Pages scraped: 156
✓ Data records: 1,293
✓ Images downloaded: 89
✓ PDFs processed: 12

Data saved to: /data/openclaw/${execution.id}`;

    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'info',
      message: '[OpenClaw] Task completed successfully',
      source: 'openclaw',
    });

    return {
      ...execution,
      status: 'completed',
      endTime: new Date(),
      output: mockOutput,
    };
  },
});

export const createAutoGPTAgent = (onLog?: (log: AgentLog) => void): MockAgent => ({
  id: 'autogpt-001',
  name: 'AutoGPT',
  type: 'autogpt',
  description: 'Self-prompting AI agent that autonomously breaks down and executes complex tasks',
  version: '4.2.0',
  capabilities: [
    'Task decomposition',
    'Self-prompting',
    'Memory persistence',
    'Tool use',
    'Multi-step reasoning',
  ],
  
  getStatus: () => 'idle',
  
  execute: async (command: string) => {
    const execution: AgentExecution = {
      id: generateId(),
      agentId: 'autogpt-001',
      command,
      status: 'running',
      startTime: new Date(),
    };

    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'info',
      message: `[AutoGPT] Task received: ${command}`,
      source: 'autogpt',
    });

    await delay(400);
    
    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: '[AutoGPT] Analyzing task requirements...',
      source: 'autogpt',
    });

    await delay(600);
    
    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: '[AutoGPT] Sub-task 1/3: Planning approach',
      source: 'autogpt',
    });

    await delay(500);
    
    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: '[AutoGPT] Sub-task 2/3: Executing primary objective',
      source: 'autogpt',
    });

    await delay(700);
    
    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: '[AutoGPT] Sub-task 3/3: Validating results',
      source: 'autogpt',
    });

    await delay(400);
    
    const mockOutput = `[AutoGPT] Execution Complete
─────────────────────
✓ Task decomposed into: 3 subtasks
✓ Primary objective: ACHIEVED
✓ Secondary goals: 2/2 COMPLETED

Results:
• Analysis: 156 lines of code generated
• Tests: 23 test cases passed
• Documentation: Auto-generated

Memory saved to: /memory/autogpt/session-${execution.id}`;

    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'info',
      message: '[AutoGPT] All objectives completed',
      source: 'autogpt',
    });

    return {
      ...execution,
      status: 'completed',
      endTime: new Date(),
      output: mockOutput,
    };
  },
});

export const createPlandexAgent = (onLog?: (log: AgentLog) => void): MockAgent => ({
  id: 'plandex-001',
  name: 'Plandex',
  type: 'plandex',
  description: 'AI-powered code engineering agent specifically designed for complex codebase modifications',
  version: '1.8.3',
  capabilities: [
    'Codebase-aware editing',
    'Multi-file refactoring',
    'Dependency analysis',
    'Test generation',
    'Semantic search',
  ],
  
  getStatus: () => 'idle',
  
  execute: async (command: string) => {
    const execution: AgentExecution = {
      id: generateId(),
      agentId: 'plandex-001',
      command,
      status: 'running',
      startTime: new Date(),
    };

    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'info',
      message: `[Plandex] Processing: ${command}`,
      source: 'plandex',
    });

    await delay(300);
    
    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: '[Plandex] Indexing codebase...',
      source: 'plandex',
    });

    await delay(500);
    
    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: '[Plandex] Analyzing code structure and dependencies...',
      source: 'plandex',
    });

    await delay(700);
    
    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: '[Plandex] Identified 12 files for modification',
      source: 'plandex',
    });

    await delay(600);
    
    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: '[Plandex] Applying changes...',
      source: 'plandex',
    });

    await delay(800);
    
    const mockOutput = `[Plandex] Code Engineering Complete
─────────────────────────────────
✓ Files analyzed: 847
✓ Files modified: 12
✓ Dependencies resolved: 34
✓ Tests generated: 8

Changes:
• api/handlers/user.ts - Modified
• utils/auth.ts - Refactored  
• components/UI/* - Updated
• tests/integration/* - Added

Build Status: ✓ PASSED
Test Coverage: 94%`;

    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'info',
      message: '[Plandex] Code engineering complete',
      source: 'plandex',
    });

    return {
      ...execution,
      status: 'completed',
      endTime: new Date(),
      output: mockOutput,
    };
  },
});

export const createGodfatherAgent = (onLog?: (log: AgentLog) => void): MockAgent => ({
  id: 'godfather-001',
  name: 'Godfather',
  type: 'godfather',
  description: 'Central orchestrator agent that manages and coordinates all child agents',
  version: '1.0.0',
  capabilities: [
    'Agent orchestration',
    'Command routing',
    'State management',
    'Neural mapping',
    'Cross-agent communication',
  ],
  
  getStatus: () => 'running',
  
  execute: async (command: string) => {
    const execution: AgentExecution = {
      id: generateId(),
      agentId: 'godfather-001',
      command,
      status: 'running',
      startTime: new Date(),
    };

    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'info',
      message: `[Godfather] Command received: ${command}`,
      source: 'godfather',
    });

    await delay(200);
    
    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: '[Godfather] Analyzing command intent...',
      source: 'godfather',
    });

    await delay(300);
    
    const mockOutput = `[Godfather] Orchestration Complete
─────────────────────────────────
✓ Command analyzed and dispatched
✓ Target agents identified
✓ Execution coordinated

Child Agents Status:
• OpenClaw: STANDBY
• AutoGPT: STANDBY  
• Plandex: STANDBY

The Godfather watches. The Godfather waits.`;

    onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'info',
      message: '[Godfather] Orchestration complete',
      source: 'godfather',
    });

    return {
      ...execution,
      status: 'completed',
      endTime: new Date(),
      output: mockOutput,
    };
  },
});

export const getAllAgents = (onLog?: (log: AgentLog) => void): MockAgent[] => [
  createGodfatherAgent(onLog),
  createOpenClawAgent(onLog),
  createAutoGPTAgent(onLog),
  createPlandexAgent(onLog),
];

export const getAgentByType = (type: AgentType, onLog?: (log: AgentLog) => void): MockAgent | undefined => {
  const agents = getAllAgents(onLog);
  return agents.find(agent => agent.type === type);
};