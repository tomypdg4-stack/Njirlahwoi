'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

function WalkingUnicorn() {
  const unicornRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const animeModule = await import('animejs');
        const anime = (animeModule as any).default ?? animeModule;
        if (cancelled || !unicornRef.current) return;
        anime({
          targets: unicornRef.current,
          translateX: ['-8px', '220px'],
          translateY: [0, -6, 0, -4, 0, -8, 0],
          rotate: { value: ['-3deg', '3deg'], duration: 500, loop: true, easing: 'easeInOutSine' },
          duration: 6000,
          loop: true,
          easing: 'easeInOutQuad',
          direction: 'alternate',
        });
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="relative h-8 w-56 mx-auto overflow-hidden">
      <div className="absolute bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-pistachio/30 to-transparent" />
      <span ref={unicornRef} className="absolute bottom-1.5 text-lg select-none" style={{ willChange: 'transform' }}>
        🦄
      </span>
    </div>
  );
}

const FOOTER_LINKS = {
  Produk: [
    { label: 'Chat', href: '/chat' },
    { label: 'Rankings', href: '/rankings' },
    { label: 'Apps', href: '/apps' },
    { label: 'Models', href: '/models' },
    { label: 'Providers', href: '/providers' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Enterprise', href: '/enterprise' },
  ],
  Perusahaan: [
    { label: 'Tentang', href: '#' },
    { label: 'Pengumuman', href: '/announcements' },
    { label: 'Privasi', href: '#' },
    { label: 'Syarat Layanan', href: '#' },
    { label: 'Dukungan', href: '#' },
  ],
  Developer: [
    { label: 'Dokumentasi', href: '/docs' },
    { label: 'API Reference', href: '/docs' },
    { label: 'API Keys', href: '/api-njir' },
    { label: 'Status', href: '#' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-[#0A0A14]/60 backdrop-blur-md py-12 flex-shrink-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Link grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl">🦄</span>
              <span className="font-black text-sm font-heading gradient-text tracking-tight">NJIRLAH AI</span>
            </Link>
            <p className="text-xs text-white/30 leading-relaxed">
              Platform chat AI multi-model. Mode tamu gratis, BYOK untuk semua provider.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-white/30 hover:text-white/70 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="section-divider mb-6" />

        {/* Walking unicorn */}
        <WalkingUnicorn />

        {/* Bottom */}
        <div className="text-center mt-4">
          <p className="text-base font-bold flex items-center justify-center gap-2 font-heading text-white/80">
            Dibuat dengan{' '}
            <motion.span
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
              className="text-brand-red inline-block"
            >
              ❤️
            </motion.span>{' '}
            oleh{' '}
            <motion.span
              whileHover={{ color: '#5AC8FA', textShadow: '0 0 12px rgba(90,200,250,0.5)' }}
              className="underline decoration-brand-blue decoration-2 cursor-default text-white/70"
            >
              Andikaa Saputraa
            </motion.span>
          </p>
          <p className="text-xs text-white/15 mt-2">© {year} NJIRLAH AI — Platform AI Bebas Tanpa Batas</p>
        </div>
      </div>
    </footer>
  );
}
