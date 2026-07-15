'use client';

import Image from 'next/image';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { YOUTUBE_PLAYLIST_URL, type WorkshopVideo } from '@/constants/workshopVideos';
import { Container } from './ui/Container';
import { SectionTitle } from './ui/SectionTitle';
import { PlayIcon } from './icons';

export function WorkshopSection({ videos }: { videos: WorkshopVideo[] }) {
  const { locale } = useLocale();
  const t = getDictionary(locale).workshop;

  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionTitle
          action={
            <a
              href={YOUTUBE_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-sm font-semibold uppercase tracking-wide text-accent-text transition-colors hover:text-accent-text"
            >
              {t.viewAll} <span aria-hidden>→</span>
            </a>
          }
        >
          {t.title}
        </SectionTitle>
      </Container>

      <Container className="mt-8">
        <div className="-mx-6 flex gap-5 overflow-x-auto px-6 pb-2 md:-mx-10 md:px-10 lg:mx-0 lg:px-0">
          {videos.map((v) => (
            <a
              key={v.id}
              href={v.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-[200px] shrink-0 sm:w-[220px]"
            >
              <div className="relative aspect-video overflow-hidden rounded-md bg-panel">
                <Image
                  src={v.thumbnail}
                  alt={v.caption}
                  fill
                  sizes="220px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 ring-1 ring-white/40 backdrop-blur-sm transition group-hover:bg-black/60">
                    <PlayIcon className="ml-0.5 h-5 w-5 text-white" />
                  </span>
                </div>
              </div>
              <p className="mt-2.5 text-xs text-subtle">{v.author}</p>
              <p className="mt-1 line-clamp-2 text-sm leading-snug text-heading">
                {v.caption}
              </p>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
