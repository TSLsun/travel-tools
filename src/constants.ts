import type { ScenarioKey, AppSettings } from './types'

export const SCENARIOS: { key: ScenarioKey; label: string; emoji: string }[] = [
  { key: 'airport',      label: 'Airport',      emoji: '✈️' },
  { key: 'food',         label: 'Food',         emoji: '🍜' },
  { key: 'hotel',        label: 'Hotel',        emoji: '🏨' },
  { key: 'shopping',     label: 'Shopping',     emoji: '🛒' },
  { key: 'navigation',   label: 'Navigation',   emoji: '🗺️' },
  { key: 'transit',      label: 'Transit',      emoji: '🚃' },
  { key: 'emergency',    label: 'Emergency',    emoji: '🚨' },
  { key: 'restaurant',   label: 'Restaurant',   emoji: '🍽️' },
  { key: 'convenience',  label: 'Convenience',  emoji: '🏪' },
]

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  nativeLang: 'zh-TW',
  targetLanguage: 'ja',
  recentlyUsedIds: [],
  customPhrases: [],
  favoritePhraseIds: [],
  partySize: 2,
}

export const STORAGE_KEY = 'travel_settings'
export const MAX_RECENT = 10
