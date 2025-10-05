import {
  SparklesIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useState, useMemo } from 'react';
import { createFlashcards } from '../utils/createFlashcards';
import { classNames } from '../utils/utils';

export function FlashcardsPage() {
  const flashcards = useMemo(() => createFlashcards(), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcards[currentIndex];
  const progress = `${currentIndex + 1} / ${flashcards.length}`;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    window.location.reload();
  };

  return (
    <div className='panel'>
      <section className='panel__section'>
        <h2>
          <SparklesIcon aria-hidden='true' /> Flashcards
        </h2>
        <p className='section-intro'>
          Practice Hungarian verb conjugations and infinitives. Click the card to reveal the
          answer.
        </p>
        <div className='flashcard-wrapper'>
          <div className='flashcard-progress'>{progress}</div>
          <div className='flashcard-container' onClick={handleFlip}>
            <div className={classNames('flashcard-inner', isFlipped && 'flashcard-inner--flipped')}>
              <div className='flashcard-face'>
                <div className='flashcard-text'>{currentCard.front}</div>
                <div className='flashcard-hint'>Click to reveal</div>
              </div>
              <div className='flashcard-face flashcard-face--back'>
                <div className='flashcard-text flashcard-text--back'>{currentCard.back}</div>
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
