export type VowelHarmony = 'back' | 'front' | 'mixed'

export interface ConjugationPattern {
  pronoun: string
  english: string
  endings: Record<VowelHarmony, string>
  note?: string
}

export interface VerbEntry {
  infinitive: string
  stem: string
  english: string
  harmony: VowelHarmony
  sample?: string
}

export const vowelHarmonyLabels: Record<VowelHarmony, string> = {
  back: 'Back (a, á, o, ó, u, ú)',
  front: 'Front unrounded (e, é, i, í)',
  mixed: 'Front rounded (ö, ő, ü, ű)'
}

export const indefinitePatterns: ConjugationPattern[] = [
  {
    pronoun: 'én',
    english: 'I',
    endings: {
      back: '-ok',
      front: '-ek',
      mixed: '-ök'
    },
    note: "The stem remains unchanged; choose the ending that matches the verb's vowel harmony."
  },
  {
    pronoun: 'te',
    english: 'you (singular)',
    endings: {
      back: '-sz',
      front: '-sz',
      mixed: '-sz'
    },
    note: 'Some stems ending in s, sz, z, dz assimilate (e.g. `olvas` → `olvasol`), but our focus verbs do not require a connecting vowel.'
  },
  {
    pronoun: 'ő',
    english: 'he / she / it',
    endings: {
      back: '—',
      front: '—',
      mixed: '—'
    },
    note: 'No ending is added in the indefinite present tense. The bare stem is the full form.'
  },
  {
    pronoun: 'mi',
    english: 'we',
    endings: {
      back: '-unk',
      front: '-ünk',
      mixed: '-ünk'
    }
  },
  {
    pronoun: 'ti',
    english: 'you (plural)',
    endings: {
      back: '-tok',
      front: '-tek',
      mixed: '-tök'
    }
  },
  {
    pronoun: 'ők',
    english: 'they',
    endings: {
      back: '-nak',
      front: '-nek',
      mixed: '-nek'
    }
  }
]

export const sampleVerbs: VerbEntry[] = [
  {
    infinitive: 'tanulni',
    stem: 'tanul',
    english: 'to learn',
    harmony: 'back',
    sample: 'Minden nap tanulok magyarul. (I study Hungarian every day.)'
  },
  {
    infinitive: 'olvasni',
    stem: 'olvas',
    english: 'to read',
    harmony: 'back',
    sample: 'Te sok könyvet olvasol. (You read many books.)'
  },
  {
    infinitive: 'írni',
    stem: 'ír',
    english: 'to write',
    harmony: 'front',
    sample: 'Ő levelet ír. (He/She writes a letter.)'
  },
  {
    infinitive: 'fizetni',
    stem: 'fizet',
    english: 'to pay',
    harmony: 'front',
    sample: 'Mi ritkán fizetünk készpénzben. (We rarely pay in cash.)'
  },
  {
    infinitive: 'fürödni',
    stem: 'füröd',
    english: 'to bathe',
    harmony: 'mixed',
    sample: 'Ti este fürödtök. (You bathe in the evening.)'
  },
  {
    infinitive: 'törni',
    stem: 'tör',
    english: 'to break',
    harmony: 'mixed',
    sample: 'Ők néha szabályt törnek. (They sometimes break a rule.)'
  }
]

export const pronounOrder = ['én', 'te', 'ő', 'mi', 'ti', 'ők'] as const

export type Pronoun = (typeof pronounOrder)[number]

export function buildConjugation(verb: VerbEntry, pronoun: Pronoun): string {
  const pattern = indefinitePatterns.find((item) => item.pronoun === pronoun)
  if (!pattern) return verb.stem
  const ending = pattern.endings[verb.harmony]
  if (ending === '—') {
    return verb.stem
  }
  return `${verb.stem}${ending.replace('-', '')}`
}

export function getEndingDescription(pronoun: Pronoun, harmony: VowelHarmony): string {
  const pattern = indefinitePatterns.find((item) => item.pronoun === pronoun)
  if (!pattern) return ''
  return pattern.endings[harmony]
}

