import { createFileRoute } from '@tanstack/react-router';
import { customVerbsQueryOptions } from '../hooks/useCustomVerbs';
import { QuizPage } from '../pages/quiz';

export const Route = createFileRoute('/quiz')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(customVerbsQueryOptions),
  component: QuizPage,
});
