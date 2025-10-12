import {indefinitePatterns} from '../data/conjugation';
import type {Pronoun, VerbEntry, VowelHarmony} from '../types';

export function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function buildConjugation(verb: VerbEntry, pronoun: Pronoun): string {
  const pattern = indefinitePatterns.find((item) => item.pronoun === pronoun);
  if (!pattern) return verb.stem;
  const ending = pattern.endings[verb.harmony];
  if (ending === '—') {
    return verb.stem;
  }
  return `${verb.stem}${ending.replace('-', '')}`;
}

export function getEndingDescription(pronoun: Pronoun, harmony: VowelHarmony): string {
  const pattern = indefinitePatterns.find((item) => item.pronoun === pronoun);
  if (!pattern) return '';
  return pattern.endings[harmony];
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function isAuthorizedEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  const authorizedEmailsStr = import.meta.env.VITE_AUTHORIZED_EMAILS;
  if (!authorizedEmailsStr) {
    console.error('VITE_AUTHORIZED_EMAILS environment variable is not set');
    return false;
  }

  const authorizedEmails = authorizedEmailsStr
    .split(',')
    .map((e: string) => e.trim().toLowerCase());
  return authorizedEmails.includes(email.toLowerCase());
}
