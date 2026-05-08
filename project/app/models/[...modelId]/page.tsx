"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TopNav from "@/components/layout/TopNav";
import { Copy, CheckCircle, Terminal, Play, Cpu, Zap, DollarSign, ArrowLeft } from "lucide-react";

export default function ModelSubpage() {
  const params = useParams();
  const router = useRouter();
  const modelId = Array.isArray(params.modelId) ? params.modelId.join("/") : params.modelId;
  const decodedModelId = decodeURIComponent(modelId || "");
  
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`import OpenAI from "openai"\n\nconst openai = new OpenAI({\n  baseURL: "https://openrouter.ai/api/v1",\n  apiKey: process.env.OPENROUTER_API_KEY,\n})\n\nconst completion = await openai.chat.completions.create({\n  model: "${decodedModelId}",\n  messages: [\n    { role: "user", content: "Hello, world!" }\n  ]\n})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getProviderIcon = () => {
    if (decodedModelId.includes("google")) return "/providers/GoogleGemini.svg";
    if (decodedModelId.includes("openai")) return "/providers/OpenAI.svg";
    return "/providers/OpenAI.svg"; // Fallback to OpenAI icon we downloaded
  };

  return (
    <div className="min-h-screen bg-[#050014] text-white selection:bg-fuchsia-500/30 overflow-hidden relative">
      {/* ─── AMBIENT GRID & NEBULA BACKGROUND ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ animation: "synthwave-grid 20s linear infinite", backgroundSize: "40px 40px", backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)" }} />
      <div className="fixed top-[-50%] left-[-50%] w-[200%] h-[200%] z-0 pointer-events-none opacity-20" style={{ animation: "nebula-spin 120s linear infinite", background: "radial-gradient(circle at 50% 50%, rgba(255, 45, 85, 0.15), rgba(90, 200, 250, 0.15) 30%, transparent 70%)" }} />

      <TopNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        
        <button onClick={() => router.push("/models")} className="flex items-center space-x-2 text-zinc-400 hover:text-white mb-8 transition-colors" style={{ animation: "phantom-slide 0.6s ease-out backwards" }}>
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Models</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: MODEL INFO */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden group"
              style={{ animation: "depth-pulse 4s ease-in-out infinite" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-500" />
              
              <div className="relative flex items-center space-x-6">
                <div className="w-24 h-24 rounded-2xl bg-black/40 border border-white/20 flex items-center justify-center p-4" style={{ animation: "float-spin 8s ease-in-out infinite" }}>
                  <img src={getProviderIcon()} alt="Provider Icon" className="w-full h-full object-contain filter drop-shadow-md" onError={(e) => { e.currentTarget.src = "/globe.svg"; }} />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400 mb-2" style={{ animation: "text-reveal 1.5s cubic-bezier(0.19, 1, 0.22, 1)" }}>
                    {decodedModelId.split('/').pop() || 'Unknown Model'}
                  </h1>
                  <p className="text-xl text-zinc-400 flex items-center space-x-2">
                    <span>By {decodedModelId.split('/')[0] || 'Unknown Provider'}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30" style={{ animation: "core-pulse 2s infinite" }}>
                      Production Ready
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* DESCRIPTION & README */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl"
            >
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center" style={{ animation: "cyber-glitch 10s infinite" }}>
                <Terminal className="w-6 h-6 mr-3 text-cyan-400" />
                Model Overview
              </h2>
              <div className="prose prose-invert max-w-none prose-p:text-zinc-300 prose-a:text-cyan-400 hover:prose-a:text-cyan-300">
                <p className="text-lg leading-relaxed mb-4">
                  Welcome to the {decodedModelId} documentation. This model is accessible via the NJIRLAH AI platform using our unified OpenRouter-compatible endpoint. 
                </p>
                <p className="text-lg leading-relaxed">
                  Featuring advanced reasoning, massive context windows, and state-of-the-art multimodal capabilities, this model is designed for enterprise-grade applications. Integrated seamlessly into the NJIRLAH Zero-Mock framework.
                </p>
              </div>
            </motion.div>
            
            {/* QUICK START */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
              className="p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <Play className="w-6 h-6 mr-3 text-fuchsia-400" />
                  Quick Start
                </h2>
                <button 
                  onClick={handleCopy}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                  <span className="text-sm font-medium">{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity blur" />
                <pre className="relative p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 overflow-x-auto text-sm text-zinc-300 font-mono" style={{ animation: "data-stream 10s linear infinite" }}>
                  <code>
<span className="text-fuchsia-400">import</span> OpenAI <span className="text-fuchsia-400">from</span> <span className="text-green-300">"openai"</span>{'\n\n'}
<span className="text-fuchsia-400">const</span> openai = <span className="text-fuchsia-400">new</span> OpenAI({'{'}{'\n'}
  baseURL: <span className="text-green-300">"https://openrouter.ai/api/v1"</span>,{'\n'}
  apiKey: process.env.<span className="text-cyan-300">OPENROUTER_API_KEY</span>,{'\n'}
{'}'}){'\n\n'}
<span className="text-fuchsia-400">const</span> completion = <span className="text-fuchsia-400">await</span> openai.chat.completions.create({'{'}{'\n'}
  model: <span className="text-green-300">"{decodedModelId}"</span>,{'\n'}
  messages: [{'\n'}
    {'{'} role: <span className="text-green-300">"user"</span>, content: <span className="text-green-300">"Hello, world!"</span> {'}'}{'\n'}
  ]{'\n'}
{'}'})
                  </code>
                </pre>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: STATS & ACTIONS */}
          <div className="space-y-6">
            
            {/* Action Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-fuchsia-500/10 to-transparent backdrop-blur-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" style={{ animation: "pulsar-ring 4s infinite" }} />
              
              <h3 className="text-lg font-medium text-white mb-4">Ready to build?</h3>
              <button 
                onClick={() => router.push(`/chat?model=${encodeURIComponent(decodedModelId)}`)}
                className="w-full py-4 rounded-xl bg-white text-black font-semibold text-lg hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center space-x-2"
                style={{ animation: "jello-wobble 8s infinite" }}
              >
                <span>Try in Chat</span>
                <Play className="w-5 h-5 fill-current" />
              </button>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              <StatCard icon={<Cpu />} label="Context Window" value="128k tokens" animation="kinetic-bounce 6s infinite" />
              <StatCard icon={<Zap />} label="Avg. Latency" value="~0.8s" animation="signal-wave 3s infinite" />
              <StatCard icon={<DollarSign />} label="Input Price" value="$0.01 / 1k" animation="rubber-band 7s infinite" />
              <StatCard icon={<DollarSign />} label="Output Price" value="$0.03 / 1k" animation="rubber-band 7.5s infinite" />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, animation }: { icon: React.ReactNode, label: string, value: string, animation: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between group hover:bg-white/10 transition-colors"
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-cyan-400 group-hover:text-fuchsia-400 transition-colors" style={{ animation }}>
          {icon}
        </div>
        <span className="text-zinc-400 font-medium">{label}</span>
      </div>
      <span className="text-white font-bold text-lg">{value}</span>
    </motion.div>
  );
}
