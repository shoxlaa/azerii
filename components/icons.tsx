/**
 * Inline SVG icons (currentColor). Keeps the header/footer dependency-free.
 */
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...props}>
      <path d="M6 7h13l-1.2 9.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7Z" strokeLinejoin="round" />
      <path d="M9 7a3 3 0 0 1 6 0" strokeLinecap="round" />
    </svg>
  );
}

export function BurgerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...props}>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.5 3c.3 2.1 1.6 3.6 3.5 3.9v2.5c-1.3.1-2.5-.3-3.5-1v6.1a5.4 5.4 0 1 1-5.4-5.4c.3 0 .5 0 .8.1v2.6a2.8 2.8 0 1 0 2 2.7V3h2.6Z" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13.5 21v-7h2.3l.4-2.7h-2.7V9.5c0-.8.2-1.3 1.4-1.3h1.4V5.8c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v1.9H8.6V14h2.3v7h2.6Z" />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M22 12s0-2.6-.3-3.8a2.4 2.4 0 0 0-1.7-1.7C18.8 6.2 12 6.2 12 6.2s-6.8 0-8 .3A2.4 2.4 0 0 0 2.3 8.2C2 9.4 2 12 2 12s0 2.6.3 3.8c.2.9.9 1.5 1.7 1.7 1.2.3 8 .3 8 .3s6.8 0 8-.3a2.4 2.4 0 0 0 1.7-1.7c.3-1.2.3-3.8.3-3.8Zm-12 3V9l5 3-5 3Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      {/* Rounded-square frame (donut via even-odd) */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Z"
      />
      {/* Lens ring */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"
      />
      {/* Flash dot */}
      <circle cx="16.6" cy="7.4" r="1.1" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" aria-hidden {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M1 12h4M19 12h4" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round" aria-hidden {...props}>
      <path d="M12 2.5 20 6v5c0 5-3.5 8.5-8 10.5C7.5 19.5 4 16 4 11V6l8-3.5Z" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" />
    </svg>
  );
}

export function BrushIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M15.5 3.5 20.5 8.5 12 17H7v-5z" />
      <path d="M7 17c0 2-1 3.5-4 4 .5-2 .5-3.5 2-4" />
      <path d="m14 5 5 5" />
    </svg>
  );
}

export function MedalIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M8 3 6 8h12l-2-5" />
      <circle cx="12" cy="15" r="6" />
      <path d="m12 12 1 2 2 .3-1.5 1.4.4 2L12 16.6 10.1 17.7l.4-2L9 14.3l2-.3z" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden {...props}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" aria-hidden {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

export function MonitorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M9 20h6M12 16v4" />
    </svg>
  );
}

/** Azerbaijan flag — compact rounded rectangle (blue/red/green + crescent & star). */
export function AzFlagIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 30 20" aria-hidden {...props}>
      <clipPath id="az-r">
        <rect width="30" height="20" rx="2.5" />
      </clipPath>
      <g clipPath="url(#az-r)">
        <rect width="30" height="6.667" y="0" fill="#0092BC" />
        <rect width="30" height="6.667" y="6.667" fill="#E4002B" />
        <rect width="30" height="6.666" y="13.333" fill="#00AE65" />
        <circle cx="14.2" cy="10" r="3.1" fill="#fff" />
        <circle cx="15.1" cy="10" r="2.5" fill="#E4002B" />
        <path
          fill="#fff"
          d="m17.8 8.1.5 1.4h1.5l-1.2.9.5 1.4-1.3-.9-1.2.9.4-1.4-1.2-.9h1.5z"
          transform="scale(0.62) translate(9 4.2)"
        />
      </g>
    </svg>
  );
}

/** Small hexagon emblem used next to the logo wordmark. */
export function HexIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden {...props}>
      <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7L12 2.5Z" strokeLinejoin="round" />
      <path d="M12 7.5 16 10v4l-4 2.5L8 14v-4l4-2.5Z" strokeLinejoin="round" />
    </svg>
  );
}
