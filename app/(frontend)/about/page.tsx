import type { Metadata } from 'next';
import { AboutView } from '@/components/AboutView';

export const metadata: Metadata = {
  title: 'О нас — AZERII',
};

export default function AboutPage() {
  return <AboutView />;
}
