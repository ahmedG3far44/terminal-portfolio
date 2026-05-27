import { useState, useEffect } from 'react';
import { useTheme, themeVariants } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { http } from '../services/http';
import { Sun, Moon, Languages, Palette, Settings } from 'lucide-react';

export default function Controls() {
  const { variant, setVariant, themes, tokens, mode, toggleMode } = useTheme();
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

  const availableThemes = themes.length > 0 ? themes : themeVariants;

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
          background: tokens.surface,
          border: `1px solid ${tokens.borderBase}`,
          color: tokens.fg,
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
            background: tokens.surface,
            border: `1px solid ${tokens.borderBase}`,
            borderRadius: '12px',
            padding: '1.25rem',
            zIndex: 1000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: tokens.textMuted }}>
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
                    border: variant === theme.slug ? `2px solid ${tokens.fg}` : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    outline: 'none',
                  }}
                  title={theme.name}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: tokens.textMuted }}>
              {mode === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              Theme
            </div>
            <button
              onClick={toggleMode}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '8px',
                border: `1px solid ${tokens.borderBase}`,
                background: 'transparent',
                color: tokens.fg,
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {mode === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: tokens.textMuted }}>
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
                  border: `1px solid ${lang === 'en' ? tokens.fg : tokens.borderBase}`,
                  background: lang === 'en' ? tokens.borderBase : 'transparent',
                  color: tokens.fg,
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
                  border: `1px solid ${lang === 'ar' ? tokens.fg : tokens.borderBase}`,
                  background: lang === 'ar' ? tokens.borderBase : 'transparent',
                  color: tokens.fg,
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
