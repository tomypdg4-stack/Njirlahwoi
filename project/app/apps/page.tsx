'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ExternalLink, TrendingUp, Users, Zap, Star,
  Code2, MessageSquare, Sparkles, Bot, Cpu, Globe,
  ArrowRight, ChevronRight, X
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';

/* ── App data ── */
interface AppEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  users: string;
  icon: string;
  trending: boolean;
  featured: boolean;
  url: string;
}

const APPS: AppEntry[] = [
  { id: 'openclaw', name: 'OpenClaw', description: 'IDE AI agent yang kuat untuk coding', category: 'Coding', users: '450K+', icon: '🦀', trending: true, featured: true, url: '#' },
  { id: 'hermes-agent', name: 'Hermes Agent', description: 'Agen otonom yang berkembang bersamamu', category: 'Agent', users: '320K+', icon: '🪽', trending: true, featured: true, url: '#' },
  { id: 'kilo-code', name: 'Kilo Code', description: 'Semua yang kamu butuhkan untuk agentic dev', category: 'Coding', users: '280K+', icon: '⚡', trending: true, featured: true, url: '#' },
  { id: 'claude-code', name: 'Claude Code', description: 'Terminal coding agent dari Anthropic', category: 'Coding', users: '890K+', icon: '🤖', trending: false, featured: false, url: '#' },
  { id: 'descript', name: 'Descript', description: 'Edit video dan podcast dengan AI', category: 'Media', users: '150K+', icon: '🎬', trending: false, featured: false, url: '#' },
  { id: 'isekai-zero', name: 'ISEKAI ZERO', description: 'RPG game dengan AI storytelling', category: 'Gaming', users: '95K+', icon: '⚔️', trending: true, featured: false, url: '#' },
  { id: 'janitor-ai', name: 'Janitor AI', description: 'Platform chatbot dengan karakter AI', category: 'Chat', users: '2.1M+', icon: '💬', trending: false, featured: false, url: '#' },
  { id: 'cline', name: 'Cline', description: 'AI coding assistant di VS Code', category: 'Coding', users: '540K+', icon: '🔧', trending: true, featured: false, url: '#' },
  { id: 'roo-code', name: 'Roo Code', description: 'AI-powered code review dan editing', category: 'Coding', users: '120K+', icon: '🦘', trending: false, featured: false, url: '#' },
  { id: 'pi', name: 'Pi', description: 'Personal AI assistant yang ramah', category: 'Chat', users: '1.8M+', icon: '🥧', trending: false, featured: false, url: '#' },
  { id: 'replit', name: 'Replit', description: 'Cara termudah dari ide ke app', category: 'Coding', users: '3.2M+', icon: '💻', trending: false, featured: true, url: '#' },
  { id: 'njirlah-chat', name: 'Njirlah Chat', description: 'Chat AI multi-model tanpa batas', category: 'Chat', users: '50K+', icon: '🦄', trending: true, featured: false, url: '#' },
];

const CATEGORIES = ['Semua', 'Coding', 'Agent', 'Chat', 'Media', 'Gaming'];

function AppCard({ app, index }: { app: AppEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: Math.min(index * 0.05, 0.5), type: 'spring', damping: 22 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card rounded-2xl p-5 group cursor-pointer hover:border-white/[0.14] transition-all relative overflow-hidden"
    >
      {/* Animation: Glass shimmer sweep on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div
          className="absolute inset-0 w-[200%] h-full"
          style={{ animation: 'glass-shimmer 2s ease-in-out', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }}
        />
      </div>

      {/* Featured badge */}
      {app.featured && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="absolute top-3 right-3"
        >
          <span className="px-2 py-0.5 text-[9px] rounded-full bg-brand-amber/15 border border-brand-amber/30 text-brand-amber font-semibold flex items-center gap-1">
            <Star size={8} /> UNGGULAN
          </span>
        </motion.div>
      )}

      <div className="flex items-start gap-3 mb-3">
        {/* Animation: Icon float */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
          className="text-2xl flex-shrink-0"
        >
          {app.icon}
        </motion.div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white group-hover:text-brand-blue transition-colors truncate">
            {app.name}
          </h3>
          <p className="text-xs text-white/35 mt-0.5 line-clamp-2">{app.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/30 flex items-center gap-1">
            <Users size={9} /> {app.users}
          </span>
          <span className="px-2 py-0.5 text-[9px] rounded-full bg-white/[0.04] border border-white/[0.08] text-white/40">
            {app.category}
          </span>
        </div>
        {app.trending && (
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[9px] text-brand-green flex items-center gap-0.5"
          >
            <TrendingUp size={8} /> Trending
          </motion.span>
        )}
      </div>

      {/* Hover arrow */}
      <motion.div
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
        whileHover={{ x: 2 }}
      >
        <ChevronRight size={14} className="text-brand-blue" />
      </motion.div>
    </motion.div>
  );
}

/* ── Featured App Carousel ── */
function FeaturedApps() {
  const featured = APPS.filter(a => a.featured);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
      {featured.map((app, i) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, type: 'spring', damping: 20 }}
          whileHover={{ scale: 1.03 }}
          className="relative rounded-2xl overflow-hidden group cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(90,200,250,0.08), rgba(169,209,113,0.05))',
            border: '1px solid rgba(90,200,250,0.15)',
          }}
        >
          {/* Animation: Aurora background */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, rgba(90,200,250,0.1), rgba(52,199,89,0.1), rgba(255,149,0,0.1))',
              backgroundSize: '400% 400%',
              animation: 'aurora 8s ease-in-out infinite',
            }}
          />

          <div className="relative p-6">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="text-3xl mb-3"
            >
              {app.icon}
            </motion.div>
            <h3 className="text-lg font-bold text-white mb-1">{app.name}</h3>
            <p className="text-sm text-white/50 mb-3">{app.description}</p>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <Users size={11} /> {app.users} pengguna
            </div>
          </div>

          {/* Animation: Energy field border */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ animation: 'energy-field 4s ease-in-out infinite' }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function AppsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');

  const filtered = useMemo(() => {
    let list = [...APPS];
    if (category !== 'Semua') list = list.filter(a => a.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    return list;
  }, [search, category]);

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <TopNav />
      <div className="pt-14 max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 22 }}
          className="py-10 border-b border-white/[0.06]"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center"
            >
              <Sparkles size={18} className="text-brand-blue" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black font-heading">
                Aplikasi & <span className="gradient-text">Agen</span>
              </h1>
              <p className="text-white/35 text-sm">250K+ aplikasi menggunakan Njirlah AI dengan 4.2M+ pengguna global</p>
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 py-6 border-b border-white/[0.06]"
        >
          {[
            { value: '250K+', label: 'Aplikasi Aktif', icon: <Globe size={14} /> },
            { value: '4.2M+', label: 'Pengguna Global', icon: <Users size={14} /> },
            { value: '60+', label: 'Kategori', icon: <Cpu size={14} /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-1.5 text-brand-blue mb-1">{stat.icon}</div>
              <p className="text-xl font-black font-heading text-white">{stat.value}</p>
              <p className="text-[10px] text-white/30">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Apps */}
        <div className="py-8">
          <motion.h2
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-bold font-heading mb-4 flex items-center gap-2"
          >
            <Star size={16} className="text-brand-amber" /> Aplikasi Unggulan
          </motion.h2>
          <FeaturedApps />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-4 border-b border-white/[0.06]">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari aplikasi..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/25 outline-none focus:border-brand-blue/40 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`relative px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                  category === cat ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {category === cat && (
                  <motion.div
                    layoutId="cat-bg"
                    className="absolute inset-0 rounded-lg bg-white/[0.07]"
                    transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* App Grid */}
        <div className="py-6">
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((app, i) => (
                <AppCard key={app.id} app={app} index={i} />
              ))}
            </div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-white/40 text-sm">Tidak ada aplikasi ditemukan</p>
            </motion.div>
          )}
        </div>

        <div className="py-4 text-xs text-white/20 border-t border-white/[0.04]">
          Menampilkan {filtered.length} dari {APPS.length} aplikasi
        </div>
      </div>
      <Footer />
    </div>
  );
}
