import { useTheme } from '../context/ThemeContext';

const COLORS = { background: '#09090b', foreground: '#fafafa', card: '#18181b', border: '#27272a' };

export default function VariantSwitcher() {
  const { variant, setVariant, themes } = useTheme();

  const displayThemes = themes.length > 0
    ? themes
    : [
        { slug: 'pink', name: 'Pink', primary: '#ec4899' },
        { slug: 'blue', name: 'Electric Blue', primary: '#3b82f6' },
        { slug: 'purple', name: 'Vivid Purple', primary: '#a855f7' },
        { slug: 'skyblue', name: 'Sky Blue', primary: '#0ea5e9' },
        { slug: 'zinc', name: 'Zinc', primary: '#71717a' },
      ];

  return (
    <div style={{ padding: '1rem', background: COLORS.card, borderRadius: '0.75rem', border: `1px solid ${COLORS.border}` }}>
      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>
        Accent Color
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {displayThemes.map((theme) => (
          <button
            key={theme.slug}
            onClick={() => setVariant(theme.slug)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: theme.primary,
              border: variant === theme.slug ? '2px solid white' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
}
