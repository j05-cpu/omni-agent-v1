/**
 * Digital Godfather - Dynamic AI Client
 * 
 * Uses user's selected API from settings
 */

import type { APIConfig } from '../stores';

/**
 * Send chat message using the configured API
 */
export async function chatWithAI(
  message: string,
  api: APIConfig
): Promise<{ response: string; done: boolean }> {
  if (!api.enabled || !api.apiKey) {
    throw new Error(`${api.name} API key not configured`);
  }

  const baseUrl = api.baseUrl;
  const apiKey = api.apiKey;
  const model = api.selectedModel || api.models[0];

  try {
    // OpenAI compatible format
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: message }],
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`${api.name} error: ${err}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'No response';

    return { response: text, done: true };
  } catch (error) {
    console.error(`[${api.name}] Error:`, error);
    throw error;
  }
}

/**
 * Check if API is configured
 */
export function checkAPIConfigured(api: APIConfig): boolean {
  return api.enabled && !!api.apiKey;
}

export default { chat: chatWithAI, checkConfigured: checkAPIConfigured };