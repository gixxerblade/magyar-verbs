import { pronounOrder } from '../contants';
import type { HarmonyChallenge, Pronoun, VerbEntry } from '../types';
import { buildConjugation, randomItem } from './utils';

export function createHarmonyChallenge(verbs: VerbEntry[]): HarmonyChallenge {
  const verb = randomItem(verbs);
  const pronounPool = pronounOrder.filter((item): item is Pronoun => item !== 'ő');
  const pronoun = randomItem(pronounPool);
  return {
    verb,
    pronoun,
    target: buildConjugation(verb, pronoun),
  };
}
