import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Textarea,
} from '@headlessui/react';
import {
  CheckIcon,
  ChevronUpDownIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {zodResolver} from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import type {JSX} from 'react';
import {useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {defaultSortingLang} from '../contants';
import {useCustomVerbs, useDeleteCustomVerb, useUpdateCustomVerb} from '../hooks/useCustomVerbs';
import {type VerbFormData, verbFormSchema} from '../schemas/verb.schema';
import type {VerbEntry, VowelHarmony} from '../types';

const HARMONY_OPTIONS: Array<{value: VowelHarmony; label: string; icon: string}> = [
  {value: 'back', label: 'Back', icon: '🔙'},
  {value: 'front', label: 'Front', icon: '⏩'},
  {value: 'mixed', label: 'Mixed', icon: '🔀'},
];

const HARMONY_COLORS = {
  back: 'bg-orange-100 text-orange-800',
  front: 'bg-blue-100 text-blue-800',
  mixed: 'bg-purple-100 text-purple-800',
} as const;

type SortOption = 'infinitive-asc' | 'infinitive-desc' | 'english-asc' | 'english-desc' | 'recent';
type HarmonyFilter = 'all' | VowelHarmony;

export function CustomVerbList(): JSX.Element {
  const {data: verbs, isLoading, isError, error} = useCustomVerbs();
  const deleteMutation = useDeleteCustomVerb();
  const [editingVerb, setEditingVerb] = useState<VerbEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter and sort state
  const [harmonyFilter, setHarmonyFilter] = useState<HarmonyFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('infinitive-asc');

  // Filtered and sorted verbs
  const filteredAndSortedVerbs = useMemo(() => {
    if (!verbs) return [];

    // Filter by harmony
    const filtered = verbs.filter((verb) => {
      if (harmonyFilter !== 'all' && verb.harmony !== harmonyFilter) return false;
      return true;
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'infinitive-asc') {
        return a.infinitive.localeCompare(b.infinitive, defaultSortingLang);
      }
      if (sortBy === 'infinitive-desc') {
        return b.infinitive.localeCompare(a.infinitive, defaultSortingLang);
      }
      if (sortBy === 'english-asc') {
        return a.english.localeCompare(b.english);
      }
      if (sortBy === 'english-desc') {
        return b.english.localeCompare(a.english);
      }
      if (sortBy === 'recent') {
        const aTime = a.createdAt ? dayjs(a.createdAt).valueOf() : 0;
        const bTime = b.createdAt ? dayjs(b.createdAt).valueOf() : 0;
        return bTime - aTime;
      }
      return 0;
    });

    return sorted;
  }, [verbs, harmonyFilter, sortBy]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (harmonyFilter !== 'all') count++;
    return count;
  }, [harmonyFilter]);

  const clearFilters = (): void => {
    setHarmonyFilter('all');
  };

  const handleDelete = (id: string): void => {
    deleteMutation.mutate(id);
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-center text-gray-500">Loading custom verbs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-center text-red-600">Error loading verbs: {error?.message}</p>
      </div>
    );
  }

  if (!verbs || verbs.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-gray-500">No custom verbs yet. Add your first verb above!</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Custom Verbs ({filteredAndSortedVerbs.length} of {verbs.length} verbs)
          </h3>

          <div className="flex flex-wrap gap-3">
            {/* Harmony Filter */}
            <Listbox value={harmonyFilter} onChange={setHarmonyFilter}>
              <div className="relative">
                <ListboxButton className="relative inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                  <FunnelIcon className="size-4" />
                  <span>
                    Harmony:{' '}
                    {harmonyFilter === 'all'
                      ? 'All'
                      : HARMONY_OPTIONS.find((opt) => opt.value === harmonyFilter)?.label}
                  </span>
                  <ChevronUpDownIcon className="size-4 text-gray-400" />
                </ListboxButton>
                <ListboxOptions className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <ListboxOption
                    value="all"
                    className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                  >
                    <span className="block truncate font-normal data-[selected]:font-semibold">
                      All Harmonies
                    </span>
                    {harmonyFilter === 'all' && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-600">
                        <CheckIcon className="size-4" />
                      </span>
                    )}
                  </ListboxOption>
                  {HARMONY_OPTIONS.map((option) => (
                    <ListboxOption
                      key={option.value}
                      value={option.value}
                      className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                    >
                      <span className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span className="block truncate font-normal data-[selected]:font-semibold">
                          {option.label}
                        </span>
                      </span>
                      {harmonyFilter === option.value && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-600">
                          <CheckIcon className="size-4" />
                        </span>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>

            {/* Sort Dropdown */}
            <Listbox value={sortBy} onChange={setSortBy}>
              <div className="relative">
                <ListboxButton className="relative inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                  <span>
                    Sort:{' '}
                    {
                      {
                        'infinitive-asc': 'Hungarian A-Z',
                        'infinitive-desc': 'Hungarian Z-A',
                        'english-asc': 'English A-Z',
                        'english-desc': 'English Z-A',
                        recent: 'Most Recent',
                      }[sortBy]
                    }
                  </span>
                  <ChevronUpDownIcon className="size-4 text-gray-400" />
                </ListboxButton>
                <ListboxOptions className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  {[
                    {value: 'infinitive-asc' as const, label: 'Hungarian A-Z'},
                    {value: 'infinitive-desc' as const, label: 'Hungarian Z-A'},
                    {value: 'english-asc' as const, label: 'English A-Z'},
                    {value: 'english-desc' as const, label: 'English Z-A'},
                    {value: 'recent' as const, label: 'Most Recent'},
                  ].map((option) => (
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

            {/* Clear Filters Button */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                <XMarkIcon className="size-4" />
                Clear Filters ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {filteredAndSortedVerbs.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-gray-500">No verbs match the current filters.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAndSortedVerbs.map((verb) => (
              <VerbCard
                key={verb.id}
                verb={verb}
                onEdit={() => setEditingVerb(verb)}
                onDelete={() => setDeletingId(verb.id ?? null)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <EditVerbDialog
        verb={editingVerb}
        isOpen={editingVerb !== null}
        onClose={() => setEditingVerb(null)}
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

interface VerbCardProps {
  verb: VerbEntry;
  onEdit: () => void;
  onDelete: () => void;
}

function VerbCard({verb, onEdit, onDelete}: VerbCardProps): JSX.Element {
  return (
    <div className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Infinitive and translation */}
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <span className="text-lg font-semibold text-gray-900">{verb.infinitive}</span>
            <span className="text-gray-400">→</span>
            <span className="text-lg text-gray-700">{verb.english}</span>
          </div>

          {/* Stem and harmony */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              Stem: {verb.stem}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${HARMONY_COLORS[verb.harmony]}`}
            >
              {HARMONY_OPTIONS.find((opt) => opt.value === verb.harmony)?.icon} {verb.harmony}{' '}
              harmony
            </span>
          </div>

          {/* Sample sentence */}
          {verb.sample && (
            <div className="text-sm">
              <p className="text-gray-600 italic">
                <span className="font-medium not-italic">Example:</span> {verb.sample}
              </p>
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

interface EditVerbDialogProps {
  verb: VerbEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

function EditVerbDialog({verb, isOpen, onClose}: EditVerbDialogProps): JSX.Element {
  const updateMutation = useUpdateCustomVerb();

  const defaultValues = useMemo(
    () =>
      verb
        ? {
            infinitive: verb.infinitive,
            stem: verb.stem,
            english: verb.english,
            harmony: verb.harmony,
            sample: verb.sample || '',
          }
        : undefined,
    [verb]
  );

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    control,
  } = useForm<VerbFormData>({
    resolver: zodResolver(verbFormSchema),
    values: defaultValues,
  });

  const onSubmit = (data: VerbFormData): void => {
    if (!verb?.id) return;

    updateMutation.mutate(
      {id: verb.id, data},
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
            <DialogTitle className="text-xl font-semibold text-gray-900">Edit Verb</DialogTitle>
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
              {/* Infinitive */}
              <Field>
                <Label
                  htmlFor="edit-infinitive"
                  className="block text-sm font-medium text-gray-700"
                >
                  Infinitive *
                </Label>
                <Input
                  type="text"
                  id="edit-infinitive"
                  {...register('infinitive')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                {errors.infinitive && (
                  <p className="mt-1 text-sm text-red-600">{errors.infinitive.message}</p>
                )}
              </Field>

              {/* Stem */}
              <Field>
                <Label htmlFor="edit-stem" className="block text-sm font-medium text-gray-700">
                  Stem *
                </Label>
                <Input
                  type="text"
                  id="edit-stem"
                  {...register('stem')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                {errors.stem && <p className="mt-1 text-sm text-red-600">{errors.stem.message}</p>}
              </Field>

              {/* English */}
              <Field>
                <Label htmlFor="edit-english" className="block text-sm font-medium text-gray-700">
                  English *
                </Label>
                <Input
                  type="text"
                  id="edit-english"
                  {...register('english')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                {errors.english && (
                  <p className="mt-1 text-sm text-red-600">{errors.english.message}</p>
                )}
              </Field>

              {/* Harmony */}
              <Field>
                <Label htmlFor="edit-harmony" className="block text-sm font-medium text-gray-700">
                  Vowel Harmony *
                </Label>
                <Controller
                  name="harmony"
                  control={control}
                  render={({field}) => (
                    <Listbox value={field.value} onChange={field.onChange}>
                      <div className="relative mt-1">
                        <ListboxButton className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500">
                          <span className="flex items-center gap-2">
                            <span>
                              {HARMONY_OPTIONS.find((opt) => opt.value === field.value)?.icon}
                            </span>
                            <span className="block truncate">
                              {HARMONY_OPTIONS.find((opt) => opt.value === field.value)?.label}
                            </span>
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="size-4 text-gray-400" />
                          </span>
                        </ListboxButton>
                        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                          {HARMONY_OPTIONS.map((option) => (
                            <ListboxOption
                              key={option.value}
                              value={option.value}
                              className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                            >
                              <span className="flex items-center gap-2">
                                <span>{option.icon}</span>
                                <span className="block truncate font-normal data-[selected]:font-semibold">
                                  {option.label}
                                </span>
                              </span>
                              {field.value === option.value && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-600">
                                  <CheckIcon className="size-4" />
                                </span>
                              )}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </div>
                    </Listbox>
                  )}
                />
                {errors.harmony && (
                  <p className="mt-1 text-sm text-red-600">{errors.harmony.message}</p>
                )}
              </Field>

              {/* Sample */}
              <Field className="col-span-2">
                <Label htmlFor="edit-sample" className="block text-sm font-medium text-gray-700">
                  Example Sentence
                </Label>
                <Textarea
                  id="edit-sample"
                  {...register('sample')}
                  rows={2}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </Field>
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
                  Error updating verb: {updateMutation.error?.message}
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
            Delete Custom Verb
          </DialogTitle>

          <p className="mb-6 text-sm text-gray-600">
            Are you sure you want to delete this verb? This action cannot be undone.
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
