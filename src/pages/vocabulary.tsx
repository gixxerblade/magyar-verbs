import { BookOpenIcon } from '@heroicons/react/24/outline';
import type { JSX } from 'react';
import { VocabularyForm } from '../components/VocabularyForm';
import { VocabularyList } from '../components/VocabularyList';

export function VocabularyPage(): JSX.Element {
  return (
    <div className='panel'>
      <section className='panel__section'>
        <h2>
          <BookOpenIcon aria-hidden='true' /> Vocabulary Manager
        </h2>
        <p className='section-intro'>
          Add and manage your Hungarian vocabulary. These words will be available for practice in
          flashcards and quizzes.
        </p>

        <VocabularyForm />
        <VocabularyList />
      </section>
    </div>
  );
}
