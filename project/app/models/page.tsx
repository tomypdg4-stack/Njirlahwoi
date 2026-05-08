'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  SlidersHorizontal, LayoutGrid, List, ArrowUpDown, ChevronDown, Check, GitCompare,
  Search, X, ExternalLink, Settings, ChevronRight, Eye, EyeOff, Loader2, CheckCircle, 
  XCircle, Filter, RotateCcw, AlertTriangle, Zap, Server, Shield, Sparkles, Box,
  Cpu, Activity, Database, Globe, Layers, Maximize2, Minimize2, Copy, Info
} from 'lucide-react';

// === IMPORT LOCAL COMPONENTS & DATA ===
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import { useModelsPageStore } from '@/store/models-page-store';
import { ALL_PROVIDERS, ALL_MODELS, TOTAL_MODELS_CLAIM, TOTAL_PROVIDERS_CLAIM, TOTAL_ENDPOINTS_CLAIM, TOTAL_FREE_CLAIM, Capability, ProviderInfo, ModelInfo } from '@/lib/providers';

// Dynamically import heavy WebGL component for performance
const NeuralParticles = dynamic(() => import('@/components/webgl/NeuralParticles'), { ssr: false });

// ==========================================
// UTILITY & HELPER FUNCTIONS
// ==========================================

const formatCtx = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(0)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : n === 0 ? '—' : String(n);
const formatPrice = (p: number | null) => p === null ? '—' : p === 0 ? 'Free' : `$${p}`;

const SORT_OPTIONS = [
  { key: 'name' as const, label: 'Alphabetical A-Z', icon: <ArrowUpDown size={14}/> },
  { key: 'price-asc' as const, label: 'Price: Lowest First', icon: <ArrowUpDown size={14}/> },
  { key: 'price-desc' as const, label: 'Price: Highest First', icon: <ArrowUpDown size={14}/> },
  { key: 'context' as const, label: 'Context: Largest First', icon: <ArrowUpDown size={14}/> },
  { key: 'provider' as const, label: 'Group by Provider', icon: <ArrowUpDown size={14}/> },
];

const CAPABILITIES_CONFIG: { key: Capability; label: string; emoji: string; color: string; desc: string }[] = [
  { key: 'text', label: 'Text Generation', emoji: '📝', color: '#7C3AED', desc: 'Standard text completion and chat capabilities' },
  { key: 'vision', label: 'Computer Vision', emoji: '👁', color: '#06B6D4', desc: 'Image understanding and visual QA' },
  { key: 'audio', label: 'Audio Processing', emoji: '🎵', color: '#F59E0B', desc: 'Speech to text and audio analysis' },
  { key: 'code', label: 'Code Generation', emoji: '💻', color: '#10B981', desc: 'Optimized for programming languages' },
  { key: 'reasoning', label: 'Advanced Reasoning', emoji: '🧠', color: '#F43F5E', desc: 'Chain of thought and complex logic' },
  { key: 'image-gen', label: 'Image Generation', emoji: '🎨', color: '#8B5CF6', desc: 'Create images from text prompts' },
  { key: 'embedding', label: 'Text Embedding', emoji: '📊', color: '#3B82F6', desc: 'Vector representation for search/RAG' },
  { key: 'function-calling', label: 'Tool Use / Functions', emoji: '🔧', color: '#14B8A6', desc: 'Execute external APIs and tools' },
  { key: 'streaming', label: 'Token Streaming', emoji: '⚡', color: '#EAB308', desc: 'Real-time response generation' },
  { key: 'reranking', label: 'Document Reranking', emoji: '📈', color: '#F97316', desc: 'Optimize search results relevance' },
  { key: 'speech', label: 'Text to Speech', emoji: '🗣️', color: '#A855F7', desc: 'Generate human-like voice from text' },
];

// ==========================================
// INLINE SUB-COMPONENTS FOR COMPLEXITY
// ==========================================

const CapabilityBadge = ({ capability, showLabel = true }: { capability: Capability, showLabel?: boolean }) => {
  const config = CAPABILITIES_CONFIG.find(c => c.key === capability);
  if (!config) return null;
  return (
    <div className="relative group inline-block">
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-help"
        style={{ color: config.color, backgroundColor: `${config.color}15`, borderColor: `${config.color}30`, boxShadow: `0 0 0 rgba(0,0,0,0)` }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLSpanElement).style.boxShadow = `0 0 15px ${config.color}40`; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLSpanElement).style.boxShadow = `0 0 0 rgba(0,0,0,0)`; }}
      >
        <span>{config.emoji}</span>
        {showLabel && config.label}
      </span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1A1A24] border border-white/10 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
        <p className="text-xs font-bold text-white mb-0.5">{config.label}</p>
        <p className="text-[10px] text-white/60">{config.desc}</p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1A24]"></div>
      </div>
    </div>
  );
};

const StatusDot = ({ status }: { status: 'connected' | 'error' | 'unconfigured' | 'checking' }) => {
  const COLOR_MAP = { connected: '#10B981', error: '#F43F5E', unconfigured: '#6B7280', checking: '#F59E0B' };
  const color = COLOR_MAP[status];
  return (
    <span className="relative flex items-center justify-center w-4 h-4 group cursor-help">
      <span className="absolute w-3 h-3 rounded-full" style={{ backgroundColor: color, opacity: 0.4 }} />
      <motion.span
        className="absolute w-3 h-3 rounded-full"
        style={{ backgroundColor: color, opacity: 0.4 }}
        animate={status === 'connected' ? { scale: [1, 2.5], opacity: [0.8, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
      <span className="relative w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color, color }} />
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 border border-white/10 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </span>
  );
};

const CodeSnippet = ({ modelId, endpoint, authExample }: { modelId: string; endpoint: string; authExample: string }) => {
  const [tab, setTab] = useState<'cURL' | 'Python' | 'JavaScript' | 'Go'>('cURL');
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    const isBearer = authExample.toLowerCase().includes('bearer');
    const headerKey = isBearer ? 'Authorization' : authExample.split(':')[0]?.trim() || 'Authorization';
    const headerVal = isBearer ? 'Bearer YOUR_API_KEY' : authExample.split(':').slice(1).join(':')?.trim() || 'YOUR_API_KEY';

    switch (tab) {
      case 'cURL': return `curl -X POST "${endpoint}" \\\n  -H "Content-Type: application/json" \\\n  -H "${headerKey}: ${headerVal}" \\\n  -d '{\n    "model": "${modelId}",\n    "messages": [{"role": "user", "content": "Hello Universe!"}],\n    "max_tokens": 4096,\n    "temperature": 0.7\n  }'`;
      case 'Python': return `import requests\nimport json\n\nurl = "${endpoint}"\nheaders = {\n    "Content-Type": "application/json",\n    "${headerKey}": "${headerVal}"\n}\ndata = {\n    "model": "${modelId}",\n    "messages": [{"role": "user", "content": "Hello Universe!"}],\n    "max_tokens": 4096,\n    "temperature": 0.7\n}\n\nresponse = requests.post(url, headers=headers, json=data)\nprint(json.dumps(response.json(), indent=2))`;
      case 'JavaScript': return `const response = await fetch("${endpoint}", {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json",\n    "${headerKey}": "${headerVal}"\n  },\n  body: JSON.stringify({\n    model: "${modelId}",\n    messages: [{ role: "user", content: "Hello Universe!" }],\n    max_tokens: 4096,\n    temperature: 0.7\n  })\n});\n\nconst data = await response.json();\nconsole.log(JSON.stringify(data, null, 2));`;
      case 'Go': return `package main\n\nimport (\n\t"bytes"\n\t"fmt"\n\t"net/http"\n)\n\nfunc main() {\n\turl := "${endpoint}"\n\tpayload := []byte(\`{"model":"${modelId}","messages":[{"role":"user","content":"Hello!"}]}\`)\n\n\treq, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))\n\treq.Header.Set("Content-Type", "application/json")\n\treq.Header.Set("${headerKey}", "${headerVal}")\n\n\tclient := &http.Client{}\n\tresp, _ := client.Do(req)\n\tdefer resp.Body.Close()\n\n\tfmt.Println("Status:", resp.Status)\n}`;
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#05050A] overflow-hidden shadow-inner relative group mt-4">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-white/[0.02]">
        <div className="flex gap-1.5">
          {(['cURL', 'Python', 'JavaScript', 'Go'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`relative px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all ${tab === t ? 'text-white' : 'text-white/35 hover:text-white/70 hover:bg-white/[0.04]'}`}>
              {tab === t && <motion.div layoutId={`code-tab-${modelId}`} className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#7C3AED]/20 to-[#06B6D4]/20 border border-white/[0.1]" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>
        <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-white/[0.05] border border-white/[0.05] hover:bg-white/[0.1] hover:border-white/[0.1] transition-all">
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span key="ok" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="flex items-center gap-1.5 text-[#10B981]">
                <Check size={12} /> Copied to Clipboard
              </motion.span>
            ) : (
              <motion.span key="cp" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="flex items-center gap-1.5 text-white/60 group-hover:text-white transition-colors">
                <Copy size={12} /> Copy Source
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-white/[0.02] border-r border-white/[0.05] flex flex-col items-center py-4 text-[10px] text-white/20 font-mono select-none">
          {generateCode().split('\n').map((_, i) => <div key={i} className="leading-relaxed">{i + 1}</div>)}
        </div>
        <pre className="p-4 pl-12 text-[12px] leading-relaxed text-[#A9B1D6] overflow-x-auto font-mono custom-scrollbar">
          <code dangerouslySetInnerHTML={{ __html: generateCode().replace(/"([^"]+)"/g, '<span style="color:#9ECE6A">"$1"</span>').replace(/(const|await|import|from|package|func|var|let)\b/g, '<span style="color:#BB9AF7">$1</span>').replace(/({|}|\[|\])/g, '<span style="color:#89DDFF">$1</span>') }} />
        </pre>
      </div>
    </div>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function ModelsPage() {
  const {
    filteredModels, searchQuery, setSearchQuery,
    viewMode, setViewMode, sortBy, setSortBy,
    isFilterOpen, setIsFilterOpen, compareList, toggleCompare,
    configModalProvider, setConfigModalProvider, selectedProviders, toggleProvider,
    selectedCapabilities, toggleCapability, resetFilters, models
  } = useModelsPageStore();

  const [loading, setLoading] = useState(true);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const hasActiveFilters = selectedProviders.length > 0 || selectedCapabilities.length > 0 || searchQuery.trim().length > 0;
  
  // Calculate provider counts dynamically
  const providerCounts = useMemo(() => {
    return ALL_PROVIDERS.map(p => ({
      ...p, count: models.filter(m => m.providerId === p.id).length
    })).filter(p => p.count > 0).sort((a,b) => b.count - a.count);
  }, [models]);

  // --- RENDER COMPONENT: Provider Card ---
  const renderProviderCard = (provider: ProviderInfo, index: number) => {
    const pModels = ALL_MODELS.filter(m => m.providerId === provider.id);
    const freeCount = pModels.filter(m => m.isFree || (m.inputPrice === 0 && m.outputPrice === 0)).length;
    const minPrice = pModels.reduce((min, m) => Math.min(min, m.inputPrice ?? Infinity), Infinity);
    const maxContext = pModels.reduce((max, m) => Math.max(max, m.context), 0);
    
    return (
      <motion.div
        key={provider.id}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: Math.min(index * 0.05, 0.5), type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className="group relative rounded-2xl border glass-panel p-5 flex flex-col h-full overflow-hidden"
        style={{ borderColor: `${provider.color}25` }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 10px 40px -10px ${provider.color}40, inset 0 0 0 1px ${provider.color}60`;
          (e.currentTarget as HTMLDivElement).style.borderColor = `${provider.color}80`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLDivElement).style.borderColor = `${provider.color}25`;
        }}
      >
        {/* Decorative background flare */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[60px] opacity-0 group-hover:opacity-[0.07] transition-opacity pointer-events-none" style={{ backgroundColor: provider.color }} />

        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black shadow-inner"
              style={{ backgroundColor: `${provider.color}15`, color: provider.color, border: `1px solid ${provider.color}30` }}
            >
              {provider.name.slice(0, 2).toUpperCase()}
            </motion.div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{provider.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Globe size={10} className="text-white/30" />
                <a href={provider.docsUrl} target="_blank" rel="noreferrer" className="text-[10px] text-white/40 hover:text-white transition-colors flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  {provider.docsUrl.replace('https://', '').split('/')[0]} <ExternalLink size={8} />
                </a>
              </div>
            </div>
          </div>
          <StatusDot status={freeCount > 0 ? 'connected' : 'unconfigured'} />
        </div>

        <p className="text-xs text-white/50 leading-relaxed mb-4 flex-1">{provider.description}</p>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="bg-[#05050A] rounded-lg p-2.5 border border-white/5">
            <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1 flex items-center gap-1"><Layers size={10}/> Models</div>
            <div className="text-sm font-bold text-white">{pModels.length} <span className="text-[10px] text-white/40 font-normal">total</span></div>
          </div>
          <div className="bg-[#05050A] rounded-lg p-2.5 border border-white/5">
            <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1 flex items-center gap-1"><Maximize2 size={10}/> Max Ctx</div>
            <div className="text-sm font-bold text-white">{formatCtx(maxContext)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto relative z-10">
          <button onClick={() => setConfigModalProvider(provider.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all group-hover:bg-white/[0.06]">
            <Settings size={12} /> Configure
          </button>
          <button onClick={() => { resetFilters(); toggleProvider(provider.id); document.getElementById('models-grid')?.scrollIntoView({behavior: 'smooth'}); }} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#7C3AED]/20 border border-[#7C3AED]/30 hover:bg-[#7C3AED]/40 hover:border-[#7C3AED]/50 transition-all group-hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            Explore <ChevronRight size={12} />
          </button>
        </div>
      </motion.div>
    );
  };

  // --- RENDER COMPONENT: Model Card ---
  const renderModelCard = (model: ModelInfo, index: number) => {
    const isComparing = compareList.includes(model.id);
    const provider = ALL_PROVIDERS.find(p => p.id === model.providerId);
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.3 }}
        className={`group flex flex-col rounded-2xl border transition-all duration-300 relative overflow-hidden ${isComparing ? 'bg-[#7C3AED]/20 border-[#7C3AED]/50 shadow-[0_0_30px_rgba(124,58,237,0.3)]' : 'bg-[#0A0A10]/90 backdrop-blur-xl border-white/[0.08] hover:border-[#06B6D4]/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:bg-[#0D0D1A]'}`}
      >
        <div className="p-5 flex-1 flex flex-col relative">
          {/* Top Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => toggleCompare(model.id)} className={`p-2 rounded-xl border backdrop-blur-sm transition-all ${isComparing ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]' : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'}`}>
              <GitCompare size={14} />
            </button>
          </div>

          {/* Header */}
          <div className="flex items-start gap-4 mb-4 pr-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-inner" style={{ backgroundColor: `${provider?.color || '#666'}15`, color: provider?.color || '#888', border: `1px solid ${provider?.color || '#666'}30` }}>
              {model.providerId.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 flex-wrap">
                {model.name}
                {model.isNew && <span className="px-2 py-0.5 text-[9px] rounded-md bg-[#06B6D4]/20 border border-[#06B6D4]/40 text-[#06B6D4] font-black tracking-wider uppercase shadow-[0_0_10px_rgba(6,182,212,0.3)]">New</span>}
                {model.isFree && <span className="px-2 py-0.5 text-[9px] rounded-md bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] font-black tracking-wider uppercase shadow-[0_0_10px_rgba(16,185,129,0.3)]">Free</span>}
              </h3>
              <p className="text-[11px] text-white/40 font-mono mt-1 flex items-center gap-1.5">
                <Server size={10}/> {model.providerId} <span className="text-white/20">/</span> {model.id}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {model.capabilities.map(c => <CapabilityBadge key={c} capability={c} />)}
            {model.isOpenSource && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6]">
                <Box size={10}/> Open Source
              </span>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 mt-auto">
            <div className="bg-[#05050A] rounded-xl p-3 border border-white/5 group-hover:border-white/10 transition-colors">
              <div className="flex items-center gap-1 text-[9px] text-white/30 uppercase tracking-widest mb-1.5"><Maximize2 size={10}/> Context</div>
              <div className="text-xs font-mono text-white/80 font-bold">{formatCtx(model.context)}</div>
            </div>
            <div className="bg-[#05050A] rounded-xl p-3 border border-white/5 group-hover:border-white/10 transition-colors">
              <div className="flex items-center gap-1 text-[9px] text-white/30 uppercase tracking-widest mb-1.5"><ChevronRight size={10}/> In ($/M)</div>
              <div className="text-xs font-mono text-white/80 font-bold">{formatPrice(model.inputPrice)}</div>
            </div>
            <div className="bg-[#05050A] rounded-xl p-3 border border-white/5 group-hover:border-white/10 transition-colors">
              <div className="flex items-center gap-1 text-[9px] text-white/30 uppercase tracking-widest mb-1.5"><ChevronRight size={10} className="rotate-180"/> Out ($/M)</div>
              <div className="text-xs font-mono text-white/80 font-bold">{formatPrice(model.outputPrice)}</div>
            </div>
          </div>
        </div>

        {/* Expandable Technical Details */}
        <details className="group/details border-t border-white/[0.05] bg-[#0A0A10] rounded-b-2xl [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex items-center justify-center gap-2 p-3 text-[10px] font-bold text-white/40 uppercase tracking-widest cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors select-none">
            <Cpu size={12}/> View Technical Specs <ChevronDown size={12} className="group-open/details:rotate-180 transition-transform"/>
          </summary>
          <div className="p-5 pt-2 border-t border-white/[0.05]">
            <div className="space-y-4">
              
              {/* Endpoint info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Globe size={11}/> API Endpoint</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#05050A] border border-white/5 font-mono text-[11px] text-white/70 overflow-hidden">
                  <span className="text-[#06B6D4] font-bold">POST</span>
                  <span className="truncate">{model.endpoint}</span>
                </div>
              </div>

              {/* Advanced info rows */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                {model.parameters && (
                  <div>
                    <div className="text-[10px] text-white/30 mb-1 flex items-center gap-1"><Database size={10}/> Parameters</div>
                    <div className="text-xs text-white/80 font-medium">{model.parameters}</div>
                  </div>
                )}
                {model.speed && (
                  <div>
                    <div className="text-[10px] text-white/30 mb-1 flex items-center gap-1"><Zap size={10}/> Inference Speed</div>
                    <div className="text-xs text-white/80 font-medium capitalize flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${model.speed === 'fast' ? 'bg-[#10B981]' : model.speed === 'medium' ? 'bg-[#F59E0B]' : 'bg-[#F43F5E]'}`}></span>
                      {model.speed}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-[10px] text-white/30 mb-1 flex items-center gap-1"><Shield size={10}/> License</div>
                  <div className="text-xs text-white/80 font-medium">{model.license}</div>
                </div>
              </div>

              {/* Implementation Code */}
              <CodeSnippet modelId={model.id} endpoint={model.endpoint} authExample={model.authExample} />

            </div>
          </div>
        </details>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#010105] text-white font-sans selection:bg-[#7C3AED]/30 selection:text-white">
      <div className="scanlines"></div>
      <div className="noise-overlay"></div>
      
      {/* Decorative ambient background */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(124, 58, 237, 0.03), transparent 25%), radial-gradient(circle at 85% 30%, rgba(6, 182, 212, 0.04), transparent 25%)'
      }}></div>

      <TopNav />

      <main className="relative z-10 pt-20 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        
        {/* ========================================== */}
        {/* HERO SECTION WITH WEBGL                    */}
        {/* ========================================== */}
        <section className="relative w-full rounded-[2rem] overflow-hidden border border-white/[0.08] bg-[#0A0A10] shadow-2xl mb-12 flex flex-col items-center justify-center min-h-[600px] lg:min-h-[700px]">
          <NeuralParticles />
          
          <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
            >
              <Sparkles size={14} className="text-[#06B6D4] animate-pulse"/>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">The Universe of AI Models</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black font-heading tracking-tighter mb-6 leading-[1.1]">
              <span className="inline-block drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">Every LLM.</span><br/>
              <span className="inline-block holographic-text pb-2 px-2 -ml-2">Every Provider.</span><br/>
              <span className="inline-block drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">One Center.</span>
            </h1>

            <p className="text-base lg:text-xl text-white/50 max-w-2xl mb-12 font-medium leading-relaxed">
              Explore, compare, and integrate over a million model configurations from hundreds of providers globally. The ultimate command center for modern AI engineering.
            </p>

            {/* Massive Stats Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-12">
              {[
                { value: TOTAL_MODELS_CLAIM, label: 'Configurations', suffix: '+' },
                { value: TOTAL_PROVIDERS_CLAIM, label: 'Global Providers', suffix: '+' },
                { value: TOTAL_ENDPOINTS_CLAIM, label: 'API Endpoints', suffix: '+' },
                { value: TOTAL_FREE_CLAIM, label: 'Free Tier Models', suffix: '+' },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1), duration: 0.8, type: 'spring' }}
                  className="bg-black/40 glass-panel rounded-2xl p-6 flex flex-col items-center justify-center group hover:bg-white/10 transition-colors"
                >
                  <div className="text-3xl lg:text-5xl font-black font-heading text-white tracking-tight mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value >= 1000000 ? `${stat.value/1000000}M` : stat.value >= 1000 ? `${stat.value/1000}K` : stat.value}{stat.suffix}
                  </div>
                  <div className="text-xs text-white/40 uppercase tracking-[0.15em] font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Live Terminal Typing Effect */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="hidden md:block w-full max-w-3xl bg-black/80 border border-white/20 rounded-xl p-4 font-mono text-[11px] text-left text-white/60 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent opacity-50"></div>
              <div className="flex gap-2 items-center mb-3 border-b border-white/10 pb-2">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div><div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div></div>
                <div className="text-white/30 text-[9px] uppercase tracking-widest ml-2">sys.connection.secure</div>
              </div>
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="space-y-1.5">
                <p><span className="text-[#06B6D4]">root@njirlah-ai:~$</span> curl -X GET https://api.njirlah.com/v1/models</p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>[INFO] Fetching global registry from 31 active providers...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}><span className="text-[#10B981]">✓ Connection established.</span> Loading 1,000,000+ configurations.</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="animate-pulse">_</motion.p>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll down indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Scroll to Explore</span>
            <ChevronDown size={16} className="text-white/50" />
          </motion.div>
        </section>

        {/* ========================================== */}
        {/* PROVIDERS MARQUEE & GRID                   */}
        {/* ========================================== */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8 px-2">
            <div>
              <h2 className="text-3xl font-black font-heading text-white tracking-tight flex items-center gap-3">
                <Globe className="text-[#06B6D4]" size={28}/> Featured Providers
              </h2>
              <p className="text-white/40 text-sm mt-2">Connect instantly with the world's leading AI infrastructure.</p>
            </div>
            <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-semibold">
              View All {ALL_PROVIDERS.length} <ChevronRight size={16}/>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {ALL_PROVIDERS.slice(0, 8).map((provider, i) => renderProviderCard(provider, i))}
          </div>
        </section>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-16"></div>

        {/* ========================================== */}
        {/* CORE DATABASE INTERFACE                    */}
        {/* ========================================== */}
        <section id="models-grid" className="scroll-mt-32">
          
          {/* Advanced Toolbar */}
          <div className="sticky top-16 z-40 bg-[#010105]/80 backdrop-blur-2xl border-b border-white/5 pb-4 pt-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-8">
            <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-4 w-full xl:w-auto">
                <div className="relative w-full sm:w-[400px] group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-white/30 group-focus-within:text-[#06B6D4] transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by model name, ID, or provider..."
                    className="w-full pl-12 pr-12 py-3.5 bg-[#0D0D15] border border-white/10 rounded-2xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/50 transition-all shadow-inner"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-4 flex items-center text-white/30 hover:text-white">
                      <X size={16} />
                    </button>
                  )}
                </div>

                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex xl:hidden items-center gap-2 px-4 py-3.5 rounded-2xl border transition-all font-semibold text-sm ${isFilterOpen ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]' : 'bg-[#0D0D15] border-white/10 text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                  <Filter size={16}/> Filters
                  {hasActiveFilters && <span className="ml-1 px-2 py-0.5 rounded-full bg-white text-black text-[10px]">{selectedProviders.length + selectedCapabilities.length}</span>}
                </button>
              </div>

              <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
                <div className="text-xs text-white/30 font-medium mr-2 hidden sm:block">
                  Showing <strong className="text-white">{filteredModels.length}</strong> models
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button onClick={() => setSortDropdownOpen(!sortDropdownOpen)} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0D0D15] border border-white/10 text-white/70 hover:text-white text-sm font-medium transition-all min-w-[180px] justify-between">
                    <span className="flex items-center gap-2">{SORT_OPTIONS.find(o=>o.key===sortBy)?.icon} {SORT_OPTIONS.find(o=>o.key===sortBy)?.label}</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {sortDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-[#11111A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                      >
                        {SORT_OPTIONS.map(o => (
                          <button key={o.key} onClick={() => { setSortBy(o.key); setSortDropdownOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${sortBy === o.key ? 'bg-[#7C3AED]/20 text-[#7C3AED]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                            {o.label} {sortBy === o.key && <Check size={14}/>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-[#0D0D15] border border-white/10 rounded-xl p-1">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}><LayoutGrid size={16}/></button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}><List size={16}/></button>
                </div>
              </div>

            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-8 items-start">
            
            {/* ========================================== */}
            {/* DESKTOP SIDEBAR FILTER                     */}
            {/* ========================================== */}
            <aside className={`xl:w-[280px] shrink-0 xl:sticky xl:top-[160px] transition-all duration-500 ease-in-out ${isFilterOpen ? 'block' : 'hidden xl:block'}`}>
              <div className="bg-[#0A0A10] border border-white/10 rounded-3xl p-6 shadow-2xl h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2"><Filter size={18} className="text-[#06B6D4]"/> Filters</h3>
                  {hasActiveFilters && (
                    <button onClick={resetFilters} className="text-[11px] font-bold text-[#F43F5E] bg-[#F43F5E]/10 hover:bg-[#F43F5E]/20 px-2 py-1 rounded-md transition-colors flex items-center gap-1">
                      <RotateCcw size={10}/> Reset
                    </button>
                  )}
                </div>

                {/* Capabilities Filter */}
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Capabilities</h4>
                  <div className="space-y-1.5">
                    {CAPABILITIES_CONFIG.map(cap => {
                      const isActive = selectedCapabilities.includes(cap.key);
                      return (
                        <button key={cap.key} onClick={() => toggleCapability(cap.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all border ${isActive ? 'bg-white/10 border-white/20 text-white shadow-inner' : 'bg-transparent border-transparent text-white/50 hover:bg-white/5 hover:text-white'}`}>
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isActive ? 'border-[#06B6D4] bg-[#06B6D4]' : 'border-white/20 bg-black/20'}`}>
                            {isActive && <Check size={12} className="text-white" />}
                          </div>
                          <span className="text-sm font-medium flex items-center gap-2">{cap.emoji} {cap.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Providers Filter */}
                <div>
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center justify-between">
                    Providers <span className="bg-white/10 text-white/50 px-1.5 py-0.5 rounded text-[9px]">{providerCounts.length}</span>
                  </h4>
                  <div className="space-y-1.5">
                    {providerCounts.map(p => {
                      const isActive = selectedProviders.includes(p.id);
                      return (
                        <button key={p.id} onClick={() => toggleProvider(p.id)} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all border ${isActive ? 'bg-[#7C3AED]/10 border-[#7C3AED]/30 text-white' : 'bg-transparent border-transparent text-white/50 hover:bg-white/5 hover:text-white'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isActive ? 'border-[#7C3AED] bg-[#7C3AED]' : 'border-white/20 bg-black/20'}`}>
                              {isActive && <Check size={10} className="text-white" />}
                            </div>
                            <span className="text-sm font-medium truncate max-w-[120px] text-left">{p.name}</span>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${isActive ? 'bg-[#7C3AED] text-white' : 'bg-white/5 text-white/30'}`}>{p.count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>

            {/* ========================================== */}
            {/* MAIN CONTENT AREA: MODELS GALLERY          */}
            {/* ========================================== */}
            <div className="flex-1 w-full min-w-0">
              
              {loading ? (
                // Loading Skeleton Grid
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-white/5 bg-[#0D0D15] p-5 animate-pulse min-h-[250px] flex flex-col justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 skeleton-shimmer"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-5 bg-white/5 rounded-md w-3/4 skeleton-shimmer"></div>
                          <div className="h-3 bg-white/5 rounded-md w-1/2 skeleton-shimmer"></div>
                        </div>
                      </div>
                      <div className="flex gap-2"><div className="h-6 w-16 bg-white/5 rounded-full skeleton-shimmer"></div><div className="h-6 w-20 bg-white/5 rounded-full skeleton-shimmer"></div></div>
                      <div className="grid grid-cols-3 gap-2 mt-4"><div className="h-12 bg-white/5 rounded-xl skeleton-shimmer"></div><div className="h-12 bg-white/5 rounded-xl skeleton-shimmer"></div><div className="h-12 bg-white/5 rounded-xl skeleton-shimmer"></div></div>
                    </div>
                  ))}
                </div>
              ) : filteredModels.length > 0 ? (
                // Models Grid
                <motion.div layout className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  <AnimatePresence>
                    {filteredModels.map((model, i) => renderModelCard(model, i))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                // Empty State
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-32 text-center bg-[#0A0A10] border border-white/5 rounded-3xl">
                  <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                    <Search size={40} className="text-white/20" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-white mb-2">No models found</h3>
                  <p className="text-white/40 max-w-md text-sm mb-8">We couldn't find any models matching your exact criteria. Try adjusting your search query or clearing some filters.</p>
                  <button onClick={resetFilters} className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    Clear All Filters
                  </button>
                </motion.div>
              )}

              {/* End of results indicator */}
              {!loading && filteredModels.length > 0 && (
                <div className="py-12 mt-12 text-center border-t border-white/5 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#010105] border border-white/10 flex items-center justify-center">
                    <Check size={12} className="text-[#06B6D4]"/>
                  </div>
                  <p className="text-xs text-white/30 font-medium uppercase tracking-widest">End of Results</p>
                  <p className="text-[10px] text-white/20 mt-1">Showing all {filteredModels.length} models matching your criteria</p>
                </div>
              )}

            </div>
          </div>
        </section>

      </main>
      
      <Footer />

      {/* ========================================== */}
      {/* FLOATING COMPARE DRAWER                    */}
      {/* ========================================== */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A15]/95 backdrop-blur-2xl border-t border-[#7C3AED]/30 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] pt-4 pb-safe-bottom"
          >
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                    <GitCompare size={14} className="text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white">Compare Models <span className="text-white/40 font-normal">({compareList.length}/4)</span></h3>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => compareList.forEach(id => toggleCompare(id))} className="text-xs font-semibold text-white/40 hover:text-white transition-colors">Clear All</button>
                  <button className="px-5 py-2 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" disabled={compareList.length < 2}>
                    Detailed Compare ⚡
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {compareList.map(id => {
                  const model = ALL_MODELS.find(m => m.id === id);
                  if (!model) return null;
                  const provider = ALL_PROVIDERS.find(p => p.id === model.providerId);
                  return (
                    <div key={id} className="relative bg-[#05050A] border border-white/10 rounded-xl p-4 group">
                      <button onClick={() => toggleCompare(id)} className="absolute -top-2 -right-2 w-6 h-6 bg-[#F43F5E] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg text-white">
                        <X size={12}/>
                      </button>
                      <div className="text-sm font-bold text-white truncate mb-1">{model.name}</div>
                      <div className="text-[10px] text-white/40 mb-3 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{backgroundColor: provider?.color}}></div>{provider?.name}</div>
                      <div className="grid grid-cols-3 gap-2 text-center border-t border-white/5 pt-3">
                        <div><div className="text-[9px] text-white/30 uppercase">Ctx</div><div className="text-xs font-mono font-bold text-white">{formatCtx(model.context)}</div></div>
                        <div><div className="text-[9px] text-white/30 uppercase">In</div><div className="text-xs font-mono font-bold text-[#06B6D4]">{formatPrice(model.inputPrice)}</div></div>
                        <div><div className="text-[9px] text-white/30 uppercase">Out</div><div className="text-xs font-mono font-bold text-[#F43F5E]">{formatPrice(model.outputPrice)}</div></div>
                      </div>
                    </div>
                  );
                })}
                {/* Empty slots */}
                {Array.from({ length: Math.max(0, 4 - compareList.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="border border-white/5 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-white/20 min-h-[100px]">
                    <span className="text-2xl font-light">+</span>
                    <span className="text-[10px] uppercase tracking-widest mt-1">Add Model</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* CONFIGURATION MODAL                        */}
      {/* ========================================== */}
      <AnimatePresence>
        {configModalProvider && (() => {
          const provider = ALL_PROVIDERS.find(p => p.id === configModalProvider);
          if (!provider) return null;
          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
              onClick={() => setConfigModalProvider(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#0D0D15] p-8 shadow-2xl relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                {/* Decorative glow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent opacity-50"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#06B6D4] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner" style={{ backgroundColor: `${provider.color}15`, color: provider.color, border: `1px solid ${provider.color}30` }}>
                      {provider.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-heading text-white tracking-tight">Configure {provider.name}</h2>
                      <a href={provider.docsUrl} target="_blank" rel="noreferrer" className="text-xs text-[#06B6D4] hover:text-white flex items-center gap-1 mt-0.5 transition-colors">
                        Get API Key from Dashboard <ExternalLink size={10}/>
                      </a>
                    </div>
                  </div>
                  <button onClick={() => setConfigModalProvider(null)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                    <X size={16}/>
                  </button>
                </div>

                <div className="space-y-6 relative z-10">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
                      <Shield size={12}/> Secure API Key
                    </label>
                    <div className="relative group">
                      <input type="password" placeholder="sk-..." className="w-full pl-4 pr-12 py-3.5 bg-[#05050A] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-all font-mono" />
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                        <Eye size={16}/>
                      </button>
                    </div>
                    <p className="text-[10px] text-white/30 mt-2 flex items-center gap-1.5"><Info size={10}/> Keys are encrypted locally using AES-GCM. Never sent to our servers.</p>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors">
                    <Activity size={16}/> Test Connection
                  </button>

                  <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl p-3 flex items-start gap-3">
                    <CheckCircle size={16} className="text-[#10B981] mt-0.5 shrink-0"/>
                    <div>
                      <div className="text-xs font-bold text-[#10B981] mb-0.5">Connection Successful</div>
                      <div className="text-[10px] text-[#10B981]/70">Verified access to 12 models. Latency: 45ms.</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8 relative z-10">
                  <button onClick={() => setConfigModalProvider(null)} className="flex-1 py-3.5 rounded-xl bg-transparent border border-white/10 text-white/60 font-semibold hover:bg-white/5 hover:text-white transition-colors text-sm">Cancel</button>
                  <button onClick={() => setConfigModalProvider(null)} className="flex-[2] py-3.5 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-transform hover:scale-[1.02] active:scale-95 text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]">Save & Encrypt Key</button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
