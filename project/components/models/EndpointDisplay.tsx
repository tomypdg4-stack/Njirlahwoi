'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EndpointDisplay({ endpoint, auth }: { endpoint: string; auth: string }) {
  const [copied, setCopied] = useState<'endpoint' | 'auth' | null>(null);

  const copy = async (text: string, type: 'endpoint' | 'auth') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-2 text-xs font-mono">
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] group">
        <span className="text-[#06B6D4]/70 flex-shrink-0">🔗</span>
        <span className="text-white/50 truncate flex-1">{endpoint}</span>
        <button onClick={() => copy(endpoint, 'endpoint')} className="flex-shrink-0 p-1 rounded-lg hover:bg-white/[0.06] transition-colors">
          <AnimatePresence mode="wait">
            {copied === 'endpoint' ? (
              <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check size={12} className="text-[#10B981]" />
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Copy size={12} className="text-white/30 group-hover:text-white/60" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] group">
        <span className="text-[#F59E0B]/70 flex-shrink-0">🔑</span>
        <span className="text-white/40 truncate flex-1">{auth}</span>
        <button onClick={() => copy(auth, 'auth')} className="flex-shrink-0 p-1 rounded-lg hover:bg-white/[0.06] transition-colors">
          <AnimatePresence mode="wait">
            {copied === 'auth' ? (
              <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check size={12} className="text-[#10B981]" />
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Copy size={12} className="text-white/30 group-hover:text-white/60" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
