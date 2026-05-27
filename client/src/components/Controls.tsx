import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { http } from '../services/http';
import { Sun, Moon, Languages, Palette, Settings } from 'lucide-react';

const COLORS = {
  background: '#09090b',
  foreground: '#fafafa',
  card: '#18181b',
  border: '#27272a',
  muted: '#27272a',
  mutedForeground: '#a1a1aa',
};

const themeColorsList = [
  { slug: 'green', name: 'Neon Green', primary: '#39ff14' },
  { slug: 'blue', name: 'Electric Blue', primary: '#3b82f6' },
  { slug: 'purple', name: 'Vivid Purple', primary: '#a855f7' },
  { slug: 'skyblue', name: 'Sky Blue', primary: '#0ea5e9' },
  { slug: 'zinc', name: 'Zinc', primary: '#71717a' },
  { slug: 'amber', name: 'Amber', primary: '#f59e0b' },
  { slug: 'rose', name: 'Rose', primary: '#f43f5e' },
  { slug: 'cyan', name: 'Cyan', primary: '#06b6d4' },
  { slug: 'emerald', name: 'Emerald', primary: '#10b981' },
  { slug: 'orange', name: 'Orange', primary: '#f97316' },
];

export default function Controls() {
  const { variant, setVariant, themes } = useTheme();
  const { lang, setLang, isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const handleThemeChange = (slug: string) => {
    setVariant(slug);
    if (isAuthenticated) {
      http.put('/portfolio', { activeTheme: slug }).catch(() => {});
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const availableThemes = themes.length > 0 ? themes : themeColorsList;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          [isRTL ? 'left' : 'right']: '1.5rem',
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          color: COLORS.foreground,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.2s',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
        title="Settings (Ctrl+Space)"
      >
        <Settings size={20} />
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '5rem',
            [isRTL ? 'left' : 'right']: '1.5rem',
            width: '260px',
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '12px',
            padding: '1.25rem',
            zIndex: 1000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: COLORS.mutedForeground }}>
              <Palette size={14} />
              Accent Color
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availableThemes.map((theme) => (
                <button
                  key={theme.slug}
                  onClick={() => handleThemeChange(theme.slug)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: theme.primary,
                    border: variant === theme.slug ? '2px solid white' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    outline: 'none',
                  }}
                  title={theme.name}
                />
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: COLORS.mutedForeground }}>
              <Languages size={14} />
              Language
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setLang('en')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '8px',
                  border: `1px solid ${lang === 'en' ? COLORS.foreground : COLORS.border}`,
                  background: lang === 'en' ? COLORS.muted : 'transparent',
                  color: COLORS.foreground,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: lang === 'en' ? 600 : 400,
                }}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ar')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '8px',
                  border: `1px solid ${lang === 'ar' ? COLORS.foreground : COLORS.border}`,
                  background: lang === 'ar' ? COLORS.muted : 'transparent',
                  color: COLORS.foreground,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: lang === 'ar' ? 600 : 400,
                }}
              >
                AR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
