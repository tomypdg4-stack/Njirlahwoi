'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import {
  ArrowRight, Zap, Shield, Globe, TrendingUp,
  ExternalLink, ChevronRight, Key, MessageSquare
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';

/* â”€â”€ Animated stat counter â”€â”€ */
function StatCounter({ end, suffix = '', label }: { end: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(eased * end));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', damping: 22 }}
      className="text-center"
    >
      <p className="stat-value">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-white/40 mt-1">{label}</p>
    </motion.div>
  );
}

/* â”€â”€ Provider logo marquee â”€â”€ */
const PROVIDERS = [
  'OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral', 'DeepSeek', 'xAI', 'Cohere',
  'Qwen', 'Groq', 'Perplexity', 'Fireworks', 'Together', 'NVIDIA', 'Inflection',
  'Inception', 'Liquid', 'Arcee AI', 'MiniMax', 'Moonshot', 'Amazon Bedrock', 'Azure',
  'Mistral', 'Cerebras', 'SambaNova', 'NovitaAI',
];

function ProviderMarquee() {
  const doubled = [...PROVIDERS, ...PROVIDERS];
  return (
    <div className="overflow-hidden w-full py-6 relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: 'linear-gradient(to right, #05050A, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: 'linear-gradient(to left, #05050A, transparent)' }} />
      <div className="flex">
        <div className="marquee-track flex gap-3 items-center">
          {doubled.map((p, i) => (
            <span
              key={i}
              className="px-3 py-1.5 text-xs rounded-full bg-white/[0.04] border border-white/[0.07] text-white/40 whitespace-nowrap flex-shrink-0 hover:text-white/70 hover:bg-white/[0.06] transition-colors cursor-default"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* â”€â”€ Featured model card â”€â”€ */
function ModelCard({
  name, provider, tokens, trend, delay = 0
}: {
  name: string; provider: string; tokens: string; trend: string; delay?: number;
}) {
  const isPositive = trend.startsWith('+');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', damping: 22, delay }}
      whileHover={{ y: -3, scale: 1.01 }}
      className="glass-card rounded-2xl p-5 cursor-pointer group transition-all hover:border-white/[0.14]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="provider-icon text-brand-blue font-black text-xs">
            {provider.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white group-hover:text-brand-blue transition-colors">{name}</p>
            <p className="text-xs text-white/35">by {provider}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          isPositive ? 'text-brand-green bg-brand-green/10 border border-brand-green/20' : 'text-brand-red/80 bg-brand-red/8 border border-brand-red/15'
        }`}>
          {trend}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-white/30">
        <span>{tokens} tokens/minggu</span>
        <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </motion.div>
  );
}

/* â”€â”€ Feature card â”€â”€ */
function FeatureCard({
  icon, title, description, cta, ctaHref, delay = 0
}: {
  icon: React.ReactNode; title: string; description: string; cta: string; ctaHref: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', damping: 22, delay }}
      whileHover={{ y: -2 }}
      className="glass-card rounded-2xl p-6 flex flex-col gap-4 group"
    >
      <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/45 leading-relaxed">{description}</p>
      </div>
      <Link
        href={ctaHref}
        className="mt-auto flex items-center gap-1.5 text-xs text-brand-blue hover:text-white transition-colors font-medium"
      >
        {cta}
        <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </motion.div>
  );
}

/* â”€â”€ Onboarding step â”€â”€ */
function OnboardStep({
  number, title, description, delay = 0
}: {
  number: string; title: string; description: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', damping: 22, delay }}
      className="flex items-start gap-4"
    >
      <div className="w-9 h-9 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue font-black text-sm flex-shrink-0">
        {number}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
        <p className="text-sm text-white/40 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

/* â”€â”€ Announcement card â”€â”€ */
function AnnouncementCard({
  title, date, excerpt, delay = 0
}: {
  title: string; date: string; excerpt: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', damping: 22, delay }}
      className="glass-card rounded-2xl p-5 group cursor-pointer hover:border-white/[0.14] transition-all"
    >
      <p className="text-[11px] text-white/30 mb-2 font-mono">{date}</p>
      <h4 className="text-sm font-semibold text-white group-hover:text-brand-blue transition-colors mb-2 leading-snug">{title}</h4>
      <p className="text-xs text-white/35 leading-relaxed line-clamp-2">{excerpt}</p>
    </motion.div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY       = useTransform(scrollY, [0, 400], [0, 60]);

  /* pointer glow */
  const [spring, api] = useSpring(() => ({ x: -300, y: -300, config: { tension: 110, friction: 28 } }));
  useEffect(() => {
    const move = (e: MouseEvent) => api.start({ x: e.clientX - 200, y: e.clientY - 200 });
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [api]);

  return (
    <div className="min-h-screen bg-[#05050A] text-white">
      <TopNav />

      {/* Pointer glow */}
      <animated.div
        style={{ left: spring.x, top: spring.y }}
        className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        aria-hidden
      >
        <div className="w-full h-full rounded-full bg-brand-blue/[0.04] blur-3xl" />
      </animated.div>

      {/* â”€â”€ HERO â”€â”€ */}
      <section ref={heroRef} className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center overflow-hidden">
        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', damping: 22 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/25 text-brand-blue text-xs font-medium mb-6"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-brand-blue"
            />
            400+ Model Â· 60+ Provider Â· BYOK
          </motion.div>

          {/* Headline â€” split text animation */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black font-heading leading-[1.08] mb-4"
            aria-label="Platform AI Bebas Tanpa Batas"
          >
            {'Platform AI Bebas'.split('').map((char, i) => (
              <motion.span
                key={`a-${i}`}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.025, type: 'spring', damping: 18 }}
                className={char === ' ' ? 'inline-block mr-3' : 'inline-block gradient-text'}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
            <br />
            {'Tanpa Batas'.split('').map((char, i) => (
              <motion.span
                key={`b-${i}`}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.025, type: 'spring', damping: 18 }}
                className={char === ' ' ? 'inline-block mr-3' : 'inline-block text-white'}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, type: 'spring', damping: 22 }}
            className="text-white/50 text-lg sm:text-xl mb-8 max-w-xl mx-auto leading-relaxed"
          >
            Harga lebih baik, uptime lebih tinggi, tanpa langganan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, type: 'spring', damping: 22 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/api-njir"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#05050A] font-semibold text-sm hover:bg-white/90 transition-all shadow-lg"
            >
              <Key size={15} />
              Masukkan API Key
            </Link>
            <Link
              href="/models"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.12] text-white/80 font-medium text-sm hover:bg-white/[0.05] hover:text-white transition-all"
            >
              <Globe size={15} />
              Jelajahi Model
              <ArrowRight size={13} className="ml-0.5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating unicorn */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-12 right-1/4 text-5xl opacity-20 pointer-events-none hidden lg:block"
        >
          ðŸ¦„
        </motion.div>
      </section>

      {/* â”€â”€ STATS BAR â”€â”€ */}
      <section className="border-y border-white/[0.06] bg-white/[0.01] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter end={80}    suffix="T"  label="Token per Bulan" />
            <StatCounter end={8}     suffix="M+" label="Pengguna Global" />
            <StatCounter end={60}    suffix="+"  label="Provider Aktif" />
            <StatCounter end={400}   suffix="+"  label="Model Tersedia" />
          </div>
        </div>
      </section>

      {/* â”€â”€ PROVIDER LOGOS â”€â”€ */}
      <section className="py-12 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <p className="text-center text-xs text-white/25 uppercase tracking-widest">
            Didukung oleh provider AI terkemuka dunia
          </p>
        </div>
        <ProviderMarquee />
      </section>

      {/* â”€â”€ FEATURES â”€â”€ */}
      <section className="py-20 px-4 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-black font-heading mb-3">
              Satu API untuk <span className="gradient-text">Semua Model</span>
            </h2>
            <p className="text-white/40 text-sm max-w-md mx-auto">
              Akses semua model AI terbesar lewat satu antarmuka terpadu. Kunci API kamu, kontrol penuh di tanganmu.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard
              icon={<Globe size={18} />}
              title="Satu API, Semua Model"
              description="Akses semua model besar lewat satu antarmuka terpadu. Kompatibel penuh dengan OpenAI SDK."
              cta="Lihat semua model"
              ctaHref="/models"
              delay={0}
            />
            <FeatureCard
              icon={<Zap size={18} />}
              title="Ketersediaan Tinggi"
              description="Model AI andal lewat infrastruktur terdistribusi. Fallback otomatis ke provider lain jika satu down."
              cta="Pelajari lebih lanjut"
              ctaHref="/api-njir"
              delay={0.07}
            />
            <FeatureCard
              icon={<TrendingUp size={18} />}
              title="Harga dan Performa"
              description="Kendalikan biaya tanpa mengorbankan kecepatan. Berjalan di edge untuk latensi minimal."
              cta="Lihat perbandingan"
              ctaHref="/models"
              delay={0.14}
            />
            <FeatureCard
              icon={<Shield size={18} />}
              title="Kebijakan Data Kustom"
              description="Enkripsi penuh di sisi klien. Kunci API kamu tidak pernah menyentuh server kami."
              cta="Lihat dokumentasi"
              ctaHref="/api-njir"
              delay={0.21}
            />
          </div>
        </div>
      </section>

      {/* â”€â”€ FEATURED MODELS â”€â”€ */}
      <section className="py-20 px-4 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-xl font-black font-heading"
              >
                Model Unggulan
              </motion.h2>
              <p className="text-white/35 text-sm mt-0.5">400+ model aktif di 60+ provider</p>
            </div>
            <Link
              href="/models"
              className="flex items-center gap-1.5 text-xs text-brand-blue hover:text-white transition-colors"
            >
              Lihat semua <ExternalLink size={11} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ModelCard name="Claude Opus 4.7" provider="anthropic"  tokens="1.1T"   trend="-14.66%" delay={0} />
            <ModelCard name="GPT-5.5"          provider="openai"     tokens="316.7B" trend="+59.72%" delay={0.07} />
            <ModelCard name="Gemini 3.1 Pro"   provider="google"     tokens="320.5B" trend="-20.24%" delay={0.14} />
          </div>
        </div>
      </section>

      {/* â”€â”€ ONBOARDING STEPS â”€â”€ */}
      <section className="py-20 px-4 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl font-black font-heading mb-3"
              >
                Mulai dalam <span className="gradient-text">3 langkah</span>
              </motion.h2>
              <p className="text-white/35 text-sm mb-8">Tidak perlu registrasi. Pakai kunci API milikmu sendiri.</p>

              <div className="flex flex-col gap-6">
                <OnboardStep
                  number="1"
                  title="Dapatkan API Key"
                  description="Daftar di OpenRouter.ai atau gunakan Cloudflare Workers AI. Salin kunci API-mu."
                  delay={0}
                />
                <OnboardStep
                  number="2"
                  title="Masukkan Kunci API"
                  description="Buka halaman API Keys, masukkan kunci. Disimpan terenkripsi di browser-mu, tidak pernah ke server."
                  delay={0.1}
                />
                <OnboardStep
                  number="3"
                  title="Mulai Ngobrol"
                  description="Pilih model, buka chat, dan nikmati 400+ model AI tanpa batas dari satu antarmuka."
                  delay={0.2}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
                className="flex gap-3 mt-8"
              >
                <Link
                  href="/api-njir"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue text-[#05050A] font-semibold text-sm hover:bg-brand-blue/90 transition-all"
                >
                  <Key size={14} /> Masukkan API Key
                </Link>
                <Link
                  href="/chat"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.10] text-white/70 font-medium text-sm hover:bg-white/[0.04] transition-all"
                >
                  <MessageSquare size={14} /> Langsung Chat
                </Link>
              </motion.div>
            </div>

            {/* Visual - code snippet */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', damping: 22, delay: 0.1 }}
              className="glass-card rounded-2xl p-5 font-mono text-xs"
            >
              <div className="flex items-center gap-1.5 mb-4">
                <div className="w-3 h-3 rounded-full bg-brand-red/50" />
                <div className="w-3 h-3 rounded-full bg-brand-amber/50" />
                <div className="w-3 h-3 rounded-full bg-brand-green/50" />
                <span className="ml-2 text-white/20 text-[10px]">openai-compat.js</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <p><span className="text-brand-blue/70">import</span> <span className="text-white/80">OpenAI</span> <span className="text-brand-blue/70">from</span> <span className="text-brand-green/70">"openai"</span>;</p>
                <p className="mt-3"><span className="text-white/80">const</span> <span className="text-brand-amber/80">client</span> = <span className="text-brand-blue/70">new</span> <span className="text-white/80">OpenAI</span>({'{'}</p>
                <p className="ml-4"><span className="text-white/50">baseURL</span>: <span className="text-brand-green/70">"https://openrouter.ai/api/v1"</span>,</p>
                <p className="ml-4"><span className="text-white/50">apiKey</span>: <span className="text-brand-green/70">process.env.OPENROUTER_API_KEY</span>,</p>
                <p>{'}'});</p>
                <p className="mt-3"><span className="text-white/80">const</span> <span className="text-brand-amber/80">response</span> = <span className="text-brand-blue/70">await</span></p>
                <p className="ml-4"><span className="text-brand-amber/80">client</span>.chat.completions.<span className="text-white/80">create</span>({'{'}</p>
                <p className="ml-8"><span className="text-white/50">model</span>: <span className="text-brand-green/70">"anthropic/claude-opus-4.7"</span>,</p>
                <p className="ml-8"><span className="text-white/50">messages</span>: [{'{'} <span className="text-white/50">role</span>: <span className="text-brand-green/70">"user"</span>,</p>
                <p className="ml-12"><span className="text-white/50">content</span>: <span className="text-brand-green/70">"NJIRLAH ini keren banget!"</span> {'}'}],</p>
                <p className="ml-4">{'}'});</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* â”€â”€ ANNOUNCEMENTS â”€â”€ */}
      <section className="py-20 px-4 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.h2
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xl font-black font-heading"
            >
              Pengumuman Terbaru
            </motion.h2>
            <Link href="/api-njir" className="text-xs text-brand-blue hover:text-white transition-colors flex items-center gap-1">
              Lihat semua <ExternalLink size={11} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AnnouncementCard
              title="GPT-5.5 Tersedia dengan Kecepatan Tinggi"
              date="7 Mei 2026"
              excerpt="OpenAI merilis GPT-5.5 dengan peningkatan kecepatan signifikan. Harga per-token lebih efisien untuk penggunaan massal."
              delay={0}
            />
            <AnnouncementCard
              title="Audio API Baru: Speech & Transcription"
              date="1 Mei 2026"
              excerpt="Text-to-speech dan transkripsi kini tersedia. Dua endpoint baru memberi akses ke sintesis suara dan transkripsi audio."
              delay={0.07}
            />
            <AnnouncementCard
              title="Response Caching: Zero Cost untuk Request Identik"
              date="30 Apr 2026"
              excerpt="Perkenalkan header Response Caching baru: memungkinkan caching request API identik sehingga response datang dalam waktu sangat singkat, tanpa biaya."
              delay={0.14}
            />
          </div>
        </div>
      </section>

      {/* â”€â”€ CTA BOTTOM â”€â”€ */}
      <section className="py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', damping: 22 }}
          className="max-w-lg mx-auto"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl mb-6 select-none"
          >
            ðŸ¦„
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading mb-3">
            Siap mulai? <span className="gradient-text">NJIRLAH.</span>
          </h2>
          <p className="text-white/40 text-sm mb-8">
            Platform AI bebas, tanpa batas, kunci apimu sendiri, njir lah keren banget.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/chat"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#05050A] font-semibold text-sm hover:bg-white/90 transition-all shadow-lg"
            >
              <MessageSquare size={15} />
              Mulai Chat Sekarang
            </Link>
            <Link
              href="/models"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.12] text-white/70 font-medium text-sm hover:bg-white/[0.04] hover:text-white transition-all"
            >
              <Globe size={15} />
              Jelajahi Model
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
