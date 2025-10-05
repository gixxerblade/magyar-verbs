import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage } from '../pages/reference';

export const Route = createFileRoute('/reference')({
  component: ReferencePage,
});
