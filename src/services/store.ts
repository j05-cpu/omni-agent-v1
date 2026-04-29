import { create } from 'zustand';
import { AgentLog, AgentStatus, AgentExecution, NeuralNode, AgentType } from '@/types';

interface GodfatherState {
  // Agent Logs
  logs: AgentLog[];
  addLog: (log: AgentLog) => void;
  clearLogs: () => void;
  
  // Agent Executions
  executions: AgentExecution[];
  activeExecution: AgentExecution | null;
  addExecution: (execution: AgentExecution) => void;
  updateExecution: (id: string, updates: Partial<AgentExecution>) => void;
  setActiveExecution: (execution: AgentExecution | null) => void;
  
  // Agent Status Tracking
  agentStatuses: Record<string, AgentStatus>;
  setAgentStatus: (agentId: string, status: AgentStatus) => void;
  
  // Neural Map
  neuralMap: NeuralNode;
  updateNeuralNode: (nodeId: string, updates: Partial<NeuralNode>) => void;
  
  // Selected Agent
  selectedAgent: AgentType | 'godfather';
  setSelectedAgent: (agent: AgentType | 'godfather') => void;
  
  // Command History
  commandHistory: string[];
  addCommandToHistory: (command: string) => void;
}

export const useGodfatherStore = create<GodfatherState>((set, get) => ({
  // Initial Log State
  logs: [],
  addLog: (log) => set((state) => ({ 
    logs: [...state.logs, log].slice(-500) // Keep last 500 logs
  })),
  clearLogs: () => set({ logs: [] }),
  
  // Initial Execution State
  executions: [],
  activeExecution: null,
  addExecution: (execution) => set((state) => ({ 
    executions: [...state.executions, execution] 
  })),
  updateExecution: (id, updates) => set((state) => ({
    executions: state.executions.map((exec) =>
      exec.id === id ? { ...exec, ...updates } : exec
    ),
    activeExecution: state.activeExecution?.id === id
      ? { ...state.activeExecution, ...updates }
      : state.activeExecution,
  })),
  setActiveExecution: (execution) => set({ activeExecution: execution }),
  
  // Initial Agent Status State
  agentStatuses: {
    'godfather-001': 'running',
    'openclaw-001': 'idle',
    'autogpt-001': 'idle',
    'plandex-001': 'idle',
  },
  setAgentStatus: (agentId, status) => set((state) => ({
    agentStatuses: { ...state.agentStatuses, [agentId]: status },
  })),
  
  // Initial Neural Map State
  neuralMap: {
    id: 'root',
    label: 'Godfather',
    type: 'godfather',
    status: 'running',
    children: [
      {
        id: 'openclaw',
        label: 'OpenClaw',
        type: 'agent',
        status: 'idle',
      },
      {
        id: 'autogpt',
        label: 'AutoGPT',
        type: 'agent',
        status: 'idle',
      },
      {
        id: 'plandex',
        label: 'Plandex',
        type: 'agent',
        status: 'idle',
      },
    ],
  },
  updateNeuralNode: (nodeId, updates) => {
    const updateNode = (node: NeuralNode): NeuralNode => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNode),
        };
      }
      return node;
    };
    set((state) => ({
      neuralMap: updateNode(state.neuralMap),
    }));
  },
  
  // Selected Agent
  selectedAgent: 'godfather',
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  
  // Command History
  commandHistory: [],
  addCommandToHistory: (command) => set((state) => ({ 
    commandHistory: [command, ...state.commandHistory].slice(0, 50)
  })),
}));

// Selector helpers for clean component consumption
export const selectLogs = (state: GodfatherState) => state.logs;
export const selectActiveExecution = (state: GodfatherState) => state.activeExecution;
export const selectNeuralMap = (state: GodfatherState) => state.neuralMap;
export const selectAgentStatuses = (state: GodfatherState) => state.agentStatuses;
export const selectSelectedAgent = (state: GodfatherState) => state.selectedAgent;