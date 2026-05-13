'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Menu, X, ChevronDown, Zap, Sparkles } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Models', href: '/models' },
  { label: 'Chat', href: '/chat' },
  { label: 'LLM Stats', href: '/llm-stats' },
  { label: 'Rankings', href: '/rankings' },
  { label: 'Apps', href: '/apps' },
  { label: 'MCP Server', href: '/mcp-servers' },
  { label: 'Enterprise', href: '/enterprise' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
];

/* â”€â”€ Animation #20: Logo with Easter egg â”€â”€ */
function Logo({ onClick }: { onClick?: () => void }) {
  const [clicks, setClicks] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);

  const handleClick = () => {
    onClick?.();
    const n = clicks + 1;
    setClicks(n);
    if (n >= 3) {
      setEasterEgg(true);
      setClicks(0);
      setTimeout(() => setEasterEgg(false), 3000);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center gap-2 select-none"
    >
      {/* Animation #21: Logo icon with hover wobble */}
      <motion.span
        className="text-xl"
        animate={easterEgg
          ? { rotate: [0, 20, -20, 20, -20, 0], scale: [1, 1.4, 1.4, 1.4, 1.4, 1] }
          : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        ðŸ¦„
      </motion.span>
      <span className="font-black text-sm font-heading gradient-text tracking-tight">
        NJIRLAH AI
      </span>
      {/* Animation #22: Easter egg sparkles */}
      <AnimatePresence>
        {easterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute left-full ml-2 flex gap-0.5 whitespace-nowrap pointer-events-none z-50"
          >
            {['ðŸŒŸ', 'âœ¨', 'ðŸ’«', 'ðŸ¦„'].map((e, i) => (
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

export default function TopNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#05050A]/95 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link href="/">
              <Logo />
            </Link>

            {/* Animation #23: Nav active indicator pill */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      active
                        ? 'text-white'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-active-bg"
                        className="absolute inset-0 rounded-lg bg-white/[0.07]"
                        transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: CTA Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/api-njir"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.07] text-sm transition-all"
            >
              <Key size={13} />
              <span>API Keys</span>
            </Link>

            {/* Animation #24: CTA button pulse glow */}
            <Link
              href="/chat"
              className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-blue text-[#05050A] font-semibold text-sm hover:bg-brand-blue/90 transition-all overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-lg"
                animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <Zap size={13} className="relative z-10" />
              <span className="relative z-10">Mulai Chat</span>
            </Link>

            {/* Animation #25: Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X size={18} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Animation #26: Mobile menu slide */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="fixed top-14 left-0 right-0 z-40 bg-[#0D0D10]/98 backdrop-blur-xl border-b border-white/[0.06] md:hidden"
          >
            <nav className="flex flex-col py-3 px-4">
              {NAV_LINKS.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <motion.div key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}>
                    <Link
                      href={link.href}
                      className={`px-3 py-3 rounded-xl text-sm transition-colors block ${
                        active ? 'text-white bg-white/[0.06]' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="border-t border-white/[0.06] mt-2 pt-2">
                <Link href="/api-njir" className="px-3 py-3 rounded-xl text-sm text-brand-blue flex items-center gap-2">
                  <Key size={13} /> API Keys
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
