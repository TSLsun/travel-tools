import { useState } from 'react'
import type { ConversationSet, ScenarioKey } from '../types'
import type { ThemeTokens } from '../theme'
import { SCENARIOS } from '../constants'
import { getConversations, filterConversations } from '../utils/conversations'

interface Props {
  T: ThemeTokens
  onSelectConversation: (conversation: ConversationSet) => void
}

export default function ConversationsScreen({ T, onSelectConversation }: Props) {
  const all = getConversations()
  const scenarioKeys = new Set(all.map(c => c.scenario))
  const tabs = [
    { key: 'all' as const, label: 'All', emoji: '💬' },
    ...SCENARIOS.filter(s => scenarioKeys.has(s.key)),
  ]
  const [activeScenario, setActiveScenario] = useState<ScenarioKey | 'all'>('all')
  const filtered = filterConversations(all, activeScenario)
  const emojiOf = (key: ScenarioKey) => SCENARIOS.find(s => s.key === key)?.emoji ?? '💬'

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

      {/* Hint */}
      <div style={{ padding: '8px 16px 0', color: T.muted, fontSize: 11 }}>
        對話範例 — 含對方（店員）可能的回答
      </div>

      {/* Conversation list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 16px' }}>
        {filtered.map(conv => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv)}
            style={{ width: '100%', background: T.surface, border: 'none', borderRadius: 10, padding: '12px 14px', marginBottom: 8, cursor: 'pointer', textAlign: 'left', display: 'block' }}
          >
            <div style={{ color: T.text, fontSize: 14, fontWeight: 600, marginBottom: 3 }}>
              {emojiOf(conv.scenario)} {conv.title}
            </div>
            <div style={{ color: T.muted, fontFamily: "'Noto Sans JP', sans-serif", fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {conv.turns[0].japanese}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
