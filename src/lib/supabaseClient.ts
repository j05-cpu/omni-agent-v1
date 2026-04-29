/**
 * Digital Godfather - Supabase Client
 * 
 * Provides database connectivity for:
 * - Agent storage and status tracking
 * - Execution logs for real-time terminal
 * - Agent memory for conversation history
 * 
 * Uses environment variables from .env.local
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables - loaded from process.env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create Supabase client instance
let supabase: SupabaseClient | null = null;

/**
 * Get or create the Supabase client
 * Returns null if credentials are not configured (for mock mode)
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    // Check if credentials are properly configured
    if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
      console.warn('[Digital Godfather] Supabase not configured - running in mock mode');
      // Return a minimal client that will gracefully fail
      return createClient(
        'https://mock.supabase.co',
        'mock-key-for-development'
      );
    }
    
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
  
  return supabase;
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key';
}

// Database Types (for TypeScript)
export interface DatabaseAgent {
  id: string;
  name: string;
  role: 'researcher' | 'architect' | 'syndicate' | 'coordinator';
  status: 'idle' | 'running' | 'completed' | 'error' | 'paused';
  internal_engine: string;
  description: string;
  capabilities: string[];
  created_at: string;
  updated_at: string;
}

export interface ExecutionLogEntry {
  id: string;
  execution_id: string;
  agent_id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
}

export interface AgentMemoryEntry {
  id: string;
  agent_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Database table names
export const TABLES = {
  AGENTS: 'agents',
  EXECUTION_LOGS: 'execution_logs',
  AGENT_MEMORY: 'agent_memory',
} as const;

/**
 * Database helper functions
 * These will gracefully degrade to mock mode if DB is not configured
 */
export const db = {
  /**
   * Get all agents from database
   */
  async getAgents(): Promise<DatabaseAgent[]> {
    if (!isSupabaseConfigured()) {
      // Return mock data in development
      return [
        {
          id: 'researcher-001',
          name: 'Godfather Researcher',
          role: 'researcher',
          status: 'idle',
          internal_engine: 'openclaw',
          description: 'Advanced research and data gathering agent',
          capabilities: ['Web Research', 'Data Extraction'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'architect-001',
          name: 'Godfather Architect',
          role: 'architect',
          status: 'idle',
          internal_engine: 'autogpt',
          description: 'Self-prompting agent for code generation',
          capabilities: ['Task Planning', 'Code Generation'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'syndicate-001',
          name: 'Godfather Syndicate',
          role: 'syndicate',
          status: 'idle',
          internal_engine: 'crewai',
          description: 'Multi-agent collaborative system',
          capabilities: ['Multi-Agent Coordination'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }

    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLES.AGENTS)
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[Digital Godfather] Error fetching agents:', error);
      return [];
    }

    return data as DatabaseAgent[];
  },

  /**
   * Update agent status
   */
  async updateAgentStatus(
    agentId: string, 
    status: DatabaseAgent['status']
  ): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.log(`[Mock] Updated ${agentId} status to ${status}`);
      return true;
    }

    const client = getSupabaseClient();
    const { error } = await client
      .from(TABLES.AGENTS)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', agentId);

    if (error) {
      console.error('[Digital Godfather] Error updating status:', error);
      return false;
    }

    return true;
  },

  /**
   * Insert execution log
   */
  async insertExecutionLog(log: Omit<ExecutionLogEntry, 'id' | 'timestamp'>): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      // In mock mode, logs are handled via Zustand
      return true;
    }

    const client = getSupabaseClient();
    const { error } = await client
      .from(TABLES.EXECUTION_LOGS)
      .insert({
        ...log,
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
      });

    if (error) {
      console.error('[Digital Godfather] Error inserting log:', error);
      return false;
    }

    return true;
  },

  /**
   * Get execution logs for an execution
   */
  async getExecutionLogs(executionId: string): Promise<ExecutionLogEntry[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLES.EXECUTION_LOGS)
      .select('*')
      .eq('execution_id', executionId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('[Digital Godfather] Error fetching logs:', error);
      return [];
    }

    return data as ExecutionLogEntry[];
  },

  /**
   * Save agent memory (conversation)
   */
  async saveMemory(
    agentId: string, 
    role: 'user' | 'assistant', 
    content: string
  ): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return true;
    }

    const client = getSupabaseClient();
    const { error } = await client
      .from(TABLES.AGENT_MEMORY)
      .insert({
        id: `mem-${Date.now()}`,
        agent_id: agentId,
        role,
        content,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('[Digital Godfather] Error saving memory:', error);
      return false;
    }

    return true;
  },

  /**
   * Get agent conversation history
   */
  async getMemory(agentId: string): Promise<AgentMemoryEntry[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLES.AGENT_MEMORY)
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('[Digital Godfather] Error fetching memory:', error);
      return [];
    }

    return data as AgentMemoryEntry[];
  },
};

export default getSupabaseClient;