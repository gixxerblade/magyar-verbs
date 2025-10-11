import { describe, expect, it } from 'vitest';
import type { VerbEntry } from '../../types';
import { createHarmonyChallenge } from '../../utils/createHarmonyChallenge';

describe('createHarmonyChallenge', () => {
  const testVerbs: VerbEntry[] = [
    {
      infinitive: 'tanulni',
      stem: 'tanul',
      english: 'to learn',
      harmony: 'back',
    },
    {
      infinitive: 'írni',
      stem: 'ír',
      english: 'to write',
      harmony: 'front',
    },
    {
      infinitive: 'fürödni',
      stem: 'füröd',
      english: 'to bathe',
      harmony: 'mixed',
    },
  ];

  it('should return a HarmonyChallenge object', () => {
    const result = createHarmonyChallenge(testVerbs);
    expect(result).toHaveProperty('verb');
    expect(result).toHaveProperty('pronoun');
    expect(result).toHaveProperty('target');
  });

  it('should select a verb from the provided list', () => {
    const result = createHarmonyChallenge(testVerbs);
    expect(testVerbs).toContainEqual(result.verb);
  });

  it('should not select "ő" as pronoun', () => {
    // Run multiple times to ensure ő is consistently excluded
    for (let i = 0; i < 20; i += 1) {
      const result = createHarmonyChallenge(testVerbs);
      expect(result.pronoun).not.toBe('ő');
    }
  });

  it('should only select valid pronouns (excluding ő)', () => {
    const validPronouns = ['én', 'te', 'mi', 'ti', 'ők'];

    for (let i = 0; i < 20; i += 1) {
      const result = createHarmonyChallenge(testVerbs);
      expect(validPronouns).toContain(result.pronoun);
    }
  });

  it('should generate correct conjugation as target', () => {
    const singleVerb: VerbEntry[] = [
      {
        infinitive: 'tanulni',
        stem: 'tanul',
        english: 'to learn',
        harmony: 'back',
      },
    ];

    const expectedConjugations: Record<string, string> = {
      én: 'tanulok',
      te: 'tanulsz',
      mi: 'tanulunk',
      ti: 'tanultok',
      ők: 'tanulnak',
    };

    // Run multiple times to test different pronouns
    for (let i = 0; i < 20; i += 1) {
      const result = createHarmonyChallenge(singleVerb);
      const expectedTarget = expectedConjugations[result.pronoun];
      expect(result.target).toBe(expectedTarget);
    }
  });

  it('should handle back harmony verbs correctly', () => {
    const backVerbs: VerbEntry[] = [
      {
        infinitive: 'tanulni',
        stem: 'tanul',
        english: 'to learn',
        harmony: 'back',
      },
    ];

    const result = createHarmonyChallenge(backVerbs);
    expect(result.verb.harmony).toBe('back');

    // Verify the conjugation contains back harmony endings
    const backEndings = ['ok', 'sz', 'unk', 'tok', 'nak'];
    const hasBackEnding = backEndings.some((ending) => result.target.endsWith(ending));
    expect(hasBackEnding).toBe(true);
  });

  it('should handle front harmony verbs correctly', () => {
    const frontVerbs: VerbEntry[] = [
      {
        infinitive: 'írni',
        stem: 'ír',
        english: 'to write',
        harmony: 'front',
      },
    ];

    const result = createHarmonyChallenge(frontVerbs);
    expect(result.verb.harmony).toBe('front');

    // Verify the conjugation contains front harmony endings
    const frontEndings = ['ek', 'sz', 'ünk', 'tek', 'nek'];
    const hasFrontEnding = frontEndings.some((ending) => result.target.endsWith(ending));
    expect(hasFrontEnding).toBe(true);
  });

  it('should handle mixed harmony verbs correctly', () => {
    const mixedVerbs: VerbEntry[] = [
      {
        infinitive: 'fürödni',
        stem: 'füröd',
        english: 'to bathe',
        harmony: 'mixed',
      },
    ];

    const result = createHarmonyChallenge(mixedVerbs);
    expect(result.verb.harmony).toBe('mixed');

    // Verify the conjugation contains mixed harmony endings
    const mixedEndings = ['ök', 'sz', 'ünk', 'tök', 'nek'];
    const hasMixedEnding = mixedEndings.some((ending) => result.target.endsWith(ending));
    expect(hasMixedEnding).toBe(true);
  });

  it('should work with single verb', () => {
    const singleVerb: VerbEntry[] = [
      {
        infinitive: 'tanulni',
        stem: 'tanul',
        english: 'to learn',
        harmony: 'back',
      },
    ];

    const result = createHarmonyChallenge(singleVerb);
    expect(result.verb).toEqual(singleVerb[0]);
  });

  it('should consistently generate valid challenges', () => {
    for (let i = 0; i < 30; i += 1) {
      const result = createHarmonyChallenge(testVerbs);

      expect(result.verb).toBeDefined();
      expect(result.pronoun).toBeDefined();
      expect(result.target).toBeDefined();
      expect(result.pronoun).not.toBe('ő');
      expect(testVerbs).toContainEqual(result.verb);
    }
  });

  it('should generate different pronouns over multiple calls', () => {
    const pronounCounts: Record<string, number> = {
      én: 0,
      te: 0,
      mi: 0,
      ti: 0,
      ők: 0,
    };

    const iterations = 100;
    for (let i = 0; i < iterations; i += 1) {
      const result = createHarmonyChallenge(testVerbs);
      pronounCounts[result.pronoun] += 1;
    }

    // Verify ő is never selected
    expect(pronounCounts).not.toHaveProperty('ő');

    // Each pronoun should be selected at least once in 100 iterations
    expect(pronounCounts.én).toBeGreaterThan(0);
    expect(pronounCounts.te).toBeGreaterThan(0);
    expect(pronounCounts.mi).toBeGreaterThan(0);
    expect(pronounCounts.ti).toBeGreaterThan(0);
    expect(pronounCounts.ők).toBeGreaterThan(0);
  });

  it('should generate different verbs over multiple calls', () => {
    const verbCounts: Record<string, number> = {
      tanulni: 0,
      írni: 0,
      fürödni: 0,
    };

    const iterations = 90;
    for (let i = 0; i < iterations; i += 1) {
      const result = createHarmonyChallenge(testVerbs);
      verbCounts[result.verb.infinitive] += 1;
    }

    // Each verb should be selected at least once in 90 iterations
    expect(verbCounts.tanulni).toBeGreaterThan(0);
    expect(verbCounts.írni).toBeGreaterThan(0);
    expect(verbCounts.fürödni).toBeGreaterThan(0);
  });

  it('should create target that matches verb stem', () => {
    const result = createHarmonyChallenge(testVerbs);
    expect(result.target).toContain(result.verb.stem);
  });

  it('should handle verbs with different stem lengths', () => {
    const variedVerbs: VerbEntry[] = [
      {
        infinitive: 'írni',
        stem: 'ír',
        english: 'to write',
        harmony: 'front',
      },
      {
        infinitive: 'programozni',
        stem: 'programoz',
        english: 'to program',
        harmony: 'back',
      },
    ];

    for (let i = 0; i < 20; i += 1) {
      const result = createHarmonyChallenge(variedVerbs);
      expect(result.target).toContain(result.verb.stem);
      expect(result.target.length).toBeGreaterThan(result.verb.stem.length);
    }
  });
});
