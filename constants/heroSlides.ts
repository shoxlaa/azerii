/**
 * Hero slider slides. Text (title/subtitle) is resolved from the i18n
 * dictionary via `key` (see dict.hero.slides[key]); only the non-translatable
 * parts (images, link) live here.
 *
 * - `image`   — full photo (whole tank), shown sharp via object-contain.
 * - `imageBg` — wide 16:5 crop, used as a blurred full-bleed backdrop so
 *               there are no empty bars around the contained tank.
 */

export type HeroSlideKey = 'somua' | 'b1' | 't28' | 'german';

export interface HeroSlide {
  key: HeroSlideKey;
  image: string;
  imageBg: string;
  ctaHref: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  { key: 'somua', image: '/hero/somua-s35.jpg', imageBg: '/hero/somua-wide.jpg', ctaHref: '/catalog' },
  { key: 'b1', image: '/hero/hero-b1-reims.jpg', imageBg: '/hero/b1-reims-wide.jpg', ctaHref: '/catalog' },
  { key: 't28', image: '/hero/hero-t28-polygon.jpg', imageBg: '/hero/t28-polygon-wide.jpg', ctaHref: '/catalog' },
  { key: 'german', image: '/hero/hero-german-field.jpg', imageBg: '/hero/german-field-wide.jpg', ctaHref: '/catalog' },
];
