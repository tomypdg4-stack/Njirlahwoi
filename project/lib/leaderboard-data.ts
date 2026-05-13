export interface LlmModelStats {
  rank: number;
  name: string;
  provider: string;
  score: number;
  params: string;
  ctx: string;
  speed: string;
  trend: 'up' | 'down' | 'same';
  tags: string[];
}

export const LEADERBOARD_DATA: LlmModelStats[] = [
  { rank: 1, name: 'Claude Mythos Preview', provider: 'Anthropic', score: 96.4, params: 'Unknown', ctx: '200K', speed: 'Fast', trend: 'up', tags: ['Reasoning', 'Coding'] },
  { rank: 2, name: 'Gemini 3.1 Pro', provider: 'Google', score: 95.8, params: 'Unknown', ctx: '2M', speed: 'Fast', trend: 'up', tags: ['Context', 'Multimodal'] },
  { rank: 3, name: 'GPT-5.5', provider: 'OpenAI', score: 95.1, params: 'Unknown', ctx: '128K', speed: 'Medium', trend: 'same', tags: ['General', 'Agents'] },
  { rank: 4, name: 'Claude Opus 4.7', provider: 'Anthropic', score: 94.2, params: 'Unknown', ctx: '200K', speed: 'Slow', trend: 'down', tags: ['Writing'] },
  { rank: 5, name: 'DeepSeek-V4-Pro-Max', provider: 'DeepSeek', score: 93.9, params: '670B', ctx: '128K', speed: 'Fast', trend: 'up', tags: ['Math', 'Coding', 'Open'] },
  { rank: 6, name: 'Kimi K2.6', provider: 'Moonshot', score: 92.5, params: 'Unknown', ctx: '200K', speed: 'Fast', trend: 'up', tags: ['Context'] },
  { rank: 7, name: 'Qwen 3.6 Plus', provider: 'Alibaba', score: 91.8, params: '110B', ctx: '32K', speed: 'Fast', trend: 'same', tags: ['Open'] },
  { rank: 8, name: 'Grok-4.20 Beta', provider: 'xAI', score: 91.0, params: '314B', ctx: '2M', speed: 'Fast', trend: 'up', tags: ['Twitter', 'Context'] },
  { rank: 9, name: 'Mercury 2', provider: 'Njirlah', score: 90.5, params: '7B', ctx: '8K', speed: 'Ultra', trend: 'up', tags: ['Speed', 'Open'] },
  { rank: 10, name: 'Seed 2.0 Pro', provider: 'Seed', score: 89.9, params: 'Unknown', ctx: '64K', speed: 'Medium', trend: 'down', tags: ['Creative'] },
];
