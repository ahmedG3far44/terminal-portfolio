import { useCallback } from 'react';
import type { SectionStyles } from '../../types';
import { defaultSectionStyles, sectionLabels, sectionKeys } from '../../styles/defaults';

const COLORS = {
  background: '#09090b',
  foreground: '#fafafa',
  card: '#18181b',
  muted: '#27272a',
  mutedForeground: '#a1a1aa',
  border: '#27272a',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  background: '#0a0a0f',
  border: '1px solid #27272a',
  borderRadius: '0.375rem',
  color: '#fafafa',
  fontSize: '0.8rem',
  outline: 'none',
  fontFamily: "'JetBrains Mono', monospace",
};

const fontOptions = [
  "'JetBrains Mono', 'Fira Code', monospace",
  "'Fira Code', monospace",
  "'Inter', sans-serif",
  "'SF Mono', 'Fira Code', monospace",
  "'Cascadia Code', monospace",
  "'IBM Plex Mono', monospace",
  "'Source Code Pro', monospace",
];

const alignmentOptions = ['left', 'center', 'right'];

interface VisualStyleFormProps {
  styles: SectionStyles;
  onChange: (styles: SectionStyles) => void;
}

export default function VisualStyleForm({ styles, onChange }: VisualStyleFormProps) {
  const updateStyle = useCallback((section: string, prop: string, value: string) => {
    onChange({
      ...styles,
      [section]: {
        ...(styles as any)[section] || {},
        [prop]: value,
      },
    });
  }, [styles, onChange]);

  const currentPageContainer = (styles as any).pageContainer || {};
  const currentProjectCard = (styles as any).projectCard || {};
  const currentProjectsGrid = (styles as any).projectsGrid || {};
  const currentPageBg = (styles as any).pageBackground || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.foreground }}>
        Quick Visual Controls
      </div>
      <p style={{ fontSize: '0.75rem', color: COLORS.mutedForeground, marginTop: '-0.75rem' }}>
        These controls modify the underlying JSON. Switch to the JSON tab to see changes or edit raw values.
      </p>

      <SectionGroup title="Typography">
        <FieldRow label="Font Family">
          <select
            value={currentPageBg.fontFamily || fontOptions[0]}
            onChange={(e) => updateStyle('pageBackground', 'fontFamily', e.target.value)}
            style={inputStyle}
          >
            {fontOptions.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </FieldRow>
        <FieldRow label="Hero Name Size">
          <input
            type="text"
            value={(styles as any).heroName?.fontSize || 'clamp(2rem, 5vw, 4rem)'}
            onChange={(e) => updateStyle('heroName', 'fontSize', e.target.value)}
            placeholder="e.g. clamp(2rem, 5vw, 4rem)"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="Bio Font Size">
          <input
            type="text"
            value={(styles as any).heroBio?.fontSize || '0.75rem'}
            onChange={(e) => updateStyle('heroBio', 'fontSize', e.target.value)}
            placeholder="e.g. 0.75rem"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="Card Title Size">
          <input
            type="text"
            value={(styles as any).projectCardTitle?.fontSize || '1.25rem'}
            onChange={(e) => updateStyle('projectCardTitle', 'fontSize', e.target.value)}
            placeholder="e.g. 1.25rem"
            style={inputStyle}
          />
        </FieldRow>
      </SectionGroup>

      <SectionGroup title="Layout & Spacing">
        <FieldRow label="Page Max Width">
          <input
            type="text"
            value={currentPageContainer.maxWidth || '60%'}
            onChange={(e) => updateStyle('pageContainer', 'maxWidth', e.target.value)}
            placeholder="e.g. 60%"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="Page Padding">
          <input
            type="text"
            value={currentPageContainer.padding || '0 2rem'}
            onChange={(e) => updateStyle('pageContainer', 'padding', e.target.value)}
            placeholder="e.g. 0 2rem"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="Hero Padding Top/Bottom">
          <input
            type="text"
            value={(styles as any).heroContainer?.padding || '4rem 0'}
            onChange={(e) => updateStyle('heroContainer', 'padding', e.target.value)}
            placeholder="e.g. 4rem 0"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="Projects Section Padding">
          <input
            type="text"
            value={(styles as any).projectsContainer?.padding || '4rem 0'}
            onChange={(e) => updateStyle('projectsContainer', 'padding', e.target.value)}
            placeholder="e.g. 4rem 0"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="Hero Skills Width">
          <input
            type="text"
            value={(styles as any).heroSkillsContainer?.width || '60%'}
            onChange={(e) => updateStyle('heroSkillsContainer', 'width', e.target.value)}
            placeholder="e.g. 60%"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="Hero Gap">
          <input
            type="text"
            value={(styles as any).heroSkillsContainer?.gap || '1rem'}
            onChange={(e) => updateStyle('heroSkillsContainer', 'gap', e.target.value)}
            placeholder="e.g. 1rem"
            style={inputStyle}
          />
        </FieldRow>
      </SectionGroup>

      <SectionGroup title="Projects Grid">
        <FieldRow label="Grid Columns">
          <input
            type="text"
            value={currentProjectsGrid.gridTemplateColumns || 'repeat(auto-fit, minmax(280px, 1fr))'}
            onChange={(e) => updateStyle('projectsGrid', 'gridTemplateColumns', e.target.value)}
            placeholder="e.g. repeat(auto-fit, minmax(280px, 1fr))"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="Grid Gap">
          <input
            type="text"
            value={currentProjectsGrid.gap || '1.5rem'}
            onChange={(e) => updateStyle('projectsGrid', 'gap', e.target.value)}
            placeholder="e.g. 1.5rem"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="Card Border Radius">
          <input
            type="text"
            value={currentProjectCard.borderRadius || '12px'}
            onChange={(e) => updateStyle('projectCard', 'borderRadius', e.target.value)}
            placeholder="e.g. 12px"
            style={inputStyle}
          />
        </FieldRow>
        <FieldRow label="Card Padding">
          <input
            type="text"
            value={currentProjectCard.padding || '1.5rem'}
            onChange={(e) => updateStyle('projectCard', 'padding', e.target.value)}
            placeholder="e.g. 1.5rem"
            style={inputStyle}
          />
        </FieldRow>
      </SectionGroup>

      <SectionGroup title="Hero Alignment">
        <FieldRow label="Text Alignment">
          <select
            value={(styles as any).heroContainer?.justifyContent || 'flex-start'}
            onChange={(e) => {
              const val = e.target.value;
              onChange({
                ...styles,
                heroContainer: {
                  ...(styles as any).heroContainer || {},
                  justifyContent: val,
                  textAlign: val === 'center' ? 'center' : 'left',
                },
              });
            }}
            style={inputStyle}
          >
            <option value="flex-start">Left</option>
            <option value="center">Center</option>
            <option value="flex-end">Right</option>
          </select>
        </FieldRow>
      </SectionGroup>
    </div>
  );
}

function SectionGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '0.75rem',
      padding: '1.25rem',
    }}>
      <div style={{
        fontSize: '0.8rem',
        fontWeight: 600,
        color: COLORS.foreground,
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {children}
      </div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    }}>
      <label style={{
        minWidth: '150px',
        fontSize: '0.8rem',
        color: COLORS.mutedForeground,
        flexShrink: 0,
      }}>
        {label}
      </label>
      <div style={{ flex: 1, maxWidth: '320px' }}>
        {children}
      </div>
    </div>
  );
}
