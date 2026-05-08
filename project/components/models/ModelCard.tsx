'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, GitCompare, ExternalLink } from 'lucide-react';
import CapabilityBadge from './CapabilityBadge';
import EndpointDisplay from './EndpointDisplay';
import CodeSnippet from './CodeSnippet';
import { ModelInfo, ALL_PROVIDERS } from '@/lib/providers';
import { useModelsPageStore } from '@/store/models-page-store';

interface Props { model: ModelInfo; index: number; }

export default function ModelCard({ model, index }: Props) {
  const { expandedModel, setExpandedModel, toggleCompare, compareList } = useModelsPageStore();
  const isExpanded = expandedModel === model.id;
  const isComparing = compareList.includes(model.id);
  const provider = ALL_PROVIDERS.find(p => p.id === model.providerId);
  const formatCtx = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(0)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : n === 0 ? '—' : String(n);
  const formatPrice = (p: number | null) => p === null ? '—' : p === 0 ? 'Free' : `$${p}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.8), type: 'spring', stiffness: 300, damping: 24 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.12] transition-colors"
    >
      <div className="p-4 cursor-pointer" onClick={() => setExpandedModel(isExpanded ? null : model.id)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: `${provider?.color || '#666'}15`, color: provider?.color || '#888' }}>
              {model.providerId.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">{model.name}</h3>
                {model.isNew && <span className="px-1.5 py-0.5 text-[8px] rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4] font-bold">NEW</span>}
                {model.isFree && <span className="px-1.5 py-0.5 text-[8px] rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-bold">FREE</span>}
              </div>
              <p className="text-[10px] text-white/30 font-mono">{model.providerId} / {model.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); toggleCompare(model.id); }}
              className={`p-1.5 rounded-lg transition-colors ${isComparing ? 'bg-[#7C3AED]/20 text-[#7C3AED]' : 'text-white/20 hover:text-white/50 hover:bg-white/[0.04]'}`}
            >
              <GitCompare size={13} />
            </button>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} className="text-white/30" />
            </motion.div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {model.capabilities.map(c => <CapabilityBadge key={c} capability={c} />)}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3 text-center">
          <div><div className="text-[10px] text-white/25">Context</div><div className="text-xs text-white/60 font-mono">{formatCtx(model.context)}</div></div>
          <div><div className="text-[10px] text-white/25">Input</div><div className="text-xs text-white/60 font-mono">{formatPrice(model.inputPrice)}/M</div></div>
          <div><div className="text-[10px] text-white/25">Output</div><div className="text-xs text-white/60 font-mono">{formatPrice(model.outputPrice)}/M</div></div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/[0.06] pt-3">
              <EndpointDisplay endpoint={model.endpoint} auth={model.authExample} />
              <CodeSnippet modelId={model.id} endpoint={model.endpoint} authExample={model.authExample} />
              {model.parameters && <div className="text-[11px] text-white/30">Parameters: <span className="text-white/50">{model.parameters}</span></div>}
              <div className="flex items-center gap-2 text-[10px]">
                <span className={`px-2 py-0.5 rounded-full ${model.isOpenSource ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'bg-white/[0.04] text-white/30 border border-white/[0.06]'}`}>
                  {model.isOpenSource ? 'Open Source' : 'Proprietary'}
                </span>
                <span className="text-white/25">License: {model.license}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
