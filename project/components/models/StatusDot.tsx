'use client';
import { motion } from 'framer-motion';

type Status = 'connected' | 'error' | 'unconfigured' | 'checking';

const COLOR_MAP: Record<Status, string> = {
  connected: '#10B981',
  error: '#F43F5E',
  unconfigured: '#6B7280',
  checking: '#F59E0B',
};

export default function StatusDot({ status }: { status: Status }) {
  const color = COLOR_MAP[status];
  return (
    <span className="relative inline-flex items-center justify-center w-3 h-3">
      <span className="absolute w-3 h-3 rounded-full" style={{ backgroundColor: color, opacity: 0.4 }} />
      <motion.span
        className="absolute w-3 h-3 rounded-full"
        style={{ backgroundColor: color, opacity: 0.4 }}
        animate={status === 'connected' ? { scale: [1, 2.2], opacity: [0.6, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
      <span className="relative w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
    </span>
  );
}
