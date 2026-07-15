/**
 * Social media links (placeholders — replace `href` with real URLs).
 */

export type SocialName = 'tiktok' | 'facebook' | 'youtube';

export interface SocialLink {
  name: SocialName;
  label: string;
  href: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'tiktok', label: 'TikTok', href: '#' },
  { name: 'facebook', label: 'Facebook', href: '#' },
  { name: 'youtube', label: 'YouTube', href: '#' },
];
