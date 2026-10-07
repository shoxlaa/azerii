import { Hero } from '@/components/Hero';
import { CatalogSection } from '@/components/CatalogSection';
import { MuseumSection } from '@/components/MuseumSection';
import { GallerySection } from '@/components/GallerySection';
import { HistorySection } from '@/components/HistorySection';
import { MuseumTimeline } from '@/components/MuseumTimeline';
import { FeaturesRow } from '@/components/FeaturesRow';
import { WorkshopSection } from '@/components/WorkshopSection';
import { PromoSection } from '@/components/PromoSection';
import { getMuseumItemsSafe, getPaintingsSafe, getProductsSafe } from '@/lib/data';
import { buildTimeline } from '@/lib/museum';
import { getWorkshopVideos } from '@/lib/youtube';

/** How many history blocks the home page teases before /history takes over. */
const TIMELINE_PREVIEW_COUNT = 3;

/**
 * How many cards the museum and gallery rows carry before their own pages take
 * over. The rows scroll, so this only caps the payload, not the layout.
 */
const ROW_PREVIEW_COUNT = 8;

export default async function Home() {
  // Real products from Payload; fall back to demo data until the catalog is populated.
  const items = await getProductsSafe();
  // Latest workshop videos from YouTube RSS (ISR, hourly), demo fallback.
  const videos = await getWorkshopVideos();
  // Teaser rows for the museum and the gallery; both degrade to empty, and the
  // sections take themselves off the page when there is nothing to show.
  const [exhibits, paintings] = await Promise.all([
    getMuseumItemsSafe(),
    getPaintingsSafe(),
  ]);

  // The opening entries of the museum ribbon, built from the products already
  // fetched above — the full timeline lives on /history.
  const timeline = buildTimeline(items).slice(0, TIMELINE_PREVIEW_COUNT);

  return (
    <>
      <Hero />
      <CatalogSection products={items} />
      {/* Museum and gallery teasers — scrolling card rows, same shape as the workshop. */}
      <MuseumSection items={exhibits.slice(0, ROW_PREVIEW_COUNT)} />
      <GallerySection paintings={paintings.slice(0, ROW_PREVIEW_COUNT)} />
      <FeaturesRow />
      <WorkshopSection videos={videos} />
      <PromoSection />
      {/* History of Armor — museum ribbon; kept last, right before the footer. */}
      <HistorySection />
      <MuseumTimeline entries={timeline} />
    </>
  );
}
