'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { 
  Trophy, Medal, Zap, Brain, Code2, Calculator, Search, Filter, 
  ChevronRight, ChevronDown, ArrowUpRight, Activity, Cpu, Database, 
  Globe, Shield, Sparkles, Layers, Box, Terminal, Flame, Star, 
  TrendingUp, BarChart2, GitCommit, Target, Maximize, Clock,
  CheckCircle2, XCircle, AlertTriangle, Info, Play, Pause, FastForward
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';
import { LEADERBOARD_DATA } from '@/lib/leaderboard-data';

// --- DATA ---
const CATEGORIES = [
  { id: 'global', name: 'Global LLM', icon: Globe, color: '#06B6D4' },
  { id: 'coding', name: 'Coding Arena', icon: Code2, color: '#10B981' },
  { id: 'reasoning', name: 'Reasoning', icon: Brain, color: '#8B5CF6' },
  { id: 'math', name: 'Mathematics', icon: Calculator, color: '#F59E0B' },
  { id: 'open', name: 'Open Weights', icon: Box, color: '#F43F5E' },
];

const RANKINGS = ['LLM Leaderboard', 'Open LLM Leaderboard', 'Coding', 'Writing', 'Math', 'Research', 'Long Context', 'Tool Calling'];



const METRICS = [
  { label: 'Models Evaluated', value: '342', icon: Database },
  { label: 'Total Benchmarks', value: '15,000+', icon: Activity },
  { label: 'Daily API Calls', value: '2.4M', icon: Zap },
  { label: 'Update Frequency', value: 'Live', icon: Clock },
];

export default function LlmStatsPage() {
  const [activeCategory, setActiveCategory] = useState('global');
  const [activeSubpage, setActiveSubpage] = useState('LLM Leaderboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const { scrollYProgress, scrollY } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const yParallax = useTransform(scrollY, [0, 1000], [0, 200]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const subpageModifier = RANKINGS.indexOf(activeSubpage) * 2;
  const filteredData = LEADERBOARD_DATA.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.provider.toLowerCase().includes(searchQuery.toLowerCase())
  ).map((item, i) => ({
    ...item,
    rank: (i + 1 + subpageModifier) % LEADERBOARD_DATA.length || 1,
    score: (item.score - subpageModifier * 0.1).toFixed(1)
  })).sort((a, b) => a.rank - b.rank);

  const podiumData = filteredData.slice(0, 3);
  const tableData = filteredData.slice(3);

  // Animations variants
  const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  return (
    <div className="min-h-screen bg-[#010105] text-white font-sans overflow-x-hidden selection:bg-[#06B6D4]/30">
      <div className="scanlines z-50 pointer-events-none"></div>
      <div className="noise-overlay z-40 pointer-events-none opacity-[0.15]"></div>
      
      {/* Background Orbs */}
      <motion.div 
        animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/20 blur-[150px] rounded-full pointer-events-none"
      />
      <motion.div 
        animate={{ rotate: -360, scale: [1, 1.5, 1] }} 
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#06B6D4]/10 blur-[150px] rounded-full pointer-events-none"
      />

      <TopNav />

      <main className="relative z-10 pt-24 pb-32 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= HERO SECTION ================= */}
        <motion.section 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0A0A10]/80 backdrop-blur-3xl p-12 lg:p-20 mb-16 flex flex-col items-center text-center shadow-[0_0_100px_rgba(6,182,212,0.1)]"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent)]"></div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#06B6D4] text-xs font-bold uppercase tracking-[0.2em]"
          >
            <Activity size={14} className="animate-pulse" /> Live Metrics & Benchmarks
          </motion.div>

          <motion.h1 
            key={activeSubpage}
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.1, type: "spring" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter mb-6 leading-[1.1] holographic-text"
          >
            {activeSubpage.toUpperCase()} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">NJIRLAH RANKING</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-white/50 max-w-3xl mb-12 font-medium"
          >
            The independent, cryptographically verifiable ranking of 300+ frontier AI models. Real-time inference speeds, context lengths, and composite intelligence scores.
          </motion.p>

          <motion.div 
            variants={staggerContainer} initial="hidden" animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl relative z-20"
          >
            {METRICS.map((m, i) => (
              <motion.div 
                key={i} variants={fadeUp} whileHover={{ y: -5, scale: 1.05 }}
                className="bg-[#05050A]/80 border border-white/5 rounded-2xl p-6 text-center group transition-colors hover:border-white/20 hover:bg-white/5 shadow-xl"
              >
                <m.icon size={24} className="mx-auto mb-3 text-white/40 group-hover:text-[#06B6D4] transition-colors" />
                <div className="text-2xl lg:text-3xl font-black font-heading text-white tracking-tight mb-1">{m.value}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-semibold">{m.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ================= CATEGORIES & SEARCH ================= */}
        <div className="sticky top-[72px] z-40 bg-[#010105]/90 backdrop-blur-xl border-b border-white/5 pb-4 pt-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-12 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 max-w-[1600px] mx-auto">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 custom-scrollbar mask-edges">
              {CATEGORIES.map(cat => {
                const isActive = activeCategory === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all overflow-hidden ${isActive ? 'text-white' : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'}`}
                    style={{ borderColor: isActive ? `${cat.color}50` : 'transparent' }}
                  >
                    {isActive && (
                      <motion.div layoutId="active-tab-bg" className="absolute inset-0 bg-white/10 backdrop-blur-md" style={{ backgroundColor: `${cat.color}20` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                    )}
                    <cat.icon size={16} className="relative z-10" style={{ color: isActive ? cat.color : 'inherit' }} />
                    <span className="relative z-10">{cat.name}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-[400px] group shrink-0">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#06B6D4] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models or providers..."
                className="w-full bg-[#0A0A10] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/50 transition-all shadow-inner"
              />
            </div>

          </div>
        </div>

        {/* ================= MAIN LAYOUT: SIDEBAR + CONTENT ================= */}
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className="w-full xl:w-[280px] shrink-0 xl:sticky xl:top-[160px] space-y-6">
            
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0A0A10] border border-white/5 rounded-3xl p-5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/10 blur-[50px] pointer-events-none group-hover:bg-[#7C3AED]/20 transition-colors"></div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Rankings</h3>
              <nav className="space-y-1 relative">
                {RANKINGS.map((item, i) => {
                  const isActive = activeSubpage === item;
                  return (
                  <motion.button key={i} onClick={() => setActiveSubpage(item)} whileHover={{ x: 5 }} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${isActive ? 'bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                    {item} <ChevronRight size={14} className={isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"} />
                  </motion.button>
                )})}
              </nav>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-[#0A0A10] border border-white/5 rounded-3xl p-5 shadow-2xl">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Arenas</h3>
              <nav className="space-y-1">
                {['Chat Arena', 'Coding Arena', 'Image Arena', 'Video Arena'].map((item, i) => (
                  <motion.button key={i} whileHover={{ x: 5 }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all text-left">
                    <Target size={14} className="text-[#06B6D4]"/> {item}
                  </motion.button>
                ))}
              </nav>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-[#7C3AED]/20 to-[#06B6D4]/10 border border-[#7C3AED]/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(124,58,237,0.15)] relative overflow-hidden group cursor-pointer">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full border border-white/10 blur-[2px]"></motion.div>
               <h3 className="text-lg font-black text-white mb-2 relative z-10">Njirlah API Gateway</h3>
               <p className="text-xs text-white/60 mb-4 relative z-10">Access all these models via a single endpoint.</p>
               <button className="relative z-10 w-full py-2.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-white/90 transition-colors shadow-lg flex items-center justify-center gap-2">
                 Get API Key <ArrowUpRight size={16}/>
               </button>
            </motion.div>
          </aside>

          {/* MAIN LEADERBOARD CONTENT */}
          <div className="flex-1 w-full min-w-0">
            
            {/* --- PODIUM (TOP 3) --- */}
            {podiumData.length >= 3 && !searchQuery && (
              <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-16 pt-12">
                {/* Rank 2 */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, type: 'spring' }}
                  className="w-full md:w-1/3 order-2 md:order-1 relative group"
                >
                  <div className="absolute inset-x-4 -bottom-4 h-20 bg-[#94A3B8]/20 blur-xl rounded-full"></div>
                  <div className="bg-gradient-to-t from-[#0A0A10] to-[#1E293B]/40 border border-white/10 rounded-t-3xl rounded-b-xl p-6 text-center h-[280px] flex flex-col justify-end relative overflow-hidden border-b-4 border-b-[#94A3B8] hover:-translate-y-4 transition-transform duration-500">
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#94A3B8]/20 text-[#94A3B8] font-black flex items-center justify-center text-sm">2</div>
                    <Medal size={48} className="mx-auto text-[#94A3B8] mb-4 drop-shadow-[0_0_15px_rgba(148,163,184,0.5)]" />
                    <h3 className="text-xl font-bold text-white mb-1 truncate">{podiumData[1].name}</h3>
                    <p className="text-xs text-white/40 mb-4 font-mono">{podiumData[1].provider}</p>
                    <div className="text-4xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-br from-white to-[#94A3B8]">{podiumData[1].score}</div>
                  </div>
                </motion.div>

                {/* Rank 1 */}
                <motion.div 
                  initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, type: 'spring' }}
                  className="w-full md:w-1/3 order-1 md:order-2 relative z-10 group"
                >
                  <div className="absolute inset-x-0 -top-20 h-40 bg-[#EAB308]/20 blur-[50px] rounded-full pointer-events-none"></div>
                  <div className="absolute inset-x-4 -bottom-4 h-20 bg-[#EAB308]/30 blur-xl rounded-full"></div>
                  <div className="bg-gradient-to-t from-[#0A0A10] to-[#EAB308]/20 border border-[#EAB308]/30 rounded-t-3xl rounded-b-xl p-8 text-center h-[340px] flex flex-col justify-end relative overflow-hidden border-b-4 border-b-[#EAB308] shadow-[0_0_50px_rgba(234,179,8,0.15)] hover:-translate-y-6 transition-transform duration-500">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute -top-10 -right-10 w-32 h-32 bg-[radial-gradient(circle,rgba(234,179,8,0.2)_0%,transparent_70%)] pointer-events-none"></motion.div>
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[#EAB308] text-black font-black flex items-center justify-center text-lg shadow-[0_0_15px_rgba(234,179,8,0.8)]">1</div>
                    <Trophy size={64} className="mx-auto text-[#EAB308] mb-4 drop-shadow-[0_0_20px_rgba(234,179,8,0.6)]" />
                    <h3 className="text-2xl font-black text-white mb-1 truncate drop-shadow-md">{podiumData[0].name}</h3>
                    <p className="text-sm text-[#EAB308]/80 mb-6 font-mono font-bold">{podiumData[0].provider}</p>
                    <div className="text-6xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-b from-white to-[#EAB308] drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]">{podiumData[0].score}</div>
                  </div>
                </motion.div>

                {/* Rank 3 */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, type: 'spring' }}
                  className="w-full md:w-1/3 order-3 md:order-3 relative group"
                >
                  <div className="absolute inset-x-4 -bottom-4 h-20 bg-[#D97706]/20 blur-xl rounded-full"></div>
                  <div className="bg-gradient-to-t from-[#0A0A10] to-[#78350F]/40 border border-white/10 rounded-t-3xl rounded-b-xl p-6 text-center h-[260px] flex flex-col justify-end relative overflow-hidden border-b-4 border-b-[#D97706] hover:-translate-y-4 transition-transform duration-500">
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#D97706]/20 text-[#D97706] font-black flex items-center justify-center text-sm">3</div>
                    <Medal size={40} className="mx-auto text-[#D97706] mb-4 drop-shadow-[0_0_15px_rgba(217,119,6,0.5)]" />
                    <h3 className="text-lg font-bold text-white mb-1 truncate">{podiumData[2].name}</h3>
                    <p className="text-xs text-white/40 mb-4 font-mono">{podiumData[2].provider}</p>
                    <div className="text-3xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-br from-white to-[#D97706]">{podiumData[2].score}</div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* --- LIST TABLE --- */}
            <div className="bg-[#0A0A10] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              
              {/* Table Header */}
              <div className="grid grid-cols-[60px_2fr_1fr_1fr_1fr_80px] gap-4 p-5 border-b border-white/10 bg-white/[0.02] text-xs font-bold text-white/40 uppercase tracking-widest sticky top-[140px] z-30 backdrop-blur-md">
                <div className="text-center">Rank</div>
                <div>Model</div>
                <div className="hidden md:block">Score</div>
                <div className="hidden lg:block">Context</div>
                <div className="hidden lg:block text-right">Tags</div>
                <div className="text-right">Action</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-white/5 relative">
                <AnimatePresence>
                  {(searchQuery ? filteredData : tableData).map((item, index) => {
                    const isHovered = hoveredRow === index;
                    return (
                      <motion.div
                        key={item.name}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className="grid grid-cols-[60px_1fr_auto] md:grid-cols-[60px_2fr_1fr_1fr_1fr_80px] gap-4 p-5 items-center hover:bg-white/[0.03] transition-colors relative group"
                      >
                        {/* Hover Gradient Highlight */}
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div 
                              layoutId="row-highlight" 
                              className="absolute inset-0 bg-gradient-to-r from-[#06B6D4]/10 via-transparent to-transparent pointer-events-none" 
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            />
                          )}
                        </AnimatePresence>

                        {/* Rank */}
                        <div className="text-center font-black font-mono text-white/30 text-lg group-hover:text-white transition-colors">{item.rank}</div>
                        
                        {/* Model Name & Provider */}
                        <div>
                          <div className="font-bold text-white text-base flex items-center gap-2">
                            {item.name}
                            {item.trend === 'up' && <TrendingUp size={14} className="text-[#10B981]"/>}
                            {item.trend === 'down' && <TrendingUp size={14} className="text-[#F43F5E] rotate-180"/>}
                          </div>
                          <div className="text-xs text-white/40 font-mono mt-1 flex items-center gap-1.5">
                            <Box size={10}/> {item.provider}
                            {item.params !== 'Unknown' && <><span className="text-white/20">•</span> {item.params}</>}
                          </div>
                        </div>

                        {/* Score */}
                        <div className="hidden md:block">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] font-bold font-mono">
                            <BarChart2 size={14}/> {item.score}
                          </div>
                        </div>

                        {/* Context */}
                        <div className="hidden lg:block text-sm font-mono text-white/60">
                          {item.ctx}
                        </div>

                        {/* Tags */}
                        <div className="hidden lg:flex flex-wrap gap-1.5 justify-end">
                          {item.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/50 whitespace-nowrap">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Action */}
                        <div className="text-right">
                          <button className="p-2 rounded-xl bg-white/5 hover:bg-[#7C3AED] hover:text-white text-white/50 transition-all group-hover:scale-110 shadow-lg border border-white/10 hover:border-[#7C3AED]">
                            <ChevronRight size={16}/>
                          </button>
                        </div>

                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {filteredData.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-16 text-center">
                    <Search size={48} className="mx-auto text-white/10 mb-4"/>
                    <h3 className="text-xl font-bold text-white mb-2">No models found</h3>
                    <p className="text-white/40">Try adjusting your search criteria</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Pagination / Load More */}
            {filteredData.length > 0 && (
              <div className="mt-8 text-center">
                <button className="px-6 py-3 rounded-xl bg-[#0A0A10] border border-white/10 text-sm font-bold text-white/60 hover:text-white hover:border-[#06B6D4]/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all flex items-center gap-2 mx-auto">
                  <Database size={16}/> Load Full Database
                </button>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
