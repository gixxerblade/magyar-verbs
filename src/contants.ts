import { Pronoun, VowelHarmony } from './types';

export const pronounOrder = ['én', 'te', 'ő', 'mi', 'ti', 'ők'] as const;

export const vowelHarmonyLabels: Record<VowelHarmony, string> = {
  back: 'Back (a, á, o, ó, u, ú)',
  front: 'Front unrounded (e, é, i, í)',
  mixed: 'Front rounded (ö, ő, ü, ű)',
};

export const pronounHints: Record<Pronoun, string> = {
  én: '1st person singular',
  te: '2nd person singular',
  ő: '3rd person singular',
  mi: '1st person plural',
  ti: '2nd person plural',
  ők: '3rd person plural'
}

export const pronounExplanations: Record<Pronoun, string> = {
  én: 'I (the speaker)',
  te: 'you (one person you\'re talking to)',
  ő: 'he/she/it (one person or thing being talked about)',
  mi: 'we (the speaker + others)',
  ti: 'you all (multiple people you\'re talking to)',
  ők: 'they (multiple people or things being talked about)'
}
