'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, ChevronDown, Filter,
  ArrowUpDown, ExternalLink, TrendingUp, TrendingDown,
  X, Check, RotateCcw
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';

/* ── Types ── */
interface ModelEntry {
  id: string;
  name: string;
  provider: string;
  context: number;
  inputPrice: string;
  outputPrice: string;
  tokens: string;
  trend: number;
  free: boolean;
  modality: 'text' | 'image' | 'audio' | 'video' | 'embedding';
  description: string;
  isNew?: boolean;
}

/* ── Static model data ── */
const MODELS: ModelEntry[] = [
  { id: 'anthropic/claude-opus-4-7',         name: 'Claude Opus 4.7',        provider: 'anthropic',  context: 200000,  inputPrice: '$3',        outputPrice: '$15',   tokens: '1.1T',   trend: -14.66, free: false, modality: 'text',      description: 'Most intelligent model for complex tasks.' },
  { id: 'openai/gpt-5-5',                    name: 'GPT-5.5',                provider: 'openai',     context: 1050000, inputPrice: '$5',        outputPrice: '$30',   tokens: '316.7B', trend: 59.72,  free: false, modality: 'text',      description: 'Latest OpenAI flagship model.', isNew: true },
  { id: 'google/gemini-3-1-pro-preview',     name: 'Gemini 3.1 Pro',         provider: 'google',     context: 2000000, inputPrice: '$1.25',     outputPrice: '$5',    tokens: '320.5B', trend: -20.24, free: false, modality: 'text',      description: 'Google latest multimodal model.' },
  { id: 'meta-llama/llama-3-3-70b-instruct', name: 'Llama 3.3 70B',          provider: 'meta-llama', context: 131072,  inputPrice: '$0.12',     outputPrice: '$0.12', tokens: '89.2B',  trend: 12.4,   free: false, modality: 'text',      description: 'Meta open-source flagship model.' },
  { id: 'deepseek/deepseek-v4-pro',          name: 'DeepSeek V4 Pro',        provider: 'deepseek',   context: 1050000, inputPrice: '$0.435',    outputPrice: '$0.87', tokens: '210B',   trend: 8.3,    free: false, modality: 'text',      description: 'DeepSeek latest frontier model.' },
  { id: 'mistralai/mistral-medium-3-5',      name: 'Mistral Medium 3.5',     provider: 'mistralai',  context: 262000,  inputPrice: '$1.5',      outputPrice: '$7.5',  tokens: '45.1B',  trend: 3.2,    free: false, modality: 'text',      description: 'Balanced performance and cost.' },
  { id: 'xai/grok-4-3',                     name: 'Grok 4.3',               provider: 'xai',        context: 1000000, inputPrice: '$1.25',     outputPrice: '$2.5',  tokens: '78.3B',  trend: 22.1,   free: false, modality: 'text',      description: "xAI's latest frontier model.", isNew: true },
  { id: 'qwen/qwen3-6-max',                  name: 'Qwen3.6 Max',            provider: 'qwen',       context: 262000,  inputPrice: '$1.04',     outputPrice: '$6.24', tokens: '52.6B',  trend: 15.8,   free: false, modality: 'text',      description: 'Alibaba latest frontier model.' },
  { id: 'cohere/command-r-plus',             name: 'Command R+',             provider: 'cohere',     context: 128000,  inputPrice: '$3',        outputPrice: '$15',   tokens: '18.4B',  trend: -5.2,   free: false, modality: 'text',      description: 'Cohere enterprise RAG model.' },
  { id: 'anthropic/claude-haiku-latest',     name: 'Claude Haiku Latest',    provider: 'anthropic',  context: 200000,  inputPrice: '$1',        outputPrice: '$5',    tokens: '203B',   trend: -2.1,   free: false, modality: 'text',      description: 'Fast and affordable Claude model.' },
  { id: 'openai/gpt-4o',                     name: 'GPT-4o',                 provider: 'openai',     context: 128000,  inputPrice: '$2.5',      outputPrice: '$10',   tokens: '421B',   trend: -8.5,   free: false, modality: 'text',      description: 'OpenAI multimodal flagship.' },
  { id: 'cloudflare/llama-3-2-11b',          name: 'Llama 3.2 11B',          provider: 'cloudflare', context: 128000,  inputPrice: '$0',        outputPrice: '$0',    tokens: '67.2B',  trend: 4.1,    free: true,  modality: 'text',      description: 'Free via Cloudflare Workers AI.' },
  { id: 'cloudflare/llama-3-3-70b',          name: 'Llama 3.3 70B Ins',      provider: 'cloudflare', context: 131072,  inputPrice: '$0',        outputPrice: '$0',    tokens: '89.2B',  trend: 7.3,    free: true,  modality: 'text',      description: 'Free via Cloudflare Workers AI.' },
  { id: 'google/gemma-3-27b-it',             name: 'Gemma 3 27B',            provider: 'google',     context: 131072,  inputPrice: '$0.2',      outputPrice: '$0.6',  tokens: '31.5B',  trend: 1.2,    free: false, modality: 'text',      description: 'Google open model.' },
  { id: 'deepseek/deepseek-r1',              name: 'DeepSeek R1',            provider: 'deepseek',   context: 131072,  inputPrice: '$0.55',     outputPrice: '$2.19', tokens: '156B',   trend: -3.8,   free: false, modality: 'text',      description: 'DeepSeek reasoning model.' },
  { id: 'perplexity/sonar-pro',              name: 'Sonar Pro',              provider: 'perplexity', context: 200000,  inputPrice: '$3',        outputPrice: '$15',   tokens: '22.1B',  trend: 6.4,    free: false, modality: 'text',      description: 'Online search-augmented model.' },
  { id: 'openai/dall-e-3',                   name: 'DALL-E 3',               provider: 'openai',     context: 4096,    inputPrice: '$0.04/img', outputPrice: '-',     tokens: '12.3B',  trend: -1.2,   free: false, modality: 'image',     description: 'OpenAI image generation.' },
  { id: 'google/imagen-4',                   name: 'Imagen 4',               provider: 'google',     context: 4096,    inputPrice: '$0.04/img', outputPrice: '-',     tokens: '8.7B',   trend: 14.5,   free: false, modality: 'image',     description: 'Google latest image generation model.', isNew: true },
  { id: 'openai/whisper-large-v3',           name: 'Whisper Large v3',       provider: 'openai',     context: 1500,    inputPrice: '$0.006/min',outputPrice: '-',     tokens: '5.1B',   trend: 2.1,    free: false, modality: 'audio',     description: 'OpenAI speech transcription.' },
  { id: 'openai/text-embedding-3-large',     name: 'text-embedding-3-large', provider: 'openai',     context: 8192,    inputPrice: '$0.13',     outputPrice: '-',     tokens: '89.3B',  trend: 0.5,    free: false, modality: 'embedding', description: 'OpenAI embeddings model.' },
];

const MODALITY_TABS = [
  { key: 'all',       label: 'Semua',     count: MODELS.length },
  { key: 'text',      label: 'Teks',      count: MODELS.filter(m => m.modality === 'text').length },
  { key: 'image',     label: 'Gambar',    count: MODELS.filter(m => m.modality === 'image').length },
  { key: 'audio',     label: 'Audio',     count: MODELS.filter(m => m.modality === 'audio').length },
  { key: 'embedding', label: 'Embedding', count: MODELS.filter(m => m.modality === 'embedding').length },
];

const SORT_OPTIONS = [
  { key: 'popular',      label: 'Paling Populer' },
  { key: 'trending',     label: 'Trending Minggu Ini' },
  { key: 'price-asc',    label: 'Harga: Terendah' },
  { key: 'price-desc',   label: 'Harga: Tertinggi' },
  { key: 'context-desc', label: 'Konteks: Terbesar' },
];

const PROVIDERS_LIST = [
  'anthropic', 'openai', 'google', 'meta-llama', 'deepseek',
  'mistralai', 'xai', 'qwen', 'cohere', 'perplexity',
  'cloudflare', 'groq',
];

function formatContext(ctx: number): string {
  if (ctx >= 1000000) return `${(ctx / 1000000).toFixed(0)}M`;
  if (ctx >= 1000) return `${(ctx / 1000).toFixed(0)}K`;
  return String(ctx);
}

function ProviderBadge({ provider }: { provider: string }) {
  const COLOR: Record<string, string> = {
    anthropic:  'text-brand-amber   bg-brand-amber/10   border-brand-amber/20',
    openai:     'text-brand-green   bg-brand-green/10   border-brand-green/20',
    google:     'text-brand-blue    bg-brand-blue/10    border-brand-blue/20',
    'meta-llama':'text-white/60    bg-white/[0.06]     border-white/[0.10]',
    deepseek:   'text-[#4ECDC4]    bg-[#4ECDC4]/10     border-[#4ECDC4]/20',
    mistralai:  'text-[#FF6B6B]    bg-[#FF6B6B]/10     border-[#FF6B6B]/20',
    xai:        'text-white/70     bg-white/[0.06]     border-white/[0.10]',
    qwen:       'text-white/60     bg-white/[0.06]     border-white/[0.10]',
    cohere:     'text-brand-pistachio bg-brand-pistachio/10 border-brand-pistachio/20',
    perplexity: 'text-brand-blue   bg-brand-blue/10    border-brand-blue/20',
    cloudflare: 'text-brand-amber   bg-brand-amber/10   border-brand-amber/20',
  };
  const cls = COLOR[provider] ?? 'text-white/50 bg-white/[0.04] border-white/[0.08]';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${cls}`}>
      {provider}
    </span>
  );
}

function ModelRow({ model, index }: { model: ModelEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.35), type: 'spring', damping: 24 }}
      className="model-row group"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="provider-icon text-[10px] font-black text-white/50 flex-shrink-0">
          {model.provider.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-white group-hover:text-brand-blue transition-colors truncate">
              {model.name}
            </span>
            {model.isNew && (
              <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-brand-blue/15 border border-brand-blue/30 text-brand-blue font-semibold flex-shrink-0">
                BARU
              </span>
            )}
            {model.free && (
              <span className="badge-free flex-shrink-0">GRATIS</span>
            )}
          </div>
          <p className="text-[11px] text-white/30 truncate mt-0.5 hidden sm:block">{model.description}</p>
        </div>
      </div>
      <div className="hidden md:flex items-center w-32 flex-shrink-0">
        <ProviderBadge provider={model.provider} />
      </div>
      <div className="hidden lg:flex items-center w-20 flex-shrink-0">
        <span className="text-xs text-white/40">{formatContext(model.context)} ctx</span>
      </div>
      <div className="hidden sm:flex items-center w-24 flex-shrink-0">
        <span className="text-xs text-white/40">{model.tokens}</span>
      </div>
      <div className="hidden sm:flex items-center w-20 flex-shrink-0 justify-end">
        <span className={`text-xs font-medium flex items-center gap-0.5 ${model.trend >= 0 ? 'text-brand-green' : 'text-brand-red/70'}`}>
          {model.trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(model.trend).toFixed(2)}%
        </span>
      </div>
      <div className="hidden xl:flex flex-col items-end w-28 flex-shrink-0">
        <span className="text-xs text-white/55">{model.inputPrice}</span>
        <span className="text-[10px] text-white/25">out: {model.outputPrice}</span>
      </div>
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        <Link
          href={`/chat?model=${encodeURIComponent(model.id)}`}
          className="px-3 py-1 rounded-lg bg-brand-blue/10 border border-brand-blue/25 text-brand-blue text-xs hover:bg-brand-blue/20 transition-all whitespace-nowrap"
        >
          Gunakan
        </Link>
      </div>
    </motion.div>
  );
}

function SortDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SORT_OPTIONS.find(o => o.key === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white text-xs transition-all"
      >
        <ArrowUpDown size={12} />
        {current?.label}
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ type: 'spring', damping: 28, stiffness: 400 }}
            className="absolute right-0 top-full mt-1.5 w-48 glass border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl z-50"
          >
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => { onChange(opt.key); setOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs transition-colors hover:bg-white/[0.05] ${opt.key === value ? 'text-brand-blue' : 'text-white/50 hover:text-white'}`}
              >
                {opt.label}
                {opt.key === value && <Check size={11} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ModelsPage() {
  const [search, setSearch]                       = useState('');
  const [modality, setModality]                   = useState('all');
  const [sort, setSort]                           = useState('popular');
  const [freeOnly, setFreeOnly]                   = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list = [...MODELS];
    if (modality !== 'all') list = list.filter(m => m.modality === modality);
    if (freeOnly) list = list.filter(m => m.free);
    if (selectedProviders.length > 0) list = list.filter(m => selectedProviders.includes(m.provider));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q) || m.id.toLowerCase().includes(q));
    }
    if (sort === 'trending')     list = [...list].sort((a, b) => b.trend - a.trend);
    if (sort === 'context-desc') list = [...list].sort((a, b) => b.context - a.context);
    return list;
  }, [search, modality, sort, freeOnly, selectedProviders]);

  const toggleProvider = (p: string) => setSelectedProviders(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  const clearFilters   = () => { setSearch(''); setModality('all'); setFreeOnly(false); setSelectedProviders([]); };
  const hasFilters     = !!(search || modality !== 'all' || freeOnly || selectedProviders.length > 0);

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <TopNav />
      <div className="pt-14 max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Page header */}
        <div className="flex items-center justify-between py-8 border-b border-white/[0.06]">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 22 }} className="text-2xl font-black font-heading">
              Model
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-white/35 text-sm mt-0.5">
              {MODELS.length} model tersedia dari 60+ provider
            </motion.p>
          </div>
          <Link href="/chat" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white text-sm transition-all">
            Bandingkan <ExternalLink size={13} />
          </Link>
        </div>

        {/* Search + sort bar */}
        <div className="flex items-center gap-3 py-4 border-b border-white/[0.06]">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari model, provider..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/25 outline-none focus:border-brand-blue/40 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                <X size={12} />
              </button>
            )}
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/[0.08]">
              <RotateCcw size={11} /> Reset
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setFreeOnly(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all border ${freeOnly ? 'bg-brand-green/10 border-brand-green/25 text-brand-green' : 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white'}`}
            >
              {freeOnly && <Check size={10} />} Gratis
            </button>
            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </div>

        {/* Modality tabs */}
        <div className="flex items-center gap-1 py-3 border-b border-white/[0.06] overflow-x-auto">
          {MODALITY_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setModality(tab.key)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${modality === tab.key ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
            >
              {modality === tab.key && (
                <motion.div layoutId="modality-bg" className="absolute inset-0 rounded-lg bg-white/[0.07]" transition={{ type: 'spring', damping: 28, stiffness: 380 }} />
              )}
              <span className="relative z-10">{tab.label}</span>
              <span className={`relative z-10 text-[10px] ${modality === tab.key ? 'text-white/60' : 'text-white/25'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Main layout */}
        <div className="flex gap-6 py-6 min-h-[60vh]">
          {/* Sidebar */}
          <aside className="flex-shrink-0 w-52 hidden lg:block">
            <div className="space-y-5 sticky top-20">
              <p className="text-[10px] text-white/25 uppercase tracking-widest flex items-center gap-1.5">
                <Filter size={10} /> Filter
                {(selectedProviders.length > 0 || freeOnly) && (
                  <span className="w-4 h-4 rounded-full bg-brand-blue text-[9px] text-[#09090B] font-black flex items-center justify-center">
                    {selectedProviders.length + (freeOnly ? 1 : 0)}
                  </span>
                )}
              </p>

              {/* Free toggle */}
              <div>
                <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2">Harga</p>
                <button onClick={() => setFreeOnly(v => !v)} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className={`w-7 h-4 rounded-full transition-colors relative ${freeOnly ? 'bg-brand-green' : 'bg-white/10'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${freeOnly ? 'left-3.5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-xs text-white/45">Hanya Gratis</span>
                </button>
              </div>

              {/* Providers */}
              <div>
                <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2">Provider</p>
                <div className="space-y-0.5">
                  {PROVIDERS_LIST.map(p => {
                    const active = selectedProviders.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => toggleProvider(p)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left ${active ? 'bg-brand-blue/8 text-white' : 'hover:bg-white/[0.03] text-white/40 hover:text-white/70'}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${active ? 'bg-brand-blue border-brand-blue' : 'border-white/[0.15] bg-white/[0.04]'}`}>
                          {active && <Check size={9} className="text-[#09090B]" />}
                        </div>
                        <span className="text-xs truncate">{p}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Table */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 px-4 py-2.5 mb-1 text-[10px] text-white/25 uppercase tracking-wider border-b border-white/[0.04]">
              <div className="flex-1">Model</div>
              <div className="hidden md:flex w-32">Provider</div>
              <div className="hidden lg:flex w-20">Konteks</div>
              <div className="hidden sm:flex w-24">Token/Mg</div>
              <div className="hidden sm:flex w-20 justify-end">Tren</div>
              <div className="hidden xl:flex w-28 justify-end">Harga/1M</div>
              <div className="w-16" />
            </div>

            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                filtered.map((model, i) => <ModelRow key={model.id} model={model} index={i} />)
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <p className="text-4xl mb-4">🔍</p>
                  <p className="text-white/40 text-sm">Tidak ada model ditemukan</p>
                  <button onClick={clearFilters} className="mt-3 text-xs text-brand-blue hover:text-white transition-colors">Reset filter</button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="py-4 px-4 text-xs text-white/20 border-t border-white/[0.04] mt-2">
              Menampilkan {filtered.length} dari {MODELS.length} model
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
