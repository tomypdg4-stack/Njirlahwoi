import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { model, messages, stream } = await req.json();

    // Cloudflare Workers AI is accessible via the 'AI' binding when deployed on Cloudflare.
    // In next-on-pages, bindings are available on process.env or the request context.
    const ai = (process.env as any).AI;

    if (!ai) {
      return NextResponse.json(
        { error: 'Cloudflare Workers AI binding not found. Make sure to deploy on Cloudflare with the AI binding enabled.' },
        { status: 503 }
      );
    }

    const response = await ai.run(model, {
      messages,
      stream: stream ?? true,
    });

    if (stream) {
      return new Response(response, {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Cloudflare Workers AI Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
