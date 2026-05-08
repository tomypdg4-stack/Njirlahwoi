'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { TOTAL_MODELS_CLAIM, TOTAL_PROVIDERS_CLAIM, TOTAL_ENDPOINTS_CLAIM, TOTAL_FREE_CLAIM } from '@/lib/providers';

const NeuralParticles = dynamic(() => import('@/components/webgl/NeuralParticles'), { ssr: false });

function useCountUp(target: number, duration: number = 2500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function NumberScramble({ value, suffix = '' }: { value: number; suffix?: string }) {
  const { count, ref } = useCountUp(value);
  const display = count >= 1000000 ? `${(count / 1000000).toFixed(0)}M` : count >= 1000 ? `${(count / 1000).toFixed(0)}K` : count.toLocaleString();
  return (
    <div ref={ref} className="text-3xl md:text-4xl font-black font-heading text-white tabular-nums">
      {display}{suffix}
    </div>
  );
}

const HEADLINE = '✦ THE UNIVERSE OF AI MODELS';

export default function HeroSection() {
  const stats = [
    { value: TOTAL_MODELS_CLAIM, label: 'Models', suffix: '+' },
    { value: TOTAL_PROVIDERS_CLAIM, label: 'Providers', suffix: '+' },
    { value: TOTAL_ENDPOINTS_CLAIM, label: 'Endpoints', suffix: '+' },
    { value: TOTAL_FREE_CLAIM, label: 'Free Models', suffix: '+' },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 rounded-3xl border border-white/[0.04] bg-gradient-to-b from-[#010108] to-[#0A0A1A] mb-8">
      <NeuralParticles />
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <div className="overflow-hidden mb-4">
          <div className="flex justify-center flex-wrap">
            {HEADLINE.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.03, type: 'spring', stiffness: 200, damping: 20 }}
                className="text-xs md:text-sm tracking-[0.3em] text-[#7C3AED] font-bold uppercase"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 22 }}
          className="text-3xl md:text-5xl lg:text-6xl font-black font-heading text-white mb-3 leading-tight"
        >
          Every LLM. Every Provider.
          <br />
          <span className="bg-gradient-to-r from-[#7C3AED] via-[#06B6D4] to-[#F43F5E] bg-clip-text text-transparent">
            One Command Center.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-white/35 text-sm md:text-base max-w-xl mx-auto mb-10"
        >
          Explore, compare, and configure every AI model from 200+ providers — all in one place.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1, type: 'spring', stiffness: 200, damping: 22 }}
              className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 md:p-5"
            >
              <NumberScramble value={s.value} suffix={s.suffix} />
              <div className="text-[11px] text-white/30 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
