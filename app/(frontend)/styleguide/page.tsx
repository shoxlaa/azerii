import type { Metadata } from 'next';
import { Badge, Button, Container, SectionTitle } from '@/components/ui';
import { PRODUCT_STATUSES } from '@/constants';
import { formatPrice } from '@/lib/format';
import { getDictionary } from '@/i18n';

export const metadata: Metadata = {
  title: 'Styleguide — AZERII',
};

/** Color tokens to preview. */
const COLOR_TOKENS: { name: string; token: string; hex: string; ring?: boolean }[] = [
  { name: 'bg / white', token: '--color-bg', hex: '#FFFFFF', ring: true },
  { name: 'ink', token: '--color-ink', hex: '#1A1A1A' },
  { name: 'accent', token: '--color-accent', hex: '#4E5A2E' },
  { name: 'accent-hover', token: '--color-accent-hover', hex: '#5E6D38' },
  { name: 'accent-text', token: '--color-accent-text', hex: '#8A9A5B' },
  { name: 'heading', token: '--color-heading', hex: '#F2EDE3' },
  { name: 'body', token: '--color-body', hex: '#DDD6C8' },
  { name: 'subtle', token: '--color-subtle', hex: '#CFC7B8' },
  { name: 'footer', token: '--color-footer', hex: '#111111', ring: true },
];

const FONT_SAMPLES: { label: string; varName: string; className: string; note?: string }[] = [
  {
    label: 'Stardos Stencil · --font-display (--font-stencil)',
    varName: '--font-stencil',
    className: 'font-display',
    note: 'Latin only — используется для логотипа и латинских заголовков (SOMUA S-35).',
  },
  {
    label: 'Oswald · --font-heading (--font-oswald)',
    varName: '--font-oswald',
    className: 'font-heading',
  },
  {
    label: 'Roboto · --font-body (--font-roboto)',
    varName: '--font-roboto',
    className: 'font-body',
  },
];

export default function StyleguidePage() {
  const dict = getDictionary('ru');

  return (
    <div className="py-16">
      <Container>
        <p className="font-heading text-sm uppercase tracking-[3px] text-accent-text">
          AZERII Design System
        </p>
        <h1 className="text-h1 mt-2">STYLEGUIDE</h1>
        <p className="text-subhead mt-4 max-w-2xl">
          Тёмная военно-трафаретная премиальная стилистика. Проверочная
          страница токенов, шрифтов и компонентов.
        </p>
      </Container>

      {/* Colors */}
      <section className="mt-20">
        <Container>
          <SectionTitle>Цвета</SectionTitle>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {COLOR_TOKENS.map((c) => (
              <div key={c.name} className="rounded-md bg-panel p-3">
                <div
                  className={`h-20 w-full rounded ${c.ring ? 'ring-1 ring-border' : ''}`}
                  style={{ backgroundColor: c.hex }}
                />
                <p className="mt-3 font-heading text-sm font-semibold uppercase text-heading">
                  {c.name}
                </p>
                <p className="text-xs text-subtle">{c.hex}</p>
                <p className="mt-1 font-mono text-[11px] text-subtle">
                  {c.token}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Fonts */}
      <section className="mt-24">
        <Container>
          <SectionTitle>Шрифты</SectionTitle>
          <div className="mt-8 space-y-6">
            {FONT_SAMPLES.map((f) => (
              <div key={f.varName} className="rounded-md bg-panel p-6">
                <p className="font-mono text-xs text-subtle">{f.label}</p>
                <p className={`${f.className} mt-3 text-4xl text-heading`}>
                  AZERII · SOMUA S-35 1:16
                </p>
                <p className={`${f.className} mt-2 text-2xl text-subtle`}>
                  Французский лёгкий танк · Бронетехника
                </p>
                {f.note ? (
                  <p className="mt-3 text-xs text-status-coming-soon">{f.note}</p>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Typography */}
      <section className="mt-24">
        <Container>
          <SectionTitle>Типографика</SectionTitle>
          <div className="mt-8 space-y-8 rounded-md bg-panel p-8">
            <div>
              <p className="font-mono text-xs text-subtle">
                H1 · 72px / lh 0.95 / ls 2px / Stardos Stencil / heading
              </p>
              <h1 className="text-h1 mt-2">SOMUA S-35</h1>
            </div>
            <div>
              <p className="font-mono text-xs text-subtle">
                Подзаголовок · 18px / subtle
              </p>
              <p className="text-subhead mt-2">ФРАНЦУЗСКИЙ ЛЁГКИЙ ТАНК</p>
            </div>
            <div>
              <p className="font-mono text-xs text-subtle">
                Цена · 42px / accent
              </p>
              <p className="text-price mt-2">{formatPrice(499.99, 'en')}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-subtle">
                Заголовок доп. блока · 28px
              </p>
              <p className="mt-2 font-heading text-[28px] font-bold uppercase tracking-wide text-heading">
                Каталог моделей
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-subtle">
                Основной текст · 16px / lh 1.6
              </p>
              <p className="mt-2 max-w-2xl">
                Мы создаём масштабные модели бронетехники, чтобы сохранить
                историю и вдохновить следующее поколение моделистов. Каждая
                модель — это сочетание исторической точности, высокого качества
                и любви к деталям.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Buttons */}
      <section className="mt-24">
        <Container>
          <SectionTitle>Кнопки</SectionTitle>
          <div className="mt-8 flex flex-wrap items-center gap-6 rounded-md bg-panel p-8">
            <Button variant="buy">Смотреть каталог</Button>
            <Button variant="cart">В корзину</Button>
            <Button variant="buy" disabled>
              Недоступно
            </Button>
          </div>
        </Container>
      </section>

      {/* Badges */}
      <section className="mt-24">
        <Container>
          <SectionTitle>Бейджи статусов</SectionTitle>
          <div className="mt-8 flex flex-wrap gap-4 rounded-md bg-panel p-8">
            {PRODUCT_STATUSES.map((status) => (
              <Badge key={status} status={status} label={dict.status[status]} />
            ))}
          </div>
        </Container>
      </section>

      {/* Hero reference block — for visual comparison with reference-home.png */}
      <section className="mt-24">
        <Container>
          <SectionTitle>Hero (сверка с эталоном)</SectionTitle>
        </Container>
        <div className="dark mt-8 border-y border-white/10 bg-[#151515] py-20">
          <Container>
            <div className="max-w-xl">
              <h1 className="text-h1">SOMUA S-35</h1>
              <p className="text-subhead mt-4">ФРАНЦУЗСКИЙ ЛЁГКИЙ ТАНК</p>
              <p className="mt-1 font-heading text-lg uppercase tracking-wide text-subtle">
                Масштаб 1:16
              </p>
              <div className="mt-8">
                <Button variant="buy">Смотреть каталог →</Button>
              </div>
            </div>
          </Container>
        </div>
      </section>
    </div>
  );
}
