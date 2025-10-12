import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import {
  AdjustmentsHorizontalIcon,
  CheckIcon,
  ChevronUpDownIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import type {JSX} from 'react';
import {useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {defaultSortingLang as hungarianLang} from '../contants';
import {useDeleteVocabulary, useUpdateVocabulary, useVocabulary} from '../hooks/useVocabulary';
import type {
  VocabularyCategory,
  VocabularyDifficulty,
  VocabularyEntry,
  VocabularyFormData,
  VocabularyPartOfSpeech,
} from '../types';

const CATEGORY_OPTIONS: Array<{value: VocabularyCategory; label: string}> = [
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

const DIFFICULTY_OPTIONS: Array<{value: VocabularyDifficulty; label: string}> = [
  {value: 'beginner', label: 'Beginner'},
  {value: 'intermediate', label: 'Intermediate'},
  {value: 'advanced', label: 'Advanced'},
];

const PART_OF_SPEECH_OPTIONS: Array<{value: VocabularyPartOfSpeech; label: string}> = [
  {value: 'noun', label: 'Noun'},
  {value: 'verb', label: 'Verb'},
  {value: 'adjective', label: 'Adjective'},
  {value: 'adverb', label: 'Adverb'},
  {value: 'other', label: 'Other'},
];

type SortOption = 'hungarian-asc' | 'hungarian-desc' | 'difficulty' | 'category' | 'recent';

const SORT_OPTIONS: Array<{value: SortOption; label: string}> = [
  {value: 'hungarian-asc', label: 'Hungarian (A-Z)'},
  {value: 'hungarian-desc', label: 'Hungarian (Z-A)'},
  {value: 'difficulty', label: 'Difficulty'},
  {value: 'category', label: 'Category'},
  {value: 'recent', label: 'Recently Added'},
];

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
} as const;

export function VocabularyList(): JSX.Element {
  const {data: vocabulary, isLoading, isError, error} = useVocabulary();
  const deleteMutation = useDeleteVocabulary();
  const [editingEntry, setEditingEntry] = useState<VocabularyEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<VocabularyCategory | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<VocabularyDifficulty | 'all'>('all');
  const [partOfSpeechFilter, setPartOfSpeechFilter] = useState<VocabularyPartOfSpeech | 'all'>(
    'all'
  );

  // Sort state
  const [sortBy, setSortBy] = useState<SortOption>('hungarian-asc');

  const handleDelete = (id: string): void => {
    deleteMutation.mutate(id);
    setDeletingId(null);
  };

  // Filter and sort logic
  const filteredAndSortedVocabulary = useMemo(() => {
    if (!vocabulary) return [];

    const filtered = vocabulary.filter((entry) => {
      if (categoryFilter !== 'all' && entry.category !== categoryFilter) return false;
      if (difficultyFilter !== 'all' && entry.difficulty !== difficultyFilter) return false;
      if (partOfSpeechFilter !== 'all' && entry.partOfSpeech !== partOfSpeechFilter) return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'hungarian-asc':
          return a.hungarian.localeCompare(b.hungarian, hungarianLang);
        case 'hungarian-desc':
          return b.hungarian.localeCompare(a.hungarian, hungarianLang);
        case 'difficulty': {
          const difficultyOrder = {beginner: 1, intermediate: 2, advanced: 3};
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        }
        case 'category':
          return a.category.localeCompare(b.category);
        case 'recent': {
          const aTime = a.createdAt ? dayjs(a.createdAt).valueOf() : 0;
          const bTime = b.createdAt ? dayjs(b.createdAt).valueOf() : 0;
          return bTime - aTime;
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [vocabulary, categoryFilter, difficultyFilter, partOfSpeechFilter, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (categoryFilter !== 'all') count++;
    if (difficultyFilter !== 'all') count++;
    if (partOfSpeechFilter !== 'all') count++;
    return count;
  }, [categoryFilter, difficultyFilter, partOfSpeechFilter]);

  if (isLoading) {
    return (
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-center text-gray-500">Loading vocabulary...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-center text-red-600">Error loading vocabulary: {error?.message}</p>
      </div>
    );
  }

  if (!vocabulary || vocabulary.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-gray-500">No vocabulary entries yet. Add your first word above!</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Vocabulary ({filteredAndSortedVocabulary.length} of {vocabulary.length} words)
          </h3>
        </div>

        {/* Filters and Sort */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="size-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">Filters & Sort</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-800">
                {activeFilterCount} active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
              <Listbox value={categoryFilter} onChange={setCategoryFilter}>
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500">
                    <span className="block truncate">
                      {categoryFilter === 'all'
                        ? 'All Categories'
                        : CATEGORY_OPTIONS.find((opt) => opt.value === categoryFilter)?.label}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="size-4 text-gray-400" />
                    </span>
                  </ListboxButton>
                  <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <ListboxOption
                      value="all"
                      className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                    >
                      <span className="block truncate font-normal data-[selected]:font-semibold">
                        All Categories
                      </span>
                      {categoryFilter === 'all' && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-600">
                          <CheckIcon className="size-4" />
                        </span>
                      )}
                    </ListboxOption>
                    {CATEGORY_OPTIONS.map((option) => (
                      <ListboxOption
                        key={option.value}
                        value={option.value}
                        className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                      >
                        <span className="block truncate font-normal data-[selected]:font-semibold">
                          {option.label}
                        </span>
                        {categoryFilter === option.value && (
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

            {/* Difficulty Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Difficulty</label>
              <Listbox value={difficultyFilter} onChange={setDifficultyFilter}>
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500">
                    <span className="block truncate">
                      {difficultyFilter === 'all'
                        ? 'All Levels'
                        : DIFFICULTY_OPTIONS.find((opt) => opt.value === difficultyFilter)?.label}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="size-4 text-gray-400" />
                    </span>
                  </ListboxButton>
                  <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <ListboxOption
                      value="all"
                      className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                    >
                      <span className="block truncate font-normal data-[selected]:font-semibold">
                        All Levels
                      </span>
                      {difficultyFilter === 'all' && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-600">
                          <CheckIcon className="size-4" />
                        </span>
                      )}
                    </ListboxOption>
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <ListboxOption
                        key={option.value}
                        value={option.value}
                        className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                      >
                        <span className="block truncate font-normal data-[selected]:font-semibold">
                          {option.label}
                        </span>
                        {difficultyFilter === option.value && (
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

            {/* Part of Speech Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Part of Speech
              </label>
              <Listbox value={partOfSpeechFilter} onChange={setPartOfSpeechFilter}>
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500">
                    <span className="block truncate">
                      {partOfSpeechFilter === 'all'
                        ? 'All Types'
                        : PART_OF_SPEECH_OPTIONS.find((opt) => opt.value === partOfSpeechFilter)
                            ?.label}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="size-4 text-gray-400" />
                    </span>
                  </ListboxButton>
                  <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <ListboxOption
                      value="all"
                      className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                    >
                      <span className="block truncate font-normal data-[selected]:font-semibold">
                        All Types
                      </span>
                      {partOfSpeechFilter === 'all' && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-600">
                          <CheckIcon className="size-4" />
                        </span>
                      )}
                    </ListboxOption>
                    {PART_OF_SPEECH_OPTIONS.map((option) => (
                      <ListboxOption
                        key={option.value}
                        value={option.value}
                        className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                      >
                        <span className="block truncate font-normal data-[selected]:font-semibold">
                          {option.label}
                        </span>
                        {partOfSpeechFilter === option.value && (
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

            {/* Sort By */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Sort By</label>
              <Listbox value={sortBy} onChange={setSortBy}>
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500">
                    <span className="flex items-center gap-1.5 truncate">
                      <AdjustmentsHorizontalIcon className="size-4 text-gray-500" />
                      {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="size-4 text-gray-400" />
                    </span>
                  </ListboxButton>
                  <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                    {SORT_OPTIONS.map((option) => (
                      <ListboxOption
                        key={option.value}
                        value={option.value}
                        className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                      >
                        <span className="block truncate font-normal data-[selected]:font-semibold">
                          {option.label}
                        </span>
                        {sortBy === option.value && (
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
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter('all');
                  setDifficultyFilter('all');
                  setPartOfSpeechFilter('all');
                }}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Vocabulary List */}
        {filteredAndSortedVocabulary.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-gray-500">
              No vocabulary entries match your filters. Try adjusting your selection.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAndSortedVocabulary.map((entry) => (
              <VocabularyCard
                key={entry.id}
                entry={entry}
                onEdit={() => setEditingEntry(entry)}
                onDelete={() => setDeletingId(entry.id ?? null)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <EditVocabularyDialog
        entry={editingEntry}
        isOpen={editingEntry !== null}
        onClose={() => setEditingEntry(null)}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}

interface VocabularyCardProps {
  entry: VocabularyEntry;
  onEdit: () => void;
  onDelete: () => void;
}

function VocabularyCard({entry, onEdit, onDelete}: VocabularyCardProps): JSX.Element {
  return (
    <div className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Main words */}
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <span className="text-lg font-semibold text-gray-900">{entry.hungarian}</span>
            <span className="text-gray-400">→</span>
            <span className="text-lg text-gray-700">{entry.english}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {entry.partOfSpeech && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {entry.partOfSpeech}
              </span>
            )}
            {entry.difficulty && (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[entry.difficulty]}`}
              >
                {entry.difficulty}
              </span>
            )}
            {entry.category && (
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                {entry.category}
              </span>
            )}
          </div>

          {/* Example and notes */}
          {(entry.exampleSentence || entry.notes) && (
            <div className="space-y-1 text-sm">
              {entry.exampleSentence && (
                <p className="text-gray-600 italic">
                  <span className="font-medium not-italic">Example:</span> {entry.exampleSentence}
                </p>
              )}
              {entry.notes && (
                <p className="text-gray-500">
                  <span className="font-medium">Notes:</span> {entry.notes}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions menu */}
        <Menu as="div" className="relative flex-shrink-0">
          <MenuButton className="inline-flex items-center justify-center rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
            <EllipsisVerticalIcon className="size-5" aria-hidden="true" />
          </MenuButton>
          <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
            <MenuItem>
              {({focus}) => (
                <button
                  type="button"
                  onClick={onEdit}
                  className={`${focus ? 'bg-gray-100' : ''} group flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700`}
                >
                  <PencilIcon className="size-4 text-gray-400 group-hover:text-gray-500" />
                  Edit
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({focus}) => (
                <button
                  type="button"
                  onClick={onDelete}
                  className={`${focus ? 'bg-red-50' : ''} group flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600`}
                >
                  <TrashIcon className="size-4 text-red-400 group-hover:text-red-500" />
                  Delete
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
}

interface EditVocabularyDialogProps {
  entry: VocabularyEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

function EditVocabularyDialog({entry, isOpen, onClose}: EditVocabularyDialogProps): JSX.Element {
  const updateMutation = useUpdateVocabulary();
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<VocabularyFormData>({
    defaultValues: entry
      ? {
          hungarian: entry.hungarian,
          english: entry.english,
          category: entry.category,
          difficulty: entry.difficulty,
          notes: entry.notes || '',
          exampleSentence: entry.exampleSentence || '',
          partOfSpeech: entry.partOfSpeech,
        }
      : undefined,
  });

  const onSubmit = (data: VocabularyFormData): void => {
    if (!entry?.id) return;

    updateMutation.mutate(
      {id: entry.id, data},
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-2xl w-full rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Edit Vocabulary
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <XMarkIcon className="size-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-hungarian" className="block text-sm font-medium text-gray-700">
                  Hungarian *
                </label>
                <input
                  type="text"
                  id="edit-hungarian"
                  {...register('hungarian', {required: 'Hungarian word is required'})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                {errors.hungarian && (
                  <p className="mt-1 text-sm text-red-600">{errors.hungarian.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="edit-english" className="block text-sm font-medium text-gray-700">
                  English *
                </label>
                <input
                  type="text"
                  id="edit-english"
                  {...register('english', {required: 'English translation is required'})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                {errors.english && (
                  <p className="mt-1 text-sm text-red-600">{errors.english.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-partOfSpeech"
                  className="block text-sm font-medium text-gray-700"
                >
                  Part of Speech
                </label>
                <select
                  id="edit-partOfSpeech"
                  {...register('partOfSpeech')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  {PART_OF_SPEECH_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-difficulty"
                  className="block text-sm font-medium text-gray-700"
                >
                  Difficulty
                </label>
                <select
                  id="edit-difficulty"
                  {...register('difficulty')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="edit-category"
                  {...register('category', {required: 'Category is required'})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="edit-exampleSentence"
                  className="block text-sm font-medium text-gray-700"
                >
                  Example Sentence
                </label>
                <input
                  type="text"
                  id="edit-exampleSentence"
                  {...register('exampleSentence')}
                  placeholder="e.g., Ez egy szép ház."
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="edit-notes"
                  {...register('notes')}
                  rows={3}
                  placeholder="Add any additional notes or mnemonics..."
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={updateMutation.isPending}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-md bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-pink-600 hover:to-rose-600 disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {updateMutation.isError && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-600">
                  Error updating vocabulary: {updateMutation.error?.message}
                </p>
              </div>
            )}
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmationDialogProps): JSX.Element {
  const handleConfirm = (): void => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="mb-4 text-lg font-semibold text-gray-900">
            Delete Vocabulary Entry
          </DialogTitle>

          <p className="mb-6 text-sm text-gray-600">
            Are you sure you want to delete this vocabulary entry? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
