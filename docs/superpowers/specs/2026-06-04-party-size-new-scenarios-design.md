# Design: Party Size & New Scenarios

**Date:** 2026-06-04  
**Branch:** feat/party-size-new-scenarios

---

## Summary

Two features:
1. **Party size (人數)** — global default setting + per-phrase temporary override in PhraseDetail, for phrases that use `{n}` placeholder
2. **New scenarios** — `restaurant` (餐廳) and `convenience` (便利商店)

---

## 1. Data Layer

### AppSettings — new field
```ts
partySize: number  // default: 2, range: 1–9
```

### ScenarioKey — expand
```ts
export type ScenarioKey =
  | 'airport'
  | 'food'
  | 'hotel'
  | 'shopping'
  | 'navigation'
  | 'transit'
  | 'emergency'
  | 'restaurant'   // new
  | 'convenience'  // new
```

### Phrase type — unchanged
No schema change. `{n}` detected dynamically at render time by checking `phrase.japanese.includes('{n}')`.

### New utility function
Add to `src/utils/phrases.ts`:
```ts
export function renderJapanese(japanese: string, count: number): string {
  return japanese.replace(/\{n\}/g, String(count))
}
```

Used for display, clipboard copy, and TTS output.

---

## 2. UI Changes

### SettingsScreen
Add a "旅行人數" row with inline stepper:
- Display: `人數  [ − ]  2  [ + ]`
- Range: 1–9
- Persists to `AppSettings.partySize` via existing storage util

### PhraseDetail
If `phrase.japanese.includes('{n}')`:
- Show a compact stepper row below the meaning label
- Local state `localCount`, initialized to `AppSettings.partySize`
- Japanese display uses `renderJapanese(phrase.japanese, localCount)`
- Copy button copies rendered text
- Listen button speaks rendered text
- `localCount` resets when sheet closes (not persisted)

Phrases without `{n}` → PhraseDetail unchanged.

---

## 3. New Phrase Data

### `restaurant` scenario (12 phrases)

| ID | Japanese | Romaji | Meaning |
|----|----------|--------|---------|
| ja-restaurant-001 | `{n}名で予約しています` | `{n}-mei de yoyaku shite imasu` | 我訂了{n}位 |
| ja-restaurant-002 | `{n}名席はありますか？` | `{n}-mei-seki wa arimasu ka?` | 有{n}人的座位嗎？ |
| ja-restaurant-003 | `{n}名お願いします` | `{n}-mei onegaishimasu` | 我們{n}個人 |
| ja-restaurant-004 | `禁煙席をお願いします` | `Kin'en-seki wo onegaishimasu` | 請給我禁煙區座位 |
| ja-restaurant-005 | `テーブル席はありますか？` | `Tēburu-seki wa arimasu ka?` | 有桌位嗎？ |
| ja-restaurant-006 | `ラストオーダーは何時ですか？` | `Rasuto ōdā wa nanji desu ka?` | 最後點餐幾點？ |
| ja-restaurant-007 | `店内で食べます` | `Tennai de tabemasu` | 在店內用餐 |
| ja-restaurant-008 | `おまかせでお願いします` | `Omakase de onegaishimasu` | 請給主廚推薦 |
| ja-restaurant-009 | `お通しは大丈夫です` | `Otōshi wa daijōbu desu` | 不用小菜謝謝 |
| ja-restaurant-010 | `追加注文してもいいですか？` | `Tsuika chūmon shite mo ii desu ka?` | 可以追加點餐嗎？ |
| ja-restaurant-011 | `お冷やをください` | `Ohiya wo kudasai` | 請給我冰水 |
| ja-restaurant-012 | `持ち帰りの容器をもらえますか？` | `Mochikaeri no yōki wo moraemasu ka?` | 可以給我外帶盒嗎？ |

### `convenience` scenario (10 phrases)

| ID | Japanese | Romaji | Meaning |
|----|----------|--------|---------|
| ja-convenience-001 | `温めてください` | `Atatamete kudasai` | 請幫我加熱 |
| ja-convenience-002 | `箸をください` | `Hashi wo kudasai` | 請給我筷子 |
| ja-convenience-003 | `スプーンをください` | `Supūn wo kudasai` | 請給我湯匙 |
| ja-convenience-004 | `袋はいりません` | `Fukuro wa irimasen` | 不需要袋子 |
| ja-convenience-005 | `レジ袋をください` | `Reji-bukuro wo kudasai` | 請給我塑膠袋 |
| ja-convenience-006 | `Suicaで払います` | `Suica de haraimasu` | 我用 Suica 付款 |
| ja-convenience-007 | `ATMはどこですか？` | `ATM wa doko desu ka?` | ATM 在哪裡？ |
| ja-convenience-008 | `トイレはありますか？` | `Toire wa arimasu ka?` | 有廁所嗎？ |
| ja-convenience-009 | `コピー機の使い方を教えてください` | `Kopī-ki no tsukaikata wo oshiete kudasai` | 請教我影印機怎麼用 |
| ja-convenience-010 | `領収書をください` | `Ryōshūsho wo kudasai` | 請給我收據 |

---

## 4. Files to Change

| File | Change |
|------|--------|
| `src/types.ts` | Add `restaurant \| convenience` to `ScenarioKey`; add `partySize` to `AppSettings` |
| `src/utils/phrases.ts` | Add `renderJapanese()` |
| `src/utils/storage.ts` | Ensure `partySize` default = 2 in settings init |
| `src/data/phrases-ja.json` | Add 22 new phrases |
| `src/components/SettingsScreen.tsx` | Add 人數 stepper row |
| `src/components/PhraseDetail.tsx` | Add `{n}` detection + local count stepper |

---

## 5. Out of Scope

- No changes to `food` scenario (kept as-is)
- No phrase count persisted per-phrase (always resets to `partySize`)
- No i18n for stepper label (existing app is zh-TW only)
