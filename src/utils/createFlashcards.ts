import { pronounHints, pronounOrder } from '../contants';
import { indefinitePatterns } from '../data/conjugation';
import type { VerbEntry } from '../types';
import { buildConjugation, shuffle } from './utils';

export interface Flashcard {
  front: string;
  back: string;
  type: 'conjugation' | 'infinitive';
}

export function createFlashcards(verbs: VerbEntry[]): Flashcard[] {
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

  return shuffle(flashcards);
}
