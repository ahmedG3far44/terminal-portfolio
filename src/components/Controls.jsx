import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

export default function Controls() {
  const { variant, setVariant, themeColors } = useTheme()
  const { lang, setLang, isRTL, t } = useLanguage()
  const [showPicker, setShowPicker] = useState(false)
  const [showHint, setShowHint] = useState(true)
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

  useEffect(() => {
    const timeout = setTimeout(() => setShowHint(false), 4000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.5rem'
      }}
    >
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            style={{
              display: 'flex',
              gap: '0.5rem',
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)' }}>
              Ctrl+Space
            </span>
            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)' }}>|</span>
            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)' }}>
              Alt+Shift
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <button
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '0.4rem 0.6rem',
            cursor: 'pointer',
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.5)',
            transition: 'all 0.2s'
          }}
        >
          {lang.toUpperCase()}
        </button>

        <motion.button
          onClick={() => setShowPicker(!showPicker)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: themeColors[variant].primary,
            boxShadow: `0 0 8px ${themeColors[variant].primary}60`
          }}
          title={themeColors[variant].name}
        />
      </div>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(12px)',
              padding: '0.6rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '90px' }}>
              {colors.map(([key, value]) => (
                <motion.button
                  key={key}
                  onClick={() => {
                    setVariant(key)
                    setShowPicker(false)
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  title={value.name}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '5px',
                    border: 'none',
                    cursor: 'pointer',
                    background: value.primary,
                    boxShadow: variant === key ? `0 0 10px ${value.primary}` : 'none',
                    outline: variant === key ? `2px solid ${value.primary}` : 'none',
                    outlineOffset: '2px'
                  }}
                />
              ))}
            </div>
            <div style={{
              textAlign: 'center',
              fontSize: '0.55rem',
              color: themeColors[variant].primary,
              opacity: 0.8,
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              {themeColors[variant].name}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}