# AZERII — гайд по стилю для новых страниц

> Скопируй этот файл целиком в новый чат. В нём всё, что нужно, чтобы создать
> страницу, визуально неотличимую от остального сайта. Ничего додумывать не надо —
> все значения взяты из работающего кода.

---

## 1. Что это за проект

Интернет-магазин масштабных моделей бронетехники 1:16 (AZERII, Азербайджан).
Дизайн — «военный постер»: оливково-кремовая палитра, трафаретные заголовки,
крупные фотографии. Работает в **светлой и тёмной** темах.

## 2. Стек (не меняй версии)

| | |
|---|---|
| Next.js | **16.2.10**, App Router, route group `app/(frontend)` |
| React | 19.2.4 |
| Tailwind CSS | **v4** — токены в `@theme`, файла `tailwind.config` НЕТ |
| CMS | Payload 3.86 + Supabase Postgres |
| Темы | `next-themes`, `attribute="class"` |
| Состояние | Zustand 5 (только корзина) |

⚠️ **Next.js 16 отличается от того, что ты можешь помнить:**
- `middleware.ts` переименован в **`proxy.ts`**
- `params` и `searchParams` — это **Promise**, их надо `await`
- `cookies()` — **асинхронная**, `await cookies()`

---

## 3. Дизайн-токены

Всё уже объявлено в `app/globals.css`. **Используй только эти токены** — никаких
произвольных hex-цветов.

### Цвета (Tailwind-классы)

| Токен | Класс | Светлая | Тёмная | Для чего |
|---|---|---|---|---|
| bg | `bg-bg` | `#ffffff` | `#1a1a1a` | фон страницы |
| panel | `bg-panel` | `#f5f5f5` | `#1c1c1c` | карточки, панели |
| heading | `text-heading` | `#1a1a1a` | `#f2ede3` | заголовки |
| body | `text-body` | `#2a2a2a` | `#ddd6c8` | основной текст |
| subtle | `text-subtle` | `#5a5346` | `#cfc7b8` | подписи, второстепенное |
| accent-text | `text-accent-text` | `#3f4a24` | `#8a9a5b` | акцентный текст, ссылки |
| border | `border-border` | `rgba(0,0,0,.12)` | `rgba(255,255,255,.1)` | рамки |
| **accent** | `bg-accent` | `#4e5a2e` | одинаково | заливка кнопок, плашки |
| accent-hover | `bg-accent-hover` | `#5e6d38` | одинаково | ховер |
| cream | `text-cream` | `#efe9da` | одинаково | текст НА оливковой заливке |

**Золота на сайте нет.** Акцент один — оливковый.

Статусы товаров: `--color-status-in-stock` `#55702f`, `out-of-stock` `#8f3a2e`,
`coming-soon` `#4a5a63`, `planned` `#6b6f7a`, `discontinued` `#5e2a22`,
`limited` `#6b5a30`, `in-development` `#565c3a`.

### Шрифты

| Класс | Шрифт | Где |
|---|---|---|
| `font-display` | Stardos Stencil | названия моделей, бренд (только латиница!) |
| `font-heading` | Oswald | заголовки, кнопки, подписи — **есть кириллица** |
| `font-body` | Roboto | текст — **есть кириллица** |

⚠️ Для русского текста **никогда** не используй `font-display` — в Stardos Stencil
нет кириллицы.

### Готовые классы

`.text-h1` (72px, на мобильном 40px) · `.text-subhead` · `.text-price` (42px)
· `.table-head` (оливковая плашка для шапок таблиц) · `.header-bg`

Сетка: `--container-site: 1200px`.

---

## 4. Обязательные шаблоны

### Каркас страницы

```tsx
// app/(frontend)/тема/page.tsx
import type { Metadata } from 'next';
import { МояView } from '@/components/МояView';

export const metadata: Metadata = { title: 'Заголовок — AZERII' };

export default function МояPage() {
  return <МояView />;
}
```

Данные тянет **серверная** страница и передаёт пропсами в клиентский компонент.
Клиентские компоненты не ходят в БД.

### Каркас секции — копируй один в один

```tsx
'use client';

import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';

export function МояView() {
  const { locale } = useLocale();
  const t = getDictionary(locale).мойРаздел;

  return (
    <section className="py-12 md:py-16">
      <Container>
        <h1 className="font-heading text-[40px] font-bold uppercase tracking-[1px] text-heading md:text-[56px]">
          {t.title}
        </h1>
        <p className="mt-2 max-w-2xl text-subtle">{t.lead}</p>
      </Container>
    </section>
  );
}
```

### Карточка

```tsx
<div className="group flex flex-col overflow-hidden rounded-md border border-border bg-panel transition-colors hover:border-accent/60">
  {/* Фото: фиксированная пропорция + object-contain (НЕ обрезать!) */}
  <span className="relative block aspect-[4/3] w-full overflow-hidden bg-bg">
    <Image src={photo} alt={name} fill sizes="(max-width:640px) 100vw, 400px"
           className="object-contain p-2" />
  </span>
  <div className="flex flex-1 flex-col p-4">
    <h3 className="font-heading text-base font-semibold uppercase tracking-wide text-heading transition-colors group-hover:text-accent-text">
      {name}
    </h3>
    <p className="mt-1 font-heading text-xs uppercase tracking-wide text-subtle">{подпись}</p>
  </div>
</div>
```

### Кнопки

```tsx
{/* Главная */}
<button className="inline-flex h-[52px] items-center justify-center rounded-[4px] bg-accent px-6 font-heading text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-accent-hover">
  Действие
</button>

{/* Второстепенная */}
<button className="inline-flex h-[52px] items-center justify-center rounded-[4px] border border-border px-6 font-heading text-sm font-semibold uppercase tracking-wide text-body transition-colors hover:border-accent hover:text-accent-text">
  Действие
</button>
```

### Чипы-фильтры

```tsx
<button className={`rounded-full border px-4 py-2 font-heading text-xs uppercase tracking-wide transition-colors ${
  active ? 'border-accent bg-accent text-cream'
         : 'border-border text-body hover:border-accent hover:text-accent-text'
}`}>
```

### Пустое состояние

```tsx
<div className="mt-20 mb-10 text-center">
  <p className="font-heading text-xl font-semibold uppercase tracking-wide text-heading">
    {t.empty}
  </p>
  <p className="mt-2 text-subtle">{t.emptyHint}</p>
</div>
```

### Модальное окно

```tsx
createPortal(
  <div role="dialog" aria-modal="true" onClick={onClose}
       className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
    <div onClick={(e) => e.stopPropagation()}
         className="relative w-full max-w-5xl overflow-hidden rounded-md border border-border bg-panel">
      {/* содержимое */}
    </div>
  </div>,
  document.body,
)
```
Обязательно: закрытие по Esc, блокировка прокрутки (`document.body.style.overflow`
с восстановлением прежнего значения), клик по фону закрывает.

---

## 5. Правила, которые нельзя нарушать

1. **Фото товаров — только `object-contain`** на фиксированной пропорции
   (`aspect-[4/3]`), фон контейнера — под цвет карточки. Обрезать модели нельзя.
   Никакого `hover:scale` на фото — он тоже обрезает.
2. **Двуязычность (EN/RU).** Никакого текста прямо в разметке — всё через
   словари `i18n/dictionaries/{en,ru}.ts`. Оба файла должны иметь одинаковую
   структуру (тип `Dictionary` выводится из `en`).
3. **Обе темы.** Пользуйся только токенами — тогда тёмная тема работает сама.
   Не пиши `text-white` / `bg-black` / произвольные hex.
4. **Адаптив**: базовые стили мобильные, дальше `sm:` `md:` `lg:`. Проверяй
   на 390 / 768 / 1440. Горизонтальной прокрутки быть не должно — в grid-колонки
   добавляй `min-w-0`.
5. **Отступы секций:** `py-12 md:py-16`. Всё содержимое — в `<Container>`.
6. **Скругление:** `rounded-md` для карточек, `rounded-[4px]` для кнопок,
   `rounded-full` для чипов.
7. **Регистр:** заголовки и кнопки — `uppercase` + `tracking-wide`, шрифт
   `font-heading`.
8. **Внешние ссылки:** всегда `target="_blank" rel="noopener noreferrer"`.

---

## 6. Как добавить текст на двух языках

`i18n/dictionaries/en.ts` и `ru.ts` — добавь одинаковый по структуре блок:

```ts
// en.ts
мойРаздел: { title: 'Title', lead: 'Subtitle', empty: 'Nothing here yet' },
// ru.ts
мойРаздел: { title: 'Заголовок', lead: 'Подзаголовок', empty: 'Здесь пока пусто' },
```

В навигацию: `nav.мойРаздел` в оба словаря + пункт в `components/Header.tsx`
(массив `navItems`).

---

## 7. Готовые кирпичики — переиспользуй, не пиши заново

| Что | Откуда импортировать |
|---|---|
| Контейнер 1200px | `@/components/ui/Container` |
| Кнопка | `@/components/ui/Button` (варианты `buy` / `cart`) |
| Бейдж статуса | `@/components/ui/Badge` |
| Заголовок секции | `@/components/ui/SectionTitle` |
| Иконки (SVG) | `@/components/icons` |
| Цена в EUR | `formatPrice(amount, locale)` из `@/lib/format` |
| Округление денег | `roundMoney()` из `@/lib/format` |
| Безопасный slug | `slugify()`, `isValidSlug()` из `@/lib/slug` |
| Галерея с зумом и лайтбоксом | `@/components/ProductGallery` |

**Цены хранятся в EUR с копейками** (`499.99`), не в центах. Выводить только
через `formatPrice`.

---

## 8. Что сказать в новом чате

> Вот гайд по стилю проекта AZERII (Next.js 16 App Router + Tailwind v4).
> Сделай страницу `/название`, строго следуя этому гайду: те же токены,
> те же шаблоны карточек и кнопок, обе темы, тексты EN/RU через словари,
> адаптив 390/768/1440. Фото товаров — `object-contain`, не обрезать.

---

## 9. Проверка перед сдачей

```bash
npx tsc --noEmit     # должно быть чисто
npm run lint         # должно быть чисто
npm run build        # должно быть чисто
```

Глазами: светлая и тёмная тема, 390 / 768 / 1440, нет горизонтальной
прокрутки, тексты переключаются между EN и RU.
