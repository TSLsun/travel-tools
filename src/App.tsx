import { useState } from 'react'
import { loadSettings, saveSettings } from './utils/storage'
import { THEMES } from './theme'
import type { AppSettings, Phrase } from './types'
import HomeScreen from './components/HomeScreen'
import PhrasesScreen from './components/PhrasesScreen'
import SettingsScreen from './components/SettingsScreen'
import TranslateModal from './components/TranslateModal'
import PhraseDetail from './components/PhraseDetail'

type Screen = 'home' | 'phrases' | 'settings'

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings())
  const [screen, setScreen] = useState<Screen>('home')
  const [translateOpen, setTranslateOpen] = useState(false)
  const [translateMode, setTranslateMode] = useState<'voice' | 'camera' | 'type'>('voice')
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null)

  const T = THEMES[settings.theme]

  function updateSettings(patch: Partial<AppSettings>) {
    const updated = { ...settings, ...patch }
    setSettings(updated)
    saveSettings(updated)
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

  const screenProps = { settings, updateSettings, T, onOpenTranslate: openTranslate, onSelectPhrase: setSelectedPhrase }

  return (
    <div style={{ background: T.bg, color: T.text, minHeight: '100dvh', fontFamily: "'Inter', system-ui, sans-serif", display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {screen === 'home'     && <HomeScreen     {...screenProps} />}
        {screen === 'phrases'  && <PhrasesScreen  {...screenProps} />}
        {screen === 'settings' && <SettingsScreen {...screenProps} />}
      </div>

      {/* Bottom nav */}
      <nav style={{ borderTop: `1px solid ${T.border}`, background: T.surface, display: 'flex', padding: '8px 0 12px' }}>
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
