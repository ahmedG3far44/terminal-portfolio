import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { http } from '../services/http';
import type { Theme } from '../types';
import type { ColorMode, ColorTokens } from '../colors';
import { resolveTokens, defaultAccent, defaultAccentRgb, themeVariants } from '../colors';

const STORAGE_KEY = 'theme-variant';
const MODE_KEY = 'color-mode';

interface ThemeContextType {
  variant: string;
  setVariant: (slug: string) => void;
  setPortfolioTheme: (slug: string | null) => void;
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
  colors: { primary: string; rgb: string; name: string } | null;
  tokens: ColorTokens;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [portfolioOverride, setPortfolioOverride] = useState<string | null>(null);
  const [localVariant, setLocalVariant] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || 'pink';
  });
  const [mode, setModeState] = useState<ColorMode>(() => {
    return (localStorage.getItem(MODE_KEY) as ColorMode) || 'dark';
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

  const setMode = useCallback((m: ColorMode) => {
    localStorage.setItem(MODE_KEY, m);
    setModeState(m);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const currentTheme = themes.find((t) => t.slug === variant);
  const fallback = themeVariants.find((t) => t.slug === variant) || themeVariants[0];
  const colors = currentTheme
    ? { primary: currentTheme.primary, rgb: currentTheme.rgb, name: currentTheme.name }
    : { primary: fallback.primary, rgb: fallback.rgb, name: fallback.name };

  const tokens = useMemo(
    () => resolveTokens(mode, colors.primary, colors.rgb),
    [mode, colors.primary, colors.rgb],
  );

  return (
    <ThemeContext.Provider value={{ variant, setVariant, setPortfolioTheme, mode, setMode, toggleMode, colors, tokens, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

export { defaultAccent, defaultAccentRgb, themeVariants };
