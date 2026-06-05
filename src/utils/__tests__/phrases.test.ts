import { describe, it, expect } from 'vitest'
import {
  filterByScenario,
  searchPhrases,
  getFavorites,
  getRecentlyUsed,
  getAllPhrases,
  renderJapanese,
} from '../phrases'
import type { Phrase } from '../../types'

const mockPhrases: Phrase[] = [
  { id: 'ja-airport-001', scenario: 'airport', japanese: 'すみません', romaji: 'Sumimasen', meaning: '不好意思', isCustom: false, isFavorite: false },
  { id: 'ja-food-001', scenario: 'food', japanese: 'メニューをください', romaji: 'Menu wo kudasai', meaning: '請給我菜單', isCustom: false, isFavorite: false },
  { id: 'custom-001', scenario: 'shopping', japanese: 'いくらですか？', romaji: 'Ikura desu ka?', meaning: '多少錢？', isCustom: true, isFavorite: false },
]

describe('getAllPhrases', () => {
  it('merges built-in and custom phrases', () => {
    const custom: Phrase[] = [{ id: 'c1', scenario: 'food', japanese: 'test', romaji: '', meaning: '', isCustom: true, isFavorite: false }]
    const all = getAllPhrases(custom)
    const ids = all.map(p => p.id)
    expect(ids).toContain('c1')
    expect(all.length).toBeGreaterThan(1)
  })
})

describe('filterByScenario', () => {
  it('returns all when scenario is "all"', () => {
    expect(filterByScenario(mockPhrases, 'all')).toHaveLength(3)
  })
  it('filters to only matching scenario', () => {
    const result = filterByScenario(mockPhrases, 'airport')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('ja-airport-001')
  })
  it('returns empty array when no match', () => {
    expect(filterByScenario(mockPhrases, 'hotel')).toHaveLength(0)
  })
})

describe('searchPhrases', () => {
  it('returns all on empty query', () => {
    expect(searchPhrases(mockPhrases, '')).toHaveLength(3)
  })
  it('returns all on whitespace-only query', () => {
    expect(searchPhrases(mockPhrases, '   ')).toHaveLength(3)
  })
  it('matches on japanese text', () => {
    const r = searchPhrases(mockPhrases, 'すみません')
    expect(r).toHaveLength(1)
    expect(r[0].id).toBe('ja-airport-001')
  })
  it('matches on romaji case-insensitive', () => {
    const r = searchPhrases(mockPhrases, 'MENU')
    expect(r).toHaveLength(1)
    expect(r[0].id).toBe('ja-food-001')
  })
  it('matches on meaning', () => {
    const r = searchPhrases(mockPhrases, '多少')
    expect(r).toHaveLength(1)
    expect(r[0].id).toBe('custom-001')
  })
})

describe('getFavorites', () => {
  it('returns only phrases whose ids are in favIds', () => {
    const r = getFavorites(mockPhrases, ['ja-food-001'])
    expect(r).toHaveLength(1)
    expect(r[0].id).toBe('ja-food-001')
  })
  it('returns empty when favIds is empty', () => {
    expect(getFavorites(mockPhrases, [])).toHaveLength(0)
  })
})

describe('getRecentlyUsed', () => {
  it('preserves recent order', () => {
    const r = getRecentlyUsed(mockPhrases, ['ja-food-001', 'ja-airport-001'])
    expect(r[0].id).toBe('ja-food-001')
    expect(r[1].id).toBe('ja-airport-001')
  })
  it('silently skips unknown ids', () => {
    expect(getRecentlyUsed(mockPhrases, ['unknown'])).toHaveLength(0)
  })
})

describe('renderJapanese', () => {
  it('replaces {n} with the given count', () => {
    expect(renderJapanese('{n}名お願いします', 3)).toBe('3名お願いします')
  })
  it('replaces all occurrences of {n}', () => {
    expect(renderJapanese('{n}名、{n}席', 2)).toBe('2名、2席')
  })
  it('returns the string unchanged when no {n} present', () => {
    expect(renderJapanese('温めてください', 5)).toBe('温めてください')
  })
  it('works with count = 1', () => {
    expect(renderJapanese('{n}名で予約しています', 1)).toBe('1名で予約しています')
  })
})
