import { Pronoun, VowelHarmony } from './types';

export const pronounOrder = ['én', 'te', 'ő', 'mi', 'ti', 'ők'] as const;

export const vowelHarmonyLabels: Record<VowelHarmony, string> = {
  back: 'Back (a, á, o, ó, u, ú)',
  front: 'Front unrounded (e, é, i, í)',
  mixed: 'Front rounded (ö, ő, ü, ű)',
};

export const pronounHints: Record<Pronoun, string> = {
  én: 'First person singular',
  te: 'Second person singular',
  ő: 'Third person singular',
  mi: 'First person plural',
  ti: 'Second person plural',
  ők: 'Third person plural'
}
