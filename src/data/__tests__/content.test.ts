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
