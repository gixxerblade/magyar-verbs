import { RadioGroup, Transition, Radio } from '@headlessui/react';
import { LightBulbIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react/jsx-runtime';
import { pronounHints, vowelHarmonyLabels } from '../contants';
import { HarmonyChallenge, VowelHarmony } from '../types';
import { classNames, getEndingDescription } from '../utils/utils';
import { useState } from 'react';
import { createHarmonyChallenge } from '../utils/createHarmonyChallenge';

export function HarmonyDrillPage() {
  const [harmonyChallenge, setHarmonyChallenge] = useState<HarmonyChallenge>(() =>
    createHarmonyChallenge()
  );
  const [harmonyChoice, setHarmonyChoice] = useState<VowelHarmony | null>(null);
  const [harmonyFeedback, setHarmonyFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const handleHarmonySubmit = (choice: VowelHarmony | null) => {
    if (!choice) return;
    setHarmonyChoice(choice);
    if (choice === harmonyChallenge.verb.harmony) {
      setHarmonyFeedback('correct');
      setTimeout(() => {
        setHarmonyFeedback(null);
        setHarmonyChoice(null);
        setHarmonyChallenge(createHarmonyChallenge());
      }, 1200);
    } else {
      setHarmonyFeedback('incorrect');
    }
  };

  return (
    <div className='panel'>
      <section className='panel__section'>
        <h2>
          <LightBulbIcon aria-hidden='true' /> Harmony Drill
        </h2>
        <p className='section-intro'>
          Identify the correct vowel harmony for each verb, then confirm to reveal the full form.
          Mastering harmony makes endings automatic.
        </p>
        <div className='harmony-card'>
          <div className='harmony-card__body'>
            <p className='harmony-card__label'>Verb</p>
            <p className='harmony-card__verb'>{harmonyChallenge.verb.stem}</p>
            <p className='harmony-card__meta'>
              {harmonyChallenge.verb.infinitive} · {harmonyChallenge.verb.english}
            </p>
            <p className='harmony-card__clue'>
              Target form: {pronounHints[harmonyChallenge.pronoun]}
            </p>
          </div>
          <RadioGroup
            value={harmonyChoice}
            onChange={handleHarmonySubmit}
            className='harmony-card__choices'
          >
            <RadioGroup.Label className='sr-only'>Choose vowel harmony</RadioGroup.Label>
            <div className='harmony-card__choice-grid'>
              {(Object.keys(vowelHarmonyLabels) as VowelHarmony[]).map(key => (
                <Radio
                  key={key}
                  value={key}
                  className={({ checked }) =>
                    classNames('harmony-card__choice', checked && 'harmony-card__choice--active')
                  }
                >
                  <span className='harmony-card__choice-title'>{vowelHarmonyLabels[key]}</span>
                  <span className='harmony-card__choice-ending'>
                    {getEndingDescription(harmonyChallenge.pronoun, key)}
                  </span>
                </Radio>
              ))}
            </div>
          </RadioGroup>
          <Transition
            show={harmonyFeedback !== null}
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 translate-y-2'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div
              className={classNames(
                'harmony-card__feedback',
                harmonyFeedback === 'correct'
                  ? 'harmony-card__feedback--good'
                  : 'harmony-card__feedback--bad'
              )}
            >
              {harmonyFeedback === 'correct' ? (
                <>
                  <CheckCircleIcon aria-hidden='true' /> {harmonyChallenge.target}
                </>
              ) : (
                <>
                  <XCircleIcon aria-hidden='true' /> Try again – the correct ending is{' '}
                  {getEndingDescription(harmonyChallenge.pronoun, harmonyChallenge.verb.harmony)}.
                </>
              )}
            </div>
          </Transition>
        </div>
      </section>
    </div>
  );
}
