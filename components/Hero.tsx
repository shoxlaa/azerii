'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { HERO_SLIDES } from '@/constants/heroSlides';
import { Container } from './ui/Container';
import { AzFlagIcon } from './icons';

/**
 * Hero — compact autoplaying slider (Embla).
 *
 * Theme-independent: always uses fixed dark/light colors (not theme tokens),
 * because every slide sits over a dark photo. The site theme does not affect it.
 */
export function Hero() {
  const { locale } = useLocale();
  const t = getDictionary(locale).hero;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 6000, stopOnMouseEnter: true, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <section className="relative w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {HERO_SLIDES.map((slide, i) => {
            const text = t.slides[slide.key];
            return (
              <div key={slide.key} className="relative min-w-0 flex-[0_0_100%]">
                <div className="relative overflow-hidden">
                  {/* Blurred full-bleed backdrop (wide crop) — no empty bars */}
                  <Image
                    src={slide.imageBg}
                    alt=""
                    fill
                    priority={i === 0}
                    /* blur-2xl destroys the detail anyway: ask for one small
                       width instead of the whole 100vw ladder. */
                    sizes="640px"
                    className="scale-110 object-cover blur-2xl"
                  />
                  <div className="absolute inset-0 bg-black/40" />

                  {(() => {
                    const textBlock = (
                      <div className="max-w-xl">
                        <h1
                          className="font-display text-[40px] font-bold uppercase leading-[0.95] tracking-[2px] text-[#F2EDE3] md:text-[64px]"
                          style={{ textShadow: '0 2px 14px rgba(0,0,0,0.55)' }}
                        >
                          {text.title}
                        </h1>
                        <p className="mt-3 font-heading text-base uppercase tracking-wide text-[#CFC7B8] md:text-lg">
                          {text.subtitle}
                        </p>
                        <p className="mt-1 font-heading text-sm uppercase tracking-wide text-[#CFC7B8]/80 md:text-base">
                          {t.scale}
                        </p>
                        <div className="mt-5 inline-flex items-center gap-2.5 rounded-sm border border-white/25 bg-black/30 px-4 py-2 backdrop-blur-sm">
                          <AzFlagIcon className="h-4 w-6 shrink-0" />
                          <span className="font-heading text-xs font-semibold uppercase tracking-[2px] text-[#F2EDE3]">
                            {t.madeIn}
                          </span>
                        </div>
                        <div className="mt-6">
                          <Link
                            href={slide.ctaHref}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-accent px-7 font-heading text-sm font-semibold uppercase tracking-wide text-[#F2EDE3] transition-colors hover:bg-accent-hover md:h-[52px] md:text-base"
                          >
                            {t.cta}
                            <span aria-hidden>→</span>
                          </Link>
                        </div>
                      </div>
                    );

                    return (
                      <>
                        {/* DESKTOP: full-bleed tank layer + centered text overlay (unchanged) */}
                        <div className="relative hidden md:flex md:h-[52vh] md:min-h-[380px] md:items-center">
                          <Image
                            src={slide.image}
                            alt=""
                            fill
                            priority={i === 0}
                            sizes="100vw"
                            className="object-contain object-[right_center]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/80 from-25% via-black/45 to-transparent" />
                          <Container className="relative z-10">{textBlock}</Container>
                        </div>

                        {/* MOBILE: text pinned to top, larger tank in its own zone below (no overlap) */}
                        <div className="relative z-10 flex flex-col pb-11 md:hidden">
                          <div className="bg-gradient-to-b from-black/55 via-black/25 to-transparent">
                            <Container className="pt-9 pb-5">{textBlock}</Container>
                          </div>
                          <div className="relative h-[44vh] min-h-[280px] w-full">
                            <Image
                              src={slide.image}
                              alt=""
                              fill
                              priority={i === 0}
                              sizes="100vw"
                              className="object-contain object-center"
                            />
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.key}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Слайд ${i + 1}`}
            aria-current={i === selectedIndex}
            className={`h-2 rounded-full transition-all ${
              i === selectedIndex ? 'w-6 bg-[#8A9A5B]' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
