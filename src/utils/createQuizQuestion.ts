import { pronounOrder, pronounHints } from '../contants';
import { sampleVerbs } from '../data/conjugation';
import { QuizQuestion } from '../types';
import { buildConjugation, allForms, shuffle, randomItem } from './utils';

export function createQuizQuestion(): QuizQuestion {
  const verb = randomItem(sampleVerbs);
  const pronoun = randomItem(pronounOrder);
  const answer = buildConjugation(verb, pronoun);
  const clue = `${pronounHints[pronoun]} · ${verb.english}`;

  const distractors = new Set<string>();
  while (distractors.size < 3) {
    const candidate = randomItem(allForms);
    if (candidate !== answer) {
      distractors.add(candidate);
    }
    if (distractors.size + 1 >= allForms.length) {
      break;
    }
  }

  const options = shuffle([answer, ...Array.from(distractors).slice(0, 3)]);
  return { verb, pronoun, answer, options, clue };
}
