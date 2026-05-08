'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search models, providers...' }: Props) {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <motion.div
      className="relative w-full max-w-md"
      animate={focused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none z-10" />
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={`w-full pl-11 pr-20 py-3 rounded-2xl bg-white/[0.04] border text-sm text-white placeholder-white/25 outline-none transition-all duration-300 ${
          focused
            ? 'border-[#06B6D4]/60 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
            : 'border-white/[0.08] hover:border-white/[0.12]'
        }`}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {value && (
          <button onClick={() => onChange('')} className="p-1 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white transition-colors">
            <X size={14} />
          </button>
        )}
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[10px] text-white/30 font-mono">
          ⌘K
        </kbd>
      </div>
    </motion.div>
  );
}
