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

describe('new content: reply options & Tokyo trip scenarios', () => {
  it('has at least 10 conversations with alternative replies', () => {
    const withAlts = allConversations.filter(c =>
      c.turns.some(t => t.alternatives && t.alternatives.length > 0)
    )
    expect(withAlts.length).toBeGreaterThanOrEqual(10)
  })

  it('alternatives only appear on "you" turns and are well-formed', () => {
    for (const conv of allConversations) {
      for (const turn of conv.turns) {
        if (!turn.alternatives) continue
        expect(turn.speaker).toBe('you')
        expect(turn.alternatives.length).toBeGreaterThan(0)
        for (const alt of turn.alternatives) {
          expect(alt.japanese).toBeTruthy()
          expect(alt.romaji).toBeTruthy()
          expect(alt.meaning).toBeTruthy()
        }
      }
    }
  })

  it('covers Tokyo trip scenarios', () => {
    const count = (s: string) => allConversations.filter(c => c.scenario === s).length
    expect(count('airport')).toBeGreaterThanOrEqual(2)
    expect(count('transit')).toBeGreaterThanOrEqual(2)
    expect(count('hotel')).toBeGreaterThanOrEqual(1)
    expect(count('navigation')).toBeGreaterThanOrEqual(1)
    expect(count('convenience')).toBeGreaterThanOrEqual(11)
    expect(count('restaurant')).toBeGreaterThanOrEqual(11)
  })

  it('includes luggage forwarding (takkyuubin) conversation', () => {
    expect(allConversations.some(c => c.turns.some(t => t.japanese.includes('宅急便')))).toBe(true)
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
