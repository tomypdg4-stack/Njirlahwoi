'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Megaphone, Calendar, ArrowRight, ChevronRight,
  Zap, Globe, Shield, Code2, Cpu, AudioLines
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';

interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  icon: React.ReactNode;
  color: string;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'agentic-web-tools',
    title: 'Web Search & Fetch Konsisten untuk Semua Model',
    excerpt: 'Berikan kemampuan pencarian web dan fetch halaman kepada model tool-calling mana pun, dengan beberapa mesin pencari dan mesin fetch.',
    date: '7 Mei 2026',
    category: 'Fitur',
    icon: <Globe size={16} />,
    color: '#5AC8FA',
  },
  {
    id: 'gpt55-cost',
    title: 'Kenaikan Harga GPT-5.5: Biaya Sebenarnya',
    excerpt: 'OpenAI menggandakan harga per-token dengan GPT-5.5 namun model lebih ringkas. Kami mengukur dampak biaya nyata.',
    date: '4 Mei 2026',
    category: 'Analisis',
    icon: <Cpu size={16} />,
    color: '#FF9500',
  },
  {
    id: 'audio-apis',
    title: 'API Audio Baru: Speech & Transcription',
    excerpt: 'Text-to-speech dan transkripsi kini tersedia. Dua endpoint baru memberikan akses ke sintesis suara dan transkripsi audio.',
    date: '1 Mei 2026',
    category: 'Fitur',
    icon: <AudioLines size={16} />,
    color: '#34C759',
  },
  {
    id: 'response-caching',
    title: 'Response Caching: Zero Cost untuk Request Identik',
    excerpt: 'Header Response Caching baru memungkinkan caching request API identik sehingga response datang sangat cepat, tanpa biaya.',
    date: '30 Apr 2026',
    category: 'Performa',
    icon: <Zap size={16} />,
    color: '#FF2D55',
  },
  {
    id: 'gemini-31-pro',
    title: 'Gemini 3.1 Pro Preview Tersedia',
    excerpt: 'Google merilis Gemini 3.1 Pro Preview dengan konteks 2M token dan peningkatan signifikan dalam reasoning.',
    date: '25 Apr 2026',
    category: 'Model',
    icon: <Code2 size={16} />,
    color: '#4285F4',
  },
  {
    id: 'enterprise-launch',
    title: 'Njirlah Enterprise: Solusi untuk Tim & Organisasi',
    excerpt: 'Perkenalkan paket Enterprise dengan SSO, audit log, dedicated support, dan SLA 99.99% untuk tim Anda.',
    date: '20 Apr 2026',
    category: 'Produk',
    icon: <Shield size={16} />,
    color: '#A855F7',
  },
  {
    id: 'grok-43',
    title: 'Grok 4.3 dari xAI Hadir di Njirlah',
    excerpt: 'Model reasoning terbaru dari xAI dengan konteks 1M token dan tanpa batas output token.',
    date: '15 Apr 2026',
    category: 'Model',
    icon: <Zap size={16} />,
    color: '#FFFFFF',
  },
  {
    id: 'structured-outputs',
    title: 'Structured Outputs: JSON Schema untuk Semua Model',
    excerpt: 'Pastikan output model mengikuti skema JSON yang Anda tentukan. Tersedia di semua model yang mendukung.',
    date: '10 Apr 2026',
    category: 'Fitur',
    icon: <Code2 size={16} />,
    color: '#5AC8FA',
  },
];

function AnnouncementCard({ item, index }: { item: Announcement; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: Math.min(index * 0.06, 0.5), type: 'spring', damping: 22 }}
      whileHover={{ y: -3 }}
      className="glass-card rounded-2xl p-6 group cursor-pointer hover:border-white/[0.14] transition-all relative overflow-hidden"
    >
      {/* Top color accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
      />

      {/* Category + Date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${item.color}15`, border: `1px solid ${item.color}30`, color: item.color }}
          >
            {item.icon}
          </motion.div>
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/[0.04] border border-white/[0.08] text-white/40">
            {item.category}
          </span>
        </div>
        <span className="text-[11px] text-white/25 font-mono flex items-center gap-1">
          <Calendar size={9} /> {item.date}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-white group-hover:text-brand-blue transition-colors mb-2 leading-snug">
        {item.title}
      </h3>

      {/* Excerpt */}
      <p className="text-sm text-white/35 leading-relaxed line-clamp-3 mb-4">
        {item.excerpt}
      </p>

      {/* Read more */}
      <div className="flex items-center gap-1.5 text-xs text-brand-blue group-hover:text-white transition-colors">
        Baca selengkapnya
        <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
      </div>

      {/* Animation: Depth pulse on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ animation: 'depth-pulse 3s ease-in-out infinite' }}
      />
    </motion.div>
  );
}

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <TopNav />
      <div className="pt-14 max-w-[1000px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-10 border-b border-white/[0.06]"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-10 h-10 rounded-xl bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center"
            >
              <Megaphone size={18} className="text-brand-amber" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black font-heading">
                Pengumuman <span className="gradient-text">Terbaru</span>
              </h1>
              <p className="text-white/35 text-sm">Berita terbaru, fitur baru, dan update dari Njirlah AI</p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="py-8 relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/[0.06] to-transparent hidden md:block" />

          <div className="space-y-6">
            {ANNOUNCEMENTS.map((item, i) => (
              <div key={item.id} className="flex gap-6 items-start">
                {/* Timeline dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-full bg-[#0D0D10] border border-white/[0.08] items-center justify-center relative z-10"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: item.color }}
                  />
                </motion.div>

                {/* Card */}
                <div className="flex-1">
                  <AnnouncementCard item={item} index={i} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load more */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center py-8"
        >
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.04] text-sm transition-all">
            Muat lebih banyak
            <ChevronRight size={13} />
          </button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
