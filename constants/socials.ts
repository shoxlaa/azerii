/**
 * Social media links (placeholders — replace `href` with real URLs).
 */

export type SocialName = 'tiktok' | 'facebook' | 'youtube' | 'instagram' ;

export interface SocialLink {
  name: SocialName;
  label: string;
  href: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@ilgar.ismailov8?_r=1&_t=ZS-986hHM2jDbm' },
  { name: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1DGdsVwpuU/' },
  { name: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@IlgarIsmailovrctank' },
  { name: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/ilgarismailovrctank?utm_source=qr&igsh=MTNleWQ3bWJwcmZhNQ==' },
];
