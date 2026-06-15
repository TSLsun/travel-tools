# Party Size & New Scenarios Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add editable party size (人數) with `{n}` template substitution in phrases, plus two new scenarios — `restaurant` (餐廳) and `convenience` (便利商店).

**Architecture:** `{n}` is detected dynamically at render time — no schema change to `Phrase`. A new `renderJapanese()` util replaces `{n}` with a count. `AppSettings` gains `partySize` (default 2) as global default; `PhraseDetail` holds a local override. New scenarios added to `ScenarioKey`, `SCENARIOS`, and the phrase data file.

**Tech Stack:** React, TypeScript, Vitest, inline styles (existing pattern)

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `src/types.ts` | Modify | Add `restaurant \| convenience` to `ScenarioKey`; add `partySize: number` to `AppSettings` |
| `src/constants.ts` | Modify | Add `partySize: 2` to `DEFAULT_SETTINGS`; add restaurant + convenience rows to `SCENARIOS` |
| `src/utils/phrases.ts` | Modify | Add `renderJapanese(japanese, count)` |
| `src/utils/__tests__/phrases.test.ts` | Modify | Add tests for `renderJapanese` |
| `src/data/phrases-ja.json` | Modify | Append 12 restaurant + 10 convenience phrases |
| `src/components/SettingsScreen.tsx` | Modify | Add 人數 stepper row (reads/writes `settings.partySize`) |
| `src/components/PhraseDetail.tsx` | Modify | Detect `{n}` → show local count stepper; render substituted text |

---

## Task 1: Types, constants, and scenario metadata

**Files:**
- Modify: `src/types.ts`
- Modify: `src/constants.ts`

- [ ] **Step 1: Expand `ScenarioKey` and `AppSettings` in types.ts**

Open `src/types.ts`. Change:
```ts
export type ScenarioKey =
  | 'airport'
  | 'food'
  | 'hotel'
  | 'shopping'
  | 'navigation'
  | 'transit'
  | 'emergency'
```
to:
```ts
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
```

Also add `partySize` to `AppSettings`:
```ts
export interface AppSettings {
  theme: Theme
  nativeLang: NativeLang
  targetLanguage: 'ja'
  recentlyUsedIds: string[]
  customPhrases: Phrase[]
  favoritePhraseIds: string[]
  partySize: number          // new — range 1–9
}
```

- [ ] **Step 2: Update constants.ts**

In `src/constants.ts`, add `partySize: 2` to `DEFAULT_SETTINGS`:
```ts
export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  nativeLang: 'zh-TW',
  targetLanguage: 'ja',
  recentlyUsedIds: [],
  customPhrases: [],
  favoritePhraseIds: [],
  partySize: 2,              // new
}
```

Also add the two new scenario rows to `SCENARIOS`:
```ts
export const SCENARIOS: { key: ScenarioKey; label: string; emoji: string }[] = [
  { key: 'airport',      label: 'Airport',      emoji: '✈️' },
  { key: 'food',         label: 'Food',         emoji: '🍜' },
  { key: 'hotel',        label: 'Hotel',        emoji: '🏨' },
  { key: 'shopping',     label: 'Shopping',     emoji: '🛒' },
  { key: 'navigation',   label: 'Navigation',   emoji: '🗺️' },
  { key: 'transit',      label: 'Transit',      emoji: '🚃' },
  { key: 'emergency',    label: 'Emergency',    emoji: '🚨' },
  { key: 'restaurant',   label: 'Restaurant',   emoji: '🍽️' },  // new
  { key: 'convenience',  label: 'Convenience',  emoji: '🏪' },  // new
]
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/constants.ts
git commit -m "feat: add restaurant/convenience scenarios and partySize to AppSettings"
```

---

## Task 2: `renderJapanese` utility (TDD)

**Files:**
- Modify: `src/utils/__tests__/phrases.test.ts`
- Modify: `src/utils/phrases.ts`

- [ ] **Step 1: Write failing tests**

Add at the bottom of `src/utils/__tests__/phrases.test.ts`:
```ts
import { renderJapanese } from '../phrases'

describe('renderJapanese', () => {
  it('replaces {n} with the given count', () => {
    expect(renderJapanese('{n}名お願いします', 3)).toBe('3名お願いします')
  })
  it('replaces all occurrences of {n}', () => {
    expect(renderJapanese('{n}名、{n}席', 2)).toBe('2名、2席')
  })
  it('returns the string unchanged when no {n} present', () => {
    expect(renderJapanese('温めてください', 5)).toBe('温めてください')
  })
  it('works with count = 1', () => {
    expect(renderJapanese('{n}名で予約しています', 1)).toBe('1名で予約しています')
  })
})
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npx vitest run src/utils/__tests__/phrases.test.ts
```
Expected: fails with `renderJapanese is not a function` or import error.

- [ ] **Step 3: Implement `renderJapanese` in phrases.ts**

Add at the bottom of `src/utils/phrases.ts`:
```ts
export function renderJapanese(japanese: string, count: number): string {
  return japanese.replace(/\{n\}/g, String(count))
}
```

Also add `renderJapanese` to the import line at the top of the test file:
```ts
import {
  filterByScenario,
  searchPhrases,
  getFavorites,
  getRecentlyUsed,
  getAllPhrases,
  renderJapanese,
} from '../phrases'
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npx vitest run src/utils/__tests__/phrases.test.ts
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/phrases.ts src/utils/__tests__/phrases.test.ts
git commit -m "feat: add renderJapanese utility for {n} placeholder substitution"
```

---

## Task 3: Phrase data — restaurant and convenience

**Files:**
- Modify: `src/data/phrases-ja.json`

- [ ] **Step 1: Append restaurant phrases**

In `src/data/phrases-ja.json`, before the closing `]`, add after the last emergency phrase:

```json
  { "id": "ja-restaurant-001", "scenario": "restaurant", "japanese": "{n}名で予約しています", "romaji": "{n}-mei de yoyaku shite imasu", "meaning": "我訂了{n}位", "isCustom": false, "isFavorite": false },
  { "id": "ja-restaurant-002", "scenario": "restaurant", "japanese": "{n}名席はありますか？", "romaji": "{n}-mei-seki wa arimasu ka?", "meaning": "有{n}人的座位嗎？", "isCustom": false, "isFavorite": false },
  { "id": "ja-restaurant-003", "scenario": "restaurant", "japanese": "{n}名お願いします", "romaji": "{n}-mei onegaishimasu", "meaning": "我們{n}個人", "isCustom": false, "isFavorite": false },
  { "id": "ja-restaurant-004", "scenario": "restaurant", "japanese": "禁煙席をお願いします", "romaji": "Kin'en-seki wo onegaishimasu", "meaning": "請給我禁煙區座位", "isCustom": false, "isFavorite": false },
  { "id": "ja-restaurant-005", "scenario": "restaurant", "japanese": "テーブル席はありますか？", "romaji": "Tēburu-seki wa arimasu ka?", "meaning": "有桌位嗎？", "isCustom": false, "isFavorite": false },
  { "id": "ja-restaurant-006", "scenario": "restaurant", "japanese": "ラストオーダーは何時ですか？", "romaji": "Rasuto ōdā wa nanji desu ka?", "meaning": "最後點餐幾點？", "isCustom": false, "isFavorite": false },
  { "id": "ja-restaurant-007", "scenario": "restaurant", "japanese": "店内で食べます", "romaji": "Tennai de tabemasu", "meaning": "在店內用餐", "isCustom": false, "isFavorite": false },
  { "id": "ja-restaurant-008", "scenario": "restaurant", "japanese": "おまかせでお願いします", "romaji": "Omakase de onegaishimasu", "meaning": "請給主廚推薦", "isCustom": false, "isFavorite": false },
  { "id": "ja-restaurant-009", "scenario": "restaurant", "japanese": "お通しは大丈夫です", "romaji": "Otōshi wa daijōbu desu", "meaning": "不用小菜謝謝", "isCustom": false, "isFavorite": false },
  { "id": "ja-restaurant-010", "scenario": "restaurant", "japanese": "追加注文してもいいですか？", "romaji": "Tsuika chūmon shite mo ii desu ka?", "meaning": "可以追加點餐嗎？", "isCustom": false, "isFavorite": false },
  { "id": "ja-restaurant-011", "scenario": "restaurant", "japanese": "お冷やをください", "romaji": "Ohiya wo kudasai", "meaning": "請給我冰水", "isCustom": false, "isFavorite": false },
  { "id": "ja-restaurant-012", "scenario": "restaurant", "japanese": "持ち帰りの容器をもらえますか？", "romaji": "Mochikaeri no yōki wo moraemasu ka?", "meaning": "可以給我外帶盒嗎？", "isCustom": false, "isFavorite": false },
```

- [ ] **Step 2: Append convenience phrases**

Immediately after the last restaurant phrase (still before closing `]`):

```json
  { "id": "ja-convenience-001", "scenario": "convenience", "japanese": "温めてください", "romaji": "Atatamete kudasai", "meaning": "請幫我加熱", "isCustom": false, "isFavorite": false },
  { "id": "ja-convenience-002", "scenario": "convenience", "japanese": "箸をください", "romaji": "Hashi wo kudasai", "meaning": "請給我筷子", "isCustom": false, "isFavorite": false },
  { "id": "ja-convenience-003", "scenario": "convenience", "japanese": "スプーンをください", "romaji": "Supūn wo kudasai", "meaning": "請給我湯匙", "isCustom": false, "isFavorite": false },
  { "id": "ja-convenience-004", "scenario": "convenience", "japanese": "袋はいりません", "romaji": "Fukuro wa irimasen", "meaning": "不需要袋子", "isCustom": false, "isFavorite": false },
  { "id": "ja-convenience-005", "scenario": "convenience", "japanese": "レジ袋をください", "romaji": "Reji-bukuro wo kudasai", "meaning": "請給我塑膠袋", "isCustom": false, "isFavorite": false },
  { "id": "ja-convenience-006", "scenario": "convenience", "japanese": "Suicaで払います", "romaji": "Suica de haraimasu", "meaning": "我用 Suica 付款", "isCustom": false, "isFavorite": false },
  { "id": "ja-convenience-007", "scenario": "convenience", "japanese": "ATMはどこですか？", "romaji": "ATM wa doko desu ka?", "meaning": "ATM 在哪裡？", "isCustom": false, "isFavorite": false },
  { "id": "ja-convenience-008", "scenario": "convenience", "japanese": "トイレはありますか？", "romaji": "Toire wa arimasu ka?", "meaning": "有廁所嗎？", "isCustom": false, "isFavorite": false },
  { "id": "ja-convenience-009", "scenario": "convenience", "japanese": "コピー機の使い方を教えてください", "romaji": "Kopī-ki no tsukaikata wo oshiete kudasai", "meaning": "請教我影印機怎麼用", "isCustom": false, "isFavorite": false },
  { "id": "ja-convenience-010", "scenario": "convenience", "japanese": "領収書をください", "romaji": "Ryōshūsho wo kudasai", "meaning": "請給我收據", "isCustom": false, "isFavorite": false }
```

- [ ] **Step 3: Verify JSON is valid and scenarios filter correctly**

```bash
node -e "const d = require('./src/data/phrases-ja.json'); const r = d.filter(p => p.scenario === 'restaurant'); const c = d.filter(p => p.scenario === 'convenience'); console.log('restaurant:', r.length, 'convenience:', c.length)"
```
Expected output: `restaurant: 12 convenience: 10`

- [ ] **Step 4: Run full test suite**

```bash
npx vitest run
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/phrases-ja.json
git commit -m "feat: add restaurant and convenience phrase data"
```

---

## Task 4: SettingsScreen — party size stepper

**Files:**
- Modify: `src/components/SettingsScreen.tsx`

- [ ] **Step 1: Add party size stepper UI**

In `src/components/SettingsScreen.tsx`, destructure `partySize` from `settings` at the top of the component function:

Change:
```ts
const { theme, nativeLang, customPhrases } = settings
```
to:
```ts
const { theme, nativeLang, customPhrases, partySize } = settings
```

Then insert a new section after the "Your language" section (after the `nativeLang` block closing `</div>`) and before the "Target language" section:

```tsx
{/* Party size */}
<div style={{ marginBottom: 20 }}>
  <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>旅行人數</div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <button
      onClick={() => updateSettings({ partySize: Math.max(1, partySize - 1) })}
      style={{ background: T.surface2, color: T.text, border: 'none', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', fontSize: 18, fontWeight: 700 }}
    >
      −
    </button>
    <span style={{ fontSize: 20, fontWeight: 700, color: T.text, minWidth: 24, textAlign: 'center' }}>{partySize}</span>
    <button
      onClick={() => updateSettings({ partySize: Math.min(9, partySize + 1) })}
      style={{ background: T.surface2, color: T.text, border: 'none', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', fontSize: 18, fontWeight: 700 }}
    >
      ＋
    </button>
  </div>
  <div style={{ color: T.muted, fontSize: 11, marginTop: 6 }}>用於含人數的常用句（如訂位、買票）</div>
</div>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/SettingsScreen.tsx
git commit -m "feat: add party size stepper to settings screen"
```

---

## Task 5: PhraseDetail — {n} count stepper

**Files:**
- Modify: `src/components/PhraseDetail.tsx`

- [ ] **Step 1: Update PhraseDetail to accept partySize and render {n} phrases**

Replace the entire contents of `src/components/PhraseDetail.tsx` with:

```tsx
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
    setLocalCount(partySize)
  }, [phrase.id, partySize]) // eslint-disable-line react-hooks/exhaustive-deps

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
```

- [ ] **Step 2: Pass `partySize` prop in App.tsx**

In `src/App.tsx` at line ~138, the `<PhraseDetail>` render looks like:
```tsx
<PhraseDetail
  phrase={selectedPhrase}
  isFavorite={settings.favoritePhraseIds.includes(selectedPhrase.id)}
  T={T}
  onClose={() => setSelectedPhrase(null)}
  onToggleFavorite={() => toggleFavorite(selectedPhrase.id)}
  onUsed={() => recordRecentlyUsed(selectedPhrase.id)}
/>
```

Add `partySize={settings.partySize}`:
```tsx
<PhraseDetail
  phrase={selectedPhrase}
  isFavorite={settings.favoritePhraseIds.includes(selectedPhrase.id)}
  partySize={settings.partySize}
  T={T}
  onClose={() => setSelectedPhrase(null)}
  onToggleFavorite={() => toggleFavorite(selectedPhrase.id)}
  onUsed={() => recordRecentlyUsed(selectedPhrase.id)}
/>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Run full test suite**

```bash
npx vitest run
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/PhraseDetail.tsx
git commit -m "feat: add party size stepper in PhraseDetail for {n} phrases"
```

---

## Task 6: Final verification

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
```
Expected: all tests pass.

- [ ] **Step 2: Run type check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Run lint**

```bash
npx eslint src/
```
Expected: no errors.

- [ ] **Step 4: Build**

```bash
npm run build
```
Expected: build succeeds with no errors.
