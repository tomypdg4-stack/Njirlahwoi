import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NJIRLAH AI — Model Explorer | Every LLM, Every Provider',
  description: 'Explore 1,000,000+ AI model configurations from 200+ providers. Compare prices, context windows, and capabilities. Your ultimate LLM command center.',
  openGraph: {
    title: 'NJIRLAH AI — The Universe of AI Models',
    description: 'Every LLM. Every Provider. One Command Center. Explore, compare, and configure AI models from 200+ providers.',
    type: 'website',
    siteName: 'NJIRLAH AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NJIRLAH AI — Model Explorer',
    description: 'The ultimate LLM encyclopedia with 1M+ model configurations.',
  },
};

export default function ModelsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
