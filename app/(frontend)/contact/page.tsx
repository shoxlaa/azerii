import type { Metadata } from 'next';
import { ContactView } from '@/components/ContactView';

export const metadata: Metadata = {
  title: 'Контакты — AZERII',
};

export default function ContactPage() {
  return <ContactView />;
}
