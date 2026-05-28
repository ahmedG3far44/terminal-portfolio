import { motion, useReducedMotion } from 'framer-motion';

const easeOut = [0.25, 1, 0.5, 1];

interface TerminalWidgetProps {
  accentRgb: string;
  tokens: any;
}

const cliLines = [
  { text: '$ git clone https://github.com/user/terminal-portfolio', type: 'input', delay: 0 },
  { text: "Cloning into 'terminal-portfolio'...", type: 'output', delay: 0.15 },
  { text: '\u2713 Receiving objects: 100% (247/247), done.', type: 'success', delay: 0.3 },
  { text: '$ cd terminal-portfolio && npm install', type: 'input', delay: 0.45 },
  { text: '\u2713 Ready in 2.3s', type: 'success', delay: 0.6 },
  { text: '$ npm run dev', type: 'input', delay: 0.75 },
  { text: '  VITE v5.4.0  ready in 412ms', type: 'output', delay: 0.9 },
  { text: '  \u279c  Local:   http://localhost:5173', type: 'output', delay: 0.95 },
];

const statusEntries = [
  { label: 'GitHub sync', value: '\u2713 connected', hue: 'emerald' },
  { label: 'Projects', value: '8 loaded', hue: 'default' },
  { label: 'Theme', value: 'pink (active)', hue: 'accent' },
  { label: 'Streak', value: '12 days', hue: 'default' },
];

export default function TerminalWidget({ accentRgb, tokens }: TerminalWidgetProps) {
  const prefersReducedMotion = useReducedMotion();

  const statusColor = (hue: string) => {
    if (hue === 'accent') return `rgb(${accentRgb})`;
    if (hue === 'emerald') return '#34d399';
    return '#e4e4e7';
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.6, ease: easeOut }}
      style={{
        background: '#09090b',
        border: '1px solid rgba(113, 113, 122, 0.15)',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.75rem',
        lineHeight: 1.7,
        boxShadow: '0 0 0 1px rgba(113, 113, 122, 0.08), 0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      <div
        style={{
          background: '#18181b',
          padding: '0.625rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderBottom: '1px solid rgba(113, 113, 122, 0.1)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
        </div>
        <span
          style={{
            flex: 1,
            textAlign: 'center',
            color: 'rgba(113, 113, 122, 0.6)',
            fontSize: '0.7rem',
            letterSpacing: '0.05em',
          }}
        >
          terminal-portfolio
        </span>
      </div>

      <div style={{ padding: '1rem', minHeight: '260px' }}>
        {cliLines.map((line, i) => (
          <motion.div
            key={i}
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: line.delay, duration: 0.3, ease: easeOut }}
            style={{
              color:
                line.type === 'input' ? '#e4e4e7'
                : line.type === 'success' ? '#34d399'
                : '#a1a1aa',
              whiteSpace: 'pre',
            }}
          >
            {line.text}
          </motion.div>
        ))}

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.4, ease: easeOut }}
          style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}
        >
          <div style={{ color: '#71717a', marginBottom: '0.375rem', letterSpacing: '0.05em' }}>
            {'-----'} terminal-portfolio v1.0.0 {'-----'}
          </div>
          {statusEntries.map((s) => (
            <div key={s.label} style={{ display: 'flex', gap: '1rem', color: '#a1a1aa' }}>
              <span style={{ minWidth: '100px' }}>{s.label}</span>
              <span style={{ color: statusColor(s.hue) }}>{s.value}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.35, duration: 0.3, ease: easeOut }}
          style={{ color: '#e4e4e7' }}
        >
          {'$ '}
          <span
            style={{
              display: 'inline-block',
              width: '1px',
              height: '1em',
              background: prefersReducedMotion ? '#e4e4e7' : undefined,
              verticalAlign: 'text-bottom',
              marginLeft: '2px',
              ...(prefersReducedMotion ? {} : { animation: 'term-cursor 1s step-end infinite' }),
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
