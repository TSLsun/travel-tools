# Design: Greetings & Self-Introductions Content

Date: 2026-06-16
Status: Approved

## Goal

Add two new conversation scenarios to TravelTalk:

1. **Greeting** — common Japanese greetings (招呼語)
2. **Introduction** — simple self-introductions for a Taiwanese learner of Japanese,
   including the required phrases 我是台灣人 and 我還在學習日語.

This is a content-only addition plus the minimal wiring to register two new
`ScenarioKey` values. No new components and no logic changes.

## Content Plan

| Scenario       | Single phrases (`phrases-ja.json`) | Conversations (`conversations-ja.json`) |
| -------------- | ---------------------------------- | --------------------------------------- |
| `greeting`     | 20                                 | 10                                      |
| `introduction` | 10                                 | 0                                       |

### Greeting — 20 single phrases (`ja-greeting-001` … `ja-greeting-020`)

Everyday greetings and courtesy phrases, e.g.:
おはようございます／こんにちは／こんばんは／はじめまして／お元気ですか／
おやすみなさい／ありがとうございます／すみません／さようなら／また会いましょう
／お久しぶりです／よろしくお願いします, etc.

### Greeting — 10 conversations (`ja-conv-greeting-001` … `ja-conv-greeting-010`)

Short 2–4 turn exchanges (`you` / `staff`), e.g. first meeting, morning greeting,
asking how someone is, saying goodbye, thanking, parting after a chat.

### Introduction — 10 single phrases (`ja-introduction-001` … `ja-introduction-010`)

Self-introduction statements signalling the speaker is a Taiwanese, non-fluent
learner. MUST include:

- 我是台灣人 → `台湾から来ました` (Taiwan kara kimashita)
- 我還在學習日語 → `日本語を勉強しています` (Nihongo wo benkyou shite imasu)

Plus, e.g.: 我叫～／請多指教／我不太會說日語／可以說慢一點嗎／我聽不太懂／
請用英文／很高興認識你, etc.

## Data Format (match existing)

- `Phrase`: `{ id, scenario, japanese, romaji, meaning, isCustom: false, isFavorite: false }`
- `ConversationSet`: `{ id, scenario, title, turns: [{ speaker, japanese, romaji, meaning }] }`
- `meaning` is zh-TW; `romaji` Hepburn, consistent with existing entries.

## Wiring Changes

- `src/types.ts` — extend `ScenarioKey` with `'greeting' | 'introduction'`.
- `src/constants.ts` — prepend to `SCENARIOS`:
  - `{ key: 'greeting',      label: 'Greeting',      emoji: '👋' }`
  - `{ key: 'introduction',  label: 'Introduction',  emoji: '🙋' }`
  - Placed first since greetings/intros open a conversation.

## Out of Scope

- No new components, screens, or logic.
- No changes to party-size rendering, TTS, translate, or storage.

## Verification

- `npm test` passes (existing phrase/scenario integrity tests).
- `npm run build` passes (TypeScript scenario exhaustiveness).
