import { NextResponse } from 'next/server';

/**
 * API Route to save user API keys to local storage
 * For Vercel deployment, set secrets in Vercel Dashboard
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, apiKey, model } = body;

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: 'Provider and API key required' },
        { status: 400 }
      );
    }

    console.log(`[API Settings] User configuring ${provider} with model ${model}`);

    return NextResponse.json({
      success: true,
      message: `API configured for ${provider}. Key is stored in browser memory and sent with each request.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save API settings' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST with provider, apiKey, model',
    providers: ['openrouter', 'openai', 'anthropic', 'google', 'ollama'],
  });
}