/**
 * Digital Godfather - OpenRouter AI Client
 * 
 * FREE models via OpenRouter.ai
 * https://openrouter.ai
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * Send message to OpenRouter AI
 */
export async function chatWithOpenRouter(
  message: string,
  options?: {
    model?: string;
  }
): Promise<{ response: string; done: boolean }> {
  // Default to free model
  const model = options?.model || 'google/gemini-2.0-flash-exp-1219 free';
  
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }
  
  try {
    const response = await fetch(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://digital-godfather.com',
          'X-Title': 'Digital Godfather',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 2048,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter error: ${err}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'No response';
    
    return {
      response: text,
      done: true,
    };
  } catch (error) {
    console.error('[OpenRouter] Error:', error);
    throw error;
  }
}

/**
 * Check if OpenRouter is configured
 */
export function checkOpenRouterStatus(): boolean {
  return !!OPENROUTER_API_KEY;
}

/**
 * Get available free models
 */
export function getFreeModels(): string[] {
  return [
    // Google - FREE
    'google/gemini-2.0-flash-exp-1219 free',
    'google/gemini-2.0-flash-001 free',
    'google/gemma-3-27b free',
    
    // Meta - FREE
    'meta-llama/llama-3.3-70b-instruct free',
    'meta-llama/llama-3.1-8b-instruct free',
    
    // Qwen - FREE
    'qwen/qwen-2.5-72b-instruct free',
    
    // DeepSeek - FREE
    'deepseek/deepseek-chat free',
    
    // Microsoft - FREE
    'microsoft phi-4 free',
  ];
}

export default {
  chat: chatWithOpenRouter,
  checkStatus: checkOpenRouterStatus,
  getFreeModels,
};