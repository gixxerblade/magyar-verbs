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
import { CheckIcon, ChevronUpDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAddCustomVerb, useCustomVerbs } from '../hooks/useCustomVerbs';
import { createVerbFormSchema, type VerbFormData } from '../schemas/verb.schema';
import type { VowelHarmony } from '../types';

const HARMONY_OPTIONS: Array<{
  value: VowelHarmony;
  label: string;
  icon: string;
  description: string;
}> = [
  { value: 'back', label: 'Back Vowels', icon: '🔙', description: 'a, á, o, ó, u, ú' },
  { value: 'front', label: 'Front Vowels', icon: '⏩', description: 'e, é, i, í' },
  { value: 'mixed', label: 'Mixed Vowels', icon: '🔀', description: 'ö, ő, ü, ű' },
];

export function CustomVerbForm(): JSX.Element {
  const addMutation = useAddCustomVerb();
  const { data: existingVerbs } = useCustomVerbs();

  // Create schema with duplicate validation
  const validationSchema = useMemo(() => createVerbFormSchema(existingVerbs), [existingVerbs]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<VerbFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      infinitive: '',
      stem: '',
      english: '',
      harmony: 'back',
      sample: '',
    },
  });

  const onSubmit = (data: VerbFormData): void => {
    addMutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Infinitive Input */}
          <Field>
            <Label className='block text-sm font-medium text-gray-900 mb-1.5'>
              Infinitive <span className='text-pink-500'>*</span>
            </Label>
            <Input
              type='text'
              {...register('infinitive')}
              placeholder='e.g., tanulni'
              className='block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:bg-gray-50 disabled:text-gray-500'
            />
            {errors.infinitive && (
              <p className='mt-1.5 text-sm text-red-600'>{errors.infinitive.message}</p>
            )}
            <p className='mt-1 text-xs text-gray-500'>Hungarian infinitives end with "ni"</p>
          </Field>

          {/* Stem Input */}
          <Field>
            <Label className='block text-sm font-medium text-gray-900 mb-1.5'>
              Verb Stem <span className='text-pink-500'>*</span>
            </Label>
            <Input
              type='text'
              {...register('stem')}
              placeholder='e.g., tanul'
              className='block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:bg-gray-50 disabled:text-gray-500'
            />
            {errors.stem && <p className='mt-1.5 text-sm text-red-600'>{errors.stem.message}</p>}
            <p className='mt-1 text-xs text-gray-500'>Remove "ni" from infinitive</p>
          </Field>

          {/* English Translation Input */}
          <Field>
            <Label className='block text-sm font-medium text-gray-900 mb-1.5'>
              English <span className='text-pink-500'>*</span>
            </Label>
            <Input
              type='text'
              {...register('english')}
              placeholder='e.g., to learn'
              className='block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:bg-gray-50 disabled:text-gray-500'
            />
            {errors.english && (
              <p className='mt-1.5 text-sm text-red-600'>{errors.english.message}</p>
            )}
            <p className='mt-1 text-xs text-gray-500'>Start with "to" (e.g., "to learn")</p>
          </Field>

          {/* Vowel Harmony Listbox */}
          <Field>
            <Label className='block text-sm font-medium text-gray-900 mb-1.5'>
              Vowel Harmony <span className='text-pink-500'>*</span>
            </Label>
            <Controller
              name='harmony'
              control={control}
              render={({ field }) => (
                <Listbox value={field.value} onChange={field.onChange}>
                  <div className='relative'>
                    <ListboxButton className='relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-left shadow-sm transition-colors focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20'>
                      <span className='flex items-center gap-2'>
                        <span>
                          {HARMONY_OPTIONS.find((opt) => opt.value === field.value)?.icon}
                        </span>
                        <span className='block truncate text-gray-900'>
                          {HARMONY_OPTIONS.find((opt) => opt.value === field.value)?.label}
                        </span>
                      </span>
                      <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                        <ChevronUpDownIcon className='size-5 text-gray-400' aria-hidden='true' />
                      </span>
                    </ListboxButton>
                    <ListboxOptions className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none'>
                      {HARMONY_OPTIONS.map((option) => (
                        <ListboxOption
                          key={option.value}
                          value={option.value}
                          className='group relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-gray-900 data-[focus]:bg-pink-50 data-[focus]:text-pink-900'
                        >
                          <div className='flex items-start gap-2'>
                            <span>{option.icon}</span>
                            <div className='flex-1'>
                              <span className='block truncate font-normal group-data-[selected]:font-semibold'>
                                {option.label}
                              </span>
                              <span className='block text-xs text-gray-500 mt-0.5'>
                                {option.description}
                              </span>
                            </div>
                          </div>
                          <span className='absolute inset-y-0 left-0 hidden items-center pl-3 text-pink-600 group-data-[selected]:flex'>
                            <CheckIcon className='size-5' aria-hidden='true' />
                          </span>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              )}
            />
            {errors.harmony && (
              <p className='mt-1.5 text-sm text-red-600'>{errors.harmony.message}</p>
            )}
          </Field>

          {/* Example Sentence Input */}
          <Field className='md:col-span-2'>
            <Label className='block text-sm font-medium text-gray-900 mb-1.5'>
              Example Sentence
            </Label>
            <Textarea
              {...register('sample')}
              rows={2}
              placeholder='e.g., Minden nap tanulok magyarul. (I study Hungarian every day.)'
              className='block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:bg-gray-50 disabled:text-gray-500 resize-none'
            />
            <p className='mt-1 text-xs text-gray-500'>
              Optional: Include both Hungarian and English
            </p>
          </Field>
        </div>
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <button
          type='submit'
          disabled={addMutation.isPending}
          className='inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-pink-600 hover:to-rose-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <PlusIcon className='size-5' aria-hidden='true' />
          {addMutation.isPending ? 'Adding...' : 'Add Verb'}
        </button>
      </div>

      {/* Error Message */}
      {addMutation.isError && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
          <p className='text-sm text-red-600'>Error adding verb: {addMutation.error?.message}</p>
        </div>
      )}
    </form>
  );
}
