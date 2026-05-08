'use client';
import { motion } from 'framer-motion';
import { ExternalLink, Settings, ChevronRight } from 'lucide-react';
import StatusDot from './StatusDot';
import { ProviderInfo } from '@/lib/providers/types';
import { ALL_MODELS } from '@/lib/providers';

interface Props {
  provider: ProviderInfo;
  index: number;
  onConfigure: () => void;
  onViewModels: () => void;
}

export default function ProviderCard({ provider, index, onConfigure, onViewModels }: Props) {
  const models = ALL_MODELS.filter(m => m.providerId === provider.id);
  const freeModels = models.filter(m => m.isFree || (m.inputPrice === 0 && m.outputPrice === 0));
  const minPrice = models.reduce((min, m) => Math.min(min, m.inputPrice ?? Infinity), Infinity);
  const maxPrice = models.reduce((max, m) => Math.max(max, m.inputPrice ?? 0), 0);
  const maxContext = models.reduce((max, m) => Math.max(max, m.context), 0);
  const initials = provider.name.slice(0, 2).toUpperCase();

  const formatCtx = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(0)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.08, 1), type: 'spring', stiffness: 300, damping: 24 }}
      whileHover={{ scale: 1.02 }}
      className="group relative rounded-2xl border bg-white/[0.02] backdrop-blur-sm p-5 cursor-pointer transition-all duration-200"
      style={{ borderColor: `${provider.color}20` }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${provider.color}15, 0 0 60px ${provider.color}08`;
        (e.currentTarget as HTMLDivElement).style.borderColor = `${provider.color}40`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLDivElement).style.borderColor = `${provider.color}20`;
      }}
      onClick={onViewModels}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
            style={{ backgroundColor: `${provider.color}15`, color: provider.color, border: `1px solid ${provider.color}25` }}
          >
            {initials}
          </motion.div>
          <div>
            <h3 className="text-sm font-semibold text-white">{provider.name}</h3>
            <p className="text-[10px] text-white/30 truncate max-w-[160px]">{provider.description}</p>
          </div>
        </div>
        <StatusDot status={freeModels.length > 0 ? 'connected' : 'unconfigured'} />
      </div>

      <div className="h-px bg-white/[0.06] my-3" />

      <div className="flex items-center gap-4 text-[11px] text-white/40">
        <span>{models.length} models</span>
        <span>·</span>
        <span>{minPrice === 0 && freeModels.length > 0 ? 'Free' : `$${minPrice.toFixed(2)}`} – ${maxPrice.toFixed(0)}/M</span>
      </div>
      <div className="text-[10px] text-white/25 mt-1">Context: up to {formatCtx(maxContext)}</div>

      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={(e) => { e.stopPropagation(); onConfigure(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all"
        >
          <Settings size={10} /> Configure
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onViewModels(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] text-white/50 hover:text-white transition-all ml-auto"
        >
          View All <ChevronRight size={10} />
        </button>
      </div>
    </motion.div>
  );
}
