'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import {
  Zap, Check, ArrowRight, Star, Shield, Globe, TrendingUp,
  CreditCard, ChevronDown, HelpCircle, Sparkles, DollarSign
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';

/* â”€â”€ Animation #12: Floating particles â”€â”€ */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(8)].map((_, i) => (
        <motion.div key={i}
          animate={{ y: [0, -60, 0], x: [0, (i % 2 === 0 ? 20 : -20), 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
          className="absolute w-1 h-1 rounded-full bg-brand-blue/30"
          style={{ left: `${10 + i * 12}%`, top: `${20 + (i * 7) % 60}%` }}
        />
      ))}
    </div>
  );
}

/* â”€â”€ Animation #13: Price ticker â”€â”€ */
function PriceTicker() {
  const models = [
    { name: 'GPT-4o', price: '$2.50', provider: 'OpenAI' },
    { name: 'Claude Opus', price: '$3.00', provider: 'Anthropic' },
    { name: 'Gemini Pro', price: '$1.25', provider: 'Google' },
    { name: 'Llama 3.3 70B', price: '$0.12', provider: 'Meta' },
    { name: 'DeepSeek V4', price: '$0.44', provider: 'DeepSeek' },
    { name: 'Qwen 3.6', price: '$1.04', provider: 'Alibaba' },
    { name: 'Mistral Medium', price: '$1.50', provider: 'Mistral' },
    { name: 'Grok 4.3', price: '$1.25', provider: 'xAI' },
  ];
  const doubled = [...models, ...models];
  return (
    <div className="overflow-hidden w-full py-4 relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(to right, #05050A, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(to left, #05050A, transparent)' }} />
      <div className="flex">
        <div className="marquee-track flex gap-4 items-center">
          {doubled.map((m, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
              <span className="text-xs text-white/50">{m.name}</span>
              <span className="text-xs font-bold text-brand-green font-mono">{m.price}</span>
              <span className="text-[9px] text-white/20">/1M</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* â”€â”€ Pricing tiers â”€â”€ */
const TIERS = [
  {
    name: 'Gratis',
    tagline: 'Model gratis tanpa biaya',
    price: '$0',
    period: 'selamanya',
    color: 'brand-green',
    colorHex: '#34C759',
    features: [
      'Model :free (Llama, Gemma, Phi, dll.)',
      'Cloudflare Workers AI gratis',
      'Enkripsi API key lokal',
      'Chat unlimited',
      'Tanpa registrasi',
      'Community support',
    ],
    cta: 'Mulai Gratis',
    href: '/chat',
    popular: false,
  },
  {
    name: 'BYOK',
    tagline: 'Bawa kunci sendiri, bayar langsung ke provider',
    price: 'Pay-as-you-go',
    period: 'ke provider',
    color: 'brand-blue',
    colorHex: '#5AC8FA',
    features: [
      'Semua 400+ model',
      '60+ provider',
      'Streaming real-time',
      'Model selector pintar',
      'Enkripsi AES-GCM',
      'Zero data logging',
      'Priority routing',
      'Custom temperature',
    ],
    cta: 'Masukkan API Key',
    href: '/api-njir',
    popular: true,
  },
  {
    name: 'Enterprise',
    tagline: 'Untuk tim dan organisasi',
    price: 'Kustom',
    period: 'hubungi kami',
    color: 'brand-amber',
    colorHex: '#FF9500',
    features: [
      'Semua fitur BYOK',
      'Team management',
      'Usage analytics',
      'SSO / SAML',
      'SLA guarantee',
      'Dedicated support',
      'Custom data policies',
      'Audit logs',
    ],
    cta: 'Hubungi Kami',
    href: 'mailto:hello@njirlah.ai',
    popular: false,
  },
];

/* â”€â”€ Animation #14: Pricing card â”€â”€ */
function PricingCard({ tier, index }: { tier: typeof TIERS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: 'spring', damping: 22 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-2xl p-6 flex flex-col transition-all ${
        tier.popular
          ? 'glass border-2 border-brand-blue/30 shadow-lg shadow-brand-blue/5'
          : 'glass-card'
      }`}
    >
      {/* Popular badge */}
      {tier.popular && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-blue text-[#05050A] text-[10px] font-bold tracking-wider">
          PALING POPULER
        </motion.div>
      )}

      {/* Animation #15: Glow overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: `radial-gradient(ellipse at top, ${tier.colorHex}08 0%, transparent 70%)` }}
          />
        )}
      </AnimatePresence>

      <div className="mb-6">
        <h3 className={`text-lg font-bold font-heading text-${tier.color}`}>{tier.name}</h3>
        <p className="text-[11px] text-white/30 mt-1">{tier.tagline}</p>
      </div>

      <div className="mb-6">
        <span className="text-3xl font-black font-heading text-white">{tier.price}</span>
        <span className="text-sm text-white/30 ml-2">{tier.period}</span>
      </div>

      <div className="flex-1 space-y-2.5 mb-6">
        {tier.features.map((feature, i) => (
          <motion.div key={feature}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.04 }}
            className="flex items-start gap-2">
            <Check size={12} className={`text-${tier.color} flex-shrink-0 mt-0.5`} />
            <span className="text-xs text-white/50">{feature}</span>
          </motion.div>
        ))}
      </div>

      <Link href={tier.href}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
            tier.popular
              ? 'bg-brand-blue text-[#05050A] hover:bg-brand-blue/90'
              : `bg-${tier.color}/10 border border-${tier.color}/25 text-${tier.color} hover:bg-${tier.color}/20`
          }`}>
          {tier.cta}
          <ArrowRight size={13} />
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* â”€â”€ FAQ â”€â”€ */
const FAQS = [
  { q: 'Apakah NJIRLAH AI gratis?', a: 'Ya! Kamu bisa menggunakan model gratis (model :free dari OpenRouter dan model Cloudflare Workers AI) tanpa biaya sama sekali. Untuk model premium, kamu perlu API key dari provider yang bersangkutan.' },
  { q: 'Bagaimana cara pembayarannya?', a: 'NJIRLAH AI menggunakan model BYOK (Bring Your Own Key). Kamu membayar langsung ke provider AI seperti OpenRouter, OpenAI, atau Anthropic. Kami tidak memproses pembayaran apa pun.' },
  { q: 'Apakah API key saya aman?', a: 'Sangat aman. Semua API key dienkripsi menggunakan AES-GCM di browser-mu dan disimpan di localStorage. Kunci tidak pernah dikirim ke server kami.' },
  { q: 'Berapa banyak model yang tersedia?', a: 'Lebih dari 400 model dari 60+ provider, termasuk GPT-5.5, Claude Opus 4.7, Gemini 3.1 Pro, DeepSeek V4, Llama 3.3, dan banyak lagi.' },
  { q: 'Bisa pakai Ollama lokal?', a: 'Tentu! Gunakan tab Custom Provider di halaman API Keys, masukkan base URL Ollama (http://localhost:11434/v1) dan mulai chat.' },
];

/* â”€â”€ Animation #16: FAQ accordion â”€â”€ */
function FAQItem({ faq, index }: { faq: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-white/[0.06]"
    >
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-4 text-left group">
        <span className="text-sm text-white/70 group-hover:text-white transition-colors pr-4">{faq.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ type: 'spring', damping: 20 }}>
          <ChevronDown size={14} className="text-white/25 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-white/35 pb-4 leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#05050A] text-white relative">
      <TopNav />
      <FloatingParticles />

      <div className="relative z-10 pt-14">
        {/* â”€â”€ Hero â”€â”€ */}
        <section className="py-16 px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 22 }}>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="text-4xl mb-4 select-none">ðŸ’Ž</motion.div>
            <h1 className="text-3xl md:text-5xl font-black font-heading mb-3">
              Harga <span className="gradient-text">Transparan</span>
            </h1>
            <p className="text-white/40 text-base max-w-lg mx-auto">
              Bayar langsung ke provider. Tidak ada markup, tidak ada biaya tersembunyi.
            </p>
          </motion.div>

          {/* Price ticker */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mt-6">
            <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2">Harga per 1M token input</p>
            <PriceTicker />
          </motion.div>
        </section>

        {/* â”€â”€ Pricing cards â”€â”€ */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier, i) => (
              <PricingCard key={tier.name} tier={tier} index={i} />
            ))}
          </div>
        </section>

        {/* â”€â”€ Comparison table â”€â”€ */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xl font-black font-heading text-center mb-8">
              Perbandingan <span className="gradient-text">Fitur</span>
            </motion.h2>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="grid grid-cols-4 gap-0 text-center text-xs">
                <div className="p-3 border-b border-r border-white/[0.06] text-white/25">Fitur</div>
                <div className="p-3 border-b border-r border-white/[0.06] text-brand-green font-semibold">Gratis</div>
                <div className="p-3 border-b border-r border-white/[0.06] text-brand-blue font-semibold">BYOK</div>
                <div className="p-3 border-b border-white/[0.06] text-brand-amber font-semibold">Enterprise</div>
                {[
                  ['Model gratis', 'âœ“', 'âœ“', 'âœ“'],
                  ['Model premium', 'â€”', 'âœ“', 'âœ“'],
                  ['400+ model', 'â€”', 'âœ“', 'âœ“'],
                  ['Streaming', 'âœ“', 'âœ“', 'âœ“'],
                  ['Enkripsi AES-GCM', 'âœ“', 'âœ“', 'âœ“'],
                  ['Custom provider', 'â€”', 'âœ“', 'âœ“'],
                  ['Team management', 'â€”', 'â€”', 'âœ“'],
                  ['SSO / SAML', 'â€”', 'â€”', 'âœ“'],
                  ['SLA guarantee', 'â€”', 'â€”', 'âœ“'],
                  ['Dedicated support', 'â€”', 'â€”', 'âœ“'],
                ].map((row, ri) => (
                  <motion.div key={ri} className="contents"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ delay: ri * 0.03 }}>
                    <div className="p-3 border-b border-r border-white/[0.06] text-white/40 text-left">{row[0]}</div>
                    {row.slice(1).map((cell, ci) => (
                      <div key={ci} className={`p-3 border-b ${ci < 2 ? 'border-r' : ''} border-white/[0.06] ${cell === 'âœ“' ? 'text-brand-green' : 'text-white/15'}`}>
                        {cell}
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* â”€â”€ FAQ â”€â”€ */}
        <section className="px-4 pb-20">
          <div className="max-w-2xl mx-auto">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xl font-black font-heading text-center mb-8">
              <span className="gradient-text">FAQ</span>
            </motion.h2>
            <div>
              {FAQS.map((faq, i) => (
                <FAQItem key={i} faq={faq} index={i} />
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
