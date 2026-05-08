"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import TopNav from "@/components/layout/TopNav";
import {
  Search, Plug, CheckCircle, ExternalLink, ChevronDown, Zap, Shield,
  MessageSquare, Mail, Calendar, FileText, Database, Video, Image,
  Github, Hash, Trello, ArrowLeft, Sparkles, Globe, Send
} from "lucide-react";

/* ── INTEGRATION DATA ── */
type Category = "all" | "productivity" | "communication" | "dev" | "marketing" | "design" | "storage" | "ai" | "social" | "crm";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: Category[];
  color: string;
  icon: string;
  connected?: boolean;
}

const INTEGRATIONS: Integration[] = [
  { id: "airtable", name: "Airtable", description: "Spreadsheet-database hybrid for organizing projects and tracking tasks", category: ["productivity","database"], color: "#18BFFF", icon: "📊" },
  { id: "asana", name: "Asana", description: "Organize, track, and manage team work with powerful project tools", category: ["productivity"], color: "#F06A6A", icon: "✅" },
  { id: "basecamp", name: "Basecamp", description: "Project management and team collaboration by 37signals", category: ["productivity"], color: "#1D2D35", icon: "🏕️" },
  { id: "brevo", name: "Brevo", description: "All-in-one email/SMS marketing with automation and CRM", category: ["marketing","crm"], color: "#0B996E", icon: "📧" },
  { id: "calendly", name: "Calendly", description: "Automate meeting scheduling, availability checks, and reminders", category: ["productivity"], color: "#006BFF", icon: "📅" },
  { id: "canva", name: "Canva", description: "Drag-and-drop design suite for graphics, presentations, and marketing", category: ["design"], color: "#00C4CC", icon: "🎨" },
  { id: "clickup", name: "ClickUp", description: "Unify tasks, docs, goals, and chat with customizable workflows", category: ["productivity"], color: "#7B68EE", icon: "⚡" },
  { id: "discord", name: "Discord", description: "Instant messaging and VoIP social platform for communities", category: ["communication"], color: "#5865F2", icon: "🎮" },
  { id: "dropbox", name: "Dropbox", description: "Cloud storage with file syncing, sharing, and version control", category: ["storage"], color: "#0061FF", icon: "📦" },
  { id: "facebook", name: "Facebook", description: "Social media and advertising platform for Pages", category: ["social","marketing"], color: "#1877F2", icon: "👥" },
  { id: "figma", name: "Figma", description: "Collaborative interface design tool for teams", category: ["design","dev"], color: "#F24E1E", icon: "🖌️" },
  { id: "github", name: "GitHub", description: "Code hosting with Git repos, issues, CI/CD, and collaboration", category: ["dev"], color: "#FFFFFF", icon: "🐙" },
  { id: "gmail", name: "Gmail", description: "Google email with spam protection and G Suite integration", category: ["communication"], color: "#EA4335", icon: "✉️" },
  { id: "google-ads", name: "Google Ads", description: "Online advertising platform for bidding and ad display", category: ["marketing"], color: "#4285F4", icon: "📢" },
  { id: "google-calendar", name: "Google Calendar", description: "Time management with scheduling, reminders, and app integration", category: ["productivity"], color: "#4285F4", icon: "🗓️" },
  { id: "google-docs", name: "Google Docs", description: "Cloud word processor with real-time collaboration", category: ["productivity"], color: "#4285F4", icon: "📝" },
  { id: "google-drive", name: "Google Drive", description: "Cloud storage for uploading, sharing, and collaborating on files", category: ["storage"], color: "#0F9D58", icon: "💾" },
  { id: "google-maps", name: "Google Maps", description: "Location data, geocoding, directions, and mapping services", category: ["dev"], color: "#34A853", icon: "🗺️" },
  { id: "google-meet", name: "Google Meet", description: "Secure video conferencing with screen sharing and chat", category: ["communication"], color: "#00897B", icon: "📹" },
  { id: "google-sheets", name: "Google Sheets", description: "Cloud spreadsheet with real-time collaboration and data analysis", category: ["productivity"], color: "#0F9D58", icon: "📈" },
  { id: "google-slides", name: "Google Slides", description: "Cloud presentations with collaboration and template gallery", category: ["productivity"], color: "#F4B400", icon: "📊" },
  { id: "hubspot", name: "HubSpot", description: "Inbound marketing, sales, CRM, email automation, and analytics", category: ["crm","marketing"], color: "#FF7A59", icon: "🔶" },
  { id: "huggingface", name: "Hugging Face", description: "Build, train, deploy state-of-the-art ML models", category: ["ai","dev"], color: "#FFD21E", icon: "🤗" },
  { id: "instagram", name: "Instagram", description: "Photo/video sharing for Business and Creator accounts", category: ["social","marketing"], color: "#E4405F", icon: "📸" },
  { id: "linear", name: "Linear", description: "Streamlined issue tracking with fast workflows and GitHub integration", category: ["dev","productivity"], color: "#5E6AD2", icon: "📐" },
  { id: "linkedin", name: "LinkedIn", description: "Professional networking for jobs, companies, and thought leaders", category: ["social","marketing"], color: "#0A66C2", icon: "💼" },
  { id: "ms-teams", name: "Microsoft Teams", description: "Chat, video meetings, and file storage within Microsoft 365", category: ["communication"], color: "#6264A7", icon: "👥" },
  { id: "notion", name: "Notion", description: "Notes, docs, wikis, and tasks in a unified workspace", category: ["productivity"], color: "#FFFFFF", icon: "📓" },
  { id: "outlook", name: "Outlook", description: "Microsoft email and calendaring with contacts and scheduling", category: ["communication"], color: "#0078D4", icon: "📬" },
  { id: "pinecone", name: "Pinecone", description: "Vector database for high-performance AI search applications", category: ["ai","dev"], color: "#000000", icon: "🌲" },
  { id: "slack", name: "Slack", description: "Channel-based messaging platform for team collaboration", category: ["communication"], color: "#4A154B", icon: "💬" },
  { id: "splitwise", name: "Splitwise", description: "Split bills and expenses with friends and family", category: ["productivity"], color: "#5BC5A7", icon: "💰" },
  { id: "ticktick", name: "TickTick", description: "Cross-platform task management and to-do list application", category: ["productivity"], color: "#4772FA", icon: "☑️" },
  { id: "todoist", name: "Todoist", description: "Task management with to-do lists, deadlines, and collaboration", category: ["productivity"], color: "#E44332", icon: "📋" },
  { id: "trello", name: "Trello", description: "Web-based kanban-style list-making application", category: ["productivity"], color: "#0052CC", icon: "📌" },
  { id: "twitter", name: "Twitter / X", description: "Social media platform for posts, engagement, and promotion", category: ["social","marketing"], color: "#1DA1F2", icon: "🐦" },
  { id: "typeform", name: "Typeform", description: "Beautiful interactive forms for data collection and payments", category: ["marketing","productivity"], color: "#262627", icon: "📝" },
  { id: "wrike", name: "Wrike", description: "Project management with Gantt charts, reporting, and resource management", category: ["productivity"], color: "#08CF65", icon: "📊" },
  { id: "youtube", name: "YouTube", description: "Video sharing with live streaming and monetization", category: ["social","marketing"], color: "#FF0000", icon: "▶️" },
  { id: "zoom", name: "Zoom", description: "Video conferencing with meetings, webinars, and screen sharing", category: ["communication"], color: "#2D8CFF", icon: "📞" },
  { id: "telegram", name: "Telegram", description: "Chat with your AI wingman through Telegram bot messages", category: ["communication"], color: "#26A5E4", icon: "✈️" },
  { id: "whatsapp", name: "WhatsApp", description: "Interact with your wingman via WhatsApp messages", category: ["communication"], color: "#25D366", icon: "📱" },
  { id: "imessage", name: "iMessage", description: "Send and receive iMessages through your wingman", category: ["communication"], color: "#34C759", icon: "💬" },
];

const CATEGORIES: { key: string; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "productivity", label: "Produktivitas" },
  { key: "communication", label: "Komunikasi" },
  { key: "dev", label: "Developer" },
  { key: "marketing", label: "Marketing" },
  { key: "design", label: "Desain" },
  { key: "storage", label: "Storage" },
  { key: "ai", label: "AI / ML" },
  { key: "social", label: "Sosial Media" },
  { key: "crm", label: "CRM" },
];

export default function IntegrationsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [connectedMap, setConnectedMap] = useState<Record<string, boolean>>({});
  const [configModal, setConfigModal] = useState<Integration | null>(null);

  const filtered = INTEGRATIONS.filter((i) => {
    const matchCat = category === "all" || i.category.includes(category as Category);
    const matchSearch = !search.trim() || i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleConnect = (id: string) => {
    setConnectedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    setConfigModal(null);
  };

  const connectedCount = Object.values(connectedMap).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#050014] text-white overflow-hidden relative">
      {/* AMBIENT */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ animation: "synthwave-grid 20s linear infinite", backgroundSize: "40px 40px", backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)" }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-b from-fuchsia-500/10 to-transparent blur-3xl pointer-events-none z-0" style={{ animation: "pulsar-ring 6s infinite" }} />

      <TopNav />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <Link href="/agent" className="text-zinc-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 20 }}>
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-fuchsia-200 to-cyan-300" style={{ animation: "text-reveal 1.5s cubic-bezier(0.19,1,0.22,1)" }}>
              Agent Integrations
            </h1>
          </motion.div>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-zinc-400 text-lg mb-2 max-w-2xl">
          Hubungkan NJIRLAH AI Agent Workspace dengan <span className="text-fuchsia-400 font-semibold">{INTEGRATIONS.length}+ layanan</span> untuk otomasi penuh.
        </motion.p>

        {/* STATS BAR */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2"><Plug className="w-4 h-4 text-cyan-400" /><span className="text-zinc-400">{INTEGRATIONS.length} tersedia</span></div>
          <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-zinc-400">{connectedCount} terhubung</span></div>
          <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /><span className="text-zinc-400">Real-time sync</span></div>
        </motion.div>

        {/* SEARCH + FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari integrasi..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                category === cat.key
                  ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.15)]"
                  : "bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10 hover:text-white"
              }`}
              style={category === cat.key ? { animation: "depth-pulse 3s infinite" } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* GRID */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((integration, i) => (
              <motion.div
                key={integration.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03, type: "spring", damping: 25 }}
                onClick={() => setConfigModal(integration)}
                className="group relative p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm cursor-pointer hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300"
                style={{ animation: `velvet-slide 0.6s ease-out ${i * 0.03}s backwards` }}
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: `inset 0 0 30px ${integration.color}15, 0 0 20px ${integration.color}10` }} />

                {/* Connected badge */}
                {connectedMap[integration.id] && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30" style={{ animation: "core-pulse 2s infinite" }}>
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] text-green-400 font-medium">Connected</span>
                  </div>
                )}

                {/* Icon */}
                <div className="relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ backgroundColor: `${integration.color}15`, border: `1px solid ${integration.color}30`, animation: "magnetic-float 6s ease-in-out infinite" }}>
                  {integration.icon}
                </div>

                {/* Info */}
                <h3 className="text-white font-semibold text-base mb-1 group-hover:text-fuchsia-300 transition-colors">{integration.name}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{integration.description}</p>

                {/* Bottom shine */}
                <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Tidak ada integrasi ditemukan</p>
            <p className="text-sm mt-1">Coba kata kunci lain atau ubah filter</p>
          </div>
        )}
      </main>

      {/* ── CONFIG MODAL ── */}
      <AnimatePresence>
        {configModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setConfigModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-8 rounded-3xl border border-white/15 bg-[#0a0a1a]/95 backdrop-blur-xl relative overflow-hidden"
              style={{ animation: "depth-pulse 4s infinite" }}
            >
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ backgroundColor: configModal.color }} />

              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: `${configModal.color}20`, border: `1px solid ${configModal.color}40` }}>
                    {configModal.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{configModal.name}</h2>
                    <p className="text-zinc-400 text-sm">{configModal.description}</p>
                  </div>
                </div>

                {/* Config form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 font-medium">API Key / Token</label>
                    <input type="password" placeholder={`Enter ${configModal.name} API key...`} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-fuchsia-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Webhook URL (opsional)</label>
                    <input type="url" placeholder="https://..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-fuchsia-500/50 transition-colors" />
                  </div>
                </div>

                {/* Permissions */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-medium text-zinc-300">Permissions yang diminta</span>
                  </div>
                  <div className="space-y-1 text-xs text-zinc-500">
                    <p>• Baca dan tulis data</p>
                    <p>• Kirim notifikasi</p>
                    <p>• Akses webhook real-time</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button onClick={() => setConfigModal(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
                    Batal
                  </button>
                  <button
                    onClick={() => handleConnect(configModal.id)}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                      connectedMap[configModal.id]
                        ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                        : "bg-fuchsia-500 text-white hover:bg-fuchsia-600 shadow-[0_0_20px_rgba(217,70,239,0.3)]"
                    }`}
                    style={!connectedMap[configModal.id] ? { animation: "jello-wobble 8s infinite" } : {}}
                  >
                    {connectedMap[configModal.id] ? (
                      <><Plug className="w-4 h-4" />Disconnect</>
                    ) : (
                      <><Sparkles className="w-4 h-4" />Connect</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
