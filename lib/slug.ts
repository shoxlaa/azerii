/**
 * URL slug helpers.
 *
 * Product URLs are /catalog/[slug], where the slug is the product's
 * `catalogCode`. Codes are typed by hand in the admin, so anything that lands
 * in a URL must be normalized first — a stray space produced a 404 once.
 *
 * A safe slug is lowercase ASCII: letters, digits and single hyphens.
 */

/** Multi-character Cyrillic transliterations, applied before the 1:1 map. */
const MULTI: [RegExp, string][] = [
  [/ё/g, 'yo'],
  [/ж/g, 'zh'],
  [/ц/g, 'ts'],
  [/ч/g, 'ch'],
  [/ш/g, 'sh'],
  [/щ/g, 'sch'],
  [/ю/g, 'yu'],
  [/я/g, 'ya'],
];

/** 1:1 Cyrillic → Latin map. `ь`/`ъ` are dropped. */
const SINGLE: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', з: 'z', и: 'i', й: 'j',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ы: 'y', э: 'e', ь: '', ъ: '',
};

/** Pattern a valid slug must match: lowercase ASCII words joined by hyphens. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Normalize any string into a URL-safe slug.
 *
 * Lowercases, transliterates Cyrillic, strips accents, replaces every run of
 * unsupported characters (spaces included) with a single hyphen, and trims
 * leading/trailing hyphens.
 *
 * @example slugify('AZ-TNK-T28-KT28 test') // 'az-tnk-t28-kt28-test'
 * @example slugify('Т-29-5')               // 't-29-5'
 * @returns a safe slug, or '' if the input has nothing usable.
 */
export function slugify(input: string): string {
  if (!input) return '';

  let s = input.toLowerCase();
  // Strip diacritics (é → e) before the ASCII filter removes them entirely.
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [re, to] of MULTI) s = s.replace(re, to);
  // Any remaining Cyrillic → Latin (unmapped letters are dropped).
  s = s.replace(/[\u0400-\u04ff]/g, (ch) => SINGLE[ch] ?? '');
  // Any run of unsupported characters collapses to one hyphen.
  s = s.replace(/[^a-z0-9]+/g, '-');
  return s.replace(/^-+|-+$/g, '');
}

/** True when `value` is already a safe slug. */
export function isValidSlug(value: string): boolean {
  return SLUG_PATTERN.test(value);
}
