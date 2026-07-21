import type { Metadata } from 'next';
import { GalleryView } from '@/components/GalleryView';
import { getPaintingsSafe } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Галерея AZERII — картины на холсте',
  description: 'Картины на холсте: размер, техника, материал и цена каждой работы.',
};

export default async function GalleryPage() {
  const paintings = await getPaintingsSafe();

  return <GalleryView paintings={paintings} />;
}
