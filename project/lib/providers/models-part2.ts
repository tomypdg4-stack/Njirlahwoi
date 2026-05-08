import { ModelInfo } from './types';

export const MISTRAL_MODELS: ModelInfo[] = [
  { id: 'mistral-large-latest', name: 'Mistral Large 2', providerId: 'mistral', context: 128000, inputPrice: 2, outputPrice: 6, capabilities: ['text','code'], endpoint: 'https://api.mistral.ai/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'medium' },
  { id: 'mistral-small-latest', name: 'Mistral Small 3.1', providerId: 'mistral', context: 128000, inputPrice: 0.10, outputPrice: 0.30, capabilities: ['text','vision'], endpoint: 'https://api.mistral.ai/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'fast' },
  { id: 'codestral-latest', name: 'Codestral', providerId: 'mistral', context: 256000, inputPrice: 1, outputPrice: 3, capabilities: ['code'], endpoint: 'https://api.mistral.ai/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'fast' },
  { id: 'mixtral-8x7b-instruct', name: 'Mixtral 8x7B', providerId: 'mistral', context: 32000, inputPrice: 0.65, outputPrice: 0.65, capabilities: ['text'], endpoint: 'https://api.mistral.ai/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: true, license: 'Apache 2.0', speed: 'fast', parameters: '8x7B MoE' },
  { id: 'pixtral-large-latest', name: 'Pixtral Large', providerId: 'mistral', context: 128000, inputPrice: 2, outputPrice: 6, capabilities: ['text','vision'], endpoint: 'https://api.mistral.ai/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'medium' },
];

export const DEEPSEEK_MODELS: ModelInfo[] = [
  { id: 'deepseek-chat', name: 'DeepSeek V3', providerId: 'deepseek', context: 64000, inputPrice: 0.27, outputPrice: 1.10, capabilities: ['text','code'], endpoint: 'https://api.deepseek.com/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: true, license: 'DeepSeek', speed: 'fast' },
  { id: 'deepseek-reasoner', name: 'DeepSeek R1', providerId: 'deepseek', context: 64000, inputPrice: 0.55, outputPrice: 2.19, capabilities: ['text','reasoning'], endpoint: 'https://api.deepseek.com/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: true, license: 'DeepSeek', speed: 'medium' },
  { id: 'deepseek-coder', name: 'DeepSeek Coder V2', providerId: 'deepseek', context: 128000, inputPrice: 0.14, outputPrice: 0.28, capabilities: ['code'], endpoint: 'https://api.deepseek.com/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: true, license: 'DeepSeek', speed: 'fast' },
];

export const GROQ_MODELS: ModelInfo[] = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', providerId: 'groq', context: 128000, inputPrice: 0, outputPrice: 0, capabilities: ['text','streaming'], endpoint: 'https://api.groq.com/openai/v1/chat/completions', authExample: 'Authorization: Bearer gsk_xxxxx', isOpenSource: true, license: 'Meta Llama', speed: 'fast', isFree: true },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', providerId: 'groq', context: 128000, inputPrice: 0, outputPrice: 0, capabilities: ['text','streaming'], endpoint: 'https://api.groq.com/openai/v1/chat/completions', authExample: 'Authorization: Bearer gsk_xxxxx', isOpenSource: true, license: 'Meta Llama', speed: 'fast', isFree: true },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', providerId: 'groq', context: 32000, inputPrice: 0, outputPrice: 0, capabilities: ['text'], endpoint: 'https://api.groq.com/openai/v1/chat/completions', authExample: 'Authorization: Bearer gsk_xxxxx', isOpenSource: true, license: 'Apache 2.0', speed: 'fast', isFree: true },
  { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 Distill 70B', providerId: 'groq', context: 128000, inputPrice: 0, outputPrice: 0, capabilities: ['text','reasoning'], endpoint: 'https://api.groq.com/openai/v1/chat/completions', authExample: 'Authorization: Bearer gsk_xxxxx', isOpenSource: true, license: 'DeepSeek', speed: 'fast', isFree: true },
  { id: 'qwen-qwq-32b', name: 'QwQ 32B', providerId: 'groq', context: 128000, inputPrice: 0, outputPrice: 0, capabilities: ['text','reasoning'], endpoint: 'https://api.groq.com/openai/v1/chat/completions', authExample: 'Authorization: Bearer gsk_xxxxx', isOpenSource: true, license: 'Apache 2.0', speed: 'fast', isFree: true },
];

export const COHERE_MODELS: ModelInfo[] = [
  { id: 'command-r-plus-08-2024', name: 'Command R+', providerId: 'cohere', context: 128000, inputPrice: 2.50, outputPrice: 10, capabilities: ['text','function-calling'], endpoint: 'https://api.cohere.com/v1/chat', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'medium' },
  { id: 'command-r-08-2024', name: 'Command R', providerId: 'cohere', context: 128000, inputPrice: 0.15, outputPrice: 0.60, capabilities: ['text'], endpoint: 'https://api.cohere.com/v1/chat', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'fast' },
  { id: 'embed-english-v3.0', name: 'Embed English v3', providerId: 'cohere', context: 512, inputPrice: 0.10, outputPrice: null, capabilities: ['embedding'], endpoint: 'https://api.cohere.com/v1/embed', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'fast' },
  { id: 'rerank-english-v3.0', name: 'Rerank English v3', providerId: 'cohere', context: 4000, inputPrice: 2, outputPrice: null, capabilities: ['reranking'], endpoint: 'https://api.cohere.com/v1/rerank', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'fast' },
];

export const TOGETHER_MODELS: ModelInfo[] = [
  { id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', name: 'Llama 3.1 405B Turbo', providerId: 'together', context: 130000, inputPrice: 3.50, outputPrice: 3.50, capabilities: ['text','code'], endpoint: 'https://api.together.xyz/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: true, license: 'Meta Llama', speed: 'medium' },
  { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', name: 'Llama 3.1 70B Turbo', providerId: 'together', context: 130000, inputPrice: 0.88, outputPrice: 0.88, capabilities: ['text'], endpoint: 'https://api.together.xyz/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: true, license: 'Meta Llama', speed: 'fast' },
  { id: 'deepseek-ai/DeepSeek-R1', name: 'DeepSeek R1', providerId: 'together', context: 64000, inputPrice: 3, outputPrice: 7, capabilities: ['text','reasoning'], endpoint: 'https://api.together.xyz/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: true, license: 'DeepSeek', speed: 'medium' },
  { id: 'Qwen/Qwen2.5-72B-Instruct-Turbo', name: 'Qwen 2.5 72B Turbo', providerId: 'together', context: 32000, inputPrice: 1.20, outputPrice: 1.20, capabilities: ['text','code'], endpoint: 'https://api.together.xyz/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: true, license: 'Apache 2.0', speed: 'fast' },
];

export const XAI_MODELS: ModelInfo[] = [
  { id: 'grok-3', name: 'Grok 3', providerId: 'xai', context: 131000, inputPrice: 3, outputPrice: 15, capabilities: ['text','reasoning'], endpoint: 'https://api.x.ai/v1/chat/completions', authExample: 'Authorization: Bearer xai-xxxxx', isOpenSource: false, license: 'Commercial', speed: 'medium', isNew: true },
  { id: 'grok-3-mini', name: 'Grok 3 Mini', providerId: 'xai', context: 131000, inputPrice: 0.30, outputPrice: 0.50, capabilities: ['text','reasoning'], endpoint: 'https://api.x.ai/v1/chat/completions', authExample: 'Authorization: Bearer xai-xxxxx', isOpenSource: false, license: 'Commercial', speed: 'fast' },
  { id: 'grok-2-vision-1212', name: 'Grok 2 Vision', providerId: 'xai', context: 32000, inputPrice: 2, outputPrice: 10, capabilities: ['text','vision'], endpoint: 'https://api.x.ai/v1/chat/completions', authExample: 'Authorization: Bearer xai-xxxxx', isOpenSource: false, license: 'Commercial', speed: 'medium' },
];

export const PERPLEXITY_MODELS: ModelInfo[] = [
  { id: 'sonar-pro', name: 'Sonar Pro', providerId: 'perplexity', context: 200000, inputPrice: 3, outputPrice: 15, capabilities: ['text','streaming'], endpoint: 'https://api.perplexity.ai/chat/completions', authExample: 'Authorization: Bearer pplx-xxxxx', isOpenSource: false, license: 'Commercial', speed: 'medium' },
  { id: 'sonar', name: 'Sonar', providerId: 'perplexity', context: 200000, inputPrice: 1, outputPrice: 1, capabilities: ['text'], endpoint: 'https://api.perplexity.ai/chat/completions', authExample: 'Authorization: Bearer pplx-xxxxx', isOpenSource: false, license: 'Commercial', speed: 'fast' },
  { id: 'sonar-reasoning-pro', name: 'Sonar Reasoning Pro', providerId: 'perplexity', context: 200000, inputPrice: 2, outputPrice: 8, capabilities: ['text','reasoning'], endpoint: 'https://api.perplexity.ai/chat/completions', authExample: 'Authorization: Bearer pplx-xxxxx', isOpenSource: false, license: 'Commercial', speed: 'medium' },
  { id: 'sonar-deep-research', name: 'Sonar Deep Research', providerId: 'perplexity', context: 200000, inputPrice: 2, outputPrice: 8, capabilities: ['text','reasoning'], endpoint: 'https://api.perplexity.ai/chat/completions', authExample: 'Authorization: Bearer pplx-xxxxx', isOpenSource: false, license: 'Commercial', speed: 'slow' },
];

export const ALIBABA_MODELS: ModelInfo[] = [
  { id: 'qwen-max', name: 'Qwen Max', providerId: 'alibaba', context: 32000, inputPrice: 0.44, outputPrice: 1.33, capabilities: ['text','code'], endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'medium' },
  { id: 'qwen-turbo', name: 'Qwen Turbo', providerId: 'alibaba', context: 1000000, inputPrice: 0.02, outputPrice: 0.06, capabilities: ['text'], endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'fast' },
  { id: 'qwen2.5-72b-instruct', name: 'Qwen 2.5 72B', providerId: 'alibaba', context: 131000, inputPrice: 0.22, outputPrice: 0.67, capabilities: ['text','code'], endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: true, license: 'Apache 2.0', speed: 'medium', parameters: '72B' },
  { id: 'qwq-32b', name: 'QwQ 32B', providerId: 'alibaba', context: 131000, inputPrice: 0.11, outputPrice: 0.33, capabilities: ['text','reasoning'], endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: true, license: 'Apache 2.0', speed: 'fast', parameters: '32B' },
];
