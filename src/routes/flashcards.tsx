import {createFileRoute} from '@tanstack/react-router';
import {z} from 'zod';
import {customVerbsQueryOptions} from '../hooks/useCustomVerbs';
import {vocabularyOptions} from '../hooks/useVocabulary';
import {FlashcardsPage} from '../pages/flashcards';

const flashcardSearchSchema = z.object({
  type: z.enum(['all', 'verbs', 'vocabulary']).catch('all'),
  category: z
    .enum([
      'all',
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
    ])
    .catch('all'),
  difficulty: z.enum(['all', 'beginner', 'intermediate', 'advanced']).catch('all'),
  partOfSpeech: z
    .enum(['all', 'noun', 'verb', 'adjective', 'adverb', 'phrase', 'other'])
    .catch('all'),
});

export const Route = createFileRoute('/flashcards')({
  validateSearch: flashcardSearchSchema,
  loaderDeps: ({search: {type, category, difficulty, partOfSpeech}}) => ({
    type,
    category,
    difficulty,
    partOfSpeech,
  }),
  loader: async ({context: {queryClient}}) => {
    const verbs = await queryClient.ensureQueryData(customVerbsQueryOptions);
    const vocabulary = await queryClient.ensureQueryData(vocabularyOptions);
    return {verbs, vocabulary};
  },
  component: FlashcardsPage,
});
