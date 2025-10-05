import { RadioGroup } from '@headlessui/react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import { sampleVerbs } from '../data/conjugation';
import { buildConjugation, classNames, getEndingDescription } from '../utils/utils';
import { pronounOrder, vowelHarmonyLabels } from '../contants';
import { VerbEntry } from '../types';

export function VerbLab() {
  const [selectedVerb, setSelectedVerb] = useState<VerbEntry>(sampleVerbs[0]);

  const selectedVerbConjugations = useMemo(() => {
    return pronounOrder.map(pronoun => ({
      pronoun,
      form: buildConjugation(selectedVerb, pronoun),
      ending: getEndingDescription(pronoun, selectedVerb.harmony),
    }));
  }, [selectedVerb]);

  return (
    <div className='panel'>
      <section className='panel__section'>
        <h2>
          <AcademicCapIcon aria-hidden='true' /> Conjugation Lab
        </h2>
        <p className='section-intro'>
          Choose a verb to see every person conjugated instantly. Compare the endings and read the
          sample sentences.
        </p>
        <RadioGroup value={selectedVerb} onChange={setSelectedVerb} className='verb-picker'>
          <RadioGroup.Label className='sr-only'>Select a verb</RadioGroup.Label>
          <div className='verb-picker__grid'>
            {sampleVerbs.map(verb => (
              <RadioGroup.Option
                key={verb.infinitive}
                value={verb}
                className={({ checked }) => classNames('verb-card', checked && 'verb-card--active')}
              >
                <div>
                  <p className='verb-card__stem'>{verb.stem}</p>
                  <p className='verb-card__meta'>
                    {verb.infinitive} · {verb.english}
                  </p>
                  <p className='verb-card__tag'>{vowelHarmonyLabels[verb.harmony]}</p>
                </div>
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>

        <div className='conjugation-grid'>
          {selectedVerbConjugations.map(item => (
            <div key={item.pronoun} className='conjugation-card'>
              <p className='conjugation-card__pronoun'>{item.pronoun}</p>
              <p className='conjugation-card__form'>{item.form}</p>
              <span className='conjugation-card__ending'>{item.ending}</span>
            </div>
          ))}
        </div>

        {selectedVerb.sample ? (
          <blockquote className='sample-sentence'>{selectedVerb.sample}</blockquote>
        ) : null}
      </section>
    </div>
  );
}
