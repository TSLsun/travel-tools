# Greetings & Self-Introductions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two new conversation scenarios — `greeting` (20 phrases + 10 conversations) and `introduction` (10 phrases) — to the TravelTalk Japanese phrasebook.

**Architecture:** Content-only addition. Extend the `ScenarioKey` union and the `SCENARIOS` list, then append entries to the existing `phrases-ja.json` and `conversations-ja.json` data files. No new components or logic.

**Tech Stack:** TypeScript, React, Vite, Vitest. Data lives in `src/data/*.json`, typed by `src/types.ts`.

---

## File Structure

- `src/types.ts` — extend `ScenarioKey` union (2 new keys).
- `src/constants.ts` — prepend 2 entries to `SCENARIOS`.
- `src/data/phrases-ja.json` — append 20 greeting + 10 introduction phrase objects.
- `src/data/conversations-ja.json` — append 10 greeting conversation objects.
- `src/data/__tests__/content.test.ts` — NEW: data-integrity test for the new content.

---

## Task 1: Wire up the two new scenarios

**Files:**
- Modify: `src/types.ts:1-10`
- Modify: `src/constants.ts:3-13`

- [ ] **Step 1: Extend `ScenarioKey`**

In `src/types.ts`, change the union to add the two new keys at the end:

```typescript
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
  | 'greeting'
  | 'introduction'
```

- [ ] **Step 2: Prepend the two new scenarios to `SCENARIOS`**

In `src/constants.ts`, add the two entries as the FIRST items in the array:

```typescript
export const SCENARIOS: { key: ScenarioKey; label: string; emoji: string }[] = [
  { key: 'greeting',     label: 'Greeting',     emoji: '👋' },
  { key: 'introduction', label: 'Introduction', emoji: '🙋' },
  { key: 'airport',      label: 'Airport',      emoji: '✈️' },
  { key: 'food',         label: 'Food',         emoji: '🍜' },
  { key: 'hotel',        label: 'Hotel',        emoji: '🏨' },
  { key: 'shopping',     label: 'Shopping',     emoji: '🛒' },
  { key: 'navigation',   label: 'Navigation',   emoji: '🗺️' },
  { key: 'transit',      label: 'Transit',      emoji: '🚃' },
  { key: 'emergency',    label: 'Emergency',    emoji: '🚨' },
  { key: 'restaurant',   label: 'Restaurant',   emoji: '🍽️' },
  { key: 'convenience',  label: 'Convenience',  emoji: '🏪' },
]
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: build succeeds (no type errors). The new union members are referenced by upcoming data, which is type-asserted, so this should pass on its own.

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/constants.ts
git commit -m "feat: register greeting and introduction scenarios"
```

---

## Task 2: Add greeting + introduction phrases

**Files:**
- Modify: `src/data/phrases-ja.json` (append before the closing `]`)

- [ ] **Step 1: Append the 20 greeting phrases**

Add these objects to the JSON array (after the last existing entry, before the closing `]`). Match the existing formatting style.

```json
  { "id": "ja-greeting-001", "scenario": "greeting", "japanese": "おはようございます", "romaji": "Ohayou gozaimasu", "meaning": "早安", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-002", "scenario": "greeting", "japanese": "こんにちは", "romaji": "Konnichiwa", "meaning": "你好（午安）", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-003", "scenario": "greeting", "japanese": "こんばんは", "romaji": "Konbanwa", "meaning": "晚上好", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-004", "scenario": "greeting", "japanese": "おやすみなさい", "romaji": "Oyasuminasai", "meaning": "晚安（睡前）", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-005", "scenario": "greeting", "japanese": "はじめまして", "romaji": "Hajimemashite", "meaning": "初次見面", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-006", "scenario": "greeting", "japanese": "お元気ですか？", "romaji": "Ogenki desu ka?", "meaning": "你好嗎？", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-007", "scenario": "greeting", "japanese": "おかげさまで元気です", "romaji": "Okagesama de genki desu", "meaning": "託您的福，我很好", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-008", "scenario": "greeting", "japanese": "ありがとうございます", "romaji": "Arigatou gozaimasu", "meaning": "謝謝", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-009", "scenario": "greeting", "japanese": "どういたしまして", "romaji": "Dou itashimashite", "meaning": "不客氣", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-010", "scenario": "greeting", "japanese": "すみません", "romaji": "Sumimasen", "meaning": "不好意思／抱歉", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-011", "scenario": "greeting", "japanese": "ごめんなさい", "romaji": "Gomennasai", "meaning": "對不起", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-012", "scenario": "greeting", "japanese": "さようなら", "romaji": "Sayounara", "meaning": "再見", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-013", "scenario": "greeting", "japanese": "また会いましょう", "romaji": "Mata aimashou", "meaning": "再見面吧", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-014", "scenario": "greeting", "japanese": "また明日", "romaji": "Mata ashita", "meaning": "明天見", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-015", "scenario": "greeting", "japanese": "お久しぶりです", "romaji": "Ohisashiburi desu", "meaning": "好久不見", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-016", "scenario": "greeting", "japanese": "よろしくお願いします", "romaji": "Yoroshiku onegai shimasu", "meaning": "請多指教", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-017", "scenario": "greeting", "japanese": "いってきます", "romaji": "Ittekimasu", "meaning": "我出門了", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-018", "scenario": "greeting", "japanese": "ただいま", "romaji": "Tadaima", "meaning": "我回來了", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-019", "scenario": "greeting", "japanese": "お疲れさまです", "romaji": "Otsukaresama desu", "meaning": "辛苦了", "isCustom": false, "isFavorite": false },
  { "id": "ja-greeting-020", "scenario": "greeting", "japanese": "失礼します", "romaji": "Shitsurei shimasu", "meaning": "打擾了／告辭", "isCustom": false, "isFavorite": false },
```

- [ ] **Step 2: Append the 10 introduction phrases**

Add these objects right after the greeting block (still before the closing `]`). The first two are the user-required phrases.

```json
  { "id": "ja-introduction-001", "scenario": "introduction", "japanese": "台湾から来ました", "romaji": "Taiwan kara kimashita", "meaning": "我是台灣人（從台灣來）", "isCustom": false, "isFavorite": false },
  { "id": "ja-introduction-002", "scenario": "introduction", "japanese": "日本語を勉強しています", "romaji": "Nihongo wo benkyou shite imasu", "meaning": "我還在學習日語", "isCustom": false, "isFavorite": false },
  { "id": "ja-introduction-003", "scenario": "introduction", "japanese": "はじめまして、林と申します", "romaji": "Hajimemashite, Rin to moushimasu", "meaning": "初次見面，我姓林", "isCustom": false, "isFavorite": false },
  { "id": "ja-introduction-004", "scenario": "introduction", "japanese": "私の名前はリンです", "romaji": "Watashi no namae wa Rin desu", "meaning": "我的名字是林", "isCustom": false, "isFavorite": false },
  { "id": "ja-introduction-005", "scenario": "introduction", "japanese": "日本語が少し話せます", "romaji": "Nihongo ga sukoshi hanasemasu", "meaning": "我會說一點日語", "isCustom": false, "isFavorite": false },
  { "id": "ja-introduction-006", "scenario": "introduction", "japanese": "日本語があまり上手ではありません", "romaji": "Nihongo ga amari jouzu de wa arimasen", "meaning": "我日語不太好", "isCustom": false, "isFavorite": false },
  { "id": "ja-introduction-007", "scenario": "introduction", "japanese": "ゆっくり話してもらえますか？", "romaji": "Yukkuri hanashite moraemasu ka?", "meaning": "可以說慢一點嗎？", "isCustom": false, "isFavorite": false },
  { "id": "ja-introduction-008", "scenario": "introduction", "japanese": "もう一度言ってください", "romaji": "Mou ichido itte kudasai", "meaning": "請再說一次", "isCustom": false, "isFavorite": false },
  { "id": "ja-introduction-009", "scenario": "introduction", "japanese": "英語で話せますか？", "romaji": "Eigo de hanasemasu ka?", "meaning": "可以用英文說嗎？", "isCustom": false, "isFavorite": false },
  { "id": "ja-introduction-010", "scenario": "introduction", "japanese": "会えて嬉しいです", "romaji": "Aete ureshii desu", "meaning": "很高興認識你", "isCustom": false, "isFavorite": false }
```

Note: the last object (`ja-introduction-010`) is the final array element — it must NOT have a trailing comma. The preceding existing last entry of the original file DID end without a comma; add a comma after it when appending.

- [ ] **Step 3: Validate JSON parses**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/data/phrases-ja.json','utf8')); console.log('ok')"`
Expected: prints `ok`

- [ ] **Step 4: Commit**

```bash
git add src/data/phrases-ja.json
git commit -m "feat: add greeting and introduction phrases"
```

---

## Task 3: Add greeting conversations

**Files:**
- Modify: `src/data/conversations-ja.json` (append before the closing `]`)

- [ ] **Step 1: Append the 10 greeting conversations**

Add these objects after the last existing conversation (before the closing `]`). Add a comma after the current last element first.

```json
  {
    "id": "ja-conv-greeting-001",
    "scenario": "greeting",
    "title": "初次見面",
    "turns": [
      { "speaker": "you",   "japanese": "はじめまして。",                       "romaji": "Hajimemashite.",                        "meaning": "初次見面。" },
      { "speaker": "staff", "japanese": "はじめまして。よろしくお願いします。", "romaji": "Hajimemashite. Yoroshiku onegai shimasu.", "meaning": "初次見面，請多指教。" },
      { "speaker": "you",   "japanese": "こちらこそ、よろしくお願いします。",   "romaji": "Kochira koso, yoroshiku onegai shimasu.",  "meaning": "我才要請您多指教。" }
    ]
  },
  {
    "id": "ja-conv-greeting-002",
    "scenario": "greeting",
    "title": "早安問候",
    "turns": [
      { "speaker": "staff", "japanese": "おはようございます。",             "romaji": "Ohayou gozaimasu.",          "meaning": "早安。" },
      { "speaker": "you",   "japanese": "おはようございます。いい天気ですね。", "romaji": "Ohayou gozaimasu. Ii tenki desu ne.", "meaning": "早安，天氣真好。" },
      { "speaker": "staff", "japanese": "そうですね。",                     "romaji": "Sou desu ne.",               "meaning": "是啊。" }
    ]
  },
  {
    "id": "ja-conv-greeting-003",
    "scenario": "greeting",
    "title": "詢問近況",
    "turns": [
      { "speaker": "you",   "japanese": "お久しぶりです。お元気ですか？",       "romaji": "Ohisashiburi desu. Ogenki desu ka?",      "meaning": "好久不見，你好嗎？" },
      { "speaker": "staff", "japanese": "おかげさまで元気です。あなたは？",     "romaji": "Okagesama de genki desu. Anata wa?",      "meaning": "託您的福很好。你呢？" },
      { "speaker": "you",   "japanese": "私も元気です。",                       "romaji": "Watashi mo genki desu.",                  "meaning": "我也很好。" }
    ]
  },
  {
    "id": "ja-conv-greeting-004",
    "scenario": "greeting",
    "title": "道別",
    "turns": [
      { "speaker": "you",   "japanese": "そろそろ失礼します。",     "romaji": "Sorosoro shitsurei shimasu.", "meaning": "我差不多該告辭了。" },
      { "speaker": "staff", "japanese": "気をつけてください。",     "romaji": "Ki wo tsukete kudasai.",      "meaning": "路上小心。" },
      { "speaker": "you",   "japanese": "ありがとうございます。さようなら。", "romaji": "Arigatou gozaimasu. Sayounara.", "meaning": "謝謝，再見。" }
    ]
  },
  {
    "id": "ja-conv-greeting-005",
    "scenario": "greeting",
    "title": "道謝",
    "turns": [
      { "speaker": "you",   "japanese": "本当にありがとうございました。", "romaji": "Hontou ni arigatou gozaimashita.", "meaning": "真的非常謝謝你。" },
      { "speaker": "staff", "japanese": "どういたしまして。",             "romaji": "Dou itashimashite.",               "meaning": "不客氣。" },
      { "speaker": "you",   "japanese": "また会いましょう。",             "romaji": "Mata aimashou.",                   "meaning": "再見面吧。" }
    ]
  },
  {
    "id": "ja-conv-greeting-006",
    "scenario": "greeting",
    "title": "晚上問候",
    "turns": [
      { "speaker": "staff", "japanese": "こんばんは。",                       "romaji": "Konbanwa.",                        "meaning": "晚上好。" },
      { "speaker": "you",   "japanese": "こんばんは。今日はありがとうございました。", "romaji": "Konbanwa. Kyou wa arigatou gozaimashita.", "meaning": "晚上好，今天謝謝你。" },
      { "speaker": "staff", "japanese": "おやすみなさい。",                   "romaji": "Oyasuminasai.",                    "meaning": "晚安。" }
    ]
  },
  {
    "id": "ja-conv-greeting-007",
    "scenario": "greeting",
    "title": "打招呼自我介紹",
    "turns": [
      { "speaker": "you",   "japanese": "こんにちは。林と申します。",                 "romaji": "Konnichiwa. Rin to moushimasu.",                 "meaning": "你好，我姓林。" },
      { "speaker": "staff", "japanese": "こんにちは。田中です。よろしくお願いします。", "romaji": "Konnichiwa. Tanaka desu. Yoroshiku onegai shimasu.", "meaning": "你好，我是田中，請多指教。" },
      { "speaker": "you",   "japanese": "こちらこそよろしくお願いします。",           "romaji": "Kochira koso yoroshiku onegai shimasu.",         "meaning": "我才要請您多指教。" }
    ]
  },
  {
    "id": "ja-conv-greeting-008",
    "scenario": "greeting",
    "title": "遲到道歉",
    "turns": [
      { "speaker": "you",   "japanese": "遅れてすみません。", "romaji": "Okurete sumimasen.", "meaning": "抱歉我遲到了。" },
      { "speaker": "staff", "japanese": "大丈夫ですよ。",     "romaji": "Daijoubu desu yo.",  "meaning": "沒關係的。" },
      { "speaker": "you",   "japanese": "ありがとうございます。", "romaji": "Arigatou gozaimasu.", "meaning": "謝謝。" }
    ]
  },
  {
    "id": "ja-conv-greeting-009",
    "scenario": "greeting",
    "title": "辛苦了",
    "turns": [
      { "speaker": "staff", "japanese": "お疲れさまです。",                     "romaji": "Otsukaresama desu.",                     "meaning": "辛苦了。" },
      { "speaker": "you",   "japanese": "お疲れさまです。今日もありがとうございました。", "romaji": "Otsukaresama desu. Kyou mo arigatou gozaimashita.", "meaning": "辛苦了，今天也謝謝你。" },
      { "speaker": "staff", "japanese": "また明日。",                           "romaji": "Mata ashita.",                           "meaning": "明天見。" }
    ]
  },
  {
    "id": "ja-conv-greeting-010",
    "scenario": "greeting",
    "title": "出門與回家",
    "turns": [
      { "speaker": "you",   "japanese": "いってきます。",       "romaji": "Ittekimasu.",     "meaning": "我出門了。" },
      { "speaker": "staff", "japanese": "いってらっしゃい。",   "romaji": "Itterasshai.",    "meaning": "慢走。" },
      { "speaker": "you",   "japanese": "ただいま。",           "romaji": "Tadaima.",        "meaning": "我回來了。" },
      { "speaker": "staff", "japanese": "おかえりなさい。",     "romaji": "Okaerinasai.",    "meaning": "歡迎回來。" }
    ]
  }
```

The `ja-conv-greeting-010` object is the new final array element — no trailing comma after it.

- [ ] **Step 2: Validate JSON parses**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/data/conversations-ja.json','utf8')); console.log('ok')"`
Expected: prints `ok`

- [ ] **Step 3: Commit**

```bash
git add src/data/conversations-ja.json
git commit -m "feat: add greeting conversations"
```

---

## Task 4: Data-integrity test + final verification

**Files:**
- Create: `src/data/__tests__/content.test.ts`

- [ ] **Step 1: Write the data-integrity test**

Create `src/data/__tests__/content.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import phrases from '../phrases-ja.json'
import conversations from '../conversations-ja.json'
import type { Phrase, ConversationSet } from '../../types'

const allPhrases = phrases as Phrase[]
const allConversations = conversations as ConversationSet[]

describe('new content: greeting & introduction', () => {
  it('has 20 greeting phrases', () => {
    expect(allPhrases.filter(p => p.scenario === 'greeting')).toHaveLength(20)
  })

  it('has 10 introduction phrases', () => {
    expect(allPhrases.filter(p => p.scenario === 'introduction')).toHaveLength(10)
  })

  it('has 10 greeting conversations', () => {
    expect(allConversations.filter(c => c.scenario === 'greeting')).toHaveLength(10)
  })

  it('includes the required self-introduction phrases', () => {
    const intros = allPhrases.filter(p => p.scenario === 'introduction')
    expect(intros.some(p => p.meaning.includes('台灣人'))).toBe(true)
    expect(intros.some(p => p.meaning.includes('學習日語'))).toBe(true)
  })
})

describe('data integrity', () => {
  it('all phrase ids are unique', () => {
    const ids = allPhrases.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all conversation ids are unique', () => {
    const ids = allConversations.map(c => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
```

- [ ] **Step 2: Run the test**

Run: `npm test -- src/data/__tests__/content.test.ts`
Expected: all 6 tests PASS. (If counts mismatch, fix the data in Task 2/3.)

- [ ] **Step 3: Run full test suite + build**

Run: `npm test && npm run build`
Expected: all tests pass; build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/data/__tests__/content.test.ts
git commit -m "test: add data-integrity test for greeting & introduction content"
```

---

## Self-Review Notes

- **Spec coverage:** greeting 20 phrases (Task 2) ✓, greeting 10 conversations (Task 3) ✓, introduction 10 phrases incl. 我是台灣人 / 我還在學習日語 (Task 2, asserted in Task 4) ✓, scenario wiring + emoji 👋/🙋 (Task 1) ✓.
- **Type consistency:** `ScenarioKey` keys `greeting`/`introduction` match across types.ts, constants.ts, JSON `scenario` fields, and the test filters.
- **No placeholders:** all content is concrete.
