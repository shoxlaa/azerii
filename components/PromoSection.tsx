'use client';

import Image from 'next/image';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';

export function PromoSection() {
  const { locale } = useLocale();
  const t = getDictionary(locale).promo;

  return (
    <section className="border-t border-border bg-panel">
      <Container className="py-14 md:py-16">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:gap-10 md:text-left">
          {/* Round emblem (theme-aware logo) */}
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-2 border-accent/40 md:h-32 md:w-32">
            <Image
              src="/logo-dark.png"
              alt=""
              width={200}
              height={204}
              className="h-16 w-auto dark:hidden md:h-20"
            />
            <Image
              src="/logo-light.png"
              alt=""
              width={200}
              height={204}
              className="hidden h-16 w-auto dark:block md:h-20"
            />
          </div>

          {/* Brand text */}
          <div className="max-w-2xl">
            <h2 className="font-display text-[26px] font-bold uppercase tracking-[1px] text-heading md:text-[32px]">
              {t.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-body">{t.text}</p>
          </div>

          {/* Decorative tank (desktop only) */}
          <div className="relative hidden h-28 w-64 shrink-0 opacity-30 grayscale md:block lg:ml-auto lg:w-72">
            <Image
              src="/hero/hero-german-field.jpg"
              alt=""
              fill
              sizes="288px"
              className="object-contain object-right"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
