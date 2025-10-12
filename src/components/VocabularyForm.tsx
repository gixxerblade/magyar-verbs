import {
  Field,
  Input,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Textarea,
} from '@headlessui/react';
import {CheckIcon, ChevronUpDownIcon, PlusIcon} from '@heroicons/react/24/outline';
import {zodResolver} from '@hookform/resolvers/zod';
import type {JSX} from 'react';
import {useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useAddVocabulary, useVocabulary} from '../hooks/useVocabulary';
import {createVocabularyFormSchema, type VocabularyFormData} from '../schemas/vocabulary.schema';
import type {VocabularyCategory} from '../types';

const CATEGORY_OPTIONS: Array<{value: VocabularyCategory; label: string; icon: string}> = [
  {value: 'essentials', label: 'Essentials', icon: '⭐'},
  {value: 'food-dining', label: 'Food & Dining', icon: '🍽️'},
  {value: 'travel-transportation', label: 'Travel & Transportation', icon: '✈️'},
  {value: 'home-family', label: 'Home & Family', icon: '🏠'},
  {value: 'work-education', label: 'Work & Education', icon: '💼'},
  {value: 'health-body', label: 'Health & Body', icon: '🏥'},
  {value: 'shopping-money', label: 'Shopping & Money', icon: '💰'},
  {value: 'time-weather', label: 'Time & Weather', icon: '⏰'},
  {value: 'hobbies-leisure', label: 'Hobbies & Leisure', icon: '🎯'},
  {value: 'nature-animals', label: 'Nature & Animals', icon: '🌿'},
];

const DIFFICULTY_OPTIONS = [
  {value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800'},
  {value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800'},
  {value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800'},
] as const;

const PART_OF_SPEECH_OPTIONS = [
  {value: 'noun', label: 'Noun', icon: '📦'},
  {value: 'verb', label: 'Verb', icon: '⚡'},
  {value: 'adjective', label: 'Adjective', icon: '🎨'},
  {value: 'adverb', label: 'Adverb', icon: '🔄'},
  {value: 'phrase', label: 'Phrase', icon: '💬'},
  {value: 'other', label: 'Other', icon: '📌'},
] as const;

export function VocabularyForm(): JSX.Element {
  const addMutation = useAddVocabulary();
  const {data: existingVocabulary} = useVocabulary();

  // Create schema with duplicate validation
  const validationSchema = useMemo(
    () => createVocabularyFormSchema(existingVocabulary),
    [existingVocabulary]
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: {errors},
  } = useForm<VocabularyFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      hungarian: '',
      english: '',
      category: 'essentials',
      difficulty: 'beginner',
      notes: '',
      exampleSentence: '',
      partOfSpeech: 'noun',
    },
  });

  const onSubmit = (data: VocabularyFormData): void => {
    addMutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Hungarian Input */}
          <Field>
            <Label className="block text-sm font-medium text-gray-900 mb-1.5">
              Hungarian <span className="text-pink-500">*</span>
            </Label>
            <Input
              type="text"
              {...register('hungarian')}
              placeholder="e.g., ház"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:bg-gray-50 disabled:text-gray-500"
            />
            {errors.hungarian && (
              <p className="mt-1.5 text-sm text-red-600">{errors.hungarian.message}</p>
            )}
          </Field>

          {/* English Input */}
          <Field>
            <Label className="block text-sm font-medium text-gray-900 mb-1.5">
              English <span className="text-pink-500">*</span>
            </Label>
            <Input
              type="text"
              {...register('english')}
              placeholder="e.g., house"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:bg-gray-50 disabled:text-gray-500"
            />
            {errors.english && (
              <p className="mt-1.5 text-sm text-red-600">{errors.english.message}</p>
            )}
          </Field>

          {/* Part of Speech Listbox */}
          <Field>
            <Label className="block text-sm font-medium text-gray-900 mb-1.5">Part of Speech</Label>
            <Controller
              name="partOfSpeech"
              control={control}
              render={({field}) => (
                <Listbox value={field.value} onChange={field.onChange}>
                  <div className="relative">
                    <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-left shadow-sm transition-colors focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                      <span className="flex items-center gap-2">
                        <span>
                          {PART_OF_SPEECH_OPTIONS.find((opt) => opt.value === field.value)?.icon}
                        </span>
                        <span className="block truncate text-gray-900">
                          {PART_OF_SPEECH_OPTIONS.find((opt) => opt.value === field.value)?.label}
                        </span>
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronUpDownIcon className="size-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>
                    <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                      {PART_OF_SPEECH_OPTIONS.map((option) => (
                        <ListboxOption
                          key={option.value}
                          value={option.value}
                          className="group relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50 data-[focus]:text-pink-900"
                        >
                          <span className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            <span className="block truncate font-normal group-data-[selected]:font-semibold">
                              {option.label}
                            </span>
                          </span>
                          <span className="absolute inset-y-0 left-0 hidden items-center pl-3 text-pink-600 group-data-[selected]:flex">
                            <CheckIcon className="size-5" aria-hidden="true" />
                          </span>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              )}
            />
          </Field>

          {/* Difficulty Listbox */}
          <Field>
            <Label className="block text-sm font-medium text-gray-900 mb-1.5">
              Difficulty Level
            </Label>
            <Controller
              name="difficulty"
              control={control}
              render={({field}) => (
                <Listbox value={field.value} onChange={field.onChange}>
                  <div className="relative">
                    <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-left shadow-sm transition-colors focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                      <span className="flex items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_OPTIONS.find((opt) => opt.value === field.value)?.color}`}
                        >
                          {DIFFICULTY_OPTIONS.find((opt) => opt.value === field.value)?.label}
                        </span>
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronUpDownIcon className="size-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>
                    <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                      {DIFFICULTY_OPTIONS.map((option) => (
                        <ListboxOption
                          key={option.value}
                          value={option.value}
                          className="group relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50"
                        >
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${option.color}`}
                          >
                            {option.label}
                          </span>
                          <span className="absolute inset-y-0 left-0 hidden items-center pl-3 text-pink-600 group-data-[selected]:flex">
                            <CheckIcon className="size-5" aria-hidden="true" />
                          </span>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              )}
            />
          </Field>

          {/* Category Listbox */}
          <Field className="md:col-span-2">
            <Label className="block text-sm font-medium text-gray-900 mb-1.5">
              Category <span className="text-pink-500">*</span>
            </Label>
            <Controller
              name="category"
              control={control}
              rules={{required: 'Category is required'}}
              render={({field}) => (
                <Listbox value={field.value} onChange={field.onChange}>
                  <div className="relative">
                    <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-left shadow-sm transition-colors focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                      <span className="flex items-center gap-2">
                        <span>
                          {CATEGORY_OPTIONS.find((opt) => opt.value === field.value)?.icon}
                        </span>
                        <span className="block truncate text-gray-900">
                          {CATEGORY_OPTIONS.find((opt) => opt.value === field.value)?.label}
                        </span>
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronUpDownIcon className="size-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>
                    <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                      {CATEGORY_OPTIONS.map((option) => (
                        <ListboxOption
                          key={option.value}
                          value={option.value}
                          className="group relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50 data-[focus]:text-pink-900"
                        >
                          <span className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            <span className="block truncate font-normal group-data-[selected]:font-semibold">
                              {option.label}
                            </span>
                          </span>
                          <span className="absolute inset-y-0 left-0 hidden items-center pl-3 text-pink-600 group-data-[selected]:flex">
                            <CheckIcon className="size-5" aria-hidden="true" />
                          </span>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              )}
            />
            {errors.category && (
              <p className="mt-1.5 text-sm text-red-600">{errors.category.message}</p>
            )}
          </Field>

          {/* Example Sentence Input */}
          <Field className="md:col-span-2">
            <Label className="block text-sm font-medium text-gray-900 mb-1.5">
              Example Sentence
            </Label>
            <Input
              type="text"
              {...register('exampleSentence')}
              placeholder="e.g., Ez egy szép ház."
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </Field>

          {/* Notes Textarea */}
          <Field className="md:col-span-2">
            <Label className="block text-sm font-medium text-gray-900 mb-1.5">Notes</Label>
            <Textarea
              {...register('notes')}
              rows={3}
              placeholder="Add any additional notes or mnemonics..."
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
            />
          </Field>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={addMutation.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-pink-600 hover:to-rose-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="size-5" aria-hidden="true" />
          {addMutation.isPending ? 'Adding...' : 'Add Word'}
        </button>
      </div>

      {/* Error Message */}
      {addMutation.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">
            Error adding vocabulary: {addMutation.error?.message}
          </p>
        </div>
      )}
    </form>
  );
}
