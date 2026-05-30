import type { Phrase, ScenarioKey } from '../types'
import builtIn from '../data/phrases-ja.json'

const builtInPhrases = builtIn as Phrase[]

export function getAllPhrases(customPhrases: Phrase[]): Phrase[] {
  return [...builtInPhrases, ...customPhrases]
}

export function filterByScenario(
  phrases: Phrase[],
  scenario: ScenarioKey | 'all'
): Phrase[] {
  if (scenario === 'all') return phrases
  return phrases.filter(p => p.scenario === scenario)
}

// Strip diacritics so "menu" matches "Menyū"
const COMBINING_MARKS = /[̀-ͯ]/g
function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(COMBINING_MARKS, '')
}

export function searchPhrases(phrases: Phrase[], query: string): Phrase[] {
  const q = normalize(query.trim())
  if (!q) return phrases
  return phrases.filter(
    p =>
      normalize(p.japanese).includes(q) ||
      normalize(p.romaji).includes(q) ||
      normalize(p.meaning).includes(q)
  )
}

export function getFavorites(phrases: Phrase[], favIds: string[]): Phrase[] {
  const set = new Set(favIds)
  return phrases.filter(p => set.has(p.id))
}

export function getRecentlyUsed(phrases: Phrase[], recentIds: string[]): Phrase[] {
  const map = new Map(phrases.map(p => [p.id, p]))
  return recentIds.map(id => map.get(id)).filter(Boolean) as Phrase[]
}
