import {pronounHints, pronounOrder} from '../contants';
import {indefinitePatterns} from '../data/conjugation';
import type {VerbEntry, VocabularyCategory, VocabularyEntry} from '../types';
import {buildConjugation, shuffle} from './utils';

export interface Flashcard {
  front: string;
  back: string;
  type: 'conjugation' | 'infinitive' | 'vocabulary';
  category?: VocabularyCategory;
  difficulty?: string;
  partOfSpeech?: string;
}

export function createVerbFlashcards(verbs: VerbEntry[]): Flashcard[] {
  const flashcards: Flashcard[] = [];

  // Create flashcards for each verb
  verbs.forEach((verb) => {
    // Add infinitive card
    flashcards.push({
      front: verb.infinitive,
      back: verb.english,
      type: 'infinitive',
    });

    // Add conjugation cards for each pronoun
    pronounOrder.forEach((pronoun) => {
      const conjugation = buildConjugation(verb, pronoun);
      const pattern = indefinitePatterns.find((p) => p.pronoun === pronoun);
      const englishPronoun = pattern?.english || '';

      // Convert "to verb" to conjugated form (e.g., "to party" → "party")
      const verbBase = verb.english.replace(/^to /, '');

      flashcards.push({
        front: conjugation,
        back: `${pronounHints[pronoun]} · ${englishPronoun} ${verbBase}`,
        type: 'conjugation',
      });
    });
  });

  return flashcards;
}

export function createVocabularyFlashcards(vocabulary: VocabularyEntry[]): Flashcard[] {
  return vocabulary.map((entry) => ({
    front: entry.hungarian,
    back: entry.english,
    type: 'vocabulary' as const,
    category: entry.category,
    difficulty: entry.difficulty,
    partOfSpeech: entry.partOfSpeech,
  }));
}

export function createAllFlashcards(
  verbs: VerbEntry[],
  vocabulary: VocabularyEntry[]
): Flashcard[] {
  const verbCards = createVerbFlashcards(verbs);
  const vocabCards = createVocabularyFlashcards(vocabulary);
  return shuffle([...verbCards, ...vocabCards]);
}
