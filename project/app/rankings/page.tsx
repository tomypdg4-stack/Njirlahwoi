'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring as useFramerSpring } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import {
  Trophy, TrendingUp, TrendingDown, Star, Zap, Globe, ArrowRight,
  Crown, Medal, Award, BarChart3, ChevronDown, Check, Filter,
  Flame, Sparkles, Activity, ExternalLink, Eye
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';

/* â”€â”€ Animation #1: Pointer follow glow â”€â”€ */
function PointerGlow() {
  const [spring, api] = useSpring(() => ({ x: -300, y: -300, config: { tension: 100, friction: 30 } }));
  useEffect(() => {
    const move = (e: MouseEvent) => api.start({ x: e.clientX - 200, y: e.clientY - 200 });
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [api]);
  return (
    <animated.div style={{ left: spring.x, top: spring.y }} className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0" aria-hidden>
      <div className="w-full h-full rounded-full bg-brand-amber/[0.04] blur-3xl" />
    </animated.div>
  );
}

/* â”€â”€ Types â”€â”€ */
interface RankEntry {
  rank: number;
  id: string;
  name: string;
  provider: string;
  category: string;
  score: number;
  trend: number;
  tokens: string;
  usage: string;
  isNew?: boolean;
  isFree?: boolean;
}

/* â”€â”€ Data â”€â”€ */
const CATEGORIES = [
  { key: 'all', label: 'Semua', icon: <Globe size={12} /> },
  { key: 'coding', label: 'Coding', icon: <Zap size={12} /> },
  { key: 'reasoning', label: 'Reasoning', icon: <Sparkles size={12} /> },
  { key: 'creative', label: 'Kreatif', icon: <Star size={12} /> },
  { key: 'math', label: 'Matematika', icon: <BarChart3 size={12} /> },
  { key: 'multilingual', label: 'Multibahasa', icon: <Globe size={12} /> },
];

const TIMEFRAMES = [
  { key: 'weekly', label: 'Minggu Ini' },
  { key: 'monthly', label: 'Bulan Ini' },
  { key: 'alltime', label: 'Sepanjang Waktu' },
];

const RANKINGS: RankEntry[] = [
  { rank: 1, id: 'anthropic/claude-opus-4.7', name: 'Claude Opus 4.7', provider: 'Anthropic', category: 'coding', score: 98.7, trend: 2.3, tokens: '1.2T', usage: '18.4%', },
  { rank: 2, id: 'openai/gpt-5.5', name: 'GPT-5.5', provider: 'OpenAI', category: 'reasoning', score: 97.2, trend: 12.5, tokens: '341.8B', usage: '15.2%', isNew: true },
  { rank: 3, id: 'google/gemini-3.1-pro', name: 'Gemini 3.1 Pro', provider: 'Google', category: 'multilingual', score: 96.8, trend: -3.1, tokens: '340.4B', usage: '12.7%' },
  { rank: 4, id: 'deepseek/deepseek-v4-pro', name: 'DeepSeek V4 Pro', provider: 'DeepSeek', category: 'coding', score: 95.4, trend: 8.7, tokens: '210B', usage: '9.8%' },
  { rank: 5, id: 'xai/grok-4.3', name: 'Grok 4.3', provider: 'xAI', category: 'reasoning', score: 94.9, trend: 22.1, tokens: '78.3B', usage: '7.2%', isNew: true },
  { rank: 6, id: 'meta-llama/llama-3.3-70b', name: 'Llama 3.3 70B', provider: 'Meta', category: 'coding', score: 93.1, trend: -1.4, tokens: '89.2B', usage: '6.8%' },
  { rank: 7, id: 'qwen/qwen3.6-max', name: 'Qwen 3.6 Max', provider: 'Alibaba', category: 'multilingual', score: 92.6, trend: 15.8, tokens: '52.6B', usage: '5.4%' },
  { rank: 8, id: 'mistralai/mistral-medium-3.5', name: 'Mistral Medium 3.5', provider: 'Mistral', category: 'creative', score: 91.3, trend: 3.2, tokens: '45.1B', usage: '4.1%' },
  { rank: 9, id: 'anthropic/claude-sonnet-4.5', name: 'Claude Sonnet 4.5', provider: 'Anthropic', category: 'coding', score: 90.8, trend: -2.7, tokens: '203B', usage: '3.9%' },
  { rank: 10, id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', category: 'reasoning', score: 89.5, trend: -8.5, tokens: '421B', usage: '3.7%' },
  { rank: 11, id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', category: 'math', score: 88.2, trend: -3.8, tokens: '156B', usage: '3.2%' },
  { rank: 12, id: 'cohere/command-r-plus', name: 'Command R+', provider: 'Cohere', category: 'reasoning', score: 86.7, trend: -5.2, tokens: '18.4B', usage: '2.1%' },
  { rank: 13, id: 'perplexity/sonar-pro', name: 'Sonar Pro', provider: 'Perplexity', category: 'reasoning', score: 85.3, trend: 6.4, tokens: '22.1B', usage: '1.8%' },
  { rank: 14, id: 'cloudflare/llama-3.3-70b', name: 'Llama 3.3 70B (CF)', provider: 'Cloudflare', category: 'coding', score: 84.1, trend: 7.3, tokens: '89.2B', usage: '1.5%', isFree: true },
  { rank: 15, id: 'google/gemma-3-27b', name: 'Gemma 3 27B', provider: 'Google', category: 'multilingual', score: 82.6, trend: 1.2, tokens: '31.5B', usage: '1.2%' },
];

/* â”€â”€ Animation #2: Animated counter â”€â”€ */
function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setCount(Math.floor(eased * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* â”€â”€ Animation #3: Rank medal with bounce â”€â”€ */
function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12, delay: 0.1 }}
      className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-400/30 flex items-center justify-center">
      <Crown size={14} className="text-yellow-400" />
    </motion.div>
  );
  if (rank === 2) return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12, delay: 0.15 }}
      className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-300/15 to-gray-500/15 border border-gray-400/25 flex items-center justify-center">
      <Medal size={14} className="text-gray-400" />
    </motion.div>
  );
  if (rank === 3) return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12, delay: 0.2 }}
      className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-700/15 to-amber-900/15 border border-amber-600/25 flex items-center justify-center">
      <Award size={14} className="text-amber-600" />
    </motion.div>
  );
  return (
    <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-xs text-white/40 font-bold font-heading">
      {rank}
    </div>
  );
}

/* â”€â”€ Animation #4: Score bar with spring â”€â”€ */
function ScoreBar({ score, color = 'brand-blue' }: { score: number; color?: string }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
        className={`h-full rounded-full bg-${color}`}
        style={{ background: `linear-gradient(90deg, rgba(90,200,250,0.6), rgba(52,199,89,0.6))` }}
      />
    </div>
  );
}

/* â”€â”€ Animation #5: Rank row with stagger â”€â”€ */
function RankRow({ entry, index }: { entry: RankEntry; index: number }) {
  const isPositive = entry.trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.5), type: 'spring', damping: 22 }}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)', x: 2 }}
      className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.04] cursor-pointer group transition-all"
    >
      {/* Rank */}
      <RankMedal rank={entry.rank} />

      {/* Model info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-white group-hover:text-brand-blue transition-colors truncate">
            {entry.name}
          </span>
          {entry.isNew && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}
              className="px-1.5 py-0.5 text-[9px] rounded-full bg-brand-blue/15 border border-brand-blue/30 text-brand-blue font-semibold">
              BARU
            </motion.span>
          )}
          {entry.isFree && <span className="badge-free">GRATIS</span>}
        </div>
        <p className="text-[11px] text-white/25 mt-0.5">{entry.provider}</p>
      </div>

      {/* Score */}
      <div className="hidden sm:flex flex-col items-end w-28">
        <span className="text-sm font-bold font-heading text-white tabular-nums">{entry.score.toFixed(1)}</span>
        <div className="w-full mt-1">
          <ScoreBar score={entry.score} />
        </div>
      </div>

      {/* Trend */}
      <div className="hidden md:flex items-center w-20 justify-end">
        <span className={`text-xs font-medium flex items-center gap-0.5 ${isPositive ? 'text-brand-green' : 'text-brand-red/70'}`}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {isPositive ? '+' : ''}{entry.trend.toFixed(1)}%
        </span>
      </div>

      {/* Usage */}
      <div className="hidden lg:flex items-center w-16 justify-end">
        <span className="text-xs text-white/35 tabular-nums">{entry.usage}</span>
      </div>

      {/* Tokens */}
      <div className="hidden xl:flex items-center w-20 justify-end">
        <span className="text-xs text-white/30 font-mono">{entry.tokens}</span>
      </div>

      {/* Action */}
      <motion.div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" whileHover={{ scale: 1.05 }}>
        <Link href={`/chat?model=${encodeURIComponent(entry.id)}`}
          className="px-3 py-1.5 rounded-lg bg-brand-blue/10 border border-brand-blue/25 text-brand-blue text-xs hover:bg-brand-blue/20 transition-all whitespace-nowrap">
          Chat
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* â”€â”€ Animation #6: Stat card with hover tilt â”€â”€ */
function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3, scale: 1.02, rotateX: 3, rotateY: -3 }}
      transition={{ type: 'spring', damping: 20 }}
      className="glass-card rounded-2xl p-5 cursor-default"
      style={{ perspective: 800 }}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`} style={{ background: 'rgba(255,255,255,0.06)' }}>
        {icon}
      </div>
      <p className="text-2xl font-black font-heading text-white tabular-nums">{value}</p>
      <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{label}</p>
    </motion.div>
  );
}

export default function RankingsPage() {
  const [category, setCategory] = useState('all');
  const [timeframe, setTimeframe] = useState('weekly');

  const filtered = useMemo(() => {
    if (category === 'all') return RANKINGS;
    return RANKINGS.filter(r => r.category === category);
  }, [category]);

  return (
    <div className="min-h-screen bg-[#05050A] text-white">
      <TopNav />
      <PointerGlow />

      <div className="pt-14 max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* â”€â”€ Header â”€â”€ */}
        <div className="py-10 border-b border-white/[0.06]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 22 }}
            className="flex items-center gap-3 mb-4">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-4xl select-none">ðŸ†</motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black font-heading">
                <span className="gradient-text">Ranking</span> Model AI
              </h1>
              <p className="text-white/35 text-sm mt-1">
                Peringkat berdasarkan benchmark dan data penggunaan nyata dari jutaan pengguna
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <StatCard icon={<Trophy size={14} className="text-yellow-400" />} value="400+" label="Model Dinilai" color="text-yellow-400" />
            <StatCard icon={<Activity size={14} className="text-brand-blue" />} value="80T" label="Token/Bulan" color="text-brand-blue" />
            <StatCard icon={<Eye size={14} className="text-brand-green" />} value="8M+" label="Pengguna Aktif" color="text-brand-green" />
            <StatCard icon={<Flame size={14} className="text-brand-amber" />} value="60+" label="Provider" color="text-brand-amber" />
          </motion.div>
        </div>

        {/* â”€â”€ Filter bar â”€â”€ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4 border-b border-white/[0.06]">
          {/* Categories */}
          <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-x-auto w-full sm:w-auto">
            {CATEGORIES.map(cat => (
              <motion.button key={cat.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat.key)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                  category === cat.key ? 'text-white font-medium' : 'text-white/35 hover:text-white/60'
                }`}
              >
                {category === cat.key && (
                  <motion.div layoutId="rank-cat-bg" className="absolute inset-0 bg-brand-blue/10 border border-brand-blue/25 rounded-xl" />
                )}
                <span className="relative">{cat.icon}</span>
                <span className="relative">{cat.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Timeframe */}
          <div className="flex gap-1 flex-shrink-0">
            {TIMEFRAMES.map(tf => (
              <button key={tf.key} onClick={() => setTimeframe(tf.key)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  timeframe === tf.key ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/60'
                }`}>
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* â”€â”€ Table header â”€â”€ */}
        <div className="flex items-center gap-3 px-4 py-2.5 text-[10px] text-white/25 uppercase tracking-wider border-b border-white/[0.04] mt-2">
          <div className="w-8 flex-shrink-0">#</div>
          <div className="flex-1">Model</div>
          <div className="hidden sm:flex w-28 justify-end">Skor</div>
          <div className="hidden md:flex w-20 justify-end">Tren</div>
          <div className="hidden lg:flex w-16 justify-end">Penggunaan</div>
          <div className="hidden xl:flex w-20 justify-end">Token/Mg</div>
          <div className="w-16" />
        </div>

        {/* â”€â”€ Rankings list â”€â”€ */}
        <div className="min-h-[50vh]">
          <AnimatePresence mode="popLayout">
            {filtered.map((entry, i) => (
              <RankRow key={entry.id} entry={entry} index={i} />
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-4xl mb-4">ðŸ”</p>
              <p className="text-white/40 text-sm">Tidak ada model di kategori ini</p>
              <button onClick={() => setCategory('all')} className="mt-3 text-xs text-brand-blue hover:text-white transition-colors">
                Lihat semua
              </button>
            </motion.div>
          )}
        </div>

        {/* â”€â”€ CTA â”€â”€ */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="py-16 text-center border-t border-white/[0.06]">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-4xl mb-4 select-none">ðŸ¦„</motion.div>
          <h2 className="text-xl font-black font-heading mb-2">
            Coba model terbaik <span className="gradient-text">sekarang</span>
          </h2>
          <p className="text-white/35 text-sm mb-6">Mulai chat dengan model peringkat teratas â€” BYOK, tanpa batas.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/chat" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#05050A] font-semibold text-sm hover:bg-white/90 transition-all shadow-lg">
              Mulai Chat <ArrowRight size={13} />
            </Link>
            <Link href="/models" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.12] text-white/70 font-medium text-sm hover:bg-white/[0.04] transition-all">
              Jelajahi Model
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
