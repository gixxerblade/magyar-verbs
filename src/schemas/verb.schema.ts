import {z} from 'zod';
import type {VerbEntry} from '../types';

// Verb form validation schema matching VerbEntry interface
export const verbFormSchema = z.object({
  infinitive: z
    .string()
    .min(1, 'Infinitive form is required')
    .trim()
    .refine((val) => val.endsWith('ni'), {
      message: 'Hungarian infinitives typically end with "ni"',
    }),
  stem: z
    .string()
    .min(1, 'Verb stem is required')
    .trim()
    .refine((val) => val.length >= 2, {
      message: 'Verb stem should be at least 2 characters',
    }),
  english: z
    .string()
    .min(1, 'English translation is required')
    .trim()
    .refine((val) => val.startsWith('to '), {
      message: 'English translation should start with "to" (e.g., "to learn")',
    }),
  harmony: z.enum(['back', 'front', 'mixed']),
  sample: z.string().trim().optional(),
});

// Factory function to create schema with duplicate validation
export function createVerbFormSchema(existingVerbs?: VerbEntry[]) {
  if (!existingVerbs || existingVerbs.length === 0) {
    return verbFormSchema;
  }

  return verbFormSchema.refine(
    (data) => {
      const normalizedInput = data.infinitive.toLowerCase().trim();
      const duplicate = existingVerbs.find(
        (entry) => entry.infinitive.toLowerCase().trim() === normalizedInput
      );
      return !duplicate;
    },
    {
      message: 'This verb already exists in your collection',
      path: ['infinitive'],
    }
  );
}

// Infer TypeScript type from schema
export type VerbFormData = z.infer<typeof verbFormSchema>;
