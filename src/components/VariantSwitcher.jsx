import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function VariantSwitcher() {
  const { variant, setVariant, themeColors } = useTheme()
  const [showPicker, setShowPicker] = useState(false)
  const colors = Object.entries(themeColors)
  const lastKeyTime = useRef(0)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault()
        const now = Date.now()
        if (now - lastKeyTime.current > 200) {
          const currentIndex = colors.findIndex(([key]) => key === variant)
          const nextIndex = (currentIndex + 1) % colors.length
          setVariant(colors[nextIndex][0])
          setShowPicker(true)
          lastKeyTime.current = now
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [variant, colors, setVariant])

  useEffect(() => {
    if (!showPicker) return

    const timeout = setTimeout(() => setShowPicker(false), 1500)
    return () => clearTimeout(timeout)
  }, [showPicker])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 100
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
            Press
          </span>
          <kbd style={{
            padding: '0.2rem 0.4rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.7)'
          }}>
            l-ctrl + space
          </kbd>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
            cycles themes
          </span>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              bottom: '5rem',
              right: '1.5rem',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <motion.div
              layout
              style={{
                display: 'flex',
                gap: '0.5rem',
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(12px)',
                padding: '0.75rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              {colors.map(([key, value]) => (
                <motion.button
                  key={key}
                  layout
                  onClick={() => setVariant(key)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: variant === key ? 1.15 : 1,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={value.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: value.primary,
                    boxShadow: variant === key ? `0 0 16px ${value.primary}80` : 'none',
                    outline: variant === key ? `2px solid ${value.primary}` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </motion.div>

            <motion.div
              layout
              style={{
                textAlign: 'center',
                fontSize: '0.7rem',
                color: themeColors[variant].primary,
                opacity: 0.8,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: 'rgba(0, 0, 0, 0.8)',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px'
              }}
            >
              {themeColors[variant].name}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}