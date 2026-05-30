import type { AppSettings, NativeLang, Phrase } from '../types'
import type { ThemeTokens } from '../theme'
import { THEME_ORDER } from '../theme'

interface Props {
  settings: AppSettings
  updateSettings: (patch: Partial<AppSettings>) => void
  T: ThemeTokens
  onOpenTranslate: (mode: 'voice' | 'camera' | 'type') => void
  onSelectPhrase: (phrase: Phrase) => void
}

export default function SettingsScreen({ settings, updateSettings, T }: Props) {
  const { theme, nativeLang, customPhrases } = settings
  const themeLabels: Record<string, string> = { dark: '🌙 Dark', light: '☀️ Light', sepia: '📜 Sepia' }

  function deleteCustomPhrase(id: string) {
    updateSettings({ customPhrases: customPhrases.filter(p => p.id !== id) })
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>⚙️ Settings</div>

      {/* Theme */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Theme</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {THEME_ORDER.map(t => (
            <button key={t} onClick={() => updateSettings({ theme: t })}
              style={{ flex: 1, background: theme === t ? T.accent : T.surface2, color: theme === t ? '#fff' : T.muted, border: 'none', borderRadius: 8, padding: '9px 0', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
              {themeLabels[t]}
            </button>
          ))}
        </div>
        <div style={{ color: T.muted, fontSize: 11, marginTop: 6 }}>Current: {themeLabels[theme]}. Home screen 🎨 button rotates through all three.</div>
      </div>

      {/* Native language */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Your language</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['zh-TW', 'en'] as NativeLang[]).map(lang => (
            <button key={lang} onClick={() => updateSettings({ nativeLang: lang })}
              style={{ flex: 1, background: nativeLang === lang ? T.accent : T.surface2, color: nativeLang === lang ? '#fff' : T.muted, border: 'none', borderRadius: 8, padding: '9px 0', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              {lang === 'zh-TW' ? '🇹🇼 繁中' : '🇺🇸 English'}
            </button>
          ))}
        </div>
      </div>

      {/* Target language */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Target language</div>
        <div style={{ background: T.surface2, borderRadius: 8, padding: '10px 12px', color: T.text, fontSize: 13 }}>🇯🇵 日本語 (v1 — more languages coming)</div>
      </div>

      {/* API Key status */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Google API</div>
        <div style={{ background: T.surface2, borderRadius: 8, padding: '10px 12px', fontSize: 13, color: import.meta.env.VITE_GOOGLE_API_KEY ? '#22c55e' : '#ef4444' }}>
          {import.meta.env.VITE_GOOGLE_API_KEY ? '✓ API key configured' : '✗ VITE_GOOGLE_API_KEY not set in .env.local'}
        </div>
      </div>

      {/* Custom phrases */}
      <div>
        <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Custom phrases ({customPhrases.length})</div>
        {customPhrases.length === 0 && (
          <div style={{ color: T.muted, fontSize: 13 }}>No custom phrases yet. Save translations to add some.</div>
        )}
        {customPhrases.map(p => (
          <div key={p.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: '10px 12px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: T.text, fontSize: 14 }}>{p.japanese}</div>
              <div style={{ color: T.muted, fontSize: 11 }}>{p.meaning}</div>
            </div>
            <button onClick={() => deleteCustomPhrase(p.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 18, padding: 4 }}>
              ×
            </button>
          </div>
        ))}
      </div>

      <div style={{ color: T.muted, fontSize: 10, textAlign: 'center', marginTop: 24 }}>
        v{(typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0')}
      </div>
    </div>
  )
}
