import type { ConversationSet, ScenarioKey } from '../types'
import builtIn from '../data/conversations-ja.json'

const conversations = builtIn as ConversationSet[]

export function getConversations(): ConversationSet[] {
  return conversations
}

export function filterConversations(
  sets: ConversationSet[],
  scenario: ScenarioKey | 'all'
): ConversationSet[] {
  if (scenario === 'all') return sets
  return sets.filter(s => s.scenario === scenario)
}
