import { createFileRoute } from '@tanstack/react-router';
import { FlashcardsPage } from '../pages/flashcards';

export const Route = createFileRoute('/flashcards')({
  component: FlashcardsPage,
});
