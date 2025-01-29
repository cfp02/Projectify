'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, themes } from '@/themes';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.emeraldSea);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(themes[savedTheme]);
    }
  }, []);

  const setTheme = (themeId: string) => {
    if (themes[themeId]) {
      setCurrentTheme(themes[themeId]);
      localStorage.setItem('theme', themeId);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        currentTheme, 
        setTheme,
        availableThemes: Object.values(themes),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 