import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Home } from 'lucide-react';

const easeOutQuart = [0.25, 1, 0.5, 1];

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { tokens } = useTheme();
  const { isRTL } = useLanguage();
  const reducedMotion = useReducedMotion();

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: tokens.bg,
        fontFamily: "'JetBrains Mono', monospace",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(${tokens.accentRgb}, 0.015) 2px, rgba(${tokens.accentRgb}, 0.015) 4px)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '480px' }}>
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: easeOutQuart }}
        >
          <div style={{ fontSize: 'clamp(4rem, 15vw, 8rem)', fontWeight: 800, color: tokens.accent, lineHeight: 1, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>
            404
          </div>
        </motion.div>

        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOutQuart, delay: 0.15 }}
          style={{
            fontSize: '0.75rem',
            color: `rgba(${tokens.accentRgb}, 0.5)`,
            letterSpacing: '0.2em',
            marginBottom: '1.5rem',
          }}
        >
          {'> cat ./404'}
        </motion.div>

        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOutQuart, delay: 0.25 }}
          style={{ marginBottom: '0.75rem' }}
        >
          <span style={{ fontSize: '1rem', color: tokens.fg, fontWeight: 500 }}>
            page not found
          </span>
          <span
            style={{
              display: 'inline-block',
              width: '1px',
              height: '1em',
              background: `rgba(${tokens.accentRgb}, 0.5)`,
              marginLeft: '4px',
              verticalAlign: 'text-bottom',
              animation: reducedMotion ? 'none' : 'cursor-blink 1s step-end infinite',
            }}
          />
        </motion.div>

        <motion.p
          initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOutQuart, delay: 0.35 }}
          style={{
            fontSize: '0.8rem',
            color: tokens.textMuted,
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          The directory or page you&apos;re looking for doesn&apos;t exist — or has been moved.
        </motion.p>

        <motion.button
          initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOutQuart, delay: 0.45 }}
          whileHover={reducedMotion ? {} : { scale: 1.03 }}
          whileTap={reducedMotion ? {} : { scale: 0.97 }}
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            background: tokens.accent,
            color: '#09090b',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
            transition: reducedMotion ? 'none' : 'opacity 0.2s',
          }}
          onMouseEnter={(e) => { if (!reducedMotion) e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          <Home size={16} />
          Back Home
        </motion.button>
      </div>

      <style>{`
        @keyframes cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
