/**
 * Digital Godfather - Supabase Client
 * 
 * Provides database connectivity for:
 * - Agent storage and status tracking
 * - Execution logs for real-time terminal
 * - Agent memory for conversation history
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Client instance
let client: SupabaseClient | null = null;

/**
 * Get the Supabase client
 */
export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    // Check if configured
    const isConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key';
    
    if (!isConfigured) {
      console.warn('[Digital Godfather] Supabase not configured - running in mock mode');
    }
    
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  
  return client;
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key';
}

/**
 * Database types
 */
export interface DatabaseAgent {
  id: string;
  name: string;
  role: 'researcher' | 'architect' | 'syndicate' | 'coordinator';
  status: 'idle' | 'running' | 'completed' | 'error' | 'paused';
  internal_engine: string;
  description: string;
  capabilities: string[];
  created_at: string;
}

export interface ExecutionLogEntry {
  id: string;
  execution_id: string;
  agent_id: string;
  level: 'info' | 'debug' | 'error' | 'warn';
  message: string;
  timestamp: string;
}

export interface AgentMemoryEntry {
  id: string;
  agent_id: string;
  agent_name: string;
  role: string;
  mission_description: string;
  result: string;
  created_at: string;
}

/**
 * Database operations
 */
export const db = {
  /**
   * Get all agents
   */
  async getAgents(): Promise<DatabaseAgent[]> {
    const supabase = getSupabaseClient();
    const { data } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  /**
   * Update agent status
   */
  async updateAgentStatus(id: string, status: string): Promise<void> {
    const supabase = getSupabaseClient();
    await supabase.from('agents').update({ status }).eq('id', id);
  },

  /**
   * Insert execution log
   */
  async insertExecutionLog(entry: Omit<ExecutionLogEntry, 'id'>): Promise<void> {
    const supabase = getSupabaseClient();
    await supabase.from('execution_logs').insert({ ...entry, id: `log-${Date.now()}` });
  },

  /**
   * Get execution logs
   */
  async getExecutionLogs(executionId: string, limit = 100): Promise<ExecutionLogEntry[]> {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from('execution_logs')
      .select('*')
      .eq('execution_id', executionId)
      .order('timestamp', { ascending: true })
      .limit(limit);
    return data || [];
  },

  /**
   * Get agent memory
   */
  async getAgentMemory(agentId: string, limit = 50): Promise<AgentMemoryEntry[]> {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from('agent_memory')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  },
};

export default getSupabaseClient;