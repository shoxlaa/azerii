import type { Metadata } from 'next';
import { Stardos_Stencil, Oswald, Roboto } from 'next/font/google';
import { cookies } from 'next/headers';
import '../globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartHydrator } from '@/components/CartHydrator';
import { LocaleProvider } from '@/i18n/locale-context';
import { ThemeProvider } from '@/components/ThemeProvider';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from '@/i18n/config';

/** Display — Latin serif stencil for model names / brand (SOMUA S-35, AZERII). */
const stencil = Stardos_Stencil({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-stencil',
  display: 'swap',
});

/** Sub-headings / accents — condensed. */
const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-oswald',
  display: 'swap',
});

/** Body text. */
const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AZERII — Scale Model',
  description:
    'AZERII — масштабные модели бронетехники. Историческая точность, премиальное качество.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Resolve the active locale from the persisted cookie; first visit → default (EN).
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value;
  const initialLocale = stored && isLocale(stored) ? stored : DEFAULT_LOCALE;

  return (
    <html
      lang={initialLocale}
      suppressHydrationWarning
      className={`${stencil.variable} ${oswald.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg font-body text-body">
        <ThemeProvider>
          <LocaleProvider initialLocale={initialLocale}>
            <CartHydrator />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
