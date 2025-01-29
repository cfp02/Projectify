'use client';

import { useTheme } from '@/contexts/ThemeContext';

export function ThemeSelector() {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="relative group">
      <button 
        className={`
          px-3 py-2 rounded-lg text-sm font-medium
          transition-all duration-200
          border border-opacity-50
          hover:border-opacity-100
          flex items-center gap-2
        `}
        style={{
          backgroundColor: currentTheme.colors.cardBackground,
          borderColor: currentTheme.colors.border.default,
          color: currentTheme.colors.text.primary,
        }}
      >
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme.colors.primary }} />
        {currentTheme.name}
      </button>

      <div className="absolute right-0 mt-2 py-2 w-48 bg-opacity-95 rounded-lg shadow-lg opacity-0 invisible
                    group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
           style={{ backgroundColor: currentTheme.colors.cardBackground }}>
        {availableThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-opacity-50 transition-colors duration-150
                     flex items-center gap-2"
            style={{
              color: theme.id === currentTheme.id ? theme.colors.primary : theme.colors.text.primary,
              backgroundColor: theme.id === currentTheme.id ? theme.colors.status.active.background : 'transparent',
            }}
          >
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
} 