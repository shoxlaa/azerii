'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { MonitorIcon, MoonIcon, SunIcon } from './icons';

const OPTIONS = [
  { value: 'light', label: 'Светлая', Icon: SunIcon },
  { value: 'dark', label: 'Тёмная', Icon: MoonIcon },
  { value: 'system', label: 'Системная', Icon: MonitorIcon },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Mount flag so we only read `theme` on the client (avoids hydration mismatch).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Placeholder with matching size before mount (avoids hydration mismatch).
  if (!mounted) {
    return <div className="h-8 w-[92px]" aria-hidden />;
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-border p-0.5"
      role="group"
      aria-label="Тема оформления"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              active
                ? 'bg-accent text-cream'
                : 'text-body hover:text-accent-text'
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
