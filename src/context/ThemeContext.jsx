import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'theme-variant'

const themeColors = {
  green: { primary: '#39ff14', rgb: '57, 255, 20', name: 'Neon Green' },
  blue: { primary: '#3b82f6', rgb: '59, 130, 246', name: 'Electric Blue' },
  purple: { primary: '#a855f7', rgb: '168, 85, 247', name: 'Vivid Purple' },
  skyblue: { primary: '#0ea5e9', rgb: '14, 165, 233', name: 'Sky Blue' },
  zinc: { primary: '#71717a', rgb: '113, 113, 122', name: 'Zinc' },
  amber: { primary: '#f59e0b', rgb: '245, 158, 11', name: 'Amber' },
  rose: { primary: '#f43f5e', rgb: '244, 63, 94', name: 'Rose' },
  cyan: { primary: '#06b6d4', rgb: '6, 182, 212', name: 'Cyan' },
  emerald: { primary: '#10b981', rgb: '16, 185, 129', name: 'Emerald' },
  orange: { primary: '#f97316', rgb: '249, 115, 22', name: 'Orange' },
}

const ThemeContext = createContext()

function getStoredVariant() {
  if (typeof window === 'undefined') return 'green'
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored && themeColors[stored] ? stored : 'green'
}

export function ThemeProvider({ children }) {
  const [variant, setVariant] = useState(getStoredVariant)
  const colors = themeColors[variant]

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, variant)
  }, [variant])

  return (
    <ThemeContext.Provider value={{ variant, setVariant, colors, themeColors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}