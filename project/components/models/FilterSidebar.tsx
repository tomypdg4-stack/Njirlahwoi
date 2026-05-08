'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import { useModelsPageStore } from '@/store/models-page-store';
import { ALL_PROVIDERS, Capability } from '@/lib/providers';

const CAPABILITIES: { key: Capability; label: string; emoji: string }[] = [
  { key: 'text', label: 'Text', emoji: '📝' },
  { key: 'vision', label: 'Vision', emoji: '👁' },
  { key: 'audio', label: 'Audio', emoji: '🎵' },
  { key: 'code', label: 'Code', emoji: '💻' },
  { key: 'reasoning', label: 'Reasoning', emoji: '🧠' },
  { key: 'image-gen', label: 'Image Gen', emoji: '🎨' },
  { key: 'embedding', label: 'Embedding', emoji: '📊' },
  { key: 'function-calling', label: 'Functions', emoji: '🔧' },
];

function FilterContent() {
  const {
    selectedProviders, toggleProvider, selectedCapabilities, toggleCapability,
    resetFilters, models,
  } = useModelsPageStore();

  const providerCounts = ALL_PROVIDERS.map(p => ({
    ...p, count: models.filter(m => m.providerId === p.id).length,
  })).filter(p => p.count > 0);

  return (
    <div className="space-y-6">
      {(selectedProviders.length > 0 || selectedCapabilities.length > 0) && (
        <button onClick={resetFilters} className="flex items-center gap-1.5 text-[11px] text-[#F43F5E] hover:text-white transition-colors">
          <RotateCcw size={11} /> Reset Filters
        </button>
      )}

      <div>
        <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2">Provider</p>
        <div className="space-y-0.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
          {providerCounts.map(p => {
            const active = selectedProviders.includes(p.id);
            return (
              <button key={p.id} onClick={() => toggleProvider(p.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left ${active ? 'bg-white/[0.06] text-white' : 'hover:bg-white/[0.03] text-white/40'}`}
              >
                <div className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${active ? 'border-[#7C3AED] bg-[#7C3AED]' : 'border-white/[0.15] bg-white/[0.04]'}`}>
                  {active && <Check size={9} className="text-white" />}
                </div>
                <span className="text-xs truncate flex-1">{p.name}</span>
                <span className="text-[10px] text-white/20">{p.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2">Capability</p>
        <div className="space-y-0.5">
          {CAPABILITIES.map(c => {
            const active = selectedCapabilities.includes(c.key);
            return (
              <button key={c.key} onClick={() => toggleCapability(c.key)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left ${active ? 'bg-white/[0.06] text-white' : 'hover:bg-white/[0.03] text-white/40'}`}
              >
                <div className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${active ? 'border-[#06B6D4] bg-[#06B6D4]' : 'border-white/[0.15] bg-white/[0.04]'}`}>
                  {active && <Check size={9} className="text-white" />}
                </div>
                <span className="text-xs">{c.emoji} {c.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function DesktopFilterSidebar() {
  return (
    <div className="sticky top-20">
      <p className="text-[10px] text-white/25 uppercase tracking-widest flex items-center gap-1.5 mb-4">
        <Filter size={10} /> Filters
      </p>
      <FilterContent />
    </div>
  );
}

export default function FilterSidebar() {
  const { isFilterOpen, setIsFilterOpen } = useModelsPageStore();

  return (
    <AnimatePresence>
      {isFilterOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          />
          <motion.aside
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#0A0A1A]/95 backdrop-blur-xl border-r border-white/[0.06] z-50 overflow-y-auto p-5 lg:hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-semibold text-white flex items-center gap-2"><Filter size={14} /> Filters</span>
              <button onClick={() => setIsFilterOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40"><X size={16} /></button>
            </div>
            <FilterContent />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
