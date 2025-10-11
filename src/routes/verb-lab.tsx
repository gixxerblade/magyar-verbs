import { createFileRoute } from '@tanstack/react-router';
import { customVerbsQueryOptions } from '../hooks/useCustomVerbs';
import { VerbLab } from '../pages/verb-lab';

export const Route = createFileRoute('/verb-lab')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(customVerbsQueryOptions),
  component: VerbLab,
});
