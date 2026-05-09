'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book, Code2, Key, Zap, ArrowRight, ChevronRight, Copy,
  Check, Terminal, Globe, Shield, Layers, FileText, Cpu,
  MessageSquare, Settings, ExternalLink, Sparkles
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';

/* â”€â”€ Animation #17: Code block with copy â”€â”€ */
function CodeBlock({ code, language = 'javascript', title }: { code: string; language?: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="glass-card rounded-xl overflow-hidden group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-red/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-brand-amber/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-brand-green/50" />
          </div>
          {title && <span className="text-[10px] text-white/20 ml-2 font-mono">{title}</span>}
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-white/25 hover:text-white/60 hover:bg-white/[0.05] transition-all">
          {copied ? <><Check size={10} className="text-brand-green" /> Tersalin</> : <><Copy size={10} /> Salin</>}
        </motion.button>
      </div>
      <pre className="p-4 text-[11px] font-mono text-white/70 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </motion.div>
  );
}

/* â”€â”€ Animation #18: Step card with number â”€â”€ */
function StepCard({ number, title, description, code, children, delay = 0 }: {
  number: string; title: string; description: string; code?: string; children?: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', damping: 22 }}
      className="flex gap-4"
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring', stiffness: 400 }}
          className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue font-black text-sm font-heading">
          {number}
        </motion.div>
        <div className="w-px flex-1 bg-white/[0.06] mt-2" />
      </div>
      <div className="pb-8 min-w-0">
        <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-white/40 mb-4 leading-relaxed">{description}</p>
        {code && <CodeBlock code={code} />}
        {children}
      </div>
    </motion.div>
  );
}

/* â”€â”€ Sidebar nav items â”€â”€ */
const DOC_SECTIONS = [
  { id: 'quickstart', label: 'Quick Start', icon: <Zap size={12} /> },
  { id: 'api-keys', label: 'API Keys', icon: <Key size={12} /> },
  { id: 'providers', label: 'Provider', icon: <Globe size={12} /> },
  { id: 'models', label: 'Model', icon: <Cpu size={12} /> },
  { id: 'streaming', label: 'Streaming', icon: <Layers size={12} /> },
  { id: 'security', label: 'Keamanan', icon: <Shield size={12} /> },
  { id: 'sdk', label: 'SDK & API', icon: <Code2 size={12} /> },
];

/* â”€â”€ Animation #19: Nav item with indicator â”€â”€ */
function NavItem({ section, active, onClick }: { section: typeof DOC_SECTIONS[0]; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all text-left relative ${
        active ? 'text-white bg-white/[0.06]' : 'text-white/35 hover:text-white/60 hover:bg-white/[0.03]'
      }`}>
      {active && (
        <motion.div layoutId="doc-active" className="absolute left-0 top-1 bottom-1 w-0.5 bg-brand-blue rounded-full" />
      )}
      <span className="relative">{section.icon}</span>
      <span className="relative">{section.label}</span>
    </button>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('quickstart');

  return (
    <div className="min-h-screen bg-[#05050A] text-white">
      <TopNav />

      <div className="pt-14 max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="py-10 border-b border-white/[0.06]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 22 }}>
            <div className="flex items-center gap-3 mb-2">
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="text-3xl select-none">ðŸ“š</motion.div>
              <div>
                <h1 className="text-3xl font-black font-heading">
                  <span className="gradient-text">Dokumentasi</span>
                </h1>
                <p className="text-white/35 text-sm mt-1">Panduan lengkap untuk memulai dengan NJIRLAH AI</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex gap-8 py-8">
          {/* Sidebar */}
          <aside className="w-48 flex-shrink-0 hidden lg:block">
            <div className="sticky top-20 space-y-0.5">
              <p className="text-[10px] text-white/20 uppercase tracking-widest mb-3 px-3">Navigasi</p>
              {DOC_SECTIONS.map(section => (
                <NavItem key={section.id} section={section} active={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)} />
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Quick Start */}
            <section id="quickstart" className="mb-16">
              <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="text-2xl font-black font-heading mb-6">
                Quick Start
              </motion.h2>

              <StepCard number="1" title="Dapatkan API Key" delay={0}
                description="Daftar di OpenRouter.ai dan buat API key baru. Kamu bisa mulai dengan model gratis tanpa saldo.">
                <div className="flex gap-2 flex-wrap">
                  <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-blue/10 border border-brand-blue/25 text-brand-blue text-xs hover:bg-brand-blue/20 transition-all">
                    OpenRouter Keys <ExternalLink size={10} />
                  </a>
                  <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-amber/10 border border-brand-amber/25 text-brand-amber text-xs hover:bg-brand-amber/20 transition-all">
                    Cloudflare Dashboard <ExternalLink size={10} />
                  </a>
                </div>
              </StepCard>

              <StepCard number="2" title="Masukkan API Key di NJIRLAH AI" delay={0.1}
                description="Buka halaman API Keys, masukkan kunci. Key-mu dienkripsi dengan AES-GCM dan disimpan di browser â€” tidak pernah menyentuh server.">
                <Link href="/api-njir" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-green/10 border border-brand-green/25 text-brand-green text-xs hover:bg-brand-green/20 transition-all w-fit">
                  Buka API Keys <ArrowRight size={10} />
                </Link>
              </StepCard>

              <StepCard number="3" title="Mulai Chat" delay={0.2}
                description="Pilih model dari 400+ pilihan, buka chat, dan nikmati AI tanpa batas dari satu antarmuka terpadu.">
                <Link href="/chat" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/60 text-xs hover:text-white hover:bg-white/[0.08] transition-all w-fit">
                  <MessageSquare size={10} /> Buka Chat
                </Link>
              </StepCard>
            </section>

            {/* SDK */}
            <section id="sdk" className="mb-16">
              <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="text-2xl font-black font-heading mb-4">
                SDK & API <span className="gradient-text">Reference</span>
              </motion.h2>
              <p className="text-sm text-white/40 mb-6">NJIRLAH AI kompatibel penuh dengan OpenAI SDK. Cukup ganti base URL.</p>

              <div className="space-y-6">
                <CodeBlock title="install.sh" language="bash" code={`npm install openai
# atau
pip install openai`} />

                <CodeBlock title="chat.js" language="javascript" code={`import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://njirlah.ai",
    "X-Title": "NJIRLAH AI",
  },
});

const response = await client.chat.completions.create({
  model: "anthropic/claude-opus-4.7",
  messages: [
    { role: "user", content: "Halo, NJIRLAH!" }
  ],
  stream: true,
});

for await (const chunk of response) {
  const content = chunk.choices[0]?.delta?.content || "";
  process.stdout.write(content);
}`} />

                <CodeBlock title="chat.py" language="python" code={`from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="sk-or-v1-...",
)

response = client.chat.completions.create(
    model="google/gemini-3.1-pro-preview",
    messages=[
        {"role": "user", "content": "Apa itu NJIRLAH AI?"}
    ],
    stream=True,
)

for chunk in response:
    content = chunk.choices[0].delta.content or ""
    print(content, end="")`} />

                <CodeBlock title="curl" language="bash" code={`curl https://openrouter.ai/api/v1/chat/completions \\
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "HTTP-Referer: https://njirlah.ai" \\
  -H "X-Title: NJIRLAH AI" \\
  -d '{
    "model": "openai/gpt-5.5",
    "messages": [
      {"role": "user", "content": "Jelaskan quantum computing"}
    ]
  }'`} />
              </div>
            </section>

            {/* Providers */}
            <section id="providers" className="mb-16">
              <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="text-2xl font-black font-heading mb-4">
                Provider yang <span className="gradient-text">Didukung</span>
              </motion.h2>
              <p className="text-sm text-white/40 mb-6">NJIRLAH AI mendukung 4 kategori provider utama:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'OpenRouter', desc: '300+ model dari 60+ provider lewat satu API key', icon: <Globe size={14} />, color: 'brand-blue', href: '/api-njir' },
                  { name: 'Cloudflare Workers AI', desc: '50+ model gratis di jaringan edge global', icon: <Zap size={14} />, color: 'brand-amber', href: '/api-njir' },
                  { name: 'Alibaba DashScope', desc: 'Qwen, DeepSeek, Llama dari ekosistem Alibaba', icon: <Sparkles size={14} />, color: 'yellow-400', href: '/api-njir' },
                  { name: 'Custom (OpenAI-Compatible)', desc: 'Endpoint apa pun yang kompatibel OpenAI SDK', icon: <Settings size={14} />, color: 'neon-pink', href: '/api-njir' },
                ].map((p, i) => (
                  <motion.div key={p.name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -2 }}
                    className="glass-card rounded-xl p-4 group cursor-pointer">
                    <div className={`w-8 h-8 rounded-lg bg-${p.color}/10 border border-${p.color}/20 flex items-center justify-center text-${p.color} mb-3`}>
                      {p.icon}
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-brand-blue transition-colors">{p.name}</h4>
                    <p className="text-[11px] text-white/30">{p.desc}</p>
                    <Link href={p.href} className="mt-3 flex items-center gap-1 text-[10px] text-brand-blue hover:text-white transition-colors">
                      Konfigurasi <ChevronRight size={9} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Security */}
            <section id="security" className="mb-16">
              <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="text-2xl font-black font-heading mb-4">
                <span className="gradient-text">Keamanan</span>
              </motion.h2>

              <div className="space-y-4">
                {[
                  { icon: <Shield size={14} />, title: 'Enkripsi AES-GCM', desc: 'Semua API key dienkripsi dengan AES-256-GCM menggunakan kunci turunan dari fingerprint browser unikmu.' },
                  { icon: <Key size={14} />, title: 'Zero Server Storage', desc: 'API key tidak pernah meninggalkan browser-mu. Semua disimpan di localStorage yang terenkripsi.' },
                  { icon: <Globe size={14} />, title: 'Direct Provider Connection', desc: 'Request API dikirim langsung ke provider (OpenRouter, Cloudflare, dll) tanpa melalui proxy server kami.' },
                  { icon: <FileText size={14} />, title: 'Open Source Vibe', desc: 'Kode sumber dapat diaudit. Tidak ada tracking, tidak ada analytics, tidak ada data logging.' },
                ].map((item, i) => (
                  <motion.div key={item.title}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 p-4 glass-card rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-[11px] text-white/35 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
