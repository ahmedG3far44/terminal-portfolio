import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { http } from '../services/http';
import type { Theme } from '../types';

const STORAGE_KEY = 'theme-variant';

interface ThemeContextType {
  variant: string;
  setVariant: (slug: string) => void;
  setPortfolioTheme: (slug: string | null) => void;
  colors: { primary: string; rgb: string; name: string } | null;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [portfolioOverride, setPortfolioOverride] = useState<string | null>(null);
  const [localVariant, setLocalVariant] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || 'green';
  });

  const variant = portfolioOverride ?? localVariant;

  useEffect(() => {
    http.get<Theme[]>('/themes')
      .then(setThemes)
      .catch(() => {});
  }, []);

  const setVariant = useCallback((slug: string) => {
    localStorage.setItem(STORAGE_KEY, slug);
    setLocalVariant(slug);
    setPortfolioOverride(null);
  }, []);

  const setPortfolioTheme = useCallback((slug: string | null) => {
    setPortfolioOverride(slug);
  }, []);

  const currentTheme = themes.find((t) => t.slug === variant);
  const fallback = themes[0] || { primary: '#39ff14', rgb: '57, 255, 20', name: 'Neon Green' };
  const colors = currentTheme
    ? { primary: currentTheme.primary, rgb: currentTheme.rgb, name: currentTheme.name }
    : fallback;

  return (
      <ThemeContext.Provider value={{ variant, setVariant, setPortfolioTheme, colors, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
