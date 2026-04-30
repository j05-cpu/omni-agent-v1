/**
 * Digital Godfather - Memory Storage
 */

import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabaseClient';

const supabase = getSupabaseClient();

/**
 * Save agent memory to database
 */
export async function saveToAgentMemory(
  agentId: string,
  agentName: string,
  role: string,
  missionDescription: string,
  result: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.log('[Godfather Memory] Skip - no Supabase');
    return false;
  }

  try {
    const { error } = await supabase.from('agent_memory').insert({
      id: `mem-${Date.now()}`,
      agent_id: agentId,
      agent_name: agentName,
      role,
      mission_description: missionDescription,
      result,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[Godfather Memory] Save error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Godfather Memory] Exception:', err);
    return false;
  }
}

/**
 * Get agent memory
 */
export async function getAgentMemory(agentId: string, limit = 50) {
  if (!isSupabaseConfigured()) return [];
  
  const { data } = await supabase
    .from('agent_memory')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return data || [];
}

/**
 * Save execution
 */
export async function saveSyndicateExecution(
  syndicateId: string,
  syndicateName: string,
  processMode: string,
  agentsCount: number,
  missionsCount: number
) {
  if (!isSupabaseConfigured()) return `mock-${Date.now()}`;
  
  const id = `exec-${Date.now()}`;
  await supabase.from('syndicate_executions').insert({
    id,
    syndicate_id: syndicateId,
    syndicate_name: syndicateName,
    process_mode: processMode,
    status: 'running',
    agents_count: agentsCount,
    missions_count: missionsCount,
    started_at: new Date().toISOString(),
  });
  return id;
}

/**
 * Update execution
 */
export async function updateSyndicateExecution(
  executionId: string,
  status: 'completed' | 'failed'
) {
  if (!isSupabaseConfigured()) return true;
  
  await supabase.from('syndicate_executions').update({
    status,
    completed_at: new Date().toISOString(),
  }).eq('id', executionId);
  
  return true;
}