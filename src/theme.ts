import type { Theme } from './types'

export interface ThemeTokens {
  bg: string
  surface: string
  surface2: string
  text: string
  muted: string
  accent: string
  accentShadow: string
  border: string
  chip: { bg: string; text: string }
}

export const THEMES: Record<Theme, ThemeTokens> = {
  dark: {
    bg: '#0e1420',
    surface: '#1a2540',
    surface2: '#243356',
    text: '#e8edf5',
    muted: '#8a9bbf',
    accent: '#4a7fcb',
    accentShadow: 'rgba(74,127,203,0.35)',
    border: '#1e2d4a',
    chip: { bg: '#243356', text: '#a8c0e8' },
  },
  light: {
    bg: '#f5f8ff',
    surface: '#ffffff',
    surface2: '#e8f0fb',
    text: '#1e293b',
    muted: '#64748b',
    accent: '#3b7dd8',
    accentShadow: 'rgba(59,125,216,0.30)',
    border: '#dce6f5',
    chip: { bg: '#dce8fb', text: '#2a5ca8' },
  },
  sepia: {
    bg: '#f8f3eb',
    surface: '#ede8de',
    surface2: '#e0d5c4',
    text: '#2d2118',
    muted: '#8a7060',
    accent: '#b06c3a',
    accentShadow: 'rgba(176,108,58,0.28)',
    border: '#ddd0ba',
    chip: { bg: '#e0d5c4', text: '#8a5030' },
  },
}

export const THEME_ORDER: Theme[] = ['dark', 'light', 'sepia']

export function nextTheme(current: Theme): Theme {
  const idx = THEME_ORDER.indexOf(current)
  return THEME_ORDER[(idx + 1) % THEME_ORDER.length]
}
