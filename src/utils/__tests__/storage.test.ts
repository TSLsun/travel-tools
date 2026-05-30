import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadSettings, saveSettings, updateSetting } from '../storage'
import { DEFAULT_SETTINGS, STORAGE_KEY } from '../../constants'

describe('loadSettings', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY)
  })

  it('returns default settings when localStorage is empty', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('returns saved theme', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...DEFAULT_SETTINGS, theme: 'light' }))
    expect(loadSettings().theme).toBe('light')
  })

  it('merges with defaults when partial data stored', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: 'sepia' }))
    const result = loadSettings()
    expect(result.theme).toBe('sepia')
    expect(result.nativeLang).toBe(DEFAULT_SETTINGS.nativeLang)
    expect(result.customPhrases).toEqual([])
  })

  it('returns defaults when stored data is corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json')
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })
})

describe('saveSettings / loadSettings roundtrip', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY)
  })

  it('persists and reloads settings', () => {
    const settings = { ...DEFAULT_SETTINGS, theme: 'sepia' as const }
    saveSettings(settings)
    expect(loadSettings().theme).toBe('sepia')
  })
})

describe('updateSetting', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY)
  })

  it('updates a single key and persists', () => {
    const result = updateSetting('theme', 'light')
    expect(result.theme).toBe('light')
    expect(loadSettings().theme).toBe('light')
  })

  it('does not affect other keys', () => {
    updateSetting('theme', 'sepia')
    const result = updateSetting('nativeLang', 'en')
    expect(result.theme).toBe('sepia')
    expect(result.nativeLang).toBe('en')
  })
})
