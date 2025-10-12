import {describe, expect, it} from 'vitest';
import type {VerbEntry, VocabularyEntry} from '../../types';
import {
  createAllFlashcards,
  createVerbFlashcards,
  createVocabularyFlashcards,
} from '../../utils/createFlashcards';

describe('createVerbFlashcards', () => {
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
  ];

  it('should create flashcards array', () => {
    const result = createVerbFlashcards(testVerbs);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should create 7 flashcards per verb (1 infinitive + 6 conjugations)', () => {
    const result = createVerbFlashcards(testVerbs);
    // 2 verbs * 7 flashcards each = 14 total
    expect(result).toHaveLength(14);
  });

  it('should create infinitive flashcard for each verb', () => {
    const result = createVerbFlashcards(testVerbs);
    const infinitiveCards = result.filter((card) => card.type === 'infinitive');

    expect(infinitiveCards).toHaveLength(2);
    expect(infinitiveCards[0].front).toBe('tanulni');
    expect(infinitiveCards[0].back).toBe('to learn');
    expect(infinitiveCards[1].front).toBe('írni');
    expect(infinitiveCards[1].back).toBe('to write');
  });

  it('should create conjugation flashcards for all 6 pronouns', () => {
    const result = createVerbFlashcards([testVerbs[0]]);
    const conjugationCards = result.filter((card) => card.type === 'conjugation');

    // 6 conjugations per verb
    expect(conjugationCards).toHaveLength(6);
  });

  it('should have correct conjugation on front of card', () => {
    const singleVerb: VerbEntry[] = [
      {
        infinitive: 'tanulni',
        stem: 'tanul',
        english: 'to learn',
        harmony: 'back',
      },
    ];

    const result = createVerbFlashcards(singleVerb);
    const conjugationCards = result.filter((card) => card.type === 'conjugation');

    const expectedConjugations = [
      'tanulok',
      'tanulsz',
      'tanul',
      'tanulunk',
      'tanultok',
      'tanulnak',
    ];

    conjugationCards.forEach((card) => {
      expect(expectedConjugations).toContain(card.front);
    });
  });

  it('should have correct back format for conjugation cards', () => {
    const result = createVerbFlashcards(testVerbs);
    const conjugationCards = result.filter((card) => card.type === 'conjugation');

    conjugationCards.forEach((card) => {
      expect(card.back).toContain('·');
      // Should not contain "to" prefix since it's removed
      expect(card.back).not.toMatch(/·\s+to\s+/);
    });
  });

  it('should remove "to" prefix from verb in conjugation back', () => {
    const result = createVerbFlashcards(testVerbs);
    const conjugationCards = result.filter((card) => card.type === 'conjugation');

    // Check one specific card
    const learnCard = conjugationCards.find((card) => card.back.includes('learn'));
    expect(learnCard?.back).not.toContain('to learn');
    expect(learnCard?.back).toContain('learn');
  });

  it('should handle empty verb array', () => {
    const result = createVerbFlashcards([]);
    expect(result).toHaveLength(0);
  });

  it('should create flashcards with all required properties', () => {
    const result = createVerbFlashcards(testVerbs);

    result.forEach((card) => {
      expect(card).toHaveProperty('front');
      expect(card).toHaveProperty('back');
      expect(card).toHaveProperty('type');
      expect(['infinitive', 'conjugation']).toContain(card.type);
    });
  });

  it('should handle verbs with different harmony types', () => {
    const mixedVerbs: VerbEntry[] = [
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

    const result = createVerbFlashcards(mixedVerbs);
    // 3 verbs * 7 flashcards = 21 total
    expect(result).toHaveLength(21);
  });
});

describe('createVocabularyFlashcards', () => {
  const testVocabulary: VocabularyEntry[] = [
    {
      hungarian: 'szia',
      english: 'hello',
      category: 'essentials',
      difficulty: 'beginner',
      partOfSpeech: 'phrase',
    },
    {
      hungarian: 'alma',
      english: 'apple',
      category: 'food-dining',
      difficulty: 'beginner',
      partOfSpeech: 'noun',
    },
    {
      hungarian: 'autó',
      english: 'car',
      category: 'travel-transportation',
      difficulty: 'intermediate',
      partOfSpeech: 'noun',
    },
  ];

  it('should create flashcards array', () => {
    const result = createVocabularyFlashcards(testVocabulary);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should create one flashcard per vocabulary entry', () => {
    const result = createVocabularyFlashcards(testVocabulary);
    expect(result).toHaveLength(3);
  });

  it('should have hungarian word on front', () => {
    const result = createVocabularyFlashcards(testVocabulary);

    expect(result[0].front).toBe('szia');
    expect(result[1].front).toBe('alma');
    expect(result[2].front).toBe('autó');
  });

  it('should have english translation on back', () => {
    const result = createVocabularyFlashcards(testVocabulary);

    expect(result[0].back).toBe('hello');
    expect(result[1].back).toBe('apple');
    expect(result[2].back).toBe('car');
  });

  it('should have type set to vocabulary', () => {
    const result = createVocabularyFlashcards(testVocabulary);

    result.forEach((card) => {
      expect(card.type).toBe('vocabulary');
    });
  });

  it('should include category in flashcard', () => {
    const result = createVocabularyFlashcards(testVocabulary);

    expect(result[0].category).toBe('essentials');
    expect(result[1].category).toBe('food-dining');
    expect(result[2].category).toBe('travel-transportation');
  });

  it('should include difficulty in flashcard', () => {
    const result = createVocabularyFlashcards(testVocabulary);

    expect(result[0].difficulty).toBe('beginner');
    expect(result[1].difficulty).toBe('beginner');
    expect(result[2].difficulty).toBe('intermediate');
  });

  it('should include partOfSpeech in flashcard', () => {
    const result = createVocabularyFlashcards(testVocabulary);

    expect(result[0].partOfSpeech).toBe('phrase');
    expect(result[1].partOfSpeech).toBe('noun');
    expect(result[2].partOfSpeech).toBe('noun');
  });

  it('should handle empty vocabulary array', () => {
    const result = createVocabularyFlashcards([]);
    expect(result).toHaveLength(0);
  });

  it('should create flashcards with all required properties', () => {
    const result = createVocabularyFlashcards(testVocabulary);

    result.forEach((card) => {
      expect(card).toHaveProperty('front');
      expect(card).toHaveProperty('back');
      expect(card).toHaveProperty('type');
      expect(card).toHaveProperty('category');
      expect(card).toHaveProperty('difficulty');
      expect(card).toHaveProperty('partOfSpeech');
    });
  });

  it('should handle vocabulary with optional fields', () => {
    const vocabWithOptionals: VocabularyEntry[] = [
      {
        hungarian: 'köszönöm',
        english: 'thank you',
        category: 'essentials',
        difficulty: 'beginner',
        partOfSpeech: 'phrase',
        notes: 'polite form',
        exampleSentence: 'Köszönöm szépen.',
      },
    ];

    const result = createVocabularyFlashcards(vocabWithOptionals);
    expect(result).toHaveLength(1);
    expect(result[0].front).toBe('köszönöm');
    expect(result[0].back).toBe('thank you');
  });
});

describe('createAllFlashcards', () => {
  const testVerbs: VerbEntry[] = [
    {
      infinitive: 'tanulni',
      stem: 'tanul',
      english: 'to learn',
      harmony: 'back',
    },
  ];

  const testVocabulary: VocabularyEntry[] = [
    {
      hungarian: 'szia',
      english: 'hello',
      category: 'essentials',
      difficulty: 'beginner',
      partOfSpeech: 'phrase',
    },
    {
      hungarian: 'alma',
      english: 'apple',
      category: 'food-dining',
      difficulty: 'beginner',
      partOfSpeech: 'noun',
    },
  ];

  it('should combine verb and vocabulary flashcards', () => {
    const result = createAllFlashcards(testVerbs, testVocabulary);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should include all verb flashcards (1 verb * 7 cards = 7)', () => {
    const result = createAllFlashcards(testVerbs, testVocabulary);
    const verbCards = result.filter(
      (card) => card.type === 'infinitive' || card.type === 'conjugation'
    );

    // 1 verb * 7 flashcards = 7
    expect(verbCards).toHaveLength(7);
  });

  it('should include all vocabulary flashcards', () => {
    const result = createAllFlashcards(testVerbs, testVocabulary);
    const vocabCards = result.filter((card) => card.type === 'vocabulary');

    expect(vocabCards).toHaveLength(2);
  });

  it('should shuffle the combined flashcards', () => {
    const manyVerbs: VerbEntry[] = [
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
    ];

    const manyVocab: VocabularyEntry[] = Array.from({length: 5}, (_, i) => ({
      hungarian: `word${i}`,
      english: `word${i}`,
      category: 'essentials' as const,
      difficulty: 'beginner' as const,
      partOfSpeech: 'noun' as const,
    }));

    const result1 = createAllFlashcards(manyVerbs, manyVocab);
    const result2 = createAllFlashcards(manyVerbs, manyVocab);

    // It's very unlikely the shuffled order is exactly the same twice
    const isSameOrder = result1.every((card, idx) => card.front === result2[idx].front);
    expect(isSameOrder).toBe(false);
  });

  it('should handle empty verb array', () => {
    const result = createAllFlashcards([], testVocabulary);
    const vocabCards = result.filter((card) => card.type === 'vocabulary');
    expect(vocabCards).toHaveLength(2);
  });

  it('should handle empty vocabulary array', () => {
    const result = createAllFlashcards(testVerbs, []);
    const verbCards = result.filter(
      (card) => card.type === 'infinitive' || card.type === 'conjugation'
    );
    expect(verbCards).toHaveLength(7);
  });

  it('should handle both empty arrays', () => {
    const result = createAllFlashcards([], []);
    expect(result).toHaveLength(0);
  });

  it('should contain mix of all card types', () => {
    const result = createAllFlashcards(testVerbs, testVocabulary);

    const hasInfinitive = result.some((card) => card.type === 'infinitive');
    const hasConjugation = result.some((card) => card.type === 'conjugation');
    const hasVocabulary = result.some((card) => card.type === 'vocabulary');

    expect(hasInfinitive).toBe(true);
    expect(hasConjugation).toBe(true);
    expect(hasVocabulary).toBe(true);
  });

  it('should maintain flashcard properties after combining', () => {
    const result = createAllFlashcards(testVerbs, testVocabulary);

    result.forEach((card) => {
      expect(card).toHaveProperty('front');
      expect(card).toHaveProperty('back');
      expect(card).toHaveProperty('type');

      if (card.type === 'vocabulary') {
        expect(card).toHaveProperty('category');
        expect(card).toHaveProperty('difficulty');
        expect(card).toHaveProperty('partOfSpeech');
      }
    });
  });

  it('should return correct total count', () => {
    const result = createAllFlashcards(testVerbs, testVocabulary);
    // 1 verb * 7 flashcards + 2 vocabulary = 9 total
    expect(result).toHaveLength(9);
  });
});
