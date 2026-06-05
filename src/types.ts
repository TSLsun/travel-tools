export type ScenarioKey =
  | 'airport'
  | 'food'
  | 'hotel'
  | 'shopping'
  | 'navigation'
  | 'transit'
  | 'emergency'
  | 'restaurant'
  | 'convenience'

export type Theme = 'dark' | 'light' | 'sepia'
export type NativeLang = 'zh-TW' | 'en'

export interface Phrase {
  id: string
  scenario: ScenarioKey
  japanese: string
  romaji: string
  meaning: string
  isCustom: boolean
  isFavorite: boolean
}

export interface AppSettings {
  theme: Theme
  nativeLang: NativeLang
  targetLanguage: 'ja'
  recentlyUsedIds: string[]   // max 10, phrase ids, newest first
  customPhrases: Phrase[]
  favoritePhraseIds: string[]
  partySize: number
}
