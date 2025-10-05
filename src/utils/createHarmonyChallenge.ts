import { pronounOrder } from '../contants';
import { sampleVerbs } from '../data/conjugation';
import { HarmonyChallenge, Pronoun } from '../types';
import { randomItem, buildConjugation } from './utils';

export function createHarmonyChallenge(): HarmonyChallenge {
  const verb = randomItem(sampleVerbs);
  const pronounPool = pronounOrder.filter((item): item is Pronoun => item !== 'ő');
  const pronoun = randomItem(pronounPool);
  return {
    verb,
    pronoun,
    target: buildConjugation(verb, pronoun),
  };
}
