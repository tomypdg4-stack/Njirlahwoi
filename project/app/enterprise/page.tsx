'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield, Users, Zap, Globe, Lock, BarChart3,
  Building2, Headphones, ArrowRight, Check, Star,
  Server, Key, FileText, Activity
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';

function FeatureBlock({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', damping: 22 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card rounded-2xl p-6 group hover:border-white/[0.14] transition-all relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ animation: 'energy-field 4s ease-in-out infinite' }} />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, delay }}
        className="w-11 h-11 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function PricingTier({ name, price, desc, features, highlight, delay }: {
  name: string; price: string; desc: string; features: string[]; highlight: boolean; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', damping: 22 }}
      whileHover={{ y: -5 }}
      className={`rounded-2xl p-6 relative overflow-hidden transition-all ${
        highlight
          ? 'bg-gradient-to-br from-brand-blue/10 to-brand-pistachio/5 border-2 border-brand-blue/30'
          : 'glass-card hover:border-white/[0.14]'
      }`}
    >
      {highlight && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4"
        >
          <span className="px-2.5 py-1 text-[10px] rounded-full bg-brand-blue/20 border border-brand-blue/40 text-brand-blue font-semibold flex items-center gap-1">
            <Star size={9} /> POPULER
          </span>
        </motion.div>
      )}
      {highlight && (
        <div className="absolute inset-0 pointer-events-none" style={{ animation: 'energy-field 5s ease-in-out infinite' }} />
      )}

      <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
      <p className="text-xs text-white/35 mb-4">{desc}</p>
      <div className="mb-6">
        <span className="text-3xl font-black font-heading text-white">{price}</span>
        {price !== 'Custom' && <span className="text-sm text-white/30 ml-1">/bulan</span>}
      </div>
      <div className="space-y-2.5 mb-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + i * 0.05 }}
            className="flex items-start gap-2 text-sm text-white/50"
          >
            <Check size={13} className="text-brand-green mt-0.5 flex-shrink-0" />
            <span>{f}</span>
          </motion.div>
        ))}
      </div>
      <button className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
        highlight
          ? 'bg-brand-blue text-[#05050A] hover:bg-brand-blue/90'
          : 'bg-white/[0.06] border border-white/[0.10] text-white/70 hover:bg-white/[0.10] hover:text-white'
      }`}>
        {price === 'Custom' ? 'Hubungi Kami' : 'Mulai Sekarang'}
      </button>
    </motion.div>
  );
}

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <TopNav />

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(90,200,250,0.08), transparent)',
            animation: 'aurora 12s ease-in-out infinite',
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 22 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/25 text-brand-blue text-xs font-medium mb-6"
          >
            <Building2 size={12} />
            Enterprise
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black font-heading mb-4 leading-tight"
          >
            AI untuk <span className="gradient-text">Tim & Organisasi</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/45 text-lg mb-8 max-w-xl mx-auto"
          >
            Infrastruktur AI terpadu dengan kontrol penuh, keamanan enterprise-grade, dan dedicated support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/chat" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#05050A] font-semibold text-sm hover:bg-white/90 transition-all shadow-lg">
              <Zap size={15} /> Mulai Gratis
            </Link>
            <Link href="#pricing" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.12] text-white/80 font-medium text-sm hover:bg-white/[0.05] transition-all">
              Lihat Paket <ArrowRight size={13} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-[10%] text-4xl opacity-10 pointer-events-none hidden lg:block"
        >🏢</motion.div>
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-[10%] text-4xl opacity-10 pointer-events-none hidden lg:block"
        >🔐</motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-black font-heading mb-3">
              Dibangun untuk <span className="gradient-text">Skala Enterprise</span>
            </h2>
            <p className="text-white/40 text-sm max-w-md mx-auto">
              Keamanan, keandalan, dan kontrol yang dibutuhkan tim Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureBlock icon={<Shield size={20} />} title="SSO & SAML" desc="Autentikasi single sign-on melalui Okta, Azure AD, Google Workspace, dan SAML 2.0 lainnya." delay={0} />
            <FeatureBlock icon={<Lock size={20} />} title="Data Encryption" desc="Enkripsi end-to-end untuk semua data. Kunci API tidak pernah disimpan di server kami." delay={0.07} />
            <FeatureBlock icon={<FileText size={20} />} title="Audit Log" desc="Log audit lengkap untuk semua aktivitas API. Compliance dengan SOC 2 dan GDPR." delay={0.14} />
            <FeatureBlock icon={<Server size={20} />} title="Dedicated Infrastructure" desc="Infrastruktur khusus dengan isolasi penuh. SLA 99.99% uptime." delay={0.21} />
            <FeatureBlock icon={<Users size={20} />} title="Tim & Workspace" desc="Manajemen tim dengan role-based access control. Workspace terpisah per proyek." delay={0.28} />
            <FeatureBlock icon={<Headphones size={20} />} title="Priority Support" desc="Dedicated account manager, response time <1 jam, dan private Slack channel." delay={0.35} />
            <FeatureBlock icon={<BarChart3 size={20} />} title="Analytics Dashboard" desc="Dashboard real-time untuk monitoring penggunaan, biaya, dan performa model." delay={0.42} />
            <FeatureBlock icon={<Globe size={20} />} title="In-Region Routing" desc="Routing data ke region tertentu untuk compliance data residency." delay={0.49} />
            <FeatureBlock icon={<Activity size={20} />} title="Rate Limiting" desc="Rate limit custom per tim, per workspace, atau per API key." delay={0.56} />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-black font-heading mb-3">
              Paket <span className="gradient-text">Harga</span>
            </h2>
            <p className="text-white/40 text-sm">Pilih paket yang sesuai dengan kebutuhan tim Anda</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <PricingTier
              name="Starter"
              price="$0"
              desc="Untuk developer individual"
              features={[
                'Akses semua 400+ model',
                'BYOK (Bring Your Own Key)',
                'Community support',
                'Rate limit standar',
                'Enkripsi di transit',
              ]}
              highlight={false}
              delay={0}
            />
            <PricingTier
              name="Pro"
              price="$29"
              desc="Untuk tim kecil dan startup"
              features={[
                'Semua fitur Starter',
                'Workspace untuk tim (5 seat)',
                'Priority support',
                'Custom rate limit',
                'Analytics dashboard',
                'Response caching',
                'Model fallback otomatis',
              ]}
              highlight={true}
              delay={0.1}
            />
            <PricingTier
              name="Enterprise"
              price="Custom"
              desc="Untuk organisasi besar"
              features={[
                'Semua fitur Pro',
                'Unlimited seats',
                'SSO / SAML',
                'Audit log',
                'Dedicated infrastructure',
                'SLA 99.99%',
                'In-region routing',
                'Account manager',
                'Private Slack channel',
              ]}
              highlight={false}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-16 px-4 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-white/25 uppercase tracking-widest mb-8"
          >
            Dipercaya oleh tim engineering terkemuka
          </motion.p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {['Replit', 'Kilo Code', 'Hermes', 'OpenClaw', 'Descript', 'Cline'].map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/30 text-sm"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-5xl mb-6"
          >🏢</motion.div>
          <h2 className="text-2xl font-black font-heading mb-3">
            Siap untuk <span className="gradient-text">Enterprise?</span>
          </h2>
          <p className="text-white/40 text-sm mb-8">
            Hubungi tim kami untuk mendapatkan demo dan paket khusus untuk organisasi Anda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/chat" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#05050A] font-semibold text-sm hover:bg-white/90 transition-all shadow-lg">
              <Headphones size={15} /> Hubungi Sales
            </Link>
            <Link href="/docs" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.12] text-white/70 font-medium text-sm hover:bg-white/[0.04] transition-all">
              <FileText size={15} /> Baca Dokumentasi
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
