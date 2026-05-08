export type Capability =
  | 'text' | 'vision' | 'audio' | 'video'
  | 'code' | 'reasoning' | 'image-gen'
  | 'embedding' | 'function-calling'
  | 'streaming' | 'reranking' | 'speech';

export interface ProviderInfo {
  id: string;
  name: string;
  color: string;
  baseUrl: string;
  authHeader: string;
  docsUrl: string;
  description: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  providerId: string;
  context: number;
  inputPrice: number | null;
  outputPrice: number | null;
  capabilities: Capability[];
  endpoint: string;
  authExample: string;
  isOpenSource: boolean;
  license: string;
  parameters?: string;
  speed?: 'fast' | 'medium' | 'slow';
  isNew?: boolean;
  isFree?: boolean;
}
