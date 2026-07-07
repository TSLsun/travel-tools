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
  | 'greeting'
  | 'introduction'

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

export type Speaker = 'you' | 'staff'

export interface ReplyOption {
  japanese: string
  romaji: string
  meaning: string
}

export interface ConversationTurn {
  speaker: Speaker
  japanese: string
  romaji: string
  meaning: string
  alternatives?: ReplyOption[]   // other replies you could give instead (e.g. yes vs no)
}

export interface ConversationSet {
  id: string
  scenario: ScenarioKey
  title: string
  turns: ConversationTurn[]
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
