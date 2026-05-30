import type { AppSettings, ScenarioKey } from '../types'
import type { ThemeTokens } from '../theme'
import type { Phrase } from '../types'
import { SCENARIOS } from '../constants'

interface Props {
  settings: AppSettings
  updateSettings: (patch: Partial<AppSettings>) => void
  T: ThemeTokens
  onOpenTranslate?: (mode: 'voice' | 'camera' | 'type') => void
  onSelectPhrase: (phrase: Phrase) => void
  onSelectScenario: (scenario: ScenarioKey) => void
}

export default function HomeScreen({ T, onSelectScenario }: Props) {
  return (
    <div style={{ padding: '0 16px 16px' }}>
      <div style={{ color: T.muted, fontSize: 11, marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>Quick scenarios</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {SCENARIOS.map(s => (
          <button
            key={s.key}
            onClick={() => onSelectScenario(s.key)}
            style={{ background: T.surface2, border: 'none', borderRadius: 10, padding: '16px 4px', cursor: 'pointer', color: T.text, fontSize: 10, fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minHeight: 80 }}
          >
            <span style={{ fontSize: 26 }}>{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
