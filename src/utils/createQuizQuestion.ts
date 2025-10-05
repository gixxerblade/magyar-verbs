import { pronounOrder, pronounHints } from '../contants';
import { sampleVerbs } from '../data/conjugation';
import { QuizQuestion } from '../types';
import { buildConjugation, shuffle, randomItem } from './utils';

export function createQuizQuestion(): QuizQuestion {
  const verb = randomItem(sampleVerbs);
  const pronoun = randomItem(pronounOrder);
  const answer = buildConjugation(verb, pronoun);
  const clue = `${pronounHints[pronoun]} · ${verb.english}`;

  // Generate all conjugations of this verb
  const verbConjugations = pronounOrder.map(p => buildConjugation(verb, p));

  // Pick 3 other conjugations as distractors
  const distractors = verbConjugations.filter(form => form !== answer);
  const selectedDistractors = shuffle(distractors).slice(0, 3);

  const options = shuffle([answer, ...selectedDistractors]);
  return { verb, pronoun, answer, options, clue };
}
