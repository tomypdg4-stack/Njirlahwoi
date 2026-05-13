'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Cloud, Server, Plus, Trash2, Cpu, ChevronLeft, Sparkles, Globe, ExternalLink, Settings, Search, CircleCheck as CheckCircle2, Circle as XCircle, Loader as Loader2, Eye, EyeOff, Copy, Check, TrendingUp, Shield, Zap, Activity } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAllApiKeysStore } from '@/store/all-api-keys-store';
import ProviderCard from '@/components/api-njir/ProviderCard';
import CustomProviderForm from '@/components/api-njir/CustomProviderForm';

const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), { ssr: false });

/* ─── BYOK providers ────────────────────────────────────────────── */
const BYOK_PROVIDERS = [
  { slug: 'ai21', name: 'AI21', url: 'https://www.ai21.com/' },
  { slug: 'aionlabs', name: 'AionLabs', url: 'https://aionlabs.ai/' },
  { slug: 'akashml', name: 'AkashML', url: 'https://akash.network/' },
  { slug: 'alibaba-cloud-int', name: 'Alibaba Cloud Int.', url: 'https://www.alibabacloud.com/' },
  { slug: 'amazon-bedrock', name: 'Amazon Bedrock', url: 'https://aws.amazon.com/bedrock/' },
  { slug: 'anthropic', name: 'Anthropic', url: 'https://console.anthropic.com/' },
  { slug: 'arcee-ai', name: 'Arcee AI', url: 'https://www.arcee.ai/' },
  { slug: 'atlascloud', name: 'AtlasCloud', url: 'https://atlascloud.ai/' },
  { slug: 'azure', name: 'Azure OpenAI', url: 'https://azure.microsoft.com/en-us/products/ai-services/openai-service' },
  { slug: 'baidu-qianfan', name: 'Baidu Qianfan', url: 'https://qianfan.cloud.baidu.com/' },
  { slug: 'baseten', name: 'Baseten', url: 'https://www.baseten.co/' },
  { slug: 'cerebras', name: 'Cerebras', url: 'https://cloud.cerebras.ai/' },
  { slug: 'chutes', name: 'Chutes', url: 'https://chutes.ai/' },
  { slug: 'clarifai', name: 'Clarifai', url: 'https://www.clarifai.com/' },
  { slug: 'cloudflare-byok', name: 'Cloudflare (BYOK)', url: 'https://developers.cloudflare.com/workers-ai/' },
  { slug: 'cohere', name: 'Cohere', url: 'https://dashboard.cohere.com/' },
  { slug: 'deepinfra', name: 'DeepInfra', url: 'https://deepinfra.com/' },
  { slug: 'deepseek', name: 'DeepSeek', url: 'https://platform.deepseek.com/' },
  { slug: 'featherless', name: 'Featherless', url: 'https://featherless.ai/' },
  { slug: 'fireworks', name: 'Fireworks AI', url: 'https://fireworks.ai/' },
  { slug: 'friendli', name: 'Friendli', url: 'https://friendli.ai/' },
  { slug: 'gmicloud', name: 'GMICloud', url: 'https://gmicloud.ai/' },
  { slug: 'google-ai-studio', name: 'Google AI Studio', url: 'https://aistudio.google.com/' },
  { slug: 'google-vertex', name: 'Google Vertex', url: 'https://cloud.google.com/vertex-ai' },
  { slug: 'groq', name: 'Groq', url: 'https://console.groq.com/' },
  { slug: 'inception', name: 'Inception', url: 'https://inception.ai/' },
  { slug: 'inceptron', name: 'Inceptron', url: 'https://inceptron.ai/' },
  { slug: 'infermatic', name: 'Infermatic', url: 'https://infermatic.ai/' },
  { slug: 'inflection', name: 'Inflection', url: 'https://inflection.ai/' },
  { slug: 'ionet', name: 'io.net', url: 'https://io.net/' },
  { slug: 'liquid', name: 'Liquid AI', url: 'https://liquid.ai/' },
  { slug: 'mancer', name: 'Mancer', url: 'https://mancer.tech/' },
  { slug: 'minimax', name: 'MiniMax', url: 'https://www.minimax.io/' },
  { slug: 'mistral', name: 'Mistral', url: 'https://console.mistral.ai/' },
  { slug: 'moonshot', name: 'Moonshot AI', url: 'https://platform.moonshot.cn/' },
  { slug: 'morph', name: 'Morph', url: 'https://morph.so/' },
  { slug: 'nebius', name: 'Nebius', url: 'https://nebius.ai/' },
  { slug: 'nextbit', name: 'NextBit', url: 'https://nextbit.ai/' },
  { slug: 'novitaai', name: 'NovitaAI', url: 'https://novita.ai/' },
  { slug: 'openai', name: 'OpenAI', url: 'https://platform.openai.com/api-keys' },
  { slug: 'openinference', name: 'OpenInference', url: 'https://openinference.ai/' },
  { slug: 'parasail', name: 'Parasail', url: 'https://parasail.io/' },
  { slug: 'perplexity', name: 'Perplexity', url: 'https://www.perplexity.ai/settings/api' },
  { slug: 'phala', name: 'Phala', url: 'https://phala.network/' },
  { slug: 'reka-ai', name: 'Reka AI', url: 'https://www.reka.ai/' },
  { slug: 'relace', name: 'Relace', url: 'https://relace.ai/' },
  { slug: 'sambanova', name: 'SambaNova', url: 'https://cloud.sambanova.ai/' },
  { slug: 'siliconflow', name: 'SiliconFlow', url: 'https://siliconflow.cn/' },
  { slug: 'stepfun', name: 'StepFun', url: 'https://platform.stepfun.com/' },
  { slug: 'switchpoint', name: 'Switchpoint', url: 'https://switchpoint.ai/' },
  { slug: 'together', name: 'Together AI', url: 'https://api.together.xyz/' },
  { slug: 'venice', name: 'Venice', url: 'https://venice.ai/' },
  { slug: 'weightsbiases', name: 'Weights & Biases', url: 'https://wandb.ai/' },
  { slug: 'xai', name: 'xAI (Grok)', url: 'https://console.x.ai/' },
  { slug: 'xiaomi', name: 'Xiaomi', url: 'https://ai.xiaomi.com/' },
  { slug: 'zai', name: 'Z.ai', url: 'https://z.ai/' },
];

const TABS = [
  { key: 'openrouter', label: 'OpenRouter', icon: <Key size={13} />,    color: 'text-brand-blue',   activeGlow: 'bg-brand-blue/10 border-brand-blue/25' },
  { key: 'cloudflare', label: 'Cloudflare', icon: <Cloud size={13} />,  color: 'text-brand-amber',  activeGlow: 'bg-brand-amber/10 border-brand-amber/25' },
  { key: 'bailian',    label: 'Bailian',    icon: <Server size={13} />, color: 'text-yellow-400',   activeGlow: 'bg-yellow-400/10 border-yellow-400/25' },
  { key: 'custom',     label: 'Custom',     icon: <Cpu size={13} />,    color: 'text-neon-pink',    activeGlow: 'bg-neon-pink/10 border-neon-pink/25' },
];

/* ─── Hero stat card ─── */
function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={vis ? { opacity: 1, y: 0 } : {}}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="glass-card rounded-2xl p-4 flex items-center gap-3 cursor-default"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} bg-current/10 flex-shrink-0`} style={{ background: 'rgba(255,255,255,0.06)' }}>
        <span className={color}>{icon}</span>
      </div>
      <div>
        <p className={`text-2xl font-black font-heading ${color} tabular-nums`}>{value}</p>
        <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  );
}

/* ─── BYOK provider row ─── */
function ByokRow({ p, keyVal, onSave, onTest, status }: {
  p: { slug: string; name: string; url: string };
  keyVal: string | null;
  onSave: (k: string) => void;
  onTest: (k: string) => Promise<boolean>;
  status?: 'idle' | 'valid' | 'invalid' | 'testing';
}) {
  const [val, setVal]     = useState(keyVal ?? '');
  const [show, setShow]   = useState(false);
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [localStatus, setLocalStatus] = useState<'idle' | 'valid' | 'invalid'>(
    keyVal ? 'valid' : 'idle'
  );

  const handleSave = async () => {
    if (!val.trim()) return;
    onSave(val.trim());
    setLocalStatus('valid');
  };

  const handleTest = async () => {
    if (!val.trim()) return;
    setTesting(true);
    const ok = await onTest(val.trim());
    setLocalStatus(ok ? 'valid' : 'invalid');
    setTesting(false);
  };

  const initials = p.name.slice(0, 2).toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-3 group hover:border-brand-blue/20 transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="provider-icon text-[10px]">{initials}</div>
          <div>
            <p className="text-xs font-medium text-white/80">{p.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {localStatus === 'valid'   && <CheckCircle2 size={12} className="text-brand-green" />}
          {localStatus === 'invalid' && <XCircle      size={12} className="text-brand-red" />}
          <a href={p.url} target="_blank" rel="noopener noreferrer"
            className="p-1 rounded-lg text-white/20 hover:text-brand-blue transition-colors">
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="flex-1 flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.07] rounded-lg px-2 py-1.5">
          <input
            type={show ? 'text' : 'password'}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={handleSave}
            placeholder="API Key..."
            className="flex-1 bg-transparent text-[11px] text-white/70 placeholder-white/20 outline-none font-mono min-w-0"
          />
          <button onClick={() => setShow((v) => !v)} className="text-white/20 hover:text-white/50 transition-colors flex-shrink-0">
            {show ? <EyeOff size={10} /> : <Eye size={10} />}
          </button>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleTest}
          disabled={testing || !val.trim()}
          className="px-2 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.09] text-[10px] text-white/40 hover:text-brand-blue hover:border-brand-blue/25 transition-all disabled:opacity-40"
        >
          {testing ? <Loader2 size={10} className="animate-spin" /> : 'Test'}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function ApiNjirPage() {
  const [tab, setTab]             = useState('openrouter');
  const [customFormOpen, setCustomFormOpen] = useState(false);
  const [byokSearch, setByokSearch] = useState('');

  const store = useAllApiKeysStore();

  useEffect(() => {
    store.loadAllKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const configuredCount = [
    store.openrouterKey,
    store.cfAccountId && store.cfApiToken,
    store.bailianApiKey,
  ].filter(Boolean).length + store.customProviders.length;

  const byokCount = Object.values(store.byokKeys).filter(Boolean).length;

  const filteredByok = BYOK_PROVIDERS.filter((p) =>
    p.name.toLowerCase().includes(byokSearch.toLowerCase())
  );

  const activeTab = TABS.find((t) => t.key === tab);

  return (
    <div className="min-h-screen bg-[#09090B] text-white relative overflow-x-hidden">
      <CustomCursor />

      {/* Background ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-brand-blue/4 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-green/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">

        {/* ── Breadcrumb ── */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-white/25 hover:text-white/50 transition-colors mb-6 group">
          <ChevronLeft size={11} className="group-hover:-translate-x-0.5 transition-transform" />
          Kembali ke Chat
        </Link>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4">
            {/* Animated key icon */}
            <motion.div
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-4xl select-none mt-1"
            >
              🔑
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-heading gradient-text leading-none mb-1">
                API NJIR
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white/35 text-sm">Kendalikan semua API key di satu tempat</p>
                <span className="px-2 py-0.5 bg-brand-blue/15 border border-brand-blue/25 rounded-full text-[9px] text-brand-blue font-bold tracking-wider">
                  AES-GCM ENCRYPTED
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          <StatCard label="Provider Aktif" value={configuredCount}           icon={<Activity size={14} />} color="text-brand-blue" />
          <StatCard label="BYOK Keys"      value={byokCount}                 icon={<Key size={14} />}      color="text-brand-green" />
          <StatCard label="Custom Endpoints" value={store.customProviders.length} icon={<Cpu size={14} />} color="text-neon-pink" />
          <StatCard label="Model Tersedia" value="300+"                      icon={<Zap size={14} />}      color="text-brand-amber" />
        </motion.div>

        {/* ── Tab bar (OpenRouter-style horizontal pills) ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl mb-6 overflow-x-auto"
        >
          {TABS.map((t) => (
            <motion.button
              key={t.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                tab === t.key ? `${t.color} font-medium` : 'text-white/35 hover:text-white/60 hover:bg-white/[0.04]'
              }`}
            >
              {tab === t.key && (
                <motion.div
                  layoutId="api-tab-bg"
                  className={`absolute inset-0 border rounded-xl ${t.activeGlow}`}
                />
              )}
              <span className="relative">{t.icon}</span>
              <span className="relative">{t.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">

          {/* ═══ OpenRouter ═══ */}
          {tab === 'openrouter' && (
            <motion.div
              key="openrouter"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.16 }}
              className="space-y-8"
            >
              {/* Main key */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={13} className="text-brand-blue" />
                  <h2 className="text-sm font-bold text-white font-heading">OpenRouter — API Key Utama</h2>
                  <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noopener noreferrer"
                    className="ml-auto text-[11px] text-white/25 hover:text-brand-blue flex items-center gap-1 transition-colors">
                    Dapatkan Key <ExternalLink size={9} />
                  </a>
                </div>
                <ProviderCard
                  name="OpenRouter"
                  description="Satu key ini membuka 300+ model dari 60+ provider — GPT-4o, Claude Sonnet, Gemini Pro, DeepSeek R1, Llama 3, dan masih banyak lagi."
                  placeholder="sk-or-v1-..."
                  docsUrl="https://openrouter.ai/docs"
                  value={store.openrouterKey}
                  status={store.openrouterStatus}
                  onSave={store.setOpenrouterKey}
                  onTest={store.testOpenrouterKey}
                />
              </section>

              {/* BYOK sub-providers */}
              <section>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Settings size={13} className="text-white/30" />
                    <h2 className="text-sm font-bold text-white font-heading">
                      BYOK Sub-Providers
                      <span className="ml-2 text-[10px] text-white/25 font-normal">({BYOK_PROVIDERS.length} tersedia)</span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-1.5 ml-auto">
                    <Search size={10} className="text-white/25" />
                    <input
                      value={byokSearch}
                      onChange={(e) => setByokSearch(e.target.value)}
                      placeholder="Cari provider..."
                      className="bg-transparent text-xs text-white/60 placeholder-white/20 outline-none w-28"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-white/25 mb-4">
                  Opsional — routing bypass OpenRouter langsung ke provider.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {filteredByok.map((p, i) => (
                    <motion.div
                      key={p.slug}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.012, 0.28), type: 'spring', damping: 24 }}
                    >
                      <ByokRow
                        p={p}
                        keyVal={store.byokKeys[p.slug] ?? null}
                        onSave={(k) => store.setBYOKKey(p.slug, k)}
                        onTest={async (k) => {
                          try {
                            const r = await fetch('https://openrouter.ai/api/v1/models', {
                              headers: { Authorization: `Bearer ${k}` },
                            });
                            return r.ok;
                          } catch { return false; }
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* ═══ Cloudflare ═══ */}
          {tab === 'cloudflare' && (
            <motion.div
              key="cloudflare"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.16 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2">
                <Cloud size={13} className="text-brand-amber" />
                <h2 className="text-sm font-bold text-white font-heading">Cloudflare Workers AI</h2>
                <a href="https://developers.cloudflare.com/workers-ai/get-started/rest-api/" target="_blank" rel="noopener noreferrer"
                  className="ml-auto text-[11px] text-white/25 hover:text-brand-amber flex items-center gap-1 transition-colors">
                  Panduan <ExternalLink size={9} />
                </a>
              </div>

              {/* Instructions card */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-4 border-brand-amber/10"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={12} className="text-brand-amber" />
                  <p className="text-xs font-semibold text-brand-amber">Cara mendapatkan credentials</p>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-white/35">
                  <li>Buka <a href="https://dash.cloudflare.com/" target="_blank" rel="noopener noreferrer" className="text-brand-amber/70 hover:text-brand-amber transition-colors">Dashboard Cloudflare</a></li>
                  <li>Workers AI → <strong className="text-white/50">Use REST API</strong></li>
                  <li>Klik <strong className="text-white/50">Create API Token</strong> → pilih template Workers AI</li>
                  <li>Copy <strong className="text-white/50">Account ID</strong> dari sidebar kanan</li>
                </ol>
              </motion.div>

              <ProviderCard
                name="Cloudflare Workers AI"
                description="Akses 50+ model text generation dari edge Cloudflare — Llama 3.3 70B, DeepSeek R1, Mistral, Qwen, Phi, dan lainnya."
                placeholder="Cloudflare API Token..."
                docsUrl="https://developers.cloudflare.com/workers-ai/"
                value={store.cfApiToken}
                status={store.cfStatus}
                extraFields={[{ label: 'Account ID', placeholder: 'Account ID (32-char hex)', value: store.cfAccountId, key: 'accountId' }]}
                onSave={async () => {}}
                onSaveExtra={async (values) => {
                  await store.setCloudflareCreds(values['accountId'] ?? '', values['mainKey'] ?? '');
                }}
                onTest={async (token) => {
                  const accountId = store.cfAccountId ?? '';
                  if (!accountId) return false;
                  return store.testCloudflareCreds(accountId, token);
                }}
              />

              {/* Model badges */}
              <div className="glass-card rounded-2xl p-4">
                <p className="text-[11px] text-brand-amber font-semibold mb-3">Model tersedia</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
                    '@cf/meta/llama-3.1-8b-instruct',
                    '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
                    '@cf/mistral/mistral-7b-instruct-v0.1',
                    '@cf/qwen/qwen2.5-coder-32b-instruct',
                    '@cf/google/gemma-7b-it-lora',
                    '@cf/microsoft/phi-2',
                  ].map((m) => (
                    <span key={m} className="px-2 py-0.5 text-[9px] bg-brand-amber/8 border border-brand-amber/15 rounded-lg text-brand-amber/70 font-mono">
                      {m}
                    </span>
                  ))}
                  <span className="text-[10px] text-white/25 self-center">+ 40 lainnya</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Bailian ═══ */}
          {tab === 'bailian' && (
            <motion.div
              key="bailian"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.16 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2">
                <Server size={13} className="text-yellow-400" />
                <h2 className="text-sm font-bold text-white font-heading">Alibaba Cloud Bailian (DashScope)</h2>
                <a href="https://bailian.console.aliyun.com/" target="_blank" rel="noopener noreferrer"
                  className="ml-auto text-[11px] text-white/25 hover:text-yellow-400 flex items-center gap-1 transition-colors">
                  Konsol <ExternalLink size={9} />
                </a>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-4 border-yellow-400/10"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={12} className="text-yellow-400" />
                  <p className="text-xs font-semibold text-yellow-400">Cara mendapatkan API Key</p>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-white/35">
                  <li>Buka <a href="https://bailian.console.aliyun.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-400/70 hover:text-yellow-400 transition-colors">Konsol Bailian</a></li>
                  <li>Klik avatar → <strong className="text-white/50">API Key Center</strong></li>
                  <li>Klik <strong className="text-white/50">Buat API Key Baru</strong></li>
                  <li>Salin dan simpan key (hanya ditampilkan sekali)</li>
                </ol>
              </motion.div>

              <ProviderCard
                name="Alibaba Cloud Bailian"
                description="Qwen-Turbo, Qwen-Plus, Qwen-Max, Llama-3, DeepSeek-V3/R1, dan ratusan model dari ekosistem Alibaba Cloud."
                placeholder="sk-..."
                docsUrl="https://developer.aliyun.com/article/1697678"
                value={store.bailianApiKey}
                status={store.bailianStatus}
                onSave={store.setBailianKey}
                onTest={store.testBailianKey}
              />

              <div className="glass-card rounded-2xl p-4">
                <p className="text-[11px] text-yellow-400 font-semibold mb-3">Model tersedia</p>
                <div className="flex flex-wrap gap-1.5">
                  {['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-long', 'llama3-8b-instruct', 'llama3-70b-instruct', 'deepseek-v3', 'deepseek-r1'].map((m) => (
                    <span key={m} className="px-2 py-0.5 text-[9px] bg-yellow-400/8 border border-yellow-400/15 rounded-lg text-yellow-400/70 font-mono">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Custom ═══ */}
          {tab === 'custom' && (
            <motion.div
              key="custom"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.16 }}
              className="space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu size={13} className="text-neon-pink" />
                  <h2 className="text-sm font-bold text-white font-heading">
                    Custom Providers
                    <span className="ml-2 text-[10px] text-white/25 font-normal">OpenAI-compatible</span>
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setCustomFormOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neon-pink/8 border border-neon-pink/25 text-neon-pink text-xs hover:bg-neon-pink/15 transition-all"
                >
                  <Plus size={11} /> Add Provider
                </motion.button>
              </div>

              <p className="text-xs text-white/25">
                Tambahkan endpoint kompatibel OpenAI — SiliconFlow, Ollama, LM Studio, Groq langsung, dan lainnya.
              </p>

              {store.customProviders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 glass-card rounded-2xl"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-5xl mb-4 select-none"
                  >
                    🔌
                  </motion.div>
                  <p className="text-sm text-white/35 mb-1">Belum ada custom provider</p>
                  <p className="text-xs text-white/20 mb-5">Sambungkan endpoint lokal atau cloud kamu</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setCustomFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-pink/8 border border-neon-pink/25 text-neon-pink text-xs hover:bg-neon-pink/15 transition-all"
                  >
                    <Plus size={11} /> Tambah Provider Pertama
                  </motion.button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <AnimatePresence>
                    {store.customProviders.map((cp, i) => (
                      <motion.div
                        key={cp.id}
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -40, scale: 0.9 }}
                        transition={{ delay: i * 0.05, type: 'spring', damping: 22, stiffness: 300 }}
                        className="relative glass-card rounded-2xl p-4 group hover:border-neon-pink/20 transition-colors"
                      >
                        <button
                          onClick={() => store.removeCustomProvider(cp.id)}
                          className="absolute top-3 right-3 p-1.5 rounded-lg text-white/20 hover:text-brand-red hover:bg-brand-red/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={11} />
                        </button>

                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-8 h-8 rounded-xl bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center flex-shrink-0">
                            <Globe size={13} className="text-neon-pink" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white/85 truncate">{cp.name}</p>
                            <p className="text-[10px] text-white/30 font-mono truncate">{cp.baseUrl}</p>
                          </div>
                        </div>

                        <div className="space-y-1 text-[11px] mb-3">
                          <div className="flex gap-2">
                            <span className="text-white/25 w-14 flex-shrink-0">Model:</span>
                            <span className="text-white/45 font-mono truncate">{cp.modelId || '—'}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-white/25 w-14 flex-shrink-0">API Key:</span>
                            <span className="text-white/35">{cp.apiKey ? '••••••••' : 'Tidak ada'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.05]">
                          <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
                            onClick={() => store.testCustomProvider(cp.id, cp.baseUrl, cp.apiKey, cp.modelId)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-white/35 hover:border-neon-pink/25 hover:text-neon-pink transition-all"
                          >
                            Test Koneksi
                          </motion.button>
                          <AnimatePresence>
                            {store.customStatus[cp.id] === 'testing' && (
                              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-[10px] text-brand-amber flex items-center gap-1">
                                <Loader2 size={9} className="animate-spin" /> Testing...
                              </motion.span>
                            )}
                            {store.customStatus[cp.id] === 'valid' && (
                              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-[10px] text-brand-green flex items-center gap-1">
                                <CheckCircle2 size={10} /> Online
                              </motion.span>
                            )}
                            {store.customStatus[cp.id] === 'invalid' && (
                              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-[10px] text-brand-red flex items-center gap-1">
                                <XCircle size={10} /> Gagal
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-10 pt-6 border-t border-white/[0.05] mt-10">
        <p className="text-xs text-white/20">
          Dibuat dengan{' '}
          <motion.span
            className="text-red-400/70 inline-block"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            ♥
          </motion.span>
          {' '}oleh{' '}
          <span className="text-white/35 hover:text-white/60 transition-colors cursor-default">Andikaa Saputraa</span>
        </p>
      </div>

      <CustomProviderForm
        open={customFormOpen}
        onClose={() => setCustomFormOpen(false)}
        onAdd={store.addCustomProvider}
      />
    </div>
  );
}
