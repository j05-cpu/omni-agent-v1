/**
 * Digital Godfather - Google Gemini AI Client
 * 
 * FREE cloud AI - No credit card needed!
 * https://ai.google.dev/docs
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Send message to Google Gemini
 */
export async function chatWithGemini(
  message: string,
  options?: {
    model?: string;
  }
): Promise<{ response: string; done: boolean }> {
  const model = options?.model || 'gemini-2.0-flash';
  
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  
  try {
    const response = await fetch(
      `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini error: ${err}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    
    return {
      response: text,
      done: true,
    };
  } catch (error) {
    console.error('[Gemini] Error:', error);
    throw error;
  }
}

/**
 * Check if Gemini is configured
 */
export function checkGeminiStatus(): boolean {
  return !!GEMINI_API_KEY;
}

/**
 * Get available models
 */
export async function getGeminiModels(): Promise<string[]> {
  if (!GEMINI_API_KEY) return [];
  
  try {
    const response = await fetch(
      `${GEMINI_BASE_URL}/models?key=${GEMINI_API_KEY}`
    );
    const data = await response.json();
    return data.models?.map((m: any) => m.name) || [];
  } catch {
    return [];
  }
}

export default {
  chat: chatWithGemini,
  checkStatus: checkGeminiStatus,
  getModels: getGeminiModels,
};