"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import TopNav from "@/components/layout/TopNav";
import { Search, Server, Star, ExternalLink, ArrowLeft, Zap, Shield, Download, ChevronDown, Sparkles, Cpu, Globe, Database, Code, Layers, Terminal, Palette, ShoppingCart, Gamepad2, Smartphone, BarChart3, BookOpen, Cloud, Users, Bug, Wrench } from "lucide-react";

const CATEGORIES = [
  { key: "all", label: "All", icon: "🌐" },
  { key: "developer-tools", label: "Developer Tools", icon: "🛠️" },
  { key: "api-development", label: "API Development", icon: "🔌" },
  { key: "data-science-ml", label: "Data Science & ML", icon: "🧠" },
  { key: "productivity", label: "Productivity", icon: "⚡" },
  { key: "analytics", label: "Analytics", icon: "📊" },
  { key: "devops", label: "DevOps", icon: "🚀" },
  { key: "security", label: "Security & Testing", icon: "🔒" },
  { key: "scraping", label: "Web Scraping", icon: "🕷️" },
  { key: "database", label: "Database", icon: "💾" },
  { key: "content", label: "Content", icon: "📝" },
  { key: "cloud", label: "Cloud", icon: "☁️" },
  { key: "design", label: "Design", icon: "🎨" },
  { key: "browser", label: "Browser Automation", icon: "🌍" },
  { key: "game-dev", label: "Game Dev", icon: "🎮" },
  { key: "collaboration", label: "Collaboration", icon: "👥" },
];

interface MCPServer {
  id: string; name: string; description: string; stars: number;
  category: string; author: string; official?: boolean; featured?: boolean;
}

const MCP_SERVERS: MCPServer[] = [
  { id: "superpowers", name: "Superpowers", description: "Empowers AI coding agents with structured software development workflow from design to TDD-driven implementation.", stars: 180827, category: "developer-tools", author: "obra" },
  { id: "trendradar", name: "TrendRadar", description: "Aggregates trending topics from 35+ platforms with intelligent filtering and AI-powered analysis.", stars: 56846, category: "data-science-ml", author: "sansan0" },
  { id: "context7", name: "Context7", description: "Fetches up-to-date documentation and code examples for LLMs directly from the source.", stars: 54610, category: "api-development", author: "upstash" },
  { id: "penpot", name: "Penpot", description: "Open-source design and prototyping platform bridging design and code through real-time collaboration.", stars: 47328, category: "design", author: "penpot" },
  { id: "openspec", name: "OpenSpec", description: "Spec-driven development ensuring alignment between humans and AI coding assistants.", stars: 45741, category: "developer-tools", author: "Fission-AI" },
  { id: "ruflo", name: "Ruflo", description: "Orchestrates intelligent multi-agent swarms for Claude with autonomous workflows.", stars: 45424, category: "developer-tools", author: "ruvnet" },
  { id: "task-master", name: "Task Master", description: "Streamline AI-driven development workflows by automating task management with Claude.", stars: 27020, category: "productivity", author: "eyaltoledano", featured: true },
  { id: "firecrawl", name: "Firecrawl", description: "Advanced web scraping for content extraction, crawling, and search functionalities.", stars: 4195, category: "scraping", author: "firecrawl", official: true },
  { id: "magic", name: "Magic", description: "Generate modern UI components instantly from natural language descriptions within your IDE.", stars: 4839, category: "developer-tools", author: "magic", official: true },
  { id: "excel", name: "Excel", description: "Excel file manipulation capabilities without requiring Microsoft Excel installation.", stars: 3786, category: "productivity", author: "microsoft", featured: true },
  { id: "godot", name: "Godot", description: "AI assistants interact with Godot game engine: launch editor, run projects, capture debug output.", stars: 3453, category: "game-dev", author: "godot", featured: true },
  { id: "browserbase", name: "Browserbase", description: "Control cloud browsers for web interaction, data extraction, and task automation.", stars: 3315, category: "browser", author: "browserbase", official: true },
  { id: "unity", name: "Unity", description: "Communication between Unity and LLMs for automating workflows and controlling the Editor.", stars: 2649, category: "game-dev", author: "unity", featured: true },
  { id: "bright-data", name: "Bright Data", description: "Access, discover, and extract real-time web data bypassing restrictions and bot detection.", stars: 2348, category: "scraping", author: "brightdata", official: true },
  { id: "fastapi", name: "FastAPI", description: "Exposes FastAPI endpoints as MCP tools with zero configuration.", stars: 11844, category: "api-development", author: "tadata-org", featured: true },
  { id: "ghidra", name: "Ghidra", description: "LLMs autonomously reverse engineer applications through Ghidra's core functionality.", stars: 8768, category: "security", author: "LaurieWired", featured: true },
  { id: "elevenlabs", name: "ElevenLabs", description: "Text to Speech and audio processing APIs for MCP clients.", stars: 1346, category: "api-development", author: "elevenlabs", official: true },
  { id: "supabase-mcp", name: "Supabase", description: "Direct database access with auth, storage, and real-time subscriptions for AI agents.", stars: 8200, category: "database", author: "supabase" },
  { id: "prisma-mcp", name: "Prisma", description: "Type-safe database queries and schema management through MCP protocol.", stars: 6100, category: "database", author: "prisma" },
  { id: "vercel-mcp", name: "Vercel", description: "Deploy, manage projects, and access serverless functions from AI coding agents.", stars: 5800, category: "devops", author: "vercel" },
  { id: "docker-mcp", name: "Docker", description: "Container management, image building, and orchestration through AI assistants.", stars: 4500, category: "devops", author: "docker" },
  { id: "stripe-mcp", name: "Stripe", description: "Payment processing, subscription management, and financial data access.", stars: 3900, category: "api-development", author: "stripe" },
  { id: "notion-mcp", name: "Notion MCP", description: "Read, create, and manage Notion pages, databases, and blocks via AI.", stars: 3400, category: "productivity", author: "notion" },
  { id: "slack-mcp", name: "Slack MCP", description: "Send messages, manage channels, and automate Slack workflows with AI agents.", stars: 3100, category: "collaboration", author: "slack" },
  { id: "github-mcp", name: "GitHub MCP", description: "Repository management, PR reviews, issue tracking, and CI/CD through MCP.", stars: 9800, category: "developer-tools", author: "github" },
  { id: "aws-mcp", name: "AWS", description: "Manage AWS infrastructure, Lambda functions, S3 buckets, and more.", stars: 7200, category: "cloud", author: "aws" },
  { id: "gcp-mcp", name: "Google Cloud", description: "GCP resource management, BigQuery, Cloud Functions, and Vertex AI access.", stars: 5500, category: "cloud", author: "google" },
  { id: "sentry-mcp", name: "Sentry", description: "Error tracking, performance monitoring, and issue resolution for AI-assisted debugging.", stars: 4100, category: "analytics", author: "sentry" },
  { id: "playwright-mcp", name: "Playwright", description: "Browser testing automation with screenshot capture and DOM manipulation.", stars: 6800, category: "browser", author: "microsoft" },
  { id: "postgres-mcp", name: "PostgreSQL", description: "Direct SQL queries, schema introspection, and database management.", stars: 5200, category: "database", author: "postgres" },
  { id: "redis-mcp", name: "Redis", description: "In-memory data store operations, caching, and pub/sub messaging.", stars: 3800, category: "database", author: "redis" },
  { id: "figma-mcp", name: "Figma MCP", description: "Design token extraction, component inspection, and layout analysis.", stars: 4600, category: "design", author: "figma" },
  { id: "linear-mcp", name: "Linear MCP", description: "Issue management, sprint planning, and project tracking automation.", stars: 3500, category: "productivity", author: "linear" },
  { id: "jira-mcp", name: "Jira", description: "Agile project management with sprint tracking and backlog management.", stars: 2900, category: "productivity", author: "atlassian" },
  { id: "datadog-mcp", name: "Datadog", description: "Infrastructure monitoring, APM, log management, and alerting.", stars: 3200, category: "analytics", author: "datadog" },
  { id: "cloudflare-mcp", name: "Cloudflare", description: "Workers deployment, DNS management, and edge computing control.", stars: 4800, category: "cloud", author: "cloudflare" },
  { id: "tensorflow-mcp", name: "TensorFlow", description: "ML model training, inference, and deployment through AI assistants.", stars: 2400, category: "data-science-ml", author: "google" },
  { id: "scout-monitoring", name: "Scout Monitoring", description: "Real-time application performance and error data for targeted code analysis.", stars: 28, category: "analytics", author: "scout", official: true },
  { id: "thunderbit", name: "Thunderbit", description: "AI-powered web scraping with CLI, MCP server, and Claude Code plugin.", stars: 12, category: "scraping", author: "thunderbit-open" },
  { id: "kicad-pro", name: "KiCad Pro", description: "Programmatic control over KiCad PCB and schematic design workflows.", stars: 0, category: "developer-tools", author: "oaslananka-lab" },
];

function formatStars(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export default function MCPServersPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"stars" | "name">("stars");

  const filtered = useMemo(() => {
    let list = [...MCP_SERVERS];
    if (category !== "all") list = list.filter((s) => s.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.author.toLowerCase().includes(q));
    }
    if (sort === "stars") list.sort((a, b) => b.stars - a.stars);
    else list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search, category, sort]);

  return (
    <div className="min-h-screen bg-[#050014] text-white overflow-hidden relative">
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ animation: "synthwave-grid 20s linear infinite", backgroundSize: "40px 40px", backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.015) 1px,transparent 1px)" }} />
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl pointer-events-none z-0" style={{ animation: "nebula-spin 80s linear infinite" }} />

      <TopNav />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/agent" className="text-zinc-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-fuchsia-300" style={{ animation: "text-reveal 1.5s cubic-bezier(0.19,1,0.22,1)" }}>
            MCP Servers
          </motion.h1>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-zinc-400 text-lg mb-2 max-w-3xl">
          <span className="text-cyan-400 font-bold">{MCP_SERVERS.length}+</span> MCP servers dari <a href="https://mcpmarket.com" target="_blank" rel="noopener" className="text-fuchsia-400 hover:underline">MCPMarket</a> — hubungkan AI agent Anda dengan seluruh ekosistem developer tools, databases, cloud, dan lainnya.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2"><Server className="w-4 h-4 text-cyan-400" /><span className="text-zinc-400">{MCP_SERVERS.length} servers</span></div>
          <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /><span className="text-zinc-400">{formatStars(MCP_SERVERS.reduce((a, b) => a + b.stars, 0))} total stars</span></div>
          <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-400" /><span className="text-zinc-400">{MCP_SERVERS.filter((s) => s.official).length} official</span></div>
        </motion.div>

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari MCP server..." className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-all backdrop-blur-sm" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as "stars" | "name")} className="px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer">
            <option value="stars">⭐ Most Stars</option>
            <option value="name">🔤 Alphabetical</option>
          </select>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button key={cat.key} onClick={() => setCategory(cat.key)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${category === cat.key ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]" : "bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10"}`}>
              <span>{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((server, i) => (
              <motion.div key={server.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.02, type: "spring", damping: 25 }}
                className="group relative p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-pointer"
                style={{ animation: `velvet-slide 0.5s ease-out ${i * 0.02}s backwards` }}
              >
                {server.official && <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-[10px] text-green-400 font-semibold" style={{ animation: "core-pulse 2s infinite" }}>Official</div>}
                {server.featured && !server.official && <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-400 font-semibold">Featured</div>}

                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-lg" style={{ animation: "magnetic-float 6s ease-in-out infinite" }}>
                  <Server className="w-5 h-5 text-cyan-400" />
                </div>

                <h3 className="text-white font-semibold mb-1 group-hover:text-cyan-300 transition-colors">{server.name}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-3">{server.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-600">by <span className="text-zinc-400">{server.author}</span></span>
                  <div className="flex items-center gap-1 text-yellow-500/70">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[11px] font-medium">{formatStars(server.stars)}</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            <Server className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Tidak ada server ditemukan</p>
          </div>
        )}
      </main>
    </div>
  );
}
