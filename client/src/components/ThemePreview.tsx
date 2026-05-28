function hexToRgb(hex: string): [number, number, number] {
  const val = parseInt(hex.slice(1), 16);
  return [(val >> 16) & 255, (val >> 8) & 255, val & 255];
}

function parseColor(color: string): [number, number, number] | null {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return hexToRgb(color);
  const parts = color.split(',').map(s => parseInt(s.trim(), 10));
  if (parts.length === 3 && parts.every(n => !isNaN(n) && n >= 0 && n <= 255)) return parts as [number, number, number];
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [R, G, B] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(color1: string, bgHex: string): number {
  const rgb1 = parseColor(color1);
  const rgb2 = hexToRgb(bgHex);
  if (!rgb1) return 1;
  const l1 = relativeLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = relativeLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const BG_DARK = '#09090b';
const BG_LIGHT = '#fafafa';

const containerStyle: React.CSSProperties = {
  background: '#0d0d12',
  border: '1px solid #27272a',
  borderRadius: '0.75rem',
  padding: '1rem',
  fontFamily: "'JetBrains Mono', monospace",
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

interface ThemePreviewProps {
  primary: string;
  rgb: string;
}

export default function ThemePreview({ primary, rgb }: ThemePreviewProps) {
  const hexColor = parseColor(primary) ? primary : (parseColor(rgb) ? rgbToHex(...parseColor(rgb)!) : null);
  const rgbColor = parseColor(rgb) ? rgb : (parseColor(primary) ? (parseColor(primary)!).join(', ') : null);

  const resolvedPrimary = hexColor || '#a855f7';
  const resolvedRgb = rgbColor || '168, 85, 247';

  const ratioDark = contrastRatio(resolvedPrimary, BG_DARK);
  const ratioLight = contrastRatio(resolvedPrimary, BG_LIGHT);

  function ContrastBadge({ ratio, bg, label }: { ratio: number; bg: string; label: string }) {
    const passesAA = ratio >= 4.5;
    const passesAALarge = ratio >= 3;
    const passesAAA = ratio >= 7;
    const score = Math.min(100, Math.round((ratio / 21) * 100));
    const barColor = passesAAA ? '#22c55e' : passesAA ? '#a3e635' : passesAALarge ? '#facc15' : '#ef4444';

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.625rem',
        background: bg === BG_DARK ? '#00000030' : '#ffffff08',
        borderRadius: '0.5rem',
        border: '1px solid #27272a',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.6rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {label}
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#fafafa' }}>
              {ratio.toFixed(1)}:1
            </span>
          </div>
          <div style={{ height: '4px', background: '#27272a', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${score}%`, height: '100%', background: barColor, borderRadius: '2px', transition: 'width 0.15s, background 0.15s' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.55rem', color: passesAAA ? '#22c55e' : '#52525b', fontWeight: passesAAA ? 600 : 400 }}>AAA</span>
            <span style={{ fontSize: '0.55rem', color: passesAA ? '#a3e635' : '#52525b', fontWeight: passesAA ? 600 : 400 }}>AA</span>
            <span style={{ fontSize: '0.55rem', color: passesAALarge ? '#facc15' : '#52525b', fontWeight: passesAALarge ? 600 : 400 }}>AA lg</span>
          </div>
        </div>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          background: resolvedPrimary,
          border: `2px solid ${bg === BG_DARK ? '#3f3f46' : '#d4d4d8'}`,
          flexShrink: 0,
        }} />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.7rem', color: '#a1a1aa', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Live Preview
      </div>

      <ContrastBadge ratio={ratioDark} bg={BG_DARK} label="on dark bg" />
      <ContrastBadge ratio={ratioLight} bg={BG_LIGHT} label="on light bg" />

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: resolvedPrimary,
            border: '2px solid #27272a',
            flexShrink: 0,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fafafa' }}>
            {resolvedPrimary}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
            rgb({resolvedRgb})
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span
          style={{
            padding: '0.35rem 0.75rem',
            fontSize: '0.7rem',
            border: `1px solid ${resolvedPrimary}`,
            background: `rgba(${resolvedRgb}, 0.1)`,
            color: resolvedPrimary,
            borderRadius: '6px',
          }}
        >
          badge
        </span>
        <div
          style={{
            padding: '0.35rem 0.75rem',
            fontSize: '0.7rem',
            border: `1px solid ${resolvedPrimary}30`,
            color: `rgba(${resolvedRgb}, 0.6)`,
            borderRadius: '6px',
          }}
        >
          muted border
        </div>
      </div>

      <div
        style={{
          padding: '0.5rem 1rem',
          background: resolvedPrimary,
          color: '#09090b',
          borderRadius: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        Button
      </div>

      <div
        style={{
          padding: '0.75rem',
          border: `1px solid ${resolvedPrimary}30`,
          borderRadius: '0.5rem',
          background: `rgba(${resolvedRgb}, 0.03)`,
        }}
      >
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: resolvedPrimary, marginBottom: '0.25rem' }}>
          Card Title
        </div>
        <div style={{ fontSize: '0.65rem', color: `rgba(${resolvedRgb}, 0.6)`, lineHeight: 1.5 }}>
          Description text using the accent at reduced opacity for readable body copy.
        </div>
        <div style={{ fontSize: '0.6rem', color: `rgba(${resolvedRgb}, 0.4)`, marginTop: '0.5rem' }}>
          {'>'} tech-stack, tools
        </div>
      </div>
    </div>
  );
}
