import {describe, expect, it} from 'vitest';
import {pronounOrder} from '../../contants';
import type {VerbEntry} from '../../types';
import {createQuizQuestion} from '../../utils/createQuizQuestion';

describe('createQuizQuestion', () => {
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

  it('should return a QuizQuestion object', () => {
    const result = createQuizQuestion(testVerbs);
    expect(result).toHaveProperty('verb');
    expect(result).toHaveProperty('pronoun');
    expect(result).toHaveProperty('answer');
    expect(result).toHaveProperty('options');
    expect(result).toHaveProperty('clue');
  });

  it('should select a verb from the provided list', () => {
    const result = createQuizQuestion(testVerbs);
    expect(testVerbs).toContainEqual(result.verb);
  });

  it('should select a pronoun from pronounOrder', () => {
    const result = createQuizQuestion(testVerbs);
    expect(pronounOrder).toContain(result.pronoun);
  });

  it('should have exactly 4 options', () => {
    const result = createQuizQuestion(testVerbs);
    expect(result.options).toHaveLength(4);
  });

  it('should include the correct answer in options', () => {
    const result = createQuizQuestion(testVerbs);
    expect(result.options).toContain(result.answer);
  });

  it('should have all unique options', () => {
    const result = createQuizQuestion(testVerbs);
    const uniqueOptions = new Set(result.options);
    expect(uniqueOptions.size).toBe(4);
  });

  it('should create valid clue containing pronoun hint and verb english', () => {
    const result = createQuizQuestion(testVerbs);
    expect(result.clue).toContain(result.verb.english);
    expect(result.clue).toContain('·');
  });

  it('should generate correct answer based on verb harmony and pronoun', () => {
    const singleVerb: VerbEntry[] = [
      {
        infinitive: 'tanulni',
        stem: 'tanul',
        english: 'to learn',
        harmony: 'back',
      },
    ];

    // Run multiple times to test different pronouns
    for (let i = 0; i < 20; i += 1) {
      const result = createQuizQuestion(singleVerb);
      const expectedEndings: Record<string, string> = {
        én: 'tanulok',
        te: 'tanulsz',
        ő: 'tanul',
        mi: 'tanulunk',
        ti: 'tanultok',
        ők: 'tanulnak',
      };

      expect(result.answer).toBe(expectedEndings[result.pronoun]);
    }
  });

  it('should create different options for different conjugations', () => {
    const result = createQuizQuestion(testVerbs);

    // All options should be different conjugations
    const optionsSet = new Set(result.options);
    expect(optionsSet.size).toBe(4);
  });

  it('should only include conjugations from the same verb as distractors', () => {
    const singleVerb: VerbEntry[] = [
      {
        infinitive: 'tanulni',
        stem: 'tanul',
        english: 'to learn',
        harmony: 'back',
      },
    ];

    const result = createQuizQuestion(singleVerb);
    const validConjugations = ['tanulok', 'tanulsz', 'tanul', 'tanulunk', 'tanultok', 'tanulnak'];

    result.options.forEach((option) => {
      expect(validConjugations).toContain(option);
    });
  });

  it('should handle single verb correctly', () => {
    const singleVerb: VerbEntry[] = [
      {
        infinitive: 'tanulni',
        stem: 'tanul',
        english: 'to learn',
        harmony: 'back',
      },
    ];

    const result = createQuizQuestion(singleVerb);
    expect(result.verb).toEqual(singleVerb[0]);
  });

  it('should generate consistent results for same verb and pronoun', () => {
    const verb: VerbEntry = {
      infinitive: 'írni',
      stem: 'ír',
      english: 'to write',
      harmony: 'front',
    };

    const expectedAnswers: Record<string, string> = {
      én: 'írek',
      te: 'írsz',
      ő: 'ír',
      mi: 'írünk',
      ti: 'írtek',
      ők: 'írnek',
    };

    // Since randomness is involved, we can't directly control which pronoun is selected
    // But we can verify that if we see a particular pronoun, the answer is correct
    for (let i = 0; i < pronounOrder.length; i += 1) {
      const result = createQuizQuestion([verb]);
      const expectedAnswer = expectedAnswers[result.pronoun];

      expect(result.answer).toBe(expectedAnswer);
      expect(result.options).toContain(expectedAnswer);
    }
  });

  it('should include answer as one of the 4 shuffled options', () => {
    for (let i = 0; i < 10; i += 1) {
      const result = createQuizQuestion(testVerbs);
      expect(result.options).toContain(result.answer);
      expect(result.options.length).toBe(4);
    }
  });

  it('should create clue in format: pronoun hint · verb english', () => {
    const result = createQuizQuestion(testVerbs);
    const parts = result.clue.split(' · ');
    expect(parts).toHaveLength(2);
    expect(parts[1]).toBe(result.verb.english);
  });

  it('should work with verbs of different harmony types', () => {
    const mixedHarmonyVerbs: VerbEntry[] = [
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

    for (let i = 0; i < 15; i += 1) {
      const result = createQuizQuestion(mixedHarmonyVerbs);
      expect(result).toHaveProperty('verb');
      expect(result).toHaveProperty('answer');
      expect(result.options).toHaveLength(4);
      expect(result.options).toContain(result.answer);
    }
  });
});
