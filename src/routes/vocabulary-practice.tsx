import {createFileRoute} from '@tanstack/react-router';
import {VocabularyPracticePage} from '../pages/vocabulary-practice';

export const Route = createFileRoute('/vocabulary-practice')({
  component: VocabularyPracticePage,
});
