import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ThemeName = 'warm' | 'bauhaus' | 'midnight' | 'ocean' | 'monochrome';

interface ThemeOption {
  name: ThemeName;
  label: string;
  accent: string;
}

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themeOptions: ThemeOption[];
}

const THEME_STORAGE_KEY = 'spark-theme';

const themeOptions: ThemeOption[] = [
  { name: 'warm', label: 'Warm', accent: 'bg-[#f4a328]' },
  { name: 'bauhaus', label: 'Bauhaus', accent: 'bg-[#e53935]' },
  { name: 'midnight', label: 'Night', accent: 'bg-[#8eb6ff]' },
  { name: 'ocean', label: 'Ocean', accent: 'bg-[#2f8fff]' },
  { name: 'monochrome', label: 'Mono', accent: 'bg-[#242424]' },
];

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const isThemeName = (value: string): value is ThemeName =>
  value === 'warm' || value === 'bauhaus' || value === 'midnight' || value === 'ocean' || value === 'monochrome';

const getStoredTheme = (): ThemeName => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && isThemeName(stored)) {
      return stored;
    }
  } catch {
    return 'warm';
  }

  return 'warm';
};

const applyThemeToDocument = (theme: ThemeName): void => {
  document.documentElement.dataset.theme = theme;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
  const [theme, setThemeState] = useState<ThemeName>(() => getStoredTheme());

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme: ThemeName): void => {
    setThemeState(nextTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage write errors and keep theme in memory.
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      themeOptions,
    }),
    [theme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
