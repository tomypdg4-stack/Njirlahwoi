'use client';
import { Capability } from '@/lib/providers/types';

const BADGE_CONFIG: Record<Capability, { emoji: string; color: string; label: string }> = {
  text: { emoji: '📝', color: '#7C3AED', label: 'Text' },
  vision: { emoji: '👁', color: '#06B6D4', label: 'Vision' },
  audio: { emoji: '🎵', color: '#F59E0B', label: 'Audio' },
  video: { emoji: '🎬', color: '#EC4899', label: 'Video' },
  code: { emoji: '💻', color: '#10B981', label: 'Code' },
  reasoning: { emoji: '🧠', color: '#F43F5E', label: 'Reasoning' },
  'image-gen': { emoji: '🎨', color: '#8B5CF6', label: 'Image Gen' },
  embedding: { emoji: '📊', color: '#3B82F6', label: 'Embedding' },
  'function-calling': { emoji: '🔧', color: '#14B8A6', label: 'Functions' },
  streaming: { emoji: '⚡', color: '#EAB308', label: 'Streaming' },
  reranking: { emoji: '📈', color: '#F97316', label: 'Reranking' },
  speech: { emoji: '🗣️', color: '#A855F7', label: 'Speech' },
};

export default function CapabilityBadge({ capability }: { capability: Capability }) {
  const config = BADGE_CONFIG[capability];
  if (!config) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border transition-transform hover:scale-105"
      style={{
        color: config.color,
        backgroundColor: `${config.color}15`,
        borderColor: `${config.color}30`,
      }}
    >
      <span>{config.emoji}</span>
      {config.label}
    </span>
  );
}
