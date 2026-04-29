/**
 * Digital Godfather - Glassmorphism UI Framework
 * 
 * Premium glassmorphism design system with emerald glow effects.
 * Mobile-first with full-screen overlays and drawer navigation.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// API Configuration Types
// ============================================================================

export type APIProvider = 
  | 'openai' 
  | 'anthropic' 
  | 'google' 
  | 'xai' 
  | 'groq' 
  | 'ollama' 
  | 'deepseek' 
  | 'kimi' 
  | 'openrouter';

export interface APIConfig {
  provider: APIProvider;
  name: string;
  icon: string;
  color: string;
  baseUrl: string;
  requiresApiKey: boolean;
  models: string[];
  selectedModel?: string;
  apiKey?: string;
  enabled: boolean;
}

// ============================================================================
// Agent & Tool Types
// ============================================================================

export type AgentRole = 'dev' | 'research' | 'ops' | 'chat';
export type ToolType = 'web_search' | 'file_edit' | 'code_runner' | 'image_gen' | 'data_fetch';

export interface Agent {
  id: string;
  name: string;
  icon: string;
  role: AgentRole;
  description: string;
  skills: string[];
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: ToolType;
  enabled: boolean;
  config: Record<string, unknown>;
}

// ============================================================================
// Knowledge & Skills Types
// ============================================================================

export interface KnowledgeItem {
  id: string;
  type: 'pdf' | 'text' | 'image' | 'youtube';
  title: string;
  source: string;
  content: string;
  vectorId?: string;
  createdAt: Date;
  processed: boolean;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  installs: number;
  rating: number;
  installed: boolean;
  code: string;
}

// ============================================================================
// Chat Types
// ============================================================================

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  model?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

// ============================================================================
// Settings Store
// ============================================================================

interface SettingsState {
  // API Keys & Configuration
  apis: APIConfig[];
  setApiKey: (provider: APIProvider, apiKey: string) => void;
  setModel: (provider: APIProvider, model: string) => void;
  toggleApi: (provider: APIProvider, enabled: boolean) => void;
  
  // Agents
  agents: Agent[];
  toggleAgent: (agentId: string, enabled: boolean) => void;
  updateAgentConfig: (agentId: string, config: Record<string, unknown>) => void;
  
  // Tools
  tools: Tool[];
  toggleTool: (toolId: string, enabled: boolean) => void;
  
  // Active Session
  activeAgent: string | null;
  setActiveAgent: (agentId: string | null) => void;
  activeModel: string | null;
  setActiveModel: (model: string | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default APIs
      apis: [
        {
          provider: 'openai',
          name: 'OpenAI',
          icon: '🤖',
          color: '#10b981',
          baseUrl: 'https://api.openai.com/v1',
          requiresApiKey: true,
          models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
          enabled: false,
        },
        {
          provider: 'anthropic',
          name: 'Claude',
          icon: '🧠',
          color: '#f59e0b',
          baseUrl: 'https://api.anthropic.com/v1',
          requiresApiKey: true,
          models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
          enabled: false,
        },
        {
          provider: 'google',
          name: 'Gemini',
          icon: '✨',
          color: '#3b82f6',
          baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
          requiresApiKey: true,
          models: ['gemini-2.0-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash'],
          enabled: false,
        },
        {
          provider: 'xai',
          name: 'Grok',
          icon: '🔥',
          color: '#ef4444',
          baseUrl: 'https://api.x.ai/v1',
          requiresApiKey: true,
          models: ['grok-2-1212', 'grok-2', 'grok-beta'],
          enabled: false,
        },
        {
          provider: 'groq',
          name: 'Groq',
          icon: '⚡',
          color: '#06b6d4',
          baseUrl: 'https://api.groq.com/openai/v1',
          requiresApiKey: true,
          models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
          enabled: false,
        },
        {
          provider: 'ollama',
          name: 'Ollama',
          icon: '🦙',
          color: '#8b5cf6',
          baseUrl: 'http://localhost:11434/v1',
          requiresApiKey: false,
          models: ['llama3.3', 'llama3.2', 'codellama', 'mistral', 'mixtral'],
          enabled: false,
        },
        {
          provider: 'deepseek',
          name: 'DeepSeek',
          icon: '🔮',
          color: '#14b8a6',
          baseUrl: 'https://api.deepseek.com/v1',
          requiresApiKey: true,
          models: ['deepseek-chat', 'deepseek-coder'],
          enabled: false,
        },
        {
          provider: 'kimi',
          name: 'Kimi',
          icon: '🌙',
          color: '#ec4899',
          baseUrl: 'https://api.moonshot.cn/v1',
          requiresApiKey: true,
          models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
          enabled: false,
        },
        {
          provider: 'openrouter',
          name: 'OpenRouter',
          icon: '🌐',
          color: '#f97316',
          baseUrl: 'https://openrouter.ai/api/v1',
          requiresApiKey: true,
          models: [
            'anthropic/claude-3.5-sonnet',
            'google/gemini-pro-1.5',
            'meta-llama/llama-3-70b-chat',
            'mistralai/mixtral-8x7b',
            'openai/gpt-4-turbo',
          ],
          enabled: false,
        },
      ],
      
      setApiKey: (provider, apiKey) => set((state) => ({
        apis: state.apis.map(api => 
          api.provider === provider ? { ...api, apiKey, enabled: true } : api
        ),
      })),
      
      setModel: (provider, model) => set((state) => ({
        apis: state.apis.map(api => 
          api.provider === provider ? { ...api, selectedModel: model } : api
        ),
      })),
      
      toggleApi: (provider, enabled) => set((state) => ({
        apis: state.apis.map(api => 
          api.provider === provider ? { ...api, enabled } : api
        ),
      })),
      
      // Default Agents
      agents: [
        { id: 'godfather-core', name: 'Godfather Core', icon: '👑', role: 'chat', description: 'Main orchestrator', skills: ['Reasoning', 'Planning'], enabled: true, config: {} },
        { id: 'godfather-dev', name: 'Godfather Dev', icon: '💻', role: 'dev', description: 'Development specialist', skills: ['Coding', 'Debugging', 'Testing'], enabled: true, config: {} },
        { id: 'godfather-research', name: 'Godfather Research', icon: '🔬', role: 'research', description: 'Research specialist', skills: ['Analysis', 'Web Search', 'Data'], enabled: true, config: {} },
        { id: 'godfather-ops', name: 'Godfather Ops', icon: '⚙️', role: 'ops', description: 'Operations specialist', skills: ['Automation', 'Monitoring'], enabled: true, config: {} },
      ],
      
      toggleAgent: (agentId, enabled) => set((state) => ({
        agents: state.agents.map(agent => 
          agent.id === agentId ? { ...agent, enabled } : agent
        ),
      })),
      
      updateAgentConfig: (agentId, config) => set((state) => ({
        agents: state.agents.map(agent => 
          agent.id === agentId ? { ...agent, config: { ...agent.config, ...config } } : agent
        ),
      })),
      
      // Default Tools
      tools: [
        { id: 'web-search', name: 'Web Search', icon: '🌐', description: 'Search the web', type: 'web_search', enabled: true, config: {} },
        { id: 'file-edit', name: 'File Edit', icon: '📝', description: 'Edit files', type: 'file_edit', enabled: true, config: {} },
        { id: 'code-runner', name: 'Code Runner', icon: '▶️', description: 'Run code', type: 'code_runner', enabled: true, config: {} },
        { id: 'image-gen', name: 'Image Gen', icon: '🎨', description: 'Generate images', type: 'image_gen', enabled: false, config: {} },
        { id: 'data-fetch', name: 'Data Fetch', icon: '📊', description: 'Fetch data', type: 'data_fetch', enabled: true, config: {} },
      ],
      
      toggleTool: (toolId, enabled) => set((state) => ({
        tools: state.tools.map(tool => 
          tool.id === toolId ? { ...tool, enabled } : tool
        ),
      })),
      
      activeAgent: 'godfather-core',
      setActiveAgent: (agentId) => set({ activeAgent: agentId }),
      activeModel: null,
      setActiveModel: (model) => set({ activeModel: model }),
    }),
    {
      name: 'godfather-settings',
      partialize: (state) => ({ 
        apis: state.apis, 
        agents: state.agents, 
        tools: state.tools,
        activeAgent: state.activeAgent,
        activeModel: state.activeModel,
      }),
    }
  )
);

// ============================================================================
// Chat Store
// ============================================================================

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date(),
    }],
  })),
  
  setTyping: (typing) => set({ isTyping: typing }),
  
  clearMessages: () => set({ messages: [] }),
}));

// ============================================================================
// Knowledge Store
// ============================================================================

interface KnowledgeState {
  items: KnowledgeItem[];
  addItem: (item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'processed'>) => void;
  removeItem: (id: string) => void;
  updateProcessed: (id: string, processed: boolean) => void;
}

export const useKnowledgeStore = create<KnowledgeState>((set) => ({
  items: [],
  
  addItem: (item) => set((state) => ({
    items: [...state.items, {
      ...item,
      id: `know-${Date.now()}`,
      createdAt: new Date(),
      processed: false,
    }],
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id),
  })),
  
  updateProcessed: (id, processed) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, processed } : item
    ),
  })),
}));

// ============================================================================
// Skills Store
// ============================================================================

interface SkillsState {
  marketplace: Skill[];
  installed: Skill[];
  installSkill: (skillId: string) => void;
  uninstallSkill: (skillId: string) => void;
}

export const useSkillsStore = create<SkillsState>((set) => ({
  marketplace: [
    {
      id: 'skill-code-review',
      name: 'Code Review Pro',
      description: 'Automated code review with style guide compliance',
      version: '1.0.0',
      author: 'Godfather Labs',
      category: 'Development',
      installs: 1234,
      rating: 4.8,
      installed: false,
      code: '// Code Review Skill',
    },
    {
      id: 'skill-web-scraper',
      name: 'Web Scraper',
      description: 'Extract data from any website',
      version: '2.1.0',
      author: 'Godfather Labs',
      category: 'Research',
      installs: 892,
      rating: 4.6,
      installed: false,
      code: '// Web Scraper Skill',
    },
    {
      id: 'skill-file-organizer',
      name: 'File Organizer',
      description: 'Automatically organize files by type and date',
      version: '1.5.0',
      author: 'Godfather Labs',
      category: 'Ops',
      installs: 567,
      rating: 4.9,
      installed: false,
      code: '// File Organizer Skill',
    },
    {
      id: 'skill-test-generator',
      name: 'Test Generator',
      description: 'Generate unit tests automatically',
      version: '1.2.0',
      author: 'Godfather Labs',
      category: 'Development',
      installs: 445,
      rating: 4.7,
      installed: false,
      code: '// Test Generator Skill',
    },
    {
      id: 'skill-api-doc',
      name: 'API Doc Writer',
      description: 'Generate OpenAPI documentation',
      version: '1.0.0',
      author: 'Godfather Labs',
      category: 'Development',
      installs: 312,
      rating: 4.5,
      installed: false,
      code: '// API Doc Writer Skill',
    },
    {
      id: 'skill-db-migrator',
      name: 'DB Migrator',
      description: 'Handle database migrations safely',
      version: '2.0.0',
      author: 'Godfather Labs',
      category: 'Ops',
      installs: 234,
      rating: 4.8,
      installed: false,
      code: '// DB Migrator Skill',
    },
  ],
  installed: [],
  
  installSkill: (skillId) => set((state) => {
    const skill = state.marketplace.find(s => s.id === skillId);
    if (!skill) return state;
    return {
      marketplace: state.marketplace.map(s => 
        s.id === skillId ? { ...s, installed: true, installs: s.installs + 1 } : s
      ),
      installed: [...state.installed, { ...skill, installed: true }],
    };
  }),
  
  uninstallSkill: (skillId) => set((state) => ({
    marketplace: state.marketplace.map(s => 
      s.id === skillId ? { ...s, installed: false } : s
    ),
    installed: state.installed.filter(s => s.id !== skillId),
  })),
}));