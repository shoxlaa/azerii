'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { SOCIAL_LINKS } from '@/constants';
import { Container } from './ui/Container';
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from './icons';
import type { SocialName } from '@/constants/socials';

const SOCIAL_ICONS: Record<SocialName, React.FC<React.SVGProps<SVGSVGElement>>> = {
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
};

export function Footer() {
  const { locale } = useLocale();
  const t = getDictionary(locale).footer;

  // Links carry a stable href here; labels come from the dictionary so they
  // switch with the active locale. Hrefs are placeholders until routes exist.
  const catalogLinks = [
    { label: t.catalog.tanks, href: '#' },
    { label: t.catalog.armor, href: '#' },
    { label: t.catalog.dioramas, href: '#' },
    { label: t.catalog.accessories, href: '#' },
    { label: t.catalog.comingSoon, href: '#' },
  ];
  const infoLinks = [
    { label: t.info.about, href: '#' },
    { label: t.info.delivery, href: '#' },
    { label: t.info.returns, href: '#' },
    { label: t.info.news, href: '#' },
    { label: t.info.contacts, href: '#' },
  ];
  const supportLinks = [
    { label: t.support.faq, href: '#' },
    { label: t.support.help, href: '#' },
    { label: t.support.feedback, href: '#' },
  ];

  return (
    <footer className="mt-auto border-t border-border bg-footer text-footer-text">
      <Container className="py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.4fr]">
          {/* Brand + socials */}
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label="AZERII">
              {/* light theme → dark (black) mark; dark theme → light (cream) mark */}
              <Image
                src="/logo-dark.png"
                alt="AZERII"
                width={1024}
                height={1045}
                className="h-10 w-auto dark:hidden"
              />
              <Image
                src="/logo-light.png"
                alt="AZERII"
                width={1024}
                height={1045}
                className="hidden h-10 w-auto dark:block"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{t.tagline}</p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => {
                const Icon = SOCIAL_ICONS[s.name];
                return (
                  <a
                    key={s.href}
                    href={s.href}
                    aria-label={s.label}
                    title={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-footer-text transition-colors hover:border-accent hover:text-accent-text"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Catalog */}
          <FooterColumn title={t.catalog.title} links={catalogLinks} />
          {/* Information */}
          <FooterColumn title={t.info.title} links={infoLinks} />
          {/* Support */}
          <FooterColumn title={t.support.title} links={supportLinks} />

          {/* Newsletter */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-footer-heading">
              {t.subscribe.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed">{t.subscribe.description}</p>
            <form
              className="mt-4 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder={t.subscribe.placeholder}
                aria-label={t.subscribe.placeholder}
                className="min-w-0 flex-1 border border-border bg-transparent px-3 py-2.5 text-sm text-footer-heading outline-none placeholder:text-footer-text focus:border-accent"
              />
              <button
                type="submit"
                className="shrink-0 bg-accent px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-accent-hover"
              >
                {t.subscribe.button}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs sm:flex-row">
          <p>{t.copyright}</p>
          <p>{t.madeWith}</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-footer-heading">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="transition-colors hover:text-accent-text">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
