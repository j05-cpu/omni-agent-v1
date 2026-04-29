export type AgentStatus = 'idle' | 'running' | 'completed' | 'error' | 'paused';

export type AgentType = 'openclaw' | 'autogpt' | 'plandex' | 'godfather';

export interface AgentConfig {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  version: string;
  capabilities: string[];
}

export interface AgentLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source: string;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  command: string;
  status: AgentStatus;
  startTime: Date;
  endTime?: Date;
  output?: string;
  error?: string;
}

export interface NeuralNode {
  id: string;
  label: string;
  type: 'godfather' | 'agent' | 'task' | 'subtask';
  status: AgentStatus;
  children?: NeuralNode[];
  metadata?: Record<string, unknown>;
}

export interface CommandRequest {
  id: string;
  command: string;
  targetAgent?: string;
  timestamp: Date;
  priority?: 'low' | 'normal' | 'high' | 'critical';
}

export interface CommandResponse {
  id: string;
  requestId: string;
  success: boolean;
  output: string;
  executionTime?: number;
  metadata?: Record<string, unknown>;
}