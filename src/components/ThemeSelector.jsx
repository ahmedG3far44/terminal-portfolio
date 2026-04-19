import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const themes = [
  { id: 3, name: 'Retro Mono', path: '/3', color: '#39ff14', font: 'JetBrains Mono' },
  { id: 4, name: 'Elegant Dark', path: '/4', color: '#d4af37', font: 'Playfair Display' },
  { id: 6, name: 'Pop Bold', path: '/6', color: '#f472b6', font: 'Archivo Black' },
  { id: 7, name: 'Neon Gradient', path: '/7', color: '#ff006e', font: 'Syne' },
  { id: 8, name: 'Build Ship', path: '/8', color: '#be123c', font: 'Bebas Neue' },
  { id: 9, name: 'Pastel Grid', path: '/9', color: '#fab387', font: 'Outfit' },
  { id: 10, name: 'Minimal Zen', path: '/10', color: '#1a1a1a', font: 'Zen Kaku' },
]

export default function ThemeSelector() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: '#0a0a0a'
    }}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: 900,
          marginBottom: '0.5rem',
          textAlign: 'center',
          letterSpacing: '-0.02em'
        }}
      >
        Choose Your <span style={{ color: '#e63946' }}>Portfolio</span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          color: '#666',
          marginBottom: '3rem',
          fontSize: '1rem'
        }}
      >
        7 unique themes to showcase your work
      </motion.p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.25rem',
        maxWidth: '800px',
        width: '100%'
      }}>
        {themes.map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
          >
            <Link to={theme.path}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                style={{
                  padding: '1.5rem',
                  background: '#141414',
                  borderRadius: '12px',
                  border: `1px solid ${theme.color}40`,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: theme.color,
                  marginBottom: '1rem'
                }} />
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '0.25rem',
                  fontFamily: theme.font
                }}>{theme.name}</h3>
                <span style={{ color: '#555', fontSize: '0.75rem' }}>
                  Theme {theme.id}
                </span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: '3rem',
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}
      >
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: '#444', fontSize: '0.875rem' }}>GitHub</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: '#444', fontSize: '0.875rem' }}>LinkedIn</a>
        <a href="mailto:hello@example.com" style={{ color: '#444', fontSize: '0.875rem' }}>Contact</a>
      </motion.div>
    </div>
  )
}