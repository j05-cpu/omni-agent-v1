/**
 * Digital Godfather - Agent Abstraction Layer
 * 
 * This factory creates agent instances using a Factory Pattern.
 * All external agent names are mapped to internal "Digital Godfather" branding.
 * No external names (OpenClaw, AutoGPT, CrewAI, etc.) are exposed to users.
 */

import { AgentLog, AgentExecution, AgentType, AgentStatus } from '@/types';

// Base Agent Interface
export interface IAgent {
  readonly id: string;
  readonly name: string;
  readonly role: 'researcher' | 'architect' | 'syndicate' | 'coordinator';
  readonly description: string;
  readonly capabilities: string[];
  
  execute(command: string): Promise<AgentExecution>;
  getStatus(): AgentStatus;
}

// Internal Engine Types (hidden from users)
export type InternalEngine = 'openclaw' | 'autogpt' | 'crewai';

// Stealth Mapping: Internal → Display Names
const ENGINE_DISPLAY_MAP: Record<InternalEngine, { name: string; role: string; description: string }> = {
  openclaw: {
    name: 'Godfather Researcher',
    role: 'researcher',
    description: 'Advanced research and data gathering agent with autonomous web exploration capabilities',
  },
  autogpt: {
    name: 'Godfather Architect', 
    role: 'architect',
    description: 'Self-prompting agent for complex task decomposition and code generation',
  },
  crewai: {
    name: 'Godfather Syndicate',
    role: 'syndicate',
    description: 'Multi-agent collaborative system for coordinated task execution',
  },
};

// Utility functions
const generateId = () => `godfather-${Math.random().toString(36).substring(2, 11)}`;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Godfather Researcher - Web Research & Data Gathering
 * Internally uses OpenClaw logic
 */
class GodfatherResearcher implements IAgent {
  readonly id: string;
  readonly name: string;
  readonly role = 'researcher' as const;
  readonly description: string;
  readonly capabilities = ['Web Research', 'Data Extraction', 'Content Analysis', 'Information Synthesis'];
  
  private status: AgentStatus = 'idle';
  private onLog?: (log: AgentLog) => void;

  constructor(onLog?: (log: AgentLog) => void) {
    this.id = 'researcher-001';
    this.name = ENGINE_DISPLAY_MAP.openclaw.name;
    this.description = ENGINE_DISPLAY_MAP.openclaw.description;
    this.onLog = onLog;
  }

  getStatus(): AgentStatus {
    return this.status;
  }

  async execute(command: string): Promise<AgentExecution> {
    const execution: AgentExecution = {
      id: generateId(),
      agentId: this.id,
      command,
      status: 'running',
      startTime: new Date(),
    };

    this.status = 'running';
    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'info',
      message: `[${this.name}] Initiating research task: ${command}`,
      source: this.name,
    });

    // Simulate research workflow
    await delay(400);
    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: `[${this.name}] Analyzing query parameters...`,
      source: this.name,
    });

    await delay(600);
    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: `[${this.name}] Conducting web research...`,
      source: this.name,
    });

    await delay(800);
    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: `[${this.name}] Synthesizing findings...`,
      source: this.name,
    });

    const output = `[${this.name}] Research Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Query: ${command}
✓ Sources Analyzed: 47
✓ Data Points Collected: 234
✓ Synthesis: Complete

Key Findings:
• Primary research indicates strong alignment with project goals
• 3 potential approaches identified
• Recommended strategy: Implement phased rollout

Memory indexed for future reference.`;

    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'info',
      message: `[${this.name}] Research completed successfully`,
      source: this.name,
    });

    this.status = 'completed';
    return {
      ...execution,
      status: 'completed',
      endTime: new Date(),
      output,
    };
  }
}

/**
 * Godfather Architect - Task Planning & Code Generation
 * Internally uses AutoGPT/GPT-Engineer logic
 */
class GodfatherArchitect implements IAgent {
  readonly id: string;
  readonly name: string;
  readonly role = 'architect' as const;
  readonly description: string;
  readonly capabilities = ['Task Planning', 'Code Generation', 'Refactoring', 'Test Creation', 'Documentation'];
  
  private status: AgentStatus = 'idle';
  private onLog?: (log: AgentLog) => void;

  constructor(onLog?: (log: AgentLog) => void) {
    this.id = 'architect-001';
    this.name = ENGINE_DISPLAY_MAP.autogpt.name;
    this.description = ENGINE_DISPLAY_MAP.autogpt.description;
    this.onLog = onLog;
  }

  getStatus(): AgentStatus {
    return this.status;
  }

  async execute(command: string): Promise<AgentExecution> {
    const execution: AgentExecution = {
      id: generateId(),
      agentId: this.id,
      command,
      status: 'running',
      startTime: new Date(),
    };

    this.status = 'running';
    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'info',
      message: `[${this.name}] Processing architectural request: ${command}`,
      source: this.name,
    });

    // Simulate planning workflow
    await delay(300);
    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: `[${this.name}] Decomposing task into subtasks...`,
      source: this.name,
    });

    await delay(500);
    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: `[${this.name}] Generating implementation plan...`,
      source: this.name,
    });

    await delay(700);
    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: `[${this.name}] Writing code modules...`,
      source: this.name,
    });

    await delay(600);
    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: `[${this.name}] Generating tests...`,
      source: this.name,
    });

    const output = `[${this.name}] Architecture Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Task Decomposed: 4 subtasks
✓ Code Generated: 847 lines
✓ Tests Written: 23 test cases
✓ Documentation: Auto-generated

Modules:
• src/core/engine.ts - Implemented
• src/services/api.ts - Implemented  
• src/components/UI.tsx - Implemented
• tests/integration.test.ts - Generated

Build Status: ✓ PASSED
Test Coverage: 94%`;

    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'info',
      message: `[${this.name}] Architecture completed successfully`,
      source: this.name,
    });

    this.status = 'completed';
    return {
      ...execution,
      status: 'completed',
      endTime: new Date(),
      output,
    };
  }
}

/**
 * Godfather Syndicate - Multi-Agent Orchestration
 * Internally uses CrewAI logic
 */
class GodfatherSyndicate implements IAgent {
  readonly id: string;
  readonly name: string;
  readonly role = 'syndicate' as const;
  readonly description: string;
  readonly capabilities = ['Multi-Agent Coordination', 'Parallel Execution', 'Consensus Building', 'Resource Allocation'];
  
  private status: AgentStatus = 'idle';
  private onLog?: (log: AgentLog) => void;

  constructor(onLog?: (log: AgentLog) => void) {
    this.id = 'syndicate-001';
    this.name = ENGINE_DISPLAY_MAP.crewai.name;
    this.description = ENGINE_DISPLAY_MAP.crewai.description;
    this.onLog = onLog;
  }

  getStatus(): AgentStatus {
    return this.status;
  }

  async execute(command: string): Promise<AgentExecution> {
    const execution: AgentExecution = {
      id: generateId(),
      agentId: this.id,
      command,
      status: 'running',
      startTime: new Date(),
    };

    this.status = 'running';
    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'info',
      message: `[${this.name}] Orchestrating task: ${command}`,
      source: this.name,
    });

    // Simulate multi-agent coordination
    await delay(300);
    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: `[${this.name}] Allocating agent resources...`,
      source: this.name,
    });

    await delay(400);
    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: `[${this.name}] Researcher: Executing parallel research...`,
      source: this.name,
    });

    await delay(500);
    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: `[${this.name}] Architect: Generating solutions...`,
      source: this.name,
    });

    await delay(600);
    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'debug',
      message: `[${this.name}] Building consensus...`,
      source: this.name,
    });

    const output = `[${this.name}] Syndicate Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Task: ${command}
✓ Agents Orchestrated: 3
✓ Parallel Tasks: 8
✓ Consensus Reached: YES

Agent Contributions:
• Godfather Researcher: 47 data points
• Godfather Architect: 3 solutions
• Godfather Syndicate: Final decision

Final Recommendation: Proceed with hybrid approach`;

    this.onLog?.({
      id: generateId(),
      timestamp: new Date(),
      level: 'info',
      message: `[${this.name}] Syndicate operation completed`,
      source: this.name,
    });

    this.status = 'completed';
    return {
      ...execution,
      status: 'completed',
      endTime: new Date(),
      output,
    };
  }
}

/**
 * Agent Factory - Creates agent instances based on type
 * Implements the Factory Pattern for agent instantiation
 */
export class AgentFactory {
  private static instances: Map<string, IAgent> = new Map();
  
  /**
   * Create or retrieve an agent instance
   * @param engineType - Internal engine type (hidden from users)
   * @param onLog - Optional callback for logging
   */
  static createAgent(
    engineType: InternalEngine, 
    onLog?: (log: AgentLog) => void
  ): IAgent {
    // Singleton pattern - return existing instance if available
    if (this.instances.has(engineType)) {
      return this.instances.get(engineType)!;
    }

    // Create new instance based on engine type
    let agent: IAgent;
    switch (engineType) {
      case 'openclaw':
        agent = new GodfatherResearcher(onLog);
        break;
      case 'autogpt':
        agent = new GodfatherArchitect(onLog);
        break;
      case 'crewai':
        agent = new GodfatherSyndicate(onLog);
        break;
      default:
        throw new Error(`Unknown engine type: ${engineType}`);
    }

    this.instances.set(engineType, agent);
    return agent;
  }

  /**
   * Get all available Digital Godfather agents
   * Returns display names only - no internal engine references
   */
  static getAllAgents(onLog?: (log: AgentLog) => void): IAgent[] {
    return [
      this.createAgent('openclaw', onLog),
      this.createAgent('autogpt', onLog),
      this.createAgent('crewai', onLog),
    ];
  }

  /**
   * Get agent by role (display name)
   */
  static getAgentByRole(
    role: 'researcher' | 'architect' | 'syndicate',
    onLog?: (log: AgentLog) => void
  ): IAgent {
    const engineMap: Record<string, InternalEngine> = {
      researcher: 'openclaw',
      architect: 'autogpt',
      syndicate: 'crewai',
    };
    
    return this.createAgent(engineMap[role], onLog);
  }

  /**
   * Clear all agent instances (for testing/reset)
   */
  static clearInstances(): void {
    this.instances.clear();
  }
}