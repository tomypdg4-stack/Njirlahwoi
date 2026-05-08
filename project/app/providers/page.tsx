'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ExternalLink, TrendingUp, Server, Globe, Shield,
  Zap, Activity, ChevronRight, X, Check, BarChart3
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';

interface ProviderEntry {
  id: string;
  name: string;
  models: number;
  status: 'online' | 'degraded' | 'offline';
  latency: string;
  uptime: string;
  region: string;
  color: string;
  icon: string;
  description: string;
}

const PROVIDERS: ProviderEntry[] = [
  { id: 'openai', name: 'OpenAI', models: 42, status: 'online', latency: '120ms', uptime: '99.95%', region: 'US', color: '#10A37F', icon: '🟢', description: 'GPT-5.5, GPT-4o, DALL-E, Whisper dan model lainnya' },
  { id: 'anthropic', name: 'Anthropic', models: 18, status: 'online', latency: '95ms', uptime: '99.98%', region: 'US', color: '#D4A574', icon: '🔶', description: 'Claude Opus 4.7, Claude Sonnet, Claude Haiku' },
  { id: 'google', name: 'Google', models: 35, status: 'online', latency: '110ms', uptime: '99.92%', region: 'Global', color: '#4285F4', icon: '🔵', description: 'Gemini 3.1 Pro, Gemini Flash, Imagen, Chirp' },
  { id: 'meta-llama', name: 'Meta', models: 24, status: 'online', latency: '85ms', uptime: '99.90%', region: 'US', color: '#0064E0', icon: '🟦', description: 'Llama 3.3, Llama Guard, Code Llama' },
  { id: 'deepseek', name: 'DeepSeek', models: 12, status: 'online', latency: '140ms', uptime: '99.85%', region: 'CN', color: '#4ECDC4', icon: '🌊', description: 'DeepSeek V4 Pro, V4 Flash, R1' },
  { id: 'mistralai', name: 'Mistral AI', models: 15, status: 'online', latency: '105ms', uptime: '99.91%', region: 'EU', color: '#FF6B6B', icon: '🔴', description: 'Mistral Medium 3.5, Mistral Large, Codestral' },
  { id: 'xai', name: 'xAI', models: 8, status: 'online', latency: '130ms', uptime: '99.88%', region: 'US', color: '#FFFFFF', icon: '⚡', description: 'Grok 4.3, Grok 4.1 Fast' },
  { id: 'qwen', name: 'Qwen (Alibaba)', models: 14, status: 'online', latency: '150ms', uptime: '99.82%', region: 'CN', color: '#FF9500', icon: '🟠', description: 'Qwen3.6 Max, Qwen VL, Qwen Audio' },
  { id: 'cohere', name: 'Cohere', models: 10, status: 'online', latency: '115ms', uptime: '99.89%', region: 'CA', color: '#39594D', icon: '🌿', description: 'Command R+, Command R, Embed, Rerank' },
  { id: 'groq', name: 'Groq', models: 8, status: 'online', latency: '45ms', uptime: '99.94%', region: 'US', color: '#F55036', icon: '🚀', description: 'Inference tercepat dengan LPU hardware' },
  { id: 'perplexity', name: 'Perplexity', models: 6, status: 'online', latency: '160ms', uptime: '99.80%', region: 'US', color: '#20808D', icon: '🌐', description: 'Sonar Pro, Sonar - model pencarian online' },
  { id: 'cloudflare', name: 'Cloudflare', models: 20, status: 'online', latency: '60ms', uptime: '99.97%', region: 'Global', color: '#F38020', icon: '☁️', description: 'Workers AI - model gratis di edge network' },
  { id: 'together', name: 'Together AI', models: 30, status: 'online', latency: '90ms', uptime: '99.86%', region: 'US', color: '#3B82F6', icon: '🤝', description: 'Inference cepat untuk model open-source' },
  { id: 'nvidia', name: 'NVIDIA', models: 12, status: 'online', latency: '100ms', uptime: '99.93%', region: 'US', color: '#76B900', icon: '💚', description: 'NIM inference dengan GPU acceleration' },
  { id: 'sambanova', name: 'SambaNova', models: 6, status: 'online', latency: '55ms', uptime: '99.90%', region: 'US', color: '#FF4500', icon: '🔥', description: 'Custom hardware untuk inference ultra-cepat' },
  { id: 'fireworks', name: 'Fireworks AI', models: 18, status: 'online', latency: '75ms', uptime: '99.91%', region: 'US', color: '#FF6B35', icon: '🎆', description: 'Optimized inference engine' },
];

function StatusDot({ status }: { status: string }) {
  return (
    <motion.div
      animate={status === 'online' ? { scale: [1, 1.3, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
      className={`w-2 h-2 rounded-full flex-shrink-0 ${
        status === 'online' ? 'bg-brand-green' :
        status === 'degraded' ? 'bg-brand-amber' : 'bg-brand-red'
      }`}
    />
  );
}

function ProviderCard({ provider, index }: { provider: ProviderEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: Math.min(index * 0.04, 0.6), type: 'spring', damping: 22 }}
      whileHover={{ y: -3 }}
      className="glass-card rounded-2xl p-5 group cursor-pointer hover:border-white/[0.14] transition-all relative overflow-hidden"
    >
      {/* Subtle color accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-80 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${provider.color}, transparent)` }}
      />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <motion.span
            className="text-xl"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.15 }}
          >
            {provider.icon}
          </motion.span>
          <div>
            <h3 className="text-sm font-semibold text-white group-hover:text-brand-blue transition-colors">
              {provider.name}
            </h3>
            <p className="text-[10px] text-white/30">{provider.region}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot status={provider.status} />
          <span className="text-[10px] text-white/40 capitalize">{provider.status}</span>
        </div>
      </div>

      <p className="text-xs text-white/35 mb-3 line-clamp-2">{provider.description}</p>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs font-bold text-white">{provider.models}</p>
          <p className="text-[9px] text-white/25">Model</p>
        </div>
        <div>
          <p className="text-xs font-bold text-brand-green">{provider.latency}</p>
          <p className="text-[9px] text-white/25">Latensi</p>
        </div>
        <div>
          <p className="text-xs font-bold text-brand-blue">{provider.uptime}</p>
          <p className="text-[9px] text-white/25">Uptime</p>
        </div>
      </div>

      <motion.div
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={14} className="text-brand-blue" />
      </motion.div>
    </motion.div>
  );
}

export default function ProvidersPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return PROVIDERS;
    const q = search.toLowerCase();
    return PROVIDERS.filter(p =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }, [search]);

  const totalModels = PROVIDERS.reduce((acc, p) => acc + p.models, 0);

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <TopNav />
      <div className="pt-14 max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-10 border-b border-white/[0.06]"
        >
          <h1 className="text-2xl font-black font-heading mb-2">
            Provider <span className="gradient-text">AI</span>
          </h1>
          <p className="text-white/35 text-sm">
            {PROVIDERS.length} provider aktif menyediakan {totalModels}+ model AI
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-4 gap-4 py-6 border-b border-white/[0.06]"
        >
          {[
            { value: `${PROVIDERS.length}`, label: 'Provider Aktif', icon: <Server size={14} /> },
            { value: `${totalModels}+`, label: 'Total Model', icon: <Zap size={14} /> },
            { value: '99.9%', label: 'Avg Uptime', icon: <Activity size={14} /> },
            { value: 'Global', label: 'Coverage', icon: <Globe size={14} /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="text-center"
            >
              <div className="flex items-center justify-center text-brand-blue mb-1">{stat.icon}</div>
              <p className="text-lg font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-white/30">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Network status banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="my-6 rounded-2xl p-4 flex items-center gap-3"
          style={{
            background: 'linear-gradient(135deg, rgba(52,199,89,0.08), rgba(90,200,250,0.05))',
            border: '1px solid rgba(52,199,89,0.15)',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-brand-green flex-shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-white">Semua sistem operasional</p>
            <p className="text-xs text-white/35">Semua {PROVIDERS.length} provider sedang online dan berfungsi normal</p>
          </div>
          <Link href="#" className="ml-auto text-xs text-brand-blue hover:text-white flex items-center gap-1">
            Status <ExternalLink size={10} />
          </Link>
        </motion.div>

        {/* Search */}
        <div className="flex items-center gap-3 py-4 border-b border-white/[0.06]">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari provider..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/25 outline-none focus:border-brand-blue/40 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Provider Grid */}
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((provider, i) => (
              <ProviderCard key={provider.id} provider={provider} index={i} />
            ))}
          </AnimatePresence>
        </div>

        <div className="py-4 text-xs text-white/20 border-t border-white/[0.04]">
          Menampilkan {filtered.length} dari {PROVIDERS.length} provider
        </div>
      </div>
      <Footer />
    </div>
  );
}
