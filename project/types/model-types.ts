export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  pricing?: { prompt: string; completion: string };
  free: boolean;
  source: "openrouter" | "cloudflare";
  context_length?: number;
  description?: string;
}

export type OpenRouterModel = ModelInfo;
