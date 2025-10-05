import { pronounOrder, pronounHints } from '../contants';
import { sampleVerbs } from '../data/conjugation';
import { buildConjugation, shuffle } from './utils';

export interface Flashcard {
  front: string;
  back: string;
  type: 'conjugation' | 'infinitive';
}

export function createFlashcards(): Flashcard[] {
  const flashcards: Flashcard[] = [];

  // Create flashcards for each verb
  sampleVerbs.forEach(verb => {
    // Add infinitive card
    flashcards.push({
      front: verb.infinitive,
      back: verb.english,
      type: 'infinitive',
    });

    // Add conjugation cards for each pronoun
    pronounOrder.forEach(pronoun => {
      const conjugation = buildConjugation(verb, pronoun);
      flashcards.push({
        front: conjugation,
        back: `${pronounHints[pronoun]} · ${verb.english}`,
        type: 'conjugation',
      });
    });
  });

  return shuffle(flashcards);
}
