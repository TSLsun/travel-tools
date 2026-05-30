import { useState } from 'react'
import type { AppSettings, Phrase, ScenarioKey } from '../types'
import type { ThemeTokens } from '../theme'
import { SCENARIOS } from '../constants'
import { getAllPhrases, filterByScenario, searchPhrases } from '../utils/phrases'

interface Props {
  settings: AppSettings
  updateSettings: (patch: Partial<AppSettings>) => void
  T: ThemeTokens
  onOpenTranslate: (mode: 'voice' | 'camera' | 'type') => void
  onSelectPhrase: (phrase: Phrase) => void
}

export default function PhrasesScreen({ settings, T, onSelectPhrase }: Props) {
  const [activeScenario, setActiveScenario] = useState<ScenarioKey | 'all'>('all')
  const [query, setQuery] = useState('')

  const all = getAllPhrases(settings.customPhrases)
  const filtered = searchPhrases(filterByScenario(all, activeScenario), query)

  const tabs = [{ key: 'all' as const, label: 'All', emoji: '📋' }, ...SCENARIOS]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Scenario tabs */}
      <div style={{ overflowX: 'auto', display: 'flex', gap: 6, padding: '12px 16px 8px', borderBottom: `1px solid ${T.border}`, scrollbarWidth: 'none' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveScenario(t.key as ScenarioKey | 'all')}
            style={{ flexShrink: 0, background: activeScenario === t.key ? T.accent : T.surface2, color: activeScenario === t.key ? '#fff' : T.muted, border: 'none', borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: '8px 16px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search Japanese, romaji, or meaning..."
          style={{ width: '100%', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: '9px 12px', color: T.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Phrase list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: T.muted, marginTop: 40, fontSize: 13 }}>No phrases found</div>
        )}
        {filtered.map(phrase => (
          <button
            key={phrase.id}
            onClick={() => onSelectPhrase(phrase)}
            style={{ width: '100%', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 14px', marginBottom: 8, cursor: 'pointer', textAlign: 'left', display: 'block' }}
          >
            <div style={{ color: T.text, fontFamily: "'Noto Sans JP', sans-serif", fontSize: 15, fontWeight: 500, marginBottom: 2 }}>{phrase.japanese}</div>
            <div style={{ color: T.muted, fontSize: 11 }}>{phrase.romaji}</div>
            <div style={{ color: T.text, fontSize: 12, marginTop: 3 }}>{phrase.meaning}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
