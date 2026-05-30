import { describe, it, expect } from 'vitest'
import { nextTheme, THEME_ORDER, THEMES } from '../../theme'

describe('nextTheme', () => {
  it('dark → light', () => expect(nextTheme('dark')).toBe('light'))
  it('light → sepia', () => expect(nextTheme('light')).toBe('sepia'))
  it('sepia → dark (wraps)', () => expect(nextTheme('sepia')).toBe('dark'))
  it('cycles through all themes without repeat', () => {
    let t = THEME_ORDER[0]
    const seen = new Set<string>()
    for (let i = 0; i < THEME_ORDER.length; i++) {
      seen.add(t)
      t = nextTheme(t)
    }
    expect(seen.size).toBe(THEME_ORDER.length)
  })
})

describe('THEMES', () => {
  it('has tokens for all three themes', () => {
    expect(Object.keys(THEMES)).toEqual(['dark', 'light', 'sepia'])
  })
  it('every theme has required token keys', () => {
    const required = ['bg', 'surface', 'surface2', 'text', 'muted', 'accent', 'border']
    for (const theme of Object.values(THEMES)) {
      for (const key of required) {
        expect(theme).toHaveProperty(key)
      }
    }
  })
})
