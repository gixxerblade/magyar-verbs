import {createFileRoute} from '@tanstack/react-router';
import CustomVerbs from '../pages/custom-verbs';

export const Route = createFileRoute('/custom-verbs')({
  component: CustomVerbs,
});
