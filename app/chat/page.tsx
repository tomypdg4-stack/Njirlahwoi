'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ChatArea from '@/components/chat/ChatArea';
import ChatInput from '@/components/chat/ChatInput';
import { useChatStore } from '@/store/chat-store';
import { useApiKeyStore } from '@/store/api-key-store';

const ApiKeyModal    = dynamic(() => import('@/components/ui/ApiKeyModal'),    { ssr: false });
const CommandPalette = dynamic(() => import('@/components/ui/CommandPalette'), { ssr: false });
const CustomCursor   = dynamic(() => import('@/components/ui/CustomCursor'),   { ssr: false });

export default function ChatPage() {
  const [apiKeyOpen, setApiKeyOpen]             = useState(false);
  const [commandOpen, setCommandOpen]           = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const {
    chats, activeChatId, isStreaming, streamingContent,
    selectedModel, selectedProvider, temperature, _hasHydrated,
    createChat, setActiveChat, addMessage, updateMessage,
    setIsStreaming, setStreamingContent, setTemperature, getActiveChat,
  } = useChatStore();

  const { openrouterKey } = useApiKeyStore();

  useEffect(() => {
    if (_hasHydrated && chats.length === 0) createChat();
  }, [_hasHydrated, chats.length, createChat]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const activeChat = getActiveChat();
  const messages   = activeChat?.messages ?? [];

  const handleSend = useCallback(async (content: string) => {
    if (!activeChatId || isStreaming) return;

    addMessage(activeChatId, { role: 'user', content });
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setIsStreaming(true);
    setStreamingContent('');

    const assistantId = addMessage(activeChatId, { role: 'assistant', content: '' });

    try {
      const msgs = [...messages, { role: 'user' as const, content }]
        .map((m) => ({ role: m.role, content: m.content }));

      let res: Response;

      if (selectedProvider === 'cloudflare') {
        res = await fetch('/api/cloudflare/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: msgs, model: selectedModel, stream: true, temperature }),
          signal: abortRef.current.signal,
        });
      } else if (selectedProvider === 'openrouter' && openrouterKey) {
        res = await fetch('/api/openrouter/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': openrouterKey },
          body: JSON.stringify({ messages: msgs, model: selectedModel, stream: true, temperature }),
          signal: abortRef.current.signal,
        });
      } else {
        res = await fetch('/api/njiriah/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: msgs, stream: true }),
          signal: abortRef.current.signal,
        });
      }

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader    = res.body.getReader();
      const decoder   = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            const delta  = parsed?.choices?.[0]?.delta?.content ?? '';
            if (delta) { accumulated += delta; setStreamingContent(accumulated); }
          } catch { /* ignore */ }
        }
      }

      updateMessage(activeChatId, assistantId, accumulated);
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name !== 'AbortError') {
        updateMessage(activeChatId, assistantId, `*Error: ${error.message}*`);
      }
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
    }
  }, [activeChatId, isStreaming, messages, selectedProvider, selectedModel, openrouterKey, temperature, addMessage, updateMessage, setIsStreaming, setStreamingContent]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setStreamingContent('');
  }, [setIsStreaming, setStreamingContent]);

  if (!_hasHydrated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#09090B]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
              <span className="text-2xl animate-bounce select-none">🦄</span>
            </div>
            <div className="absolute inset-0 rounded-2xl border border-brand-blue/30 animate-ping" />
          </div>
          <p className="text-white/30 text-xs tracking-wider uppercase">Memuat NJIRLAH AI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#09090B] text-white relative">
      <CustomCursor />

      <Sidebar
        onOpenApiKey={() => setApiKeyOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        <Header
          onOpenCommand={() => setCommandOpen(true)}
          onToggleSidebar={() => setMobileSidebarOpen((v) => !v)}
        />

        <ChatArea
          messages={messages}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          onSend={handleSend}
          onOpenApiKey={() => setApiKeyOpen(true)}
        />

        <ChatInput
          onSend={handleSend}
          isStreaming={isStreaming}
          onStop={handleStop}
          temperature={temperature}
          onTemperatureChange={setTemperature}
        />
      </div>

      <ApiKeyModal open={apiKeyOpen} onClose={() => setApiKeyOpen(false)} />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}
