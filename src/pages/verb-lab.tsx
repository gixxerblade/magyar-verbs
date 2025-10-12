import {Label, Radio, RadioGroup} from '@headlessui/react';
import {AcademicCapIcon} from '@heroicons/react/24/outline';
import {useSuspenseQuery} from '@tanstack/react-query';
import {useMemo, useState} from 'react';
import {pronounOrder, vowelHarmonyLabels} from '../contants';
import {customVerbsQueryOptions} from '../hooks/useCustomVerbs';
import type {VerbEntry} from '../types';
import {buildConjugation, classNames, getEndingDescription} from '../utils/utils';

export function VerbLab() {
  const {data: verbs} = useSuspenseQuery(customVerbsQueryOptions);
  const [selectedVerb, setSelectedVerb] = useState<VerbEntry>(verbs[0]);

  const selectedVerbConjugations = useMemo(() => {
    return pronounOrder.map((pronoun) => ({
      pronoun,
      form: buildConjugation(selectedVerb, pronoun),
      ending: getEndingDescription(pronoun, selectedVerb.harmony),
    }));
  }, [selectedVerb]);

  if (!verbs || verbs.length === 0) {
    return (
      <div className="panel">
        <section className="panel__section">
          <h2>
            <AcademicCapIcon aria-hidden="true" /> Conjugation Lab
          </h2>
          <p className="section-intro">
            No custom verbs found. Please add some verbs in the Custom Verbs page first.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="panel">
      <section className="panel__section">
        <h2>
          <AcademicCapIcon aria-hidden="true" /> Conjugation Lab
        </h2>
        <p className="section-intro">
          Choose a verb to see every person conjugated instantly. Compare the endings and read the
          sample sentences.
        </p>
        <div className="conjugation-grid">
          {selectedVerbConjugations.map((item) => (
            <div key={item.pronoun} className="conjugation-card">
              <p className="conjugation-card__pronoun">{item.pronoun}</p>
              <p className="conjugation-card__form">{item.form}</p>
              <span className="conjugation-card__ending">{item.ending}</span>
            </div>
          ))}
        </div>

        {selectedVerb.sample ? (
          <blockquote className="sample-sentence">{selectedVerb.sample}</blockquote>
        ) : null}
        <RadioGroup value={selectedVerb} onChange={setSelectedVerb} className="verb-picker">
          <Label className="sr-only">Select a verb</Label>
          <div className="verb-picker__grid">
            {verbs.map((verb) => (
              <Radio
                key={verb.id}
                value={verb}
                className={({checked}) => classNames('verb-card', checked && 'verb-card--active')}
              >
                <div>
                  <p className="verb-card__stem">{verb.stem}</p>
                  <p className="verb-card__meta">
                    {verb.infinitive} · {verb.english}
                  </p>
                  <p className="verb-card__tag">{vowelHarmonyLabels[verb.harmony]}</p>
                </div>
              </Radio>
            ))}
          </div>
        </RadioGroup>
      </section>
    </div>
  );
}
