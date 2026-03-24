'use client';

import { useTheme } from '../../lib/theme-context';

export default function ThemePicker() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {themes.map((t) => {
        const isActive = theme === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            title={t.label}
            aria-label={t.label}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              border-2 transition-all duration-150 cursor-pointer
              ${isActive ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}
            `.trim()}
            style={{ backgroundColor: t.preview }}
          >
            {isActive && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
