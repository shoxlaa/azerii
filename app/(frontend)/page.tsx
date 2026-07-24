import { Hero } from '@/components/Hero';
import { CatalogSection } from '@/components/CatalogSection';
import { HistorySection } from '@/components/HistorySection';
import { MuseumTimeline } from '@/components/MuseumTimeline';
import { FeaturesRow } from '@/components/FeaturesRow';
import { WorkshopSection } from '@/components/WorkshopSection';
import { PromoSection } from '@/components/PromoSection';
import { getProductsSafe } from '@/lib/data';
import { buildTimeline } from '@/lib/museum';
import { getWorkshopVideos } from '@/lib/youtube';

/** How many history blocks the home page teases before /history takes over. */
const TIMELINE_PREVIEW_COUNT = 3;

export default async function Home() {
  // Real products from Payload; fall back to demo data until the catalog is populated.
  const items = await getProductsSafe();
  // Latest workshop videos from YouTube RSS (ISR, hourly), demo fallback.
  const videos = await getWorkshopVideos();

  // The opening entries of the museum ribbon, built from the products already
  // fetched above — the full timeline lives on /history.
  const timeline = buildTimeline(items).slice(0, TIMELINE_PREVIEW_COUNT);

  return (
    <>
      <Hero />
      <CatalogSection products={items} />
      <FeaturesRow />
      <WorkshopSection videos={videos} />
      <PromoSection />
      {/* History of Armor — museum ribbon; kept last, right before the footer. */}
      <HistorySection />
      <MuseumTimeline entries={timeline} />
    </>
  );
}
