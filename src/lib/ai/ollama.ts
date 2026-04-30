/**
 * Digital Godfather - Ollama AI Client
 * 
 * Real AI integration with Ollama (free, local AI)
 * https://ollama.com
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:1b';

/**
 * Send message to Ollama AI
 */
export async function chatWithOllama(
  message: string,
  options?: {
    model?: string;
    stream?: boolean;
  }
): Promise<{ response: string; done: boolean }> {
  const model = options?.model || OLLAMA_MODEL;
  
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        stream: options?.stream ?? false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    return {
      response: data.message?.content || 'No response',
      done: data.done ?? true,
    };
  } catch (error) {
    console.error('[Ollama] Error:', error);
    throw error;
  }
}

/**
 * Check if Ollama is running
 */
export async function checkOllamaStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get available models
 */
export async function getOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    const data = await response.json();
    return data.models?.map((m: any) => m.name) || [];
  } catch {
    return [];
  }
}

/**
 * Generate embeddings
 */
export async function generateEmbedding(
  text: string,
  model = 'nomic-embed-text'
): Promise<number[]> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt: text }),
  });
  
  const data = await response.json();
  return data.embedding || [];
}

export default {
  chat: chatWithOllama,
  checkStatus: checkOllamaStatus,
  getModels: getOllamaModels,
  generateEmbedding,
};