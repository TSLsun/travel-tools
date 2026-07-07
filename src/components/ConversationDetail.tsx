import type { ConversationSet } from '../types'
import type { ThemeTokens } from '../theme'
import { speak } from '../utils/tts'

interface Props {
  conversation: ConversationSet
  T: ThemeTokens
  onClose: () => void
}

export default function ConversationDetail({ conversation, T, onClose }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />

      {/* Sheet */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, maxHeight: '85dvh', background: T.surface, borderRadius: '20px 20px 0 0', padding: '20px 16px 40px', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: T.border, borderRadius: 2, margin: '0 auto 16px', flexShrink: 0 }} />

        {/* Title */}
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 16, textAlign: 'center', flexShrink: 0 }}>
          {conversation.title}
        </div>

        {/* Turns */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {conversation.turns.map((turn, i) => {
            const isYou = turn.speaker === 'you'
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isYou ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize: 10, color: T.muted, marginBottom: 3, padding: '0 4px' }}>
                  {isYou ? '你' : '店員'}
                </span>
                <div
                  onClick={() => speak(turn.japanese)}
                  style={{ background: isYou ? T.accent : T.surface2, color: isYou ? '#fff' : T.text, borderRadius: 14, padding: '10px 14px', maxWidth: '85%', cursor: 'pointer' }}
                >
                  <div style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>
                    {turn.japanese} <span style={{ fontSize: 13, opacity: 0.85 }}>🔊</span>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{turn.romaji}</div>
                  <div style={{ fontSize: 13, marginTop: 3 }}>{turn.meaning}</div>
                </div>
                {isYou && turn.alternatives && turn.alternatives.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, marginTop: 6, maxWidth: '85%' }}>
                    <span style={{ fontSize: 10, color: T.muted, padding: '0 4px' }}>也可以說：</span>
                    {turn.alternatives.map((alt, j) => (
                      <div
                        key={j}
                        onClick={() => speak(alt.japanese)}
                        style={{ border: `1.5px dashed ${T.accent}`, color: T.text, borderRadius: 14, padding: '8px 12px', cursor: 'pointer' }}
                      >
                        <div style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>
                          {alt.japanese} <span style={{ fontSize: 12, opacity: 0.85 }}>🔊</span>
                        </div>
                        <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{alt.romaji}</div>
                        <div style={{ fontSize: 12, marginTop: 2 }}>{alt.meaning}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
