'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ProviderCard from './ProviderCard';
import { ALL_PROVIDERS } from '@/lib/providers';
import { useModelsPageStore } from '@/store/models-page-store';

export default function ProviderGrid() {
  const [showAll, setShowAll] = useState(false);
  const { toggleProvider, setConfigModalProvider } = useModelsPageStore();
  const visible = showAll ? ALL_PROVIDERS : ALL_PROVIDERS.slice(0, 12);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white font-heading">All Providers</h2>
        <span className="text-xs text-white/25">{ALL_PROVIDERS.length} providers</span>
      </div>

      {/* Marquee */}
      <div className="overflow-hidden mb-6 py-3 group">
        <motion.div
          className="flex gap-4 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ willChange: 'transform' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running'; }}
        >
          {[...ALL_PROVIDERS, ...ALL_PROVIDERS].map((p, i) => (
            <div key={`${p.id}-${i}`} className="flex-shrink-0 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black" style={{ backgroundColor: `${p.color}15`, color: p.color }}>
                {p.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-[11px] text-white/40">{p.name}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visible.map((p, i) => (
          <ProviderCard
            key={p.id}
            provider={p}
            index={i}
            onConfigure={() => setConfigModalProvider(p.id)}
            onViewModels={() => toggleProvider(p.id)}
          />
        ))}
      </div>

      {ALL_PROVIDERS.length > 12 && (
        <div className="text-center mt-6">
          <button onClick={() => setShowAll(!showAll)}
            className="px-6 py-2.5 rounded-xl text-xs text-white/50 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-all"
          >
            {showAll ? 'Show Less' : `Show All ${ALL_PROVIDERS.length} Providers`}
          </button>
        </div>
      )}
    </section>
  );
}
