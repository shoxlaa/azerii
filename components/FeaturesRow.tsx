'use client';

import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';
import { BrushIcon, MedalIcon, ShieldIcon, TargetIcon } from './icons';

export function FeaturesRow() {
  const { locale } = useLocale();
  const a = getDictionary(locale).advantages;

  const items = [
    { Icon: TargetIcon, ...a.historical },
    { Icon: ShieldIcon, ...a.quality },
    { Icon: BrushIcon, ...a.modelers },
    { Icon: MedalIcon, ...a.madeIn },
  ];

  return (
    <section className="border-y border-border bg-panel">
      <Container className="py-10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4">
              <Icon className="mt-0.5 h-8 w-8 shrink-0 text-accent-text" />
              <div>
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-heading">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-subtle">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
