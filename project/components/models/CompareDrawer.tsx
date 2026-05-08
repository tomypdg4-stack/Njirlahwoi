'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitCompare } from 'lucide-react';
import { useModelsPageStore } from '@/store/models-page-store';
import { ALL_MODELS, ALL_PROVIDERS } from '@/lib/providers';
import CapabilityBadge from './CapabilityBadge';

export default function CompareDrawer() {
  const { compareList, toggleCompare } = useModelsPageStore();
  const models = compareList.map(id => ALL_MODELS.find(m => m.id === id)).filter(Boolean);
  if (models.length === 0) return null;

  const formatCtx = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(0)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : n === 0 ? '—' : String(n);
  const formatPrice = (p: number | null) => p === null ? '—' : p === 0 ? 'Free' : `$${p}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A1A]/95 backdrop-blur-xl border-t border-white/[0.08] p-4"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white flex items-center gap-2">
              <GitCompare size={14} className="text-[#7C3AED]" /> Compare ({models.length}/4)
            </span>
            <button onClick={() => models.forEach(m => m && toggleCompare(m.id))} className="text-[11px] text-white/40 hover:text-white">Clear all</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {models.map(m => {
              if (!m) return null;
              const prov = ALL_PROVIDERS.find(p => p.id === m.providerId);
              return (
                <div key={m.id} className="relative rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                  <button onClick={() => toggleCompare(m.id)} className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/[0.06] text-white/30"><X size={12} /></button>
                  <div className="text-xs font-medium text-white mb-1">{m.name}</div>
                  <div className="text-[10px] text-white/30 mb-2">{prov?.name}</div>
                  <div className="grid grid-cols-3 gap-1 text-center text-[10px] mb-2">
                    <div><span className="text-white/20">Ctx</span><br/><span className="text-white/50">{formatCtx(m.context)}</span></div>
                    <div><span className="text-white/20">In</span><br/><span className="text-white/50">{formatPrice(m.inputPrice)}</span></div>
                    <div><span className="text-white/20">Out</span><br/><span className="text-white/50">{formatPrice(m.outputPrice)}</span></div>
                  </div>
                  <div className="flex flex-wrap gap-1">{m.capabilities.slice(0, 3).map(c => <CapabilityBadge key={c} capability={c} />)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
