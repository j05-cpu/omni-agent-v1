/**
 * Simple AI Chat API
 * 
 * Easy to use: /api/chat?message=hello&key=YOUR_API_KEY
 * Or use header: x-api-key: YOUR_API_KEY
 */

import { NextRequest, NextResponse } from 'next/server';

const AI_PROVIDERS: Record<string, { url: string; model: string; free?: boolean }> = {
  // OpenRouter (RECOMMENDED - 8 FREE models!)
  openrouter: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'google/gemini-2.0-flash-exp-1219 free',
  },
  // Groq (FREE)
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    free: true,
  },
  // DeepSeek
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const message = searchParams.get('message');
  const apiKey = searchParams.get('key') || request.headers.get('x-api-key');
  const provider = searchParams.get('provider') || 'openrouter';
  
  if (!message) {
    return NextResponse.json({
      error: 'message parameter required',
      example: '/api/chat?message=hello&key=YOUR_API_KEY',
      providers: Object.keys(AI_PROVIDERS),
    });
  }
  
  if (!apiKey) {
    return NextResponse.json({
      error: 'API key required',
      header: 'x-api-key: YOUR_API_KEY',
      or: 'key=YOUR_API_KEY',
      getFreeKey: 'https://openrouter.ai/settings',
    });
  }
  
  const providerConfig = AI_PROVIDERS[provider];
  if (!providerConfig) {
    return NextResponse.json({
      error: 'Invalid provider',
      available: Object.keys(AI_PROVIDERS),
    });
  }
  
  try {
    const response = await fetch(providerConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://digital-godfather.com',
        'X-Title': 'Digital Godfather',
      },
      body: JSON.stringify({
        model: providerConfig.model,
        messages: [{ role: 'user', content: message }],
        max_tokens: 2048,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({
        error: data.error?.message || 'API error',
        details: data,
      });
    }
    
    const reply = data.choices?.[0]?.message?.content || 'No response';
    
    return NextResponse.json({
      success: true,
      message: reply,
      model: providerConfig.model,
      provider,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { message, key, provider } = body;
  
  // Build URL with params
  const url = new URL(request.url);
  const params = new URLSearchParams();
  params.set('message', message);
  if (key) params.set('key', key);
  if (provider) params.set('provider', provider);
  
  // Create mock request
  const mockUrl = `${url.origin}/api/chat?${params.toString()}`;
  const mockRequest = new NextRequest(mockUrl);
  
  return GET(mockRequest);
}