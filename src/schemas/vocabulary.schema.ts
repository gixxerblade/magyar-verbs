import { z } from 'zod';
import type { VocabularyEntry } from '../types';

// Base vocabulary form validation schema
const baseVocabularyFormSchema = z.object({
  hungarian: z.string().min(1, 'Hungarian word is required').trim(),
  english: z.string().min(1, 'English translation is required').trim(),
  category: z.enum([
    'essentials',
    'food-dining',
    'travel-transportation',
    'home-family',
    'work-education',
    'health-body',
    'shopping-money',
    'time-weather',
    'hobbies-leisure',
    'nature-animals',
  ]),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  partOfSpeech: z.enum(['noun', 'adjective', 'adverb', 'verb', 'other']),
  notes: z.string().optional(),
  exampleSentence: z.string().optional(),
});

// Factory function to create schema with duplicate validation
export function createVocabularyFormSchema(existingVocabulary?: VocabularyEntry[]) {
  if (!existingVocabulary || existingVocabulary.length === 0) {
    return baseVocabularyFormSchema;
  }

  return baseVocabularyFormSchema.refine(
    (data) => {
      const normalizedInput = data.hungarian.toLowerCase().trim();
      const duplicate = existingVocabulary.find(
        (entry) => entry.hungarian.toLowerCase().trim() === normalizedInput
      );
      return !duplicate;
    },
    {
      message: 'This word already exists in your vocabulary',
      path: ['hungarian'],
    }
  );
}

// Export base schema for contexts without duplicate checking
export const vocabularyFormSchema = baseVocabularyFormSchema;

// Infer TypeScript type from schema
export type VocabularyFormData = z.infer<typeof baseVocabularyFormSchema>;
