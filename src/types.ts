import { pronounOrder } from './contants'

export type VowelHarmony = 'back' | 'front' | 'mixed'

export interface ConjugationPattern {
  pronoun: string
  english: string
  endings: Record<VowelHarmony, string>
  note?: string
}

export interface VerbEntry {
  infinitive: string
  stem: string
  english: string
  harmony: VowelHarmony
  sample?: string
}

export type Pronoun = (typeof pronounOrder)[number];

export interface HarmonyChallenge {
  verb: VerbEntry
  pronoun: Pronoun
  target: string
}

export interface QuizQuestion {
  verb: VerbEntry
  pronoun: Pronoun
  answer: string
  options: string[]
  clue: string
}
