import type { pronounOrder } from './contants';

export type VowelHarmony = 'back' | 'front' | 'mixed';

export interface ConjugationPattern {
  pronoun: string;
  english: string;
  endings: Record<VowelHarmony, string>;
  note?: string;
}

export interface VerbEntry {
  id?: string;
  infinitive: string;
  stem: string;
  english: string;
  harmony: VowelHarmony;
  sample?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type Pronoun = (typeof pronounOrder)[number];

export interface HarmonyChallenge {
  verb: VerbEntry;
  pronoun: Pronoun;
  target: string;
}

export interface QuizQuestion {
  verb: VerbEntry;
  pronoun: Pronoun;
  answer: string;
  options: string[];
  clue: string;
}

// Vocabulary types for Firestore
export type VocabularyCategory =
  | 'essentials'
  | 'food-dining'
  | 'travel-transportation'
  | 'home-family'
  | 'work-education'
  | 'health-body'
  | 'shopping-money'
  | 'time-weather'
  | 'hobbies-leisure'
  | 'nature-animals';

export type VocabularyDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type VocabularyPartOfSpeech = 'noun' | 'adjective' | 'adverb' | 'verb' | 'phrase' | 'other';

export interface VocabularyEntry {
  id?: string;
  hungarian: string;
  english: string;
  category: VocabularyCategory;
  difficulty: VocabularyDifficulty;
  notes?: string;
  exampleSentence?: string;
  partOfSpeech: VocabularyPartOfSpeech;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VocabularyFormData {
  hungarian: string;
  english: string;
  category: VocabularyCategory;
  difficulty: VocabularyDifficulty;
  notes?: string;
  exampleSentence?: string;
  partOfSpeech: VocabularyPartOfSpeech;
}
