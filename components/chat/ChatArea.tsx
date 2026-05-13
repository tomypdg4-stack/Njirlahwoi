'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring as useFramerSpring } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { ArrowDown, Sparkles, Key, Zap, Code as Code2, Globe, Cpu, Activity } from 'lucide-react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import SkeletonBubble from '@/components/ui/SkeletonBubble';
import { Message, useChatStore } from '@/store/chat-store';
import { useApiKeyStore } from '@/store/api-key-store';

/* ── Prompt suggestions (animated stagger) ── */
const PROMPTS = [
  { icon: <Code2 size={12} />, text: 'Tulis fungsi Python sorting', color: 'amber' },
  { icon: <Cpu size={12} />,   text: 'Jelaskan neural network',     color: 'blue' },
  { icon: <Globe size={12} />, text: 'Cara deploy app ke Vercel?',  color: 'green' },
  { icon: <Sparkles size={12} />, text: 'Tulis puisi teknologi',    color: 'pistachio' },
  { icon: <Code2 size={12} />, text: 'Debug kode TypeScript ini',   color: 'amber' },
  { icon: <Cpu size={12} />,   text: 'Bedanya AI, ML, Deep Learning?', color: 'blue' },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  amber:     { bg: 'hover:bg-brand-amber/8',     border: 'hover:border-brand-amber/25',     text: 'hover:text-white', icon: 'text-brand-amber' },
  blue:      { bg: 'hover:bg-brand-blue/8',      border: 'hover:border-brand-blue/25',      text: 'hover:text-white', icon: 'text-brand-blue' },
  green:     { bg: 'hover:bg-brand-green/8',     border: 'hover:border-brand-green/25',     text: 'hover:text-white', icon: 'text-brand-green' },
  pistachio: { bg: 'hover:bg-brand-pistachio/8', border: 'hover:border-brand-pistachio/25', text: 'hover:text-white', icon: 'text-brand-pistachio' },
};

/* ── Animated follow-pointer glow (animation #13) ── */
function PointerGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [spring, api] = useSpring(() => ({ x: -200, y: -200, config: { tension: 120, friction: 26 } }));

  useEffect(() => {
    const move = (e: MouseEvent) => {
      api.start({ x: e.clientX - 150, y: e.clientY - 150 });
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [api]);

  return (
    <animated.div
      style={{ left: spring.x, top: spring.y }}
      className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-0"
      aria-hidden
    >
      <div className="w-full h-full rounded-full bg-brand-blue/5 blur-3xl" />
    </animated.div>
  );
}

/* ── Provider marquee (OpenRouter-style, animation #16 + motion along path concept) ── */
const PROVIDERS = [
  'OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral', 'DeepSeek',
  'xAI', 'Cohere', 'Qwen', 'Groq', 'Perplexity', 'Fireworks',
];

function ProviderMarquee() {
  const doubled = [...PROVIDERS, ...PROVIDERS];
  return (
    <div className="overflow-hidden w-full max-w-lg mx-auto mb-6">
      <div className="flex">
        <div className="marquee-track flex gap-3">
          {doubled.map((p, i) => (
            <span
              key={i}
              className="px-2.5 py-1 text-[10px] rounded-full bg-white/[0.04] border border-white/[0.07] text-white/30 whitespace-nowrap flex-shrink-0"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Stat counter with scroll reveal (animation #41) ── */
function MiniStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', damping: 22 }}
      className="text-center"
    >
      <p className="text-lg font-black font-heading gradient-text">{value}</p>
      <p className="text-[10px] text-white/25 uppercase tracking-wider mt-0.5">{label}</p>
    </motion.div>
  );
}

interface ChatAreaProps {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  onSend: (text: string) => void;
  onRegenerate?: (msgId: string) => void;
  onOpenApiKey?: () => void;
}

/* ── Stagger container variants (animation #38) ── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const promptVariants = {
  hidden:  { opacity: 0, y: 10, scale: 0.94 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { type: 'spring' as const, damping: 22, stiffness: 300 } },
};

export default function ChatArea({
  messages, isStreaming, streamingContent, onSend, onRegenerate, onOpenApiKey,
}: ChatAreaProps) {
  const scrollRef    = useRef<HTMLDivElement>(null);
  const bottomRef    = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [showScrollBtn, setShowScrollBtn]   = useState(false);

  const { setLike, activeChatId, selectedProvider } = useChatStore();
  const { hasKey } = useApiKeyStore();

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
    setUserScrolledUp(false);
    setShowScrollBtn(false);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
      setUserScrolledUp(dist > 80);
      setShowScrollBtn(dist > 80 && messages.length > 0);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [messages.length]);

  useEffect(() => { if (!userScrolledUp) scrollToBottom('smooth'); }, [streamingContent, userScrolledUp, scrollToBottom]);
  useEffect(() => { if (!userScrolledUp) scrollToBottom('smooth'); }, [messages.length, userScrolledUp, scrollToBottom]);

  /* ── Empty / welcome state ── */
  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center overflow-y-auto relative">
        <PointerGlow />

        {/* Floating unicorn (animation #6 keyframe loop) */}
        <motion.div
          animate={{ y: [0, -16, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-5xl sm:text-6xl mb-5 select-none relative z-10"
        >
          🦄
        </motion.div>

        {/* Split text headline (animation #19) */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.06 }}
          className="text-3xl sm:text-4xl font-black font-heading mb-2 relative z-10"
          aria-label="NJIRLAH AI"
        >
          {'NJIRLAH AI'.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.04, type: 'spring', damping: 18 }}
              className={char === ' ' ? 'mr-2' : 'inline-block gradient-text'}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/35 text-sm mb-2 relative z-10"
        >
          Multi-model AI · BYOK · Open-source vibe
        </motion.p>

        {/* Apple Intelligence ripple ring (animation #45) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="relative mb-6 z-10"
        >
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs ${
            selectedProvider === 'cloudflare' || hasKey()
              ? 'bg-brand-green/8 border-brand-green/20 text-brand-green'
              : 'bg-brand-amber/8 border-brand-amber/20 text-brand-amber'
          }`}>
            {/* Multi-state badge dot (animation #33) */}
            <motion.div
              className={`relative w-2 h-2`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className={`absolute inset-0 rounded-full ${selectedProvider === 'cloudflare' || hasKey() ? 'bg-brand-green' : 'bg-brand-amber'} animate-ping opacity-50`} />
              <span className={`relative block w-2 h-2 rounded-full ${selectedProvider === 'cloudflare' || hasKey() ? 'bg-brand-green' : 'bg-brand-amber'}`} />
            </motion.div>
            {selectedProvider === 'cloudflare'
              ? 'Cloudflare aktif · Langsung mulai!'
              : hasKey()
              ? 'OpenRouter tersambung'
              : 'Butuh API Key'}
          </div>
          {/* Ripple rings */}
          {[1, 2].map((n) => (
            <motion.div
              key={n}
              className={`absolute inset-0 rounded-full border ${
                selectedProvider === 'cloudflare' || hasKey() ? 'border-brand-green/20' : 'border-brand-amber/20'
              }`}
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: 1 + n * 0.5, opacity: 0 }}
              transition={{ duration: 2, delay: n * 0.5, repeat: Infinity }}
            />
          ))}
        </motion.div>

        {!hasKey() && selectedProvider === 'openrouter' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            onClick={onOpenApiKey}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mb-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue/10 border border-brand-blue/25 text-brand-blue text-sm hover:bg-brand-blue/18 transition-all relative z-10"
          >
            <Key size={13} />
            Masukkan OpenRouter API Key
          </motion.button>
        )}

        {/* Provider marquee (animation #16) */}
        <ProviderMarquee />

        {/* Prompt suggestions with stagger (animation #38) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-w-2xl w-full mb-8 relative z-10"
        >
          {PROMPTS.map((prompt, i) => {
            const c = COLOR_MAP[prompt.color] ?? COLOR_MAP.blue;
            return (
              <motion.button
                key={i}
                variants={promptVariants}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSend(prompt.text)}
                className={`group flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-white/45 ${c.text} ${c.bg} ${c.border} transition-all text-left`}
              >
                {/* Material Design ripple effect (animation #15) */}
                <span className={`flex-shrink-0 ${c.icon} transition-colors group-hover:scale-110`}>{prompt.icon}</span>
                <span className="leading-snug">{prompt.text}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Stats (OpenRouter-style) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex items-center gap-10 relative z-10"
        >
          <MiniStat value="400+" label="Model" />
          <MiniStat value="60+"  label="Provider" />
          <MiniStat value="GRATIS" label="CF Models" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 min-h-0 flex flex-col">
      {/* Streaming progress bar (animation #23) */}
      <AnimatePresence>
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 right-0 h-0.5 z-20 overflow-hidden"
          >
            <div className="progress-bar-blue w-full" />
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 px-2 sm:px-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              onRegenerate={msg.role === 'assistant' && onRegenerate ? () => onRegenerate(msg.id) : undefined}
              onLike={
                msg.role === 'assistant' && activeChatId
                  ? (liked) => setLike(activeChatId, msg.id, liked)
                  : undefined
              }
            />
          ))}
        </AnimatePresence>

        {isStreaming && streamingContent && (
          <ChatBubble
            message={{ id: 'streaming', role: 'assistant', content: streamingContent, timestamp: Date.now() }}
            streaming
          />
        )}
        {isStreaming && !streamingContent && <SkeletonBubble />}

        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Scroll-to-bottom pill (animation #1 spring) */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            transition={{ type: 'spring', damping: 22, stiffness: 360 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-blue/25 text-xs text-brand-blue hover:text-white hover:border-brand-blue/50 shadow-xl transition-all z-10"
          >
            <ArrowDown size={11} />
            <span className="hidden sm:inline">Scroll ke bawah</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
