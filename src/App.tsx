import { useState } from 'react'
import { loadSettings, saveSettings } from './utils/storage'
import { THEMES, nextTheme } from './theme'
import type { AppSettings, Phrase, ScenarioKey } from './types'
import HomeScreen from './components/HomeScreen'
import PhrasesScreen from './components/PhrasesScreen'
import SettingsScreen from './components/SettingsScreen'
import TranslateModal from './components/TranslateModal'
import PhraseDetail from './components/PhraseDetail'

type Screen = 'home' | 'phrases' | 'settings'

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings())
  const [screen, setScreen] = useState<Screen>('home')
  const [phrasesScenario, setPhrasesScenario] = useState<ScenarioKey | 'all'>('all')
  const [translateOpen, setTranslateOpen] = useState(false)
  const [translateMode, setTranslateMode] = useState<'voice' | 'camera' | 'type'>('voice')
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null)

  const T = THEMES[settings.theme]
  const themeLabel = settings.theme === 'dark' ? '🌙' : settings.theme === 'light' ? '☀️' : '📜'

  function updateSettings(patch: Partial<AppSettings>) {
    const updated = { ...settings, ...patch }
    setSettings(updated)
    saveSettings(updated)
  }

  function openScenario(scenario: ScenarioKey) {
    setPhrasesScenario(scenario)
    setScreen('phrases')
  }

  function openTranslate(mode: 'voice' | 'camera' | 'type') {
    setTranslateMode(mode)
    setTranslateOpen(true)
  }

  function recordRecentlyUsed(phraseId: string) {
    const ids = [phraseId, ...settings.recentlyUsedIds.filter(id => id !== phraseId)].slice(0, 10)
    updateSettings({ recentlyUsedIds: ids })
  }

  function toggleFavorite(phraseId: string) {
    const favs = settings.favoritePhraseIds.includes(phraseId)
      ? settings.favoritePhraseIds.filter(id => id !== phraseId)
      : [...settings.favoritePhraseIds, phraseId]
    updateSettings({ favoritePhraseIds: favs })
  }

  const screenProps = { settings, updateSettings, T, onOpenTranslate: openTranslate, onSelectPhrase: setSelectedPhrase, onSelectScenario: openScenario }

  return (
    <div style={{ background: T.bg, color: T.text, height: '100dvh', overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif", display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto' }}>

      {/* Persistent header */}
      <div style={{ padding: '12px 16px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: 0.3 }}>🌏 TravelTalk</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ background: T.chip.bg, color: T.chip.text, fontSize: 11, padding: '3px 10px', borderRadius: 12, fontWeight: 500 }}>
              🇯🇵 日本語
            </span>
            <button
              onClick={() => updateSettings({ theme: nextTheme(settings.theme) })}
              style={{ background: T.surface2, border: 'none', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', fontSize: 14, color: T.text }}
              title="Change theme"
            >
              {themeLabel}
            </button>
          </div>
        </div>

        {/* Persistent translate hero */}
        <div style={{ background: T.surface, borderRadius: 14, padding: '16px', marginBottom: 12, textAlign: 'center' }}>
          <button
            onClick={() => openTranslate('voice')}
            style={{ width: 56, height: 56, borderRadius: '50%', background: T.accent, border: 'none', cursor: 'pointer', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', boxShadow: `0 4px 16px ${T.accentShadow}` }}
          >
            🎤
          </button>
          <div style={{ color: T.muted, fontSize: 11, marginBottom: 10, letterSpacing: 0.3 }}>Tap to speak</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => openTranslate('camera')}
              style={{ flex: 1, background: T.surface2, border: 'none', borderRadius: 8, padding: '8px 0', cursor: 'pointer', fontSize: 12, color: T.text, fontWeight: 500 }}
            >
              📷 Scan
            </button>
            <button
              onClick={() => openTranslate('type')}
              style={{ flex: 1, background: T.surface2, border: 'none', borderRadius: 8, padding: '8px 0', cursor: 'pointer', fontSize: 12, color: T.text, fontWeight: 500 }}
            >
              ⌨️ Type
            </button>
          </div>
        </div>
      </div>

      {/* Screen content */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {screen === 'home'     && <HomeScreen     {...screenProps} />}
        {screen === 'phrases'  && <PhrasesScreen  key={phrasesScenario} initialScenario={phrasesScenario} {...screenProps} />}
        {screen === 'settings' && <SettingsScreen {...screenProps} />}
      </div>

      {/* Bottom nav */}
      <nav style={{ borderTop: `1px solid ${T.border}`, background: T.surface, display: 'flex', padding: '8px 0 12px', flexShrink: 0 }}>
        {(['home', 'phrases', 'settings'] as Screen[]).map(s => (
          <button
            key={s}
            onClick={() => setScreen(s)}
            style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: screen === s ? T.accent : T.muted, fontSize: 10, fontWeight: screen === s ? 600 : 400 }}
          >
            <span style={{ fontSize: 20 }}>{s === 'home' ? '🏠' : s === 'phrases' ? '📖' : '⚙️'}</span>
            {s === 'home' ? 'Home' : s === 'phrases' ? 'Phrases' : 'Settings'}
          </button>
        ))}
      </nav>

      {translateOpen && (
        <TranslateModal
          initialMode={translateMode}
          settings={settings}
          T={T}
          onClose={() => setTranslateOpen(false)}
          onSavePhrase={(phrase) => updateSettings({ customPhrases: [...settings.customPhrases, phrase] })}
        />
      )}

      {selectedPhrase && (
        <PhraseDetail
          phrase={selectedPhrase}
          isFavorite={settings.favoritePhraseIds.includes(selectedPhrase.id)}
          T={T}
          onClose={() => setSelectedPhrase(null)}
          onToggleFavorite={() => toggleFavorite(selectedPhrase.id)}
          onUsed={() => recordRecentlyUsed(selectedPhrase.id)}
        />
      )}
    </div>
  )
}
