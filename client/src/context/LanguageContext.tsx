import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import en from '../data/en.json';
import ar from '../data/ar.json';

const translations: Record<string, Record<string, any>> = { en, ar };
const STORAGE_KEY = 'theme-language';

interface LanguageContextType {
  lang: string;
  setLang: (lang: string) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function getNestedValue(obj: Record<string, any>, path: string): string {
  const result = path.split('.').reduce((acc, part) => acc?.[part], obj);
  return typeof result === 'string' ? result : path;
}

function getStoredLanguage(): string {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'ar' ? 'ar' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<string>(getStoredLanguage);
  const isRTL = lang === 'ar';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  useEffect(() => {
    let lastKeyTime = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey) {
        e.preventDefault();
        const now = Date.now();
        if (now - lastKeyTime > 300) {
          setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
          lastKeyTime = now;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const t = (key: string): string => {
    const translation = getNestedValue(translations[lang], key);
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
