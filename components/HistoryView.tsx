'use client';

/**
 * HistoryView — the /history page: a title wall, then the ribbon.
 *
 * Split out of the museum: /museum is now the standing collection of finished
 * exhibits, while the story of the machines themselves lives here. The title
 * wall travels with the ribbon because its heading *is* the ribbon's name.
 *
 * No prices and no buy buttons — a block links to a model's page to read
 * about it, not to buy it.
 */

import type { MuseumTimelineEntry } from '@/types';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';
import { MuseumTimeline, KICKER_CLASS } from './MuseumTimeline';

export function HistoryView({ timeline }: { timeline: MuseumTimelineEntry[] }) {
  return (
    <>
      <TitleWall />
      <MuseumTimeline entries={timeline} />
    </>
  );
}

/**
 * Title wall — the plate by the door.
 *
 * Sized after `.text-h1` but set in `font-heading`: the display face is Latin
 * only, and this heading has to render in Russian too.
 */
function TitleWall() {
  const { locale } = useLocale();
  const t = getDictionary(locale).historyPage;

  return (
    <section className="py-12 text-center md:py-16">
      <Container>
        <p className={KICKER_CLASS}>{t.kicker}</p>
        <h1 className="mt-5 font-heading text-[40px] font-bold uppercase leading-[0.95] tracking-[1px] text-heading md:text-[56px] lg:text-[72px] lg:tracking-[2px]">
          {t.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-subtle">{t.lead}</p>
      </Container>
    </section>
  );
}
