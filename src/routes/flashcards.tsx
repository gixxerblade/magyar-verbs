import { createFileRoute } from '@tanstack/react-router';
import { customVerbsQueryOptions } from '../hooks/useCustomVerbs';
import { FlashcardsPage } from '../pages/flashcards';

export const Route = createFileRoute('/flashcards')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(customVerbsQueryOptions),
  component: FlashcardsPage,
});
