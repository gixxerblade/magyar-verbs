import { pronounOrder } from '../contants';
import { indefinitePatterns, sampleVerbs } from '../data/conjugation';
import { Pronoun, VerbEntry, VowelHarmony } from '../types';

export function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function buildConjugation(verb: VerbEntry, pronoun: Pronoun): string {
  const pattern = indefinitePatterns.find(item => item.pronoun === pronoun);
  if (!pattern) return verb.stem;
  const ending = pattern.endings[verb.harmony];
  if (ending === '—') {
    return verb.stem;
  }
  return `${verb.stem}${ending.replace('-', '')}`;
}

export function getEndingDescription(pronoun: Pronoun, harmony: VowelHarmony): string {
  const pattern = indefinitePatterns.find(item => item.pronoun === pronoun);
  if (!pattern) return '';
  return pattern.endings[harmony];
}

function buildAllForms(): string[] {
  const combos = sampleVerbs.flatMap(verb =>
    pronounOrder.map(pronoun => buildConjugation(verb, pronoun))
  );
  return Array.from(new Set(combos));
}

export const allForms = buildAllForms();

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
