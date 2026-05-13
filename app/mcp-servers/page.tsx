'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ExternalLink, Star, ChevronDown, Check, Filter,
  RotateCcw, LayoutGrid, List, ArrowUpDown, Server, Globe, Shield,
  Zap, Wrench, Sparkles, ChevronRight, Package, Cpu, Radio, Tag
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';
import { useMCPStore, getFilteredServers } from '@/store/mcp-store';
import {
  ALL_MCP_SERVERS, MCP_CATEGORIES, TOTAL_MCP_SERVERS, TOTAL_OFFICIAL,
  TOTAL_REMOTE, TOTAL_TOOLS, type MCPServer, type MCPCategory
} from '@/lib/mcp-servers';

// ── Sort Options ──
const SORT_OPTIONS = [
  { key: 'featured' as const, label: 'Featured First' },
  { key: 'stars' as const, label: 'Most Popular' },
  { key: 'newest' as const, label: 'Newest First' },
  { key: 'tools' as const, label: 'Most Tools' },
  { key: 'name' as const, label: 'Alphabetical' },
];

// ── Animated Counter ──
function AnimCounter({ end, duration = 1600 }: { end: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.floor(p * p * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, duration]);
  return <>{val.toLocaleString()}</>;
}

// ── Server Card ──
function MCPServerCard({ server, index }: { server: MCPServer; index: number }) {
  const cat = MCP_CATEGORIES.find(c => c.key === server.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), type: 'spring', stiffness: 260, damping: 24 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl border bg-[#0A0A10]/90 backdrop-blur-xl overflow-hidden flex flex-col"
      style={{ borderColor: `${server.color}20` }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = `0 12px 40px -10px ${server.color}35, inset 0 0 0 1px ${server.color}50`;
        el.style.borderColor = `${server.color}60`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = 'none';
        el.style.borderColor = `${server.color}20`;
      }}
    >
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full blur-[50px] opacity-0 group-hover:opacity-[0.08] transition-opacity pointer-events-none" style={{ backgroundColor: server.color }} />

      {/* Hologram scan effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden">
        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ animation: 'hologram-scan 2s linear infinite' }} />
      </div>

      <div className="p-5 flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-inner"
              style={{ backgroundColor: `${server.color}15`, border: `1px solid ${server.color}30` }}
            >
              {server.icon}
            </motion.div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {server.name}
                {server.isOfficial && (
                  <span className="px-1.5 py-0.5 text-[8px] rounded bg-[#06B6D4]/20 border border-[#06B6D4]/40 text-[#06B6D4] font-black uppercase tracking-wider">Official</span>
                )}
                {server.isNew && (
                  <span className="px-1.5 py-0.5 text-[8px] rounded bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] font-black uppercase tracking-wider">New</span>
                )}
              </h3>
              <p className="text-[10px] text-white/35 mt-0.5">by {server.author}</p>
            </div>
          </div>
          {server.isRemote && (
            <span className="px-1.5 py-0.5 text-[8px] rounded bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#A855F7] font-bold flex items-center gap-1">
              <Radio size={8} /> Remote
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-white/45 leading-relaxed mb-4 flex-1 line-clamp-2">{server.description}</p>

        {/* Category badge */}
        {cat && (
          <div className="flex items-center gap-1.5 mb-3">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border"
              style={{ color: cat.color, backgroundColor: `${cat.color}12`, borderColor: `${cat.color}25` }}
            >
              {cat.emoji} {cat.label}
            </span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {server.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 text-[9px] rounded bg-white/[0.04] border border-white/[0.06] text-white/30 font-mono">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <div className="bg-[#05050A] rounded-lg p-2.5 border border-white/5">
            <div className="text-[8px] text-white/25 uppercase tracking-widest mb-1 flex items-center gap-1"><Star size={9} /> Stars</div>
            <div className="text-xs font-bold text-white font-mono">{server.stars.toLocaleString()}</div>
          </div>
          <div className="bg-[#05050A] rounded-lg p-2.5 border border-white/5">
            <div className="text-[8px] text-white/25 uppercase tracking-widest mb-1 flex items-center gap-1"><Wrench size={9} /> Tools</div>
            <div className="text-xs font-bold text-white font-mono">{server.tools}</div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-5 pb-4 flex gap-2 relative z-10">
        <a
          href={server.url}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-semibold text-white/60 bg-white/[0.04] border border-white/[0.08] hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={11} /> View Source
        </a>
        <button
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-semibold text-white border border-white/10 transition-all group-hover:shadow-lg"
          style={{ backgroundColor: `${server.color}20`, borderColor: `${server.color}30` }}
        >
          <Package size={11} /> Install
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Page ──
export default function MCPServerPage() {
  const store = useMCPStore();
  const filteredServers = useMemo(() => getFilteredServers(store), [
    store.searchQuery, store.selectedCategories, store.showOfficialOnly, store.showRemoteOnly, store.sortBy
  ]);

  const [loading, setLoading] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const hasFilters = store.selectedCategories.length > 0 || store.showOfficialOnly || store.showRemoteOnly || store.searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#010105] text-white font-sans selection:bg-[#A855F7]/30">
      <div className="scanlines" />
      <div className="noise-overlay" />

      {/* Ambient bg */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 20% 40%, rgba(168,85,247,0.04), transparent 30%), radial-gradient(circle at 80% 60%, rgba(6,182,212,0.03), transparent 30%)'
      }} />

      <TopNav />

      <main className="relative z-10 pt-20 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/* ── HERO ── */}
        <section className="relative w-full rounded-[2rem] overflow-hidden border border-white/[0.08] bg-[#0A0A10] shadow-2xl mb-12 flex flex-col items-center justify-center min-h-[420px] lg:min-h-[500px]">
          {/* Animated grid bg */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            animation: 'synthwave-grid 3s linear infinite',
          }} />

          {/* Floating orbs */}
          <motion.div animate={{ y: [0, -20, 0], x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-16 left-[15%] w-32 h-32 bg-[#A855F7] rounded-full blur-[80px] opacity-[0.06]" />
          <motion.div animate={{ y: [0, 15, 0], x: [0, -8, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-20 right-[20%] w-40 h-40 bg-[#06B6D4] rounded-full blur-[90px] opacity-[0.05]" />

          <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8 }}
              className="mb-5 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
            >
              <Server size={13} className="text-[#A855F7] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-[#A855F7] to-[#06B6D4]">MCP Server Marketplace</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-black font-heading tracking-tighter mb-5 leading-[1.1]"
            >
              <span className="holographic-text">Connect.</span>{' '}
              <span className="text-white">Extend.</span>{' '}
              <span className="holographic-text">Build.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base lg:text-lg text-white/45 max-w-2xl mb-10 leading-relaxed"
            >
              Discover and install MCP servers to supercharge your AI agents with real-world tools — from GitHub to databases, web scraping to cloud services.
            </motion.p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
              {[
                { value: TOTAL_MCP_SERVERS, label: 'MCP Servers', icon: <Server size={14} /> },
                { value: TOTAL_OFFICIAL, label: 'Official', icon: <Shield size={14} /> },
                { value: TOTAL_REMOTE, label: 'Remote Ready', icon: <Globe size={14} /> },
                { value: TOTAL_TOOLS, label: 'Total Tools', icon: <Wrench size={14} /> },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-black/40 glass-panel rounded-xl p-4 text-center group hover:bg-white/[0.06] transition-colors"
                >
                  <div className="flex items-center justify-center gap-1.5 text-white/30 mb-1.5">{stat.icon}</div>
                  <div className="text-2xl lg:text-3xl font-black font-heading text-white mb-1 group-hover:scale-105 transition-transform">
                    <AnimCounter end={stat.value} />
                  </div>
                  <div className="text-[10px] text-white/35 uppercase tracking-widest font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          >
            <span className="text-[9px] uppercase tracking-widest text-white/25 font-bold">Explore</span>
            <ChevronDown size={14} className="text-white/40" />
          </motion.div>
        </section>

        {/* ── CATEGORY PILLS ── */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {MCP_CATEGORIES.map((cat) => {
              const active = store.selectedCategories.includes(cat.key);
              const count = ALL_MCP_SERVERS.filter(s => s.category === cat.key).length;
              return (
                <motion.button
                  key={cat.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => store.toggleCategory(cat.key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-all ${
                    active
                      ? 'text-white shadow-lg'
                      : 'text-white/50 bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:text-white'
                  }`}
                  style={active ? { backgroundColor: `${cat.color}20`, borderColor: `${cat.color}50`, color: cat.color, boxShadow: `0 0 15px ${cat.color}25` } : {}}
                >
                  <span>{cat.emoji}</span> {cat.label}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${active ? 'bg-white/20' : 'bg-white/[0.06]'}`}>{count}</span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ── TOOLBAR ── */}
        <div className="sticky top-16 z-40 bg-[#010105]/80 backdrop-blur-2xl border-b border-white/5 pb-4 pt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full md:w-[380px] group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={16} className="text-white/30 group-focus-within:text-[#A855F7] transition-colors" />
              </div>
              <input
                type="text"
                value={store.searchQuery}
                onChange={(e) => store.setSearchQuery(e.target.value)}
                placeholder="Search MCP servers, tools, authors..."
                className="w-full pl-11 pr-10 py-3 bg-[#0D0D15] border border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#A855F7]/50 focus:ring-1 focus:ring-[#A855F7]/30 transition-all"
              />
              {store.searchQuery && (
                <button onClick={() => store.setSearchQuery('')} className="absolute inset-y-0 right-3 flex items-center text-white/30 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              {/* Filters */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => store.setShowOfficialOnly(!store.showOfficialOnly)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] font-semibold border transition-all ${store.showOfficialOnly ? 'bg-[#06B6D4]/15 border-[#06B6D4]/40 text-[#06B6D4]' : 'bg-[#0D0D15] border-white/10 text-white/50 hover:text-white'}`}
                >
                  <Shield size={12} /> Official
                </button>
                <button
                  onClick={() => store.setShowRemoteOnly(!store.showRemoteOnly)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] font-semibold border transition-all ${store.showRemoteOnly ? 'bg-[#A855F7]/15 border-[#A855F7]/40 text-[#A855F7]' : 'bg-[#0D0D15] border-white/10 text-white/50 hover:text-white'}`}
                >
                  <Globe size={12} /> Remote
                </button>
                {hasFilters && (
                  <button onClick={store.resetFilters} className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-[11px] font-bold text-[#F43F5E] bg-[#F43F5E]/10 border border-[#F43F5E]/20 hover:bg-[#F43F5E]/20 transition-all">
                    <RotateCcw size={10} /> Reset
                  </button>
                )}
              </div>

              {/* Count + Sort + View */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white/30 hidden sm:block">
                  <strong className="text-white">{filteredServers.length}</strong> servers
                </span>

                <div className="relative">
                  <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0D0D15] border border-white/10 text-white/60 hover:text-white text-[11px] font-medium transition-all min-w-[140px] justify-between">
                    <span className="flex items-center gap-1.5"><ArrowUpDown size={11} /> {SORT_OPTIONS.find(o => o.key === store.sortBy)?.label}</span>
                    <ChevronDown size={11} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full mt-1.5 w-48 bg-[#11111A] border border-white/10 rounded-xl shadow-2xl z-50 p-1.5"
                      >
                        {SORT_OPTIONS.map(o => (
                          <button key={o.key} onClick={() => { store.setSortBy(o.key); setSortOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-medium transition-colors ${store.sortBy === o.key ? 'bg-[#A855F7]/15 text-[#A855F7]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                          >
                            {o.label} {store.sortBy === o.key && <Check size={12} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center bg-[#0D0D15] border border-white/10 rounded-lg p-0.5">
                  <button onClick={() => store.setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${store.viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white'}`}><LayoutGrid size={14} /></button>
                  <button onClick={() => store.setViewMode('list')} className={`p-1.5 rounded-md transition-all ${store.viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white'}`}><List size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── GRID ── */}
        {loading ? (
          <div className={`grid gap-5 ${store.viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/5 bg-[#0D0D15] p-5 animate-pulse min-h-[280px]">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-white/5 skeleton-shimmer" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-3/4 skeleton-shimmer" />
                    <div className="h-3 bg-white/5 rounded w-1/2 skeleton-shimmer" />
                  </div>
                </div>
                <div className="h-8 bg-white/5 rounded mb-3 skeleton-shimmer" />
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <div className="h-14 bg-white/5 rounded-lg skeleton-shimmer" />
                  <div className="h-14 bg-white/5 rounded-lg skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredServers.length > 0 ? (
          <motion.div layout className={`grid gap-5 ${store.viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            <AnimatePresence>
              {filteredServers.map((server, i) => (
                <MCPServerCard key={server.id} server={server} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center bg-[#0A0A10] border border-white/5 rounded-3xl">
            <div className="w-20 h-20 mb-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Search size={32} className="text-white/15" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white mb-2">No servers found</h3>
            <p className="text-white/35 max-w-md text-sm mb-6">Try adjusting your search or clearing filters.</p>
            <button onClick={store.resetFilters} className="px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors text-sm">
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* End indicator */}
        {!loading && filteredServers.length > 0 && (
          <div className="py-10 mt-10 text-center border-t border-white/5 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#010105] border border-white/10 flex items-center justify-center">
              <Check size={10} className="text-[#A855F7]" />
            </div>
            <p className="text-[10px] text-white/25 font-medium uppercase tracking-widest">
              Showing all {filteredServers.length} MCP servers
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
