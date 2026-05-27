import { useTheme } from '../context/ThemeContext';

const COLORS = { background: '#09090b', foreground: '#fafafa', card: '#18181b', border: '#27272a' };

export default function ThemeSelector() {
  const { variant, setVariant, themes } = useTheme();

  const displayThemes = themes.length > 0
    ? themes
    : [
        { slug: 'pink', name: 'Pink', primary: '#ec4899' },
        { slug: 'blue', name: 'Electric Blue', primary: '#3b82f6' },
        { slug: 'purple', name: 'Vivid Purple', primary: '#a855f7' },
      ];

  return (
    <div style={{ padding: '2rem', background: COLORS.background, minHeight: '100vh' }}>
      <h2 style={{ color: COLORS.foreground, marginBottom: '1.5rem' }}>Select Theme</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {displayThemes.map((theme) => (
          <button
            key={theme.slug}
            onClick={() => setVariant(theme.slug)}
            style={{
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem',
              border: variant === theme.slug ? `2px solid ${theme.primary}` : `1px solid ${COLORS.border}`,
              background: COLORS.card,
              color: COLORS.foreground,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1rem',
            }}
          >
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: theme.primary }} />
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
}
