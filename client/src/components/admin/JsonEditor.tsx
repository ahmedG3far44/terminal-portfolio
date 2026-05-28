import { useState, useCallback } from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#fafafa',
  },
  textarea: {
    width: '100%',
    minHeight: '400px',
    padding: '1rem',
    background: '#0a0a0f',
    border: '1px solid #27272a',
    borderRadius: '0.5rem',
    color: '#fafafa',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '0.8rem',
    lineHeight: '1.6',
    outline: 'none',
    resize: 'vertical' as const,
    tabSize: 2,
  },
  error: {
    fontSize: '0.75rem',
    color: '#ef4444',
    padding: '0.5rem 0.75rem',
    background: '#1a0a0a',
    borderRadius: '0.375rem',
    border: '1px solid #ef444440',
    whiteSpace: 'pre-wrap' as const,
    fontFamily: "'JetBrains Mono', monospace",
  },
  footer: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  btn: {
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #27272a',
    background: '#18181b',
    color: '#a1a1aa',
    cursor: 'pointer',
    fontSize: '0.78rem',
    transition: 'all 0.15s',
  },
};

interface JsonEditorProps {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
}

export default function JsonEditor({ value, onChange }: JsonEditorProps) {
  const [raw, setRaw] = useState(() => JSON.stringify(value, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRaw(text);
    setError(null);
    try {
      const parsed = JSON.parse(text);
      onChange(parsed);
    } catch (err: any) {
      setError(err.message);
    }
  }, [onChange]);

  const handleFormat = useCallback(() => {
    try {
      const formatted = JSON.stringify(JSON.parse(raw), null, 2);
      setRaw(formatted);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  }, [raw]);

  const handleResetToDefaults = useCallback(() => {
    const defaults = JSON.stringify(value, null, 2);
    setRaw(defaults);
    setError(null);
  }, [value]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.label}>styles</span>
        <div style={styles.footer}>
          <button onClick={handleFormat} style={styles.btn}>
            Format JSON
          </button>
        </div>
      </div>
      <textarea
        value={raw}
        onChange={handleChange}
        spellCheck={false}
        style={{
          ...styles.textarea,
          borderColor: error ? '#ef444480' : '#27272a',
        }}
      />
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}
