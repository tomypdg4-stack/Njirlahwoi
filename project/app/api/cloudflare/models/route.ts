import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  // Static list of popular Cloudflare Workers AI models
  // In a real scenario, you might want to fetch this from an API or env
  const models = [
    { id: '@cf/meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B' },
    { id: '@cf/meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B' },
    { id: '@cf/meta/llama-3.3-70b-instruct-fp8-fast', name: 'Llama 3.3 70B Fast' },
    { id: '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b', name: 'DeepSeek R1 32B' },
    { id: '@cf/mistral/mistral-7b-instruct-v0.3', name: 'Mistral 7B v0.3' },
    { id: '@cf/qwen/qwen1.5-14b-chat-awq', name: 'Qwen 1.5 14B' },
    { id: '@cf/google/gemma-7b-it', name: 'Gemma 7B' },
    { id: '@cf/tinyllama/tinyllama-1.1b-chat-v1.0', name: 'TinyLlama 1.1B' },
  ];

  return NextResponse.json({ models });
}
