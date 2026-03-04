/**
 * Theme Toggle Component
 * Defaults to system color scheme and allows manual override.
 */

'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from './button'

const THEME_OVERRIDE_KEY = 'themeOverride'

type Theme = 'light' | 'dark'

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>('light')
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyResolvedTheme = (override: Theme | null) => {
      const resolvedTheme: Theme = override ?? (mediaQuery.matches ? 'dark' : 'light')
      setTheme(resolvedTheme)
      document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    }

    const storedOverride = localStorage.getItem(THEME_OVERRIDE_KEY) as Theme | null

    // Migration cleanup: ignore any legacy key and follow system unless explicit override exists.
    if (!storedOverride) {
      localStorage.removeItem('theme')
    }

    applyResolvedTheme(storedOverride)
    setMounted(true)

    const handleSystemThemeChange = () => {
      const currentOverride = localStorage.getItem(THEME_OVERRIDE_KEY) as Theme | null
      if (!currentOverride) {
        applyResolvedTheme(null)
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [])

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem(THEME_OVERRIDE_KEY, nextTheme)
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-9 h-9 p-0"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  )
}
