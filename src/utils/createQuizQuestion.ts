import {pronounHints, pronounOrder} from '../contants';
import type {QuizQuestion, VerbEntry} from '../types';
import {buildConjugation, randomItem, shuffle} from './utils';

export function createQuizQuestion(verbs: VerbEntry[]): QuizQuestion {
  const verb = randomItem(verbs);
  const pronoun = randomItem(pronounOrder);
  const answer = buildConjugation(verb, pronoun);
  const clue = `${pronounHints[pronoun]} · ${verb.english}`;

  // Generate all conjugations of this verb
  const verbConjugations = pronounOrder.map((p) => buildConjugation(verb, p));

  // Pick 3 other conjugations as distractors
  const DISTRACTOR_COUNT = 3;
  const distractors = verbConjugations.filter((form) => form !== answer);
  const selectedDistractors = shuffle(distractors).slice(0, DISTRACTOR_COUNT);

  const options = shuffle([answer, ...selectedDistractors]);
  return {verb, pronoun, answer, options, clue};
}
