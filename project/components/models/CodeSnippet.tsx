'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  modelId: string;
  endpoint: string;
  authExample: string;
}

const TABS = ['cURL', 'Python', 'JavaScript'] as const;

function generateCode(tab: typeof TABS[number], modelId: string, endpoint: string, authExample: string): string {
  const isBearer = authExample.toLowerCase().includes('bearer');
  const headerKey = isBearer ? 'Authorization' : authExample.split(':')[0]?.trim() || 'Authorization';
  const headerVal = isBearer ? 'Bearer YOUR_API_KEY' : authExample.split(':').slice(1).join(':')?.trim() || 'YOUR_API_KEY';

  if (tab === 'cURL') return `curl -X POST "${endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "${headerKey}: ${headerVal}" \\
  -d '{
    "model": "${modelId}",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 1024
  }'`;

  if (tab === 'Python') return `import requests

response = requests.post(
    "${endpoint}",
    headers={
        "Content-Type": "application/json",
        "${headerKey}": "${headerVal}"
    },
    json={
        "model": "${modelId}",
        "messages": [{"role": "user", "content": "Hello!"}],
        "max_tokens": 1024
    }
)
print(response.json())`;

  return `const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "${headerKey}": "${headerVal}"
  },
  body: JSON.stringify({
    model: "${modelId}",
    messages: [{ role: "user", content: "Hello!" }],
    max_tokens: 1024
  })
});
const data = await response.json();
console.log(data);`;
}

export default function CodeSnippet({ modelId, endpoint, authExample }: Props) {
  const [tab, setTab] = useState<typeof TABS[number]>('cURL');
  const [copied, setCopied] = useState(false);
  const code = generateCode(tab, modelId, endpoint, authExample);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0A0A1A] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
        <div className="flex gap-1">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-3 py-1 rounded-lg text-[11px] font-medium transition-colors ${tab === t ? 'text-white' : 'text-white/35 hover:text-white/60'}`}
            >
              {tab === t && (
                <motion.div layoutId="code-tab-pill" className="absolute inset-0 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/30" transition={{ type: 'spring', stiffness: 380, damping: 28 }} />
              )}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] hover:bg-white/[0.06] transition-colors">
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1 text-[#10B981]">
                <Check size={11} /> Copied!
              </motion.span>
            ) : (
              <motion.span key="cp" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1 text-white/40">
                <Copy size={11} /> Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
      <pre className="p-4 text-[11px] leading-relaxed text-white/60 overflow-x-auto font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}
