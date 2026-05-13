import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const client = new OpenAI({
  baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
  apiKey: process.env.NJIRLAH_API_KEY || "GANTI_DENGAN_API_KEY_ANDA",
});

export async function POST(req: NextRequest) {
  try {
    const userKey = req.headers.get("x-njirlah-key");
    const body = await req.json();
    const { messages, stream } = body;

    const currentClient = userKey ? new OpenAI({
      baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
      apiKey: userKey,
    }) : client;

    if (stream) {
      const response = await currentClient.chat.completions.create({
        model: process.env.NJIRLAH_MODEL_ID || "NJIRLAH-1-SS", // Ganti dengan Model Code dari tabel Deployment jika perlu
        messages,
        temperature: 0.3,
        max_tokens: 1024,
        stream: true,
      });

      const readable = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          for await (const chunk of response) {
            const data = `data: ${JSON.stringify(chunk)}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const response = await currentClient.chat.completions.create({
      model: process.env.NJIRLAH_MODEL_ID || "NJIRLAH-1-SS", // Ganti dengan Model Code dari tabel Deployment jika perlu
      messages,
      temperature: 0.3,
      max_tokens: 1024,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("NJIRLAH API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-njirlah-key",
    },
  });
}
