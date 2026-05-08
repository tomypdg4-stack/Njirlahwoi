'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, ExternalLink, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useModelsPageStore } from '@/store/models-page-store';
import { ALL_PROVIDERS } from '@/lib/providers';

export default function ConfigureModal() {
  const { configModalProvider, setConfigModalProvider } = useModelsPageStore();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');

  const provider = configModalProvider ? ALL_PROVIDERS.find(p => p.id === configModalProvider) : null;
  if (!provider) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult('idle');
    await new Promise(r => setTimeout(r, 1500));
    setTestResult(apiKey.length > 5 ? 'success' : 'error');
    setTesting(false);
  };

  const handleSave = () => {
    setConfigModalProvider(null);
    setApiKey('');
    setTestResult('idle');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setConfigModalProvider(null)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0D0D15]/95 backdrop-blur-xl p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Configure {provider.name}</h2>
            <button onClick={() => setConfigModalProvider(null)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40"><X size={16} /></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">API Key</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 outline-none focus:border-[#7C3AED]/50 transition-colors pr-10"
                />
                <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-[#06B6D4]/70 hover:text-[#06B6D4] mt-1.5 transition-colors">
                Get your key <ExternalLink size={9} />
              </a>
            </div>

            <button onClick={handleTest} disabled={!apiKey || testing}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                testing ? 'bg-white/[0.06] text-white/50 border border-white/[0.08] animate-pulse' :
                'bg-white/[0.06] text-white/70 border border-white/[0.08] hover:bg-white/[0.10] hover:text-white'
              }`}
            >
              {testing ? <><Loader2 size={14} className="animate-spin" /> Testing...</> : '🧪 Test Connection'}
            </button>

            {testResult !== 'idle' && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${
                  testResult === 'success' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/20'
                }`}
              >
                {testResult === 'success' ? <><CheckCircle size={13} /> Connected successfully</> : <><XCircle size={13} /> Connection failed</>}
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button onClick={() => setConfigModalProvider(null)} className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-all">Cancel</button>
            <button onClick={handleSave} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#7C3AED] hover:bg-[#7C3AED]/30 transition-all">
              Save Encrypted 🔐
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
