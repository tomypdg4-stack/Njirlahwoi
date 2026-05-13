'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Pin, Star, MoveHorizontal as MoreHorizontal, Pencil, Trash2, Download, Menu, Zap } from 'lucide-react';
import ModelSelector from '@/components/ui/ModelSelector';
import MultiStateBadge from '@/components/ui/MultiStateBadge';
import { useChatStore } from '@/store/chat-store';

interface HeaderProps {
  onOpenCommand?: () => void;
  onToggleSidebar?: () => void;
}

function EditableTitle({ chatId, title }: { chatId: string; title: string }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue]     = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const { renameChat } = useChatStore();

  useEffect(() => { setValue(title); }, [title]);
  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  const commit = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== title) renameChat(chatId, trimmed);
    else setValue(title);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setValue(title); setEditing(false); }
        }}
        className="bg-white/[0.06] border border-brand-blue/30 rounded-lg px-2 py-0.5 text-xs text-white font-medium outline-none w-full max-w-[180px]"
        maxLength={60}
      />
    );
  }

  return (
    <motion.button
      key={title}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 300 }}
      onClick={() => setEditing(true)}
      className="group flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors max-w-[160px]"
    >
      <span className="truncate">{title === 'New Chat' ? 'Chat Baru' : title}</span>
      <Pencil size={9} className="text-white/15 group-hover:text-brand-blue transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100" />
    </motion.button>
  );
}

function ChatMenu({
  chatId, isPinned, isFavorited, onPin, onFav, onDelete,
}: {
  chatId: string;
  isPinned?: boolean;
  isFavorited?: boolean;
  onPin: () => void;
  onFav: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const items = [
    { icon: <Pin  size={11} className={isPinned    ? 'fill-brand-amber text-brand-amber' : ''} />, label: isPinned    ? 'Lepas Pin' : 'Sematkan', action: () => { onPin(); setOpen(false); } },
    { icon: <Star size={11} className={isFavorited ? 'fill-brand-pistachio text-brand-pistachio' : ''} />, label: isFavorited ? 'Hapus Favorit' : 'Favoritkan', action: () => { onFav(); setOpen(false); } },
    { icon: <Download size={11} />, label: 'Ekspor Chat', action: () => setOpen(false) },
    { icon: <Trash2 size={11} />, label: 'Hapus Chat', action: () => { onDelete(); setOpen(false); }, danger: true },
  ];

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/[0.05] transition-all"
      >
        <MoreHorizontal size={13} />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{ type: 'spring', damping: 26, stiffness: 400 }}
            className="absolute right-0 top-full mt-1.5 w-44 glass border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
          >
            {items.map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors hover:bg-white/[0.06] ${
                  item.danger ? 'text-brand-red/80 hover:text-brand-red' : 'text-white/50 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Logo() {
  const [easterEgg, setEasterEgg] = useState(false);
  const [clicks, setClicks]       = useState(0);

  return (
    <motion.button
      onClick={() => {
        const n = clicks + 1;
        setClicks(n);
        if (n >= 3) {
          setEasterEgg(true);
          setClicks(0);
          setTimeout(() => setEasterEgg(false), 3000);
        }
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      className="relative flex items-center gap-1.5 select-none flex-shrink-0"
    >
      <motion.span
        className="text-lg sm:text-xl"
        animate={easterEgg
          ? { rotate: [0, 20, -20, 20, -20, 0], scale: [1, 1.4, 1.4, 1.4, 1.4, 1] }
          : { rotate: 0, scale: 1 }
        }
        transition={{ duration: 0.8 }}
      >
        🦄
      </motion.span>
      <span className="hidden sm:block font-black text-sm font-heading gradient-text whitespace-nowrap">
        NJIRLAH AI
      </span>

      <AnimatePresence>
        {easterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute left-full ml-2 flex gap-0.5 whitespace-nowrap pointer-events-none z-50"
          >
            {['🌟', '✨', '💫', '🦄'].map((e, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 0.5, delay: i * 0.07, repeat: 5 }}
                className="text-sm"
              >
                {e}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function Header({ onOpenCommand, onToggleSidebar }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const {
    isStreaming, activeChatId, getActiveChat,
    setPinned, setFavorited, deleteChat, chats, setActiveChat,
  } = useChatStore();

  const activeChat = mounted ? getActiveChat() : null;
  const badgeState = isStreaming ? 'streaming' : 'online';

  const handleDelete = () => {
    if (!activeChatId) return;
    deleteChat(activeChatId);
    const remaining = chats.filter((c) => c.id !== activeChatId);
    if (remaining[0]) setActiveChat(remaining[0].id);
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] bg-[#0D0D10]/90 backdrop-blur-xl flex-shrink-0 relative z-10 gap-2">
      {/* LEFT */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="md:hidden p-1.5 rounded-lg text-white/40 hover:text-brand-blue hover:bg-brand-blue/10 transition-all flex-shrink-0"
        >
          <Menu size={15} />
        </motion.button>

        <Logo />

        {activeChat && <div className="w-px h-4 bg-white/[0.07] flex-shrink-0 hidden sm:block" />}
        {activeChat && activeChatId && (
          <div className="flex items-center gap-1 min-w-0">
            <EditableTitle chatId={activeChatId} title={activeChat.title} />
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {activeChat && activeChatId && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setPinned(activeChatId, !activeChat.pinned)}
              className={`hidden sm:flex p-1.5 rounded-lg transition-all ${
                activeChat.pinned
                  ? 'text-brand-amber bg-brand-amber/10 border border-brand-amber/20'
                  : 'text-white/20 hover:text-brand-amber/60 hover:bg-brand-amber/8 border border-transparent'
              }`}
            >
              <Pin size={12} className={activeChat.pinned ? 'fill-brand-amber' : ''} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setFavorited(activeChatId, !activeChat.favorited)}
              className={`hidden sm:flex p-1.5 rounded-lg transition-all ${
                activeChat.favorited
                  ? 'text-brand-pistachio bg-brand-pistachio/10 border border-brand-pistachio/20'
                  : 'text-white/20 hover:text-brand-pistachio/60 hover:bg-brand-pistachio/8 border border-transparent'
              }`}
            >
              <Star size={12} className={activeChat.favorited ? 'fill-brand-pistachio' : ''} />
            </motion.button>
            <ChatMenu
              chatId={activeChatId}
              isPinned={activeChat.pinned}
              isFavorited={activeChat.favorited}
              onPin={() => setPinned(activeChatId, !activeChat.pinned)}
              onFav={() => setFavorited(activeChatId, !activeChat.favorited)}
              onDelete={handleDelete}
            />
            <div className="w-px h-4 bg-white/[0.07] mx-0.5 hidden sm:block" />
          </>
        )}

        <ModelSelector />
        <MultiStateBadge state={badgeState} provider="" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={onOpenCommand}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/25 hover:text-brand-blue hover:border-brand-blue/25 transition-all"
          title="Command Palette (Ctrl+K)"
        >
          <Terminal size={11} />
          <kbd className="text-[9px] font-mono">⌘K</kbd>
        </motion.button>
      </div>
    </div>
  );
}
