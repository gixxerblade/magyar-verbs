import { describe, expect, it } from 'vitest';
import type { VerbEntry } from '../../types';
import {
  buildConjugation,
  classNames,
  getEndingDescription,
  randomItem,
  shuffle,
} from '../../utils/utils';

describe('utils', () => {
  describe('buildConjugation', () => {
    const backVerbEntry: VerbEntry = {
      infinitive: 'tanulni',
      stem: 'tanul',
      english: 'to learn',
      harmony: 'back',
    };

    const frontVerbEntry: VerbEntry = {
      infinitive: 'írni',
      stem: 'ír',
      english: 'to write',
      harmony: 'front',
    };

    const mixedVerbEntry: VerbEntry = {
      infinitive: 'fürödni',
      stem: 'füröd',
      english: 'to bathe',
      harmony: 'mixed',
    };

    it('should conjugate back harmony verb for én', () => {
      const result = buildConjugation(backVerbEntry, 'én');
      expect(result).toBe('tanulok');
    });

    it('should conjugate back harmony verb for te', () => {
      const result = buildConjugation(backVerbEntry, 'te');
      expect(result).toBe('tanulsz');
    });

    it('should return stem for ő (no ending)', () => {
      const result = buildConjugation(backVerbEntry, 'ő');
      expect(result).toBe('tanul');
    });

    it('should conjugate back harmony verb for mi', () => {
      const result = buildConjugation(backVerbEntry, 'mi');
      expect(result).toBe('tanulunk');
    });

    it('should conjugate back harmony verb for ti', () => {
      const result = buildConjugation(backVerbEntry, 'ti');
      expect(result).toBe('tanultok');
    });

    it('should conjugate back harmony verb for ők', () => {
      const result = buildConjugation(backVerbEntry, 'ők');
      expect(result).toBe('tanulnak');
    });

    it('should conjugate front harmony verb for én', () => {
      const result = buildConjugation(frontVerbEntry, 'én');
      expect(result).toBe('írek');
    });

    it('should conjugate front harmony verb for mi', () => {
      const result = buildConjugation(frontVerbEntry, 'mi');
      expect(result).toBe('írünk');
    });

    it('should conjugate front harmony verb for ti', () => {
      const result = buildConjugation(frontVerbEntry, 'ti');
      expect(result).toBe('írtek');
    });

    it('should conjugate front harmony verb for ők', () => {
      const result = buildConjugation(frontVerbEntry, 'ők');
      expect(result).toBe('írnek');
    });

    it('should conjugate mixed harmony verb for én', () => {
      const result = buildConjugation(mixedVerbEntry, 'én');
      expect(result).toBe('fürödök');
    });

    it('should conjugate mixed harmony verb for mi', () => {
      const result = buildConjugation(mixedVerbEntry, 'mi');
      expect(result).toBe('fürödünk');
    });

    it('should conjugate mixed harmony verb for ti', () => {
      const result = buildConjugation(mixedVerbEntry, 'ti');
      expect(result).toBe('fürödtök');
    });

    it('should conjugate mixed harmony verb for ők', () => {
      const result = buildConjugation(mixedVerbEntry, 'ők');
      expect(result).toBe('fürödnek');
    });

    it('should remove hyphen from ending when applying it', () => {
      const result = buildConjugation(backVerbEntry, 'én');
      expect(result).not.toContain('-');
    });

    it('should handle verb with short stem', () => {
      const shortStemVerb: VerbEntry = {
        infinitive: 'írni',
        stem: 'ír',
        english: 'to write',
        harmony: 'front',
      };
      const result = buildConjugation(shortStemVerb, 'én');
      expect(result).toBe('írek');
    });
  });

  describe('getEndingDescription', () => {
    it('should return correct ending for back harmony én', () => {
      const result = getEndingDescription('én', 'back');
      expect(result).toBe('-ok');
    });

    it('should return correct ending for front harmony én', () => {
      const result = getEndingDescription('én', 'front');
      expect(result).toBe('-ek');
    });

    it('should return correct ending for mixed harmony én', () => {
      const result = getEndingDescription('én', 'mixed');
      expect(result).toBe('-ök');
    });

    it('should return correct ending for back harmony ti', () => {
      const result = getEndingDescription('ti', 'back');
      expect(result).toBe('-tok');
    });

    it('should return correct ending for front harmony ti', () => {
      const result = getEndingDescription('ti', 'front');
      expect(result).toBe('-tek');
    });

    it('should return correct ending for mixed harmony ti', () => {
      const result = getEndingDescription('ti', 'mixed');
      expect(result).toBe('-tök');
    });

    it('should return dash for ő (no ending)', () => {
      const result = getEndingDescription('ő', 'back');
      expect(result).toBe('—');
    });

    it('should return same ending for all harmonies for te', () => {
      const backResult = getEndingDescription('te', 'back');
      const frontResult = getEndingDescription('te', 'front');
      const mixedResult = getEndingDescription('te', 'mixed');
      expect(backResult).toBe('-sz');
      expect(frontResult).toBe('-sz');
      expect(mixedResult).toBe('-sz');
    });
  });

  describe('randomItem', () => {
    it('should return an item from the array', () => {
      const items = ['a', 'b', 'c', 'd', 'e'] as const;
      const result = randomItem(items);
      expect(items).toContain(result);
    });

    it('should return the only item from single-item array', () => {
      const items = ['single'] as const;
      const result = randomItem(items);
      expect(result).toBe('single');
    });

    it('should return items with roughly equal distribution', () => {
      const items = ['a', 'b', 'c'] as const;
      const counts = { a: 0, b: 0, c: 0 };
      const iterations = 300;

      for (let i = 0; i < iterations; i += 1) {
        const result = randomItem(items);
        counts[result] += 1;
      }

      // Each item should appear at least 20% of the time (allowing for randomness)
      const minExpected = iterations * 0.2;
      expect(counts.a).toBeGreaterThan(minExpected);
      expect(counts.b).toBeGreaterThan(minExpected);
      expect(counts.c).toBeGreaterThan(minExpected);
    });
  });

  describe('shuffle', () => {
    it('should return array with same length', () => {
      const items = [1, 2, 3, 4, 5];
      const result = shuffle(items);
      expect(result).toHaveLength(items.length);
    });

    it('should return array with same elements', () => {
      const items = [1, 2, 3, 4, 5];
      const result = shuffle(items);
      expect(result).toEqual(expect.arrayContaining(items));
    });

    it('should not modify original array', () => {
      const items = [1, 2, 3, 4, 5];
      const original = [...items];
      shuffle(items);
      expect(items).toEqual(original);
    });

    it('should handle empty array', () => {
      const items: number[] = [];
      const result = shuffle(items);
      expect(result).toHaveLength(0);
    });

    it('should handle single-item array', () => {
      const items = [1];
      const result = shuffle(items);
      expect(result).toEqual([1]);
    });

    it('should actually shuffle the array (probabilistic test)', () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = shuffle(items);

      // Very unlikely to be in exact same order after shuffle
      // This test could theoretically fail due to randomness, but probability is ~1 in 3,628,800
      const isSameOrder = result.every((val, idx) => val === items[idx]);
      expect(isSameOrder).toBe(false);
    });

    it('should handle array with duplicate values', () => {
      const items = [1, 1, 2, 2, 3, 3];
      const result = shuffle(items);
      expect(result).toHaveLength(6);
      expect(result.filter((x) => x === 1)).toHaveLength(2);
      expect(result.filter((x) => x === 2)).toHaveLength(2);
      expect(result.filter((x) => x === 3)).toHaveLength(2);
    });
  });

  describe('classNames', () => {
    it('should join multiple class names with space', () => {
      const result = classNames('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should filter out false values', () => {
      const result = classNames('class1', false, 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should filter out null values', () => {
      const result = classNames('class1', null, 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should filter out undefined values', () => {
      const result = classNames('class1', undefined, 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should handle conditional class names', () => {
      const isActive = true;
      const isDisabled = false;
      const result = classNames('base', isActive && 'active', isDisabled && 'disabled');
      expect(result).toBe('base active');
    });

    it('should handle empty input', () => {
      const result = classNames();
      expect(result).toBe('');
    });

    it('should handle all falsy values', () => {
      const result = classNames(false, null, undefined);
      expect(result).toBe('');
    });

    it('should handle single class name', () => {
      const result = classNames('single');
      expect(result).toBe('single');
    });

    it('should handle complex conditional logic', () => {
      const state: string = 'active';
      const hasError = false;
      const isLarge = true;

      const result = classNames(
        'base-class',
        state === 'active' && 'is-active',
        state === 'disabled' && 'is-disabled',
        hasError && 'has-error',
        isLarge && 'size-large'
      );

      expect(result).toBe('base-class is-active size-large');
    });
  });
});
