import type {JSX} from 'react';
import {CustomVerbForm} from '../components/CustomVerbForm';
import {CustomVerbList} from '../components/CustomVerbList';

export default function CustomVerbs(): JSX.Element {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          Custom Verbs
        </h1>
        <p className="text-gray-600">
          Add your own verbs with conjugation data for practice. These verbs can be used in
          conjugation drills.
        </p>
      </div>

      {/* Add Verb Form */}
      <section className="mb-12">
        <h2 className="mb-4">Add New Verb</h2>
        <CustomVerbForm />
      </section>

      {/* Verb List */}
      <section>
        <CustomVerbList />
      </section>
    </div>
  );
}
