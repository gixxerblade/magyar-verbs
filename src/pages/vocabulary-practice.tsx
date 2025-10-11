import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { type JSX, useEffect, useMemo, useState } from 'react';
import { useVocabulary } from '../hooks/useVocabulary';
import type { VocabularyEntry } from '../types';
import { classNames } from '../utils/utils';

interface VocabularyFlashcard {
  front: string;
  back: string;
  category?: string;
  difficulty?: string;
}

const SHOW_HUNGARIAN_FIRST = 'hungarian-first';
const SHOW_ENGLISH_FIRST = 'english-first';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createVocabularyFlashcards(
  entries: VocabularyEntry[],
  mode: string
): VocabularyFlashcard[] {
  const shuffled = shuffleArray(entries);

  return shuffled.map((entry) => {
    if (mode === SHOW_ENGLISH_FIRST) {
      return {
        front: entry.english,
        back: entry.hungarian,
        category: entry.category,
        difficulty: entry.difficulty,
      };
    }
    return {
      front: entry.hungarian,
      back: entry.english,
      category: entry.category,
      difficulty: entry.difficulty,
    };
  });
}

export function VocabularyPracticePage(): JSX.Element {
  const { data: vocabulary, isLoading, isError, error } = useVocabulary();
  const [mode, setMode] = useState<string>(SHOW_HUNGARIAN_FIRST);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flashcards = useMemo(() => {
    if (!vocabulary || vocabulary.length === 0) return [];
    return createVocabularyFlashcards(vocabulary, mode);
  }, [vocabulary, mode]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  if (isLoading) {
    return (
      <div className='panel'>
        <section className='panel__section'>
          <h2>
            <SparklesIcon aria-hidden='true' /> Vocabulary Practice
          </h2>
          <p>Loading vocabulary...</p>
        </section>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='panel'>
        <section className='panel__section'>
          <h2>
            <SparklesIcon aria-hidden='true' /> Vocabulary Practice
          </h2>
          <p className='vocabulary-form__error'>Error loading vocabulary: {error?.message}</p>
        </section>
      </div>
    );
  }

  if (!vocabulary || vocabulary.length === 0) {
    return (
      <div className='panel'>
        <section className='panel__section'>
          <h2>
            <SparklesIcon aria-hidden='true' /> Vocabulary Practice
          </h2>
          <p className='section-intro'>
            No vocabulary entries found. Add some words in the Vocabulary Manager first!
          </p>
        </section>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = `${currentIndex + 1} / ${flashcards.length}`;

  const handleFlip = (): void => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = (): void => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = (): void => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMode((prevMode) =>
      prevMode === SHOW_HUNGARIAN_FIRST ? SHOW_ENGLISH_FIRST : SHOW_HUNGARIAN_FIRST
    );
  };

  const toggleMode = (): void => {
    setMode((prevMode) =>
      prevMode === SHOW_HUNGARIAN_FIRST ? SHOW_ENGLISH_FIRST : SHOW_HUNGARIAN_FIRST
    );
  };

  return (
    <div className='panel'>
      <section className='panel__section'>
        <h2>
          <SparklesIcon aria-hidden='true' /> Vocabulary Practice
        </h2>
        <p className='section-intro'>
          Practice your Hungarian vocabulary. Click the card to reveal the translation.
        </p>

        <div className='vocabulary-practice__mode-toggle'>
          <button type='button' onClick={toggleMode} className='vocabulary-practice__mode-button'>
            Current mode:{' '}
            {mode === SHOW_HUNGARIAN_FIRST ? 'Hungarian → English' : 'English → Hungarian'}
          </button>
        </div>

        <div className='flashcard-wrapper'>
          <div className='flashcard-progress'>{progress}</div>
          <div className='flashcard-container' onClick={handleFlip}>
            <div className={classNames('flashcard-inner', isFlipped && 'flashcard-inner--flipped')}>
              <div className='flashcard-face'>
                <div className='flashcard-text'>{currentCard.front}</div>
                {currentCard.category && (
                  <div className='flashcard-category'>{currentCard.category}</div>
                )}
                <div className='flashcard-hint'>Click to reveal</div>
              </div>
              <div className='flashcard-face flashcard-face--back'>
                <div className='flashcard-text flashcard-text--back'>{currentCard.back}</div>
                {currentCard.difficulty && (
                  <div className='flashcard-difficulty'>{currentCard.difficulty}</div>
                )}
              </div>
            </div>
          </div>
          <div className='flashcard-controls'>
            <button
              type='button'
              className='flashcard-button'
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ArrowLeftIcon aria-hidden='true' /> Previous
            </button>
            <button type='button' className='flashcard-button' onClick={handleShuffle}>
              <ArrowPathIcon aria-hidden='true' /> Shuffle
            </button>
            <button
              type='button'
              className='flashcard-button'
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
            >
              Next <ArrowRightIcon aria-hidden='true' />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
