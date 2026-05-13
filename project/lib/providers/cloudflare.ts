import { ModelInfo } from './types';

export const CLOUDFLARE_MODELS: ModelInfo[] = [
  {
    id: '@cf/meta/llama-3.1-8b-instruct',
    name: 'Llama 3.1 8B (Cloudflare)',
    providerId: 'cloudflare',
    context: 8000,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: ['text', 'streaming'],
    endpoint: '/api/cloudflare/chat',
    authExample: 'Cloudflare API Token',
    isOpenSource: true,
    license: 'Llama 3.1',
    speed: 'fast',
    isNew: true
  },
  {
    id: '@cf/meta/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B (Cloudflare)',
    providerId: 'cloudflare',
    context: 8000,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: ['text', 'streaming', 'reasoning'],
    endpoint: '/api/cloudflare/chat',
    authExample: 'Cloudflare API Token',
    isOpenSource: true,
    license: 'Llama 3.1',
    speed: 'medium',
    isNew: true
  },
  {
    id: '@cf/mistral/mistral-7b-instruct-v0.3',
    name: 'Mistral 7B v0.3 (Cloudflare)',
    providerId: 'cloudflare',
    context: 8000,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: ['text', 'streaming'],
    endpoint: '/api/cloudflare/chat',
    authExample: 'Cloudflare API Token',
    isOpenSource: true,
    license: 'Apache-2.0',
    speed: 'fast'
  },
  {
    id: '@cf/qwen/qwen1.5-14b-chat-awq',
    name: 'Qwen 1.5 14B (Cloudflare)',
    providerId: 'cloudflare',
    context: 4000,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: ['text', 'streaming'],
    endpoint: '/api/cloudflare/chat',
    authExample: 'Cloudflare API Token',
    isOpenSource: true,
    license: 'Proprietary',
    speed: 'fast'
  }
];
