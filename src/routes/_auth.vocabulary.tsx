import {createFileRoute} from '@tanstack/react-router';
import {VocabularyPage} from '../pages/vocabulary';

export const Route = createFileRoute('/_auth/vocabulary')({
  component: VocabularyPage,
});
