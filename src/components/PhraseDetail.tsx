import { useEffect, useState } from 'react'
import type { Phrase } from '../types'
import type { ThemeTokens } from '../theme'
import { speak } from '../utils/tts'
import { renderJapanese } from '../utils/phrases'

interface Props {
  phrase: Phrase
  isFavorite: boolean
  partySize: number
  T: ThemeTokens
  onClose: () => void
  onToggleFavorite: () => void
  onUsed: () => void
}

export default function PhraseDetail({ phrase, isFavorite, partySize, T, onClose, onToggleFavorite, onUsed }: Props) {
  const hasCount = phrase.japanese.includes('{n}')
  const [localCount, setLocalCount] = useState(partySize)

  useEffect(() => {
    onUsed()
  }, [phrase.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderedJapanese = hasCount ? renderJapanese(phrase.japanese, localCount) : phrase.japanese
  const renderedMeaning = hasCount ? renderJapanese(phrase.meaning, localCount) : phrase.meaning

  function copyToClipboard() {
    navigator.clipboard.writeText(renderedJapanese).catch(() => {})
  }

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />

      {/* Sheet */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: T.surface, borderRadius: '20px 20px 0 0', padding: '20px 20px 40px', zIndex: 50 }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: T.border, borderRadius: 2, margin: '0 auto 20px' }} />

        {/* Japanese */}
        <div style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 28, fontWeight: 700, color: T.text, marginBottom: 6, lineHeight: 1.3 }}>
          {renderedJapanese}
        </div>

        {/* Romaji */}
        <div style={{ color: T.muted, fontSize: 14, marginBottom: 4 }}>{phrase.romaji}</div>

        {/* Meaning */}
        <div style={{ color: T.text, fontSize: 16, marginBottom: hasCount ? 12 : 24 }}>{renderedMeaning}</div>

        {/* Count stepper — only for {n} phrases */}
        {hasCount && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ color: T.muted, fontSize: 13 }}>人數</span>
            <button
              onClick={() => setLocalCount(c => Math.max(1, c - 1))}
              style={{ background: T.surface2, color: T.text, border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
            >
              −
            </button>
            <span style={{ fontSize: 18, fontWeight: 700, color: T.text, minWidth: 20, textAlign: 'center' }}>{localCount}</span>
            <button
              onClick={() => setLocalCount(c => Math.min(9, c + 1))}
              style={{ background: T.surface2, color: T.text, border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
            >
              ＋
            </button>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => speak(renderedJapanese)}
            style={{ flex: 1, background: T.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 0', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
          >
            🔊 Listen
          </button>
          <button
            onClick={copyToClipboard}
            style={{ flex: 1, background: T.surface2, color: T.text, border: 'none', borderRadius: 10, padding: '12px 0', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
          >
            📋 Copy
          </button>
          <button
            onClick={onToggleFavorite}
            style={{ background: T.surface2, color: isFavorite ? '#f59e0b' : T.muted, border: 'none', borderRadius: 10, padding: '12px 16px', cursor: 'pointer', fontSize: 18 }}
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
        </div>
      </div>
    </>
  )
}
