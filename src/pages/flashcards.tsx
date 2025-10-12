import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from '@headlessui/react';
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronUpDownIcon,
  FunnelIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import {getRouteApi} from '@tanstack/react-router';
import type {JSX} from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import type {
  VerbEntry,
  VocabularyCategory,
  VocabularyDifficulty,
  VocabularyEntry,
  VocabularyPartOfSpeech,
} from '../types';
import type {Flashcard} from '../utils/createFlashcards';
import {
  createAllFlashcards,
  createVerbFlashcards,
  createVocabularyFlashcards,
} from '../utils/createFlashcards';
import {classNames, shuffle} from '../utils/utils';

const routeApi = getRouteApi('/flashcards');

const CATEGORY_OPTIONS: Array<{value: VocabularyCategory | 'all'; label: string}> = [
  {value: 'all', label: 'All Categories'},
  {value: 'essentials', label: 'Essentials'},
  {value: 'food-dining', label: 'Food & Dining'},
  {value: 'travel-transportation', label: 'Travel & Transportation'},
  {value: 'home-family', label: 'Home & Family'},
  {value: 'work-education', label: 'Work & Education'},
  {value: 'health-body', label: 'Health & Body'},
  {value: 'shopping-money', label: 'Shopping & Money'},
  {value: 'time-weather', label: 'Time & Weather'},
  {value: 'hobbies-leisure', label: 'Hobbies & Leisure'},
  {value: 'nature-animals', label: 'Nature & Animals'},
];

const DIFFICULTY_OPTIONS: Array<{value: VocabularyDifficulty | 'all'; label: string}> = [
  {value: 'all', label: 'All Levels'},
  {value: 'beginner', label: 'Beginner'},
  {value: 'intermediate', label: 'Intermediate'},
  {value: 'advanced', label: 'Advanced'},
];

const PART_OF_SPEECH_OPTIONS: Array<{value: VocabularyPartOfSpeech | 'all'; label: string}> = [
  {value: 'all', label: 'All Types'},
  {value: 'noun', label: 'Noun'},
  {value: 'verb', label: 'Verb'},
  {value: 'adjective', label: 'Adjective'},
  {value: 'adverb', label: 'Adverb'},
  {value: 'phrase', label: 'Phrase'},
  {value: 'other', label: 'Other'},
];

type FlashcardType = 'all' | 'verbs' | 'vocabulary';

const TYPE_OPTIONS: Array<{value: FlashcardType; label: string}> = [
  {value: 'all', label: 'All Cards'},
  {value: 'verbs', label: 'Verb Conjugations'},
  {value: 'vocabulary', label: 'Vocabulary Words'},
];

export function FlashcardsPage(): JSX.Element {
  const {verbs, vocabulary} = routeApi.useLoaderData() as {
    verbs: VerbEntry[];
    vocabulary: VocabularyEntry[];
  };
  const navigate = routeApi.useNavigate();
  const {
    type: typeParam,
    category: categoryParam,
    difficulty: difficultyParam,
    partOfSpeech: partOfSpeechParam,
  } = routeApi.useSearch();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const type = typeParam ?? 'all';
  const category = categoryParam ?? 'all';
  const difficulty = difficultyParam ?? 'all';
  const partOfSpeech = partOfSpeechParam ?? 'all';

  const setType = useCallback(
    (newType: FlashcardType): void => {
      void navigate({
        search: (prev) => ({...prev, type: newType}),
      });
    },
    [navigate]
  );

  const setCategory = useCallback(
    (newCategory: VocabularyCategory | 'all'): void => {
      void navigate({
        search: (prev) => ({...prev, category: newCategory}),
      });
    },
    [navigate]
  );

  const setDifficulty = useCallback(
    (newDifficulty: VocabularyDifficulty | 'all'): void => {
      void navigate({
        search: (prev) => ({...prev, difficulty: newDifficulty}),
      });
    },
    [navigate]
  );

  const setPartOfSpeech = useCallback(
    (newPartOfSpeech: VocabularyPartOfSpeech | 'all'): void => {
      void navigate({
        search: (prev) => ({...prev, partOfSpeech: newPartOfSpeech}),
      });
    },
    [navigate]
  );

  // Create and filter flashcards based on selected filters
  const baseFlashcards = useMemo(() => {
    let cards: Flashcard[];

    // Create cards based on type filter
    if (type === 'verbs') {
      cards = createVerbFlashcards(verbs);
    } else if (type === 'vocabulary') {
      cards = createVocabularyFlashcards(vocabulary);
    } else {
      cards = createAllFlashcards(verbs, vocabulary);
    }

    // Filter by category if vocabulary cards are included
    if (category !== 'all' && (type === 'vocabulary' || type === 'all')) {
      cards = cards.filter((card) => card.type !== 'vocabulary' || card.category === category);
    }

    // Filter by difficulty if vocabulary cards are included
    if (difficulty !== 'all' && (type === 'vocabulary' || type === 'all')) {
      cards = cards.filter((card) => card.type !== 'vocabulary' || card.difficulty === difficulty);
    }

    // Filter by part of speech if vocabulary cards are included
    if (partOfSpeech !== 'all' && (type === 'vocabulary' || type === 'all')) {
      cards = cards.filter(
        (card) => card.type !== 'vocabulary' || card.partOfSpeech === partOfSpeech
      );
    }

    return cards;
  }, [verbs, vocabulary, type, category, difficulty, partOfSpeech]);

  // State to hold shuffled cards
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  // Shuffle cards when base flashcards change
  useEffect(() => {
    setFlashcards(shuffle([...baseFlashcards]));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [baseFlashcards]);

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
    setFlashcards(shuffle([...baseFlashcards]));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleClearFilters = useCallback((): void => {
    void navigate({
      search: {
        type: 'all',
        category: 'all',
        difficulty: 'all',
        partOfSpeech: 'all',
      },
    });
  }, [navigate]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (type !== 'all') count++;
    if (category !== 'all') count++;
    if (difficulty !== 'all') count++;
    if (partOfSpeech !== 'all') count++;
    return count;
  }, [type, category, difficulty, partOfSpeech]);

  if (flashcards.length === 0) {
    return (
      <div className="panel">
        <section className="panel__section">
          <h2>
            <SparklesIcon aria-hidden="true" /> Flashcards
          </h2>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-gray-500">
              No flashcards available for the selected filters. Try adjusting your selection.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="panel">
      <section className="panel__section">
        <h2>
          <SparklesIcon aria-hidden="true" /> Flashcards
        </h2>
        <p className="section-intro">
          Practice Hungarian verb conjugations and vocabulary words. Click the card to reveal the
          answer.
        </p>

        {/* Filters */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="size-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-800">
                {activeFilterCount} active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Card Type</label>
              <Listbox value={type} onChange={setType}>
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500">
                    <span className="block truncate">
                      {TYPE_OPTIONS.find((opt) => opt.value === type)?.label}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="size-4 text-gray-400" />
                    </span>
                  </ListboxButton>
                  <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                    {TYPE_OPTIONS.map((option) => (
                      <ListboxOption
                        key={option.value}
                        value={option.value}
                        className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                      >
                        <span className="block truncate font-normal data-[selected]:font-semibold">
                          {option.label}
                        </span>
                        {type === option.value && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-600">
                            <CheckIcon className="size-4" />
                          </span>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>
            </div>

            {/* Category Filter - Only show for vocabulary or all */}
            {(type === 'vocabulary' || type === 'all') && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Category {type === 'all' && '(Vocabulary)'}
                </label>
                <Listbox value={category} onChange={setCategory}>
                  <div className="relative">
                    <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500">
                      <span className="block truncate">
                        {CATEGORY_OPTIONS.find((opt) => opt.value === category)?.label}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="size-4 text-gray-400" />
                      </span>
                    </ListboxButton>
                    <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                      {CATEGORY_OPTIONS.map((option) => (
                        <ListboxOption
                          key={option.value}
                          value={option.value}
                          className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                        >
                          <span className="block truncate font-normal data-[selected]:font-semibold">
                            {option.label}
                          </span>
                          {category === option.value && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-600">
                              <CheckIcon className="size-4" />
                            </span>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
            )}

            {/* Difficulty Filter - Only show for vocabulary or all */}
            {(type === 'vocabulary' || type === 'all') && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Difficulty {type === 'all' && '(Vocabulary)'}
                </label>
                <Listbox value={difficulty} onChange={setDifficulty}>
                  <div className="relative">
                    <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500">
                      <span className="block truncate">
                        {DIFFICULTY_OPTIONS.find((opt) => opt.value === difficulty)?.label}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="size-4 text-gray-400" />
                      </span>
                    </ListboxButton>
                    <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                      {DIFFICULTY_OPTIONS.map((option) => (
                        <ListboxOption
                          key={option.value}
                          value={option.value}
                          className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                        >
                          <span className="block truncate font-normal data-[selected]:font-semibold">
                            {option.label}
                          </span>
                          {difficulty === option.value && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-600">
                              <CheckIcon className="size-4" />
                            </span>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
            )}

            {/* Part of Speech Filter - Only show for vocabulary or all */}
            {(type === 'vocabulary' || type === 'all') && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Part of Speech {type === 'all' && '(Vocabulary)'}
                </label>
                <Listbox value={partOfSpeech} onChange={setPartOfSpeech}>
                  <div className="relative">
                    <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500">
                      <span className="block truncate">
                        {PART_OF_SPEECH_OPTIONS.find((opt) => opt.value === partOfSpeech)?.label}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="size-4 text-gray-400" />
                      </span>
                    </ListboxButton>
                    <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                      {PART_OF_SPEECH_OPTIONS.map((option) => (
                        <ListboxOption
                          key={option.value}
                          value={option.value}
                          className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                        >
                          <span className="block truncate font-normal data-[selected]:font-semibold">
                            {option.label}
                          </span>
                          {partOfSpeech === option.value && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-600">
                              <CheckIcon className="size-4" />
                            </span>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="flashcard-wrapper">
          <div className="flashcard-progress">{progress}</div>
          <div className="flashcard-container" onClick={handleFlip}>
            <div className={classNames('flashcard-inner', isFlipped && 'flashcard-inner--flipped')}>
              <div className="flashcard-face">
                <div className="flashcard-text">{currentCard.front}</div>
                <div className="flashcard-hint">Click to reveal</div>
              </div>
              <div className="flashcard-face flashcard-face--back">
                <div className="flashcard-text flashcard-text--back">{currentCard.back}</div>
              </div>
            </div>
          </div>
          <div className="flashcard-controls">
            <button
              type="button"
              className="flashcard-button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ArrowLeftIcon aria-hidden="true" /> Previous
            </button>
            <button type="button" className="flashcard-button" onClick={handleShuffle}>
              <ArrowPathIcon aria-hidden="true" /> Shuffle
            </button>
            <button
              type="button"
              className="flashcard-button"
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
            >
              Next <ArrowRightIcon aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
