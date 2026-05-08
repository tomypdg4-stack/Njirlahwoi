import { ModelInfo } from './types';

export const CLOUDFLARE_MODELS: ModelInfo[] = [
  { id: '@cf/meta/llama-3.3-70b-instruct-fp8-fast', name: 'Llama 3.3 70B Fast', providerId: 'cloudflare', context: 128000, inputPrice: 0, outputPrice: 0, capabilities: ['text'], endpoint: 'https://api.cloudflare.com/client/v4/accounts/{ID}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast', authExample: 'Authorization: Bearer cf-token', isOpenSource: true, license: 'Meta Llama', speed: 'fast', isFree: true },
  { id: '@cf/meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', providerId: 'cloudflare', context: 128000, inputPrice: 0, outputPrice: 0, capabilities: ['text'], endpoint: 'https://api.cloudflare.com/client/v4/accounts/{ID}/ai/run/@cf/meta/llama-3.1-8b-instruct', authExample: 'Authorization: Bearer cf-token', isOpenSource: true, license: 'Meta Llama', speed: 'fast', isFree: true },
  { id: '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b', name: 'DeepSeek R1 32B', providerId: 'cloudflare', context: 32000, inputPrice: 0, outputPrice: 0, capabilities: ['text','reasoning'], endpoint: 'https://api.cloudflare.com/client/v4/accounts/{ID}/ai/run/@cf/deepseek-ai/deepseek-r1-distill-qwen-32b', authExample: 'Authorization: Bearer cf-token', isOpenSource: true, license: 'DeepSeek', speed: 'fast', isFree: true },
  { id: '@cf/mistral/mistral-7b-instruct-v0.2', name: 'Mistral 7B v0.2', providerId: 'cloudflare', context: 32000, inputPrice: 0, outputPrice: 0, capabilities: ['text'], endpoint: 'https://api.cloudflare.com/client/v4/accounts/{ID}/ai/run/@cf/mistral/mistral-7b-instruct-v0.2', authExample: 'Authorization: Bearer cf-token', isOpenSource: true, license: 'Apache 2.0', speed: 'fast', isFree: true },
];

export const NVIDIA_MODELS: ModelInfo[] = [
  { id: 'nvidia/llama-3.1-nemotron-ultra-253b-v1', name: 'Nemotron Ultra 253B', providerId: 'nvidia', context: 128000, inputPrice: 3.50, outputPrice: 3.50, capabilities: ['text','code'], endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions', authExample: 'Authorization: Bearer nvapi-xxxxx', isOpenSource: false, license: 'NVIDIA', speed: 'medium' },
  { id: 'nvidia/llama-3.1-nemotron-70b-instruct', name: 'Nemotron 70B', providerId: 'nvidia', context: 128000, inputPrice: 0.35, outputPrice: 0.40, capabilities: ['text'], endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions', authExample: 'Authorization: Bearer nvapi-xxxxx', isOpenSource: false, license: 'NVIDIA', speed: 'fast' },
];

export const AI21_MODELS: ModelInfo[] = [
  { id: 'jamba-1.5-large', name: 'Jamba 1.5 Large', providerId: 'ai21', context: 256000, inputPrice: 2, outputPrice: 8, capabilities: ['text'], endpoint: 'https://api.ai21.com/studio/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'medium' },
  { id: 'jamba-1.5-mini', name: 'Jamba 1.5 Mini', providerId: 'ai21', context: 256000, inputPrice: 0.20, outputPrice: 0.40, capabilities: ['text'], endpoint: 'https://api.ai21.com/studio/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'fast' },
];

export const FIREWORKS_MODELS: ModelInfo[] = [
  { id: 'accounts/fireworks/models/llama-v3p1-405b-instruct', name: 'Llama 3.1 405B', providerId: 'fireworks', context: 131000, inputPrice: 3, outputPrice: 3, capabilities: ['text','code'], endpoint: 'https://api.fireworks.ai/inference/v1/chat/completions', authExample: 'Authorization: Bearer fw_xxxxx', isOpenSource: true, license: 'Meta Llama', speed: 'medium' },
  { id: 'accounts/fireworks/models/deepseek-r1', name: 'DeepSeek R1', providerId: 'fireworks', context: 64000, inputPrice: 3, outputPrice: 3, capabilities: ['text','reasoning'], endpoint: 'https://api.fireworks.ai/inference/v1/chat/completions', authExample: 'Authorization: Bearer fw_xxxxx', isOpenSource: true, license: 'DeepSeek', speed: 'medium' },
];

export const SAMBANOVA_MODELS: ModelInfo[] = [
  { id: 'Meta-Llama-3.3-70B-Instruct', name: 'Llama 3.3 70B', providerId: 'sambanova', context: 128000, inputPrice: 0, outputPrice: 0, capabilities: ['text','streaming'], endpoint: 'https://api.sambanova.ai/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: true, license: 'Meta Llama', speed: 'fast', isFree: true },
  { id: 'DeepSeek-R1', name: 'DeepSeek R1', providerId: 'sambanova', context: 64000, inputPrice: 0, outputPrice: 0, capabilities: ['text','reasoning'], endpoint: 'https://api.sambanova.ai/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: true, license: 'DeepSeek', speed: 'fast', isFree: true },
];

export const CEREBRAS_MODELS: ModelInfo[] = [
  { id: 'llama3.3-70b', name: 'Llama 3.3 70B', providerId: 'cerebras', context: 128000, inputPrice: 0, outputPrice: 0, capabilities: ['text','streaming'], endpoint: 'https://api.cerebras.ai/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: true, license: 'Meta Llama', speed: 'fast', isFree: true },
  { id: 'llama3.1-8b', name: 'Llama 3.1 8B', providerId: 'cerebras', context: 128000, inputPrice: 0, outputPrice: 0, capabilities: ['text'], endpoint: 'https://api.cerebras.ai/v1/chat/completions', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: true, license: 'Meta Llama', speed: 'fast', isFree: true },
];

export const STABILITY_MODELS: ModelInfo[] = [
  { id: 'stable-image/generate/ultra', name: 'SD Ultra', providerId: 'stability', context: 0, inputPrice: 0.08, outputPrice: null, capabilities: ['image-gen'], endpoint: 'https://api.stability.ai/v2beta/stable-image/generate/ultra', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'medium' },
  { id: 'stable-image/generate/sd3', name: 'SD3', providerId: 'stability', context: 0, inputPrice: 0.065, outputPrice: null, capabilities: ['image-gen'], endpoint: 'https://api.stability.ai/v2beta/stable-image/generate/sd3', authExample: 'Authorization: Bearer YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'medium' },
];

export const BFL_MODELS: ModelInfo[] = [
  { id: 'flux-pro-1.1-ultra', name: 'FLUX Pro 1.1 Ultra', providerId: 'bfl', context: 0, inputPrice: 0.06, outputPrice: null, capabilities: ['image-gen'], endpoint: 'https://api.bfl.ml/v1/flux-pro-1.1-ultra', authExample: 'x-key: YOUR_KEY', isOpenSource: false, license: 'Commercial', speed: 'slow' },
  { id: 'flux-schnell', name: 'FLUX Schnell', providerId: 'bfl', context: 0, inputPrice: 0.003, outputPrice: null, capabilities: ['image-gen'], endpoint: 'https://api.bfl.ml/v1/flux-schnell', authExample: 'x-key: YOUR_KEY', isOpenSource: true, license: 'Apache 2.0', speed: 'fast' },
];

export const OLLAMA_MODELS: ModelInfo[] = [
  { id: 'llama3.3', name: 'Llama 3.3', providerId: 'ollama', context: 128000, inputPrice: 0, outputPrice: 0, capabilities: ['text','code'], endpoint: 'http://localhost:11434/api/chat', authExample: 'None', isOpenSource: true, license: 'Meta Llama', speed: 'medium', isFree: true, parameters: '70B' },
  { id: 'mistral', name: 'Mistral 7B', providerId: 'ollama', context: 32000, inputPrice: 0, outputPrice: 0, capabilities: ['text'], endpoint: 'http://localhost:11434/api/chat', authExample: 'None', isOpenSource: true, license: 'Apache 2.0', speed: 'fast', isFree: true, parameters: '7B' },
  { id: 'deepseek-r1', name: 'DeepSeek R1', providerId: 'ollama', context: 64000, inputPrice: 0, outputPrice: 0, capabilities: ['text','reasoning'], endpoint: 'http://localhost:11434/api/chat', authExample: 'None', isOpenSource: true, license: 'DeepSeek', speed: 'medium', isFree: true, parameters: '7B' },
  { id: 'phi4', name: 'Phi-4', providerId: 'ollama', context: 16000, inputPrice: 0, outputPrice: 0, capabilities: ['text','code'], endpoint: 'http://localhost:11434/api/chat', authExample: 'None', isOpenSource: true, license: 'MIT', speed: 'fast', isFree: true, parameters: '14B' },
];
