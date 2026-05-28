import { useState, useCallback, useEffect } from 'react';
import { Paintbrush, Code, Eye, FileJson } from 'lucide-react';
import type { PortfolioCustomization } from '../../types';
import VisualStyleForm from './VisualStyleForm';
import JsonEditor from './JsonEditor';

const COLORS = {
  foreground: '#fafafa',
  muted: '#27272a',
  mutedForeground: '#a1a1aa',
  border: '#27272a',
  card: '#18181b',
};

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.8rem',
  fontWeight: active ? 600 : 400,
  background: active ? COLORS.muted : 'transparent',
  color: active ? COLORS.foreground : COLORS.mutedForeground,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.15s',
});

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  background: '#0a0a0f',
  border: '1px solid #27272a',
  borderRadius: '0.375rem',
  color: '#fafafa',
  fontSize: '0.8rem',
  outline: 'none',
  fontFamily: "'JetBrains Mono', monospace",
  resize: 'vertical',
  minHeight: '120px',
};

interface CustomizationEditorProps {
  value: PortfolioCustomization;
  onChange: (value: PortfolioCustomization) => void;
}

export default function CustomizationEditor({ value, onChange }: CustomizationEditorProps) {
  const [activeSubTab, setActiveSubTab] = useState<'visual' | 'json' | 'css'>('visual');

  const handleStylesChange = useCallback((styles: any) => {
    onChange({ ...value, styles });
  }, [value, onChange]);

  const handleRawCssChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...value, rawCss: e.target.value });
  }, [value, onChange]);

  const tabs = [
    { id: 'visual' as const, label: 'Visual', icon: Eye },
    { id: 'json' as const, label: 'JSON', icon: FileJson },
    { id: 'css' as const, label: 'Raw CSS', icon: Code },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: COLORS.foreground, marginBottom: '0.5rem' }}>
          Customize UI
        </h3>
        <p style={{ fontSize: '0.8rem', color: COLORS.mutedForeground }}>
          Customize the look and feel of your portfolio page. Changes apply to your public portfolio.
          Use <strong style={{ color: COLORS.foreground }}>$ACCENT</strong> and{' '}
          <strong style={{ color: COLORS.foreground }}>$RGB</strong> placeholders to reference the active theme color.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '0.75rem' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={tabStyle(activeSubTab === tab.id)}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeSubTab === 'visual' && (
        <VisualStyleForm
          styles={value.styles || {}}
          onChange={handleStylesChange}
        />
      )}

      {activeSubTab === 'json' && (
        <JsonEditor
          value={value.styles || {}}
          onChange={handleStylesChange}
        />
      )}

      {activeSubTab === 'css' && (
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.foreground, marginBottom: '0.75rem' }}>
            Raw CSS Override
          </div>
          <p style={{ fontSize: '0.75rem', color: COLORS.mutedForeground, marginBottom: '0.75rem' }}>
            Write custom CSS to override any element on the portfolio page. Use your browser's dev tools
            to inspect element class names and IDs.
          </p>
          <textarea
            value={value.rawCss || ''}
            onChange={handleRawCssChange}
            placeholder="/* Your custom CSS here */
.project-card {
  border-width: 2px;
}

.hero-name {
  text-transform: uppercase;
}"
            style={inputStyle}
          />
        </div>
      )}
    </div>
  );
}
