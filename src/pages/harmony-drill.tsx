import {Radio, RadioGroup} from '@headlessui/react';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  LightBulbIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import {useSuspenseQuery} from '@tanstack/react-query';
import {useState} from 'react';
import {pronounHints, vowelHarmonyLabels} from '../contants';
import {indefinitePatterns} from '../data/conjugation';
import {customVerbsQueryOptions} from '../hooks/useCustomVerbs';
import type {HarmonyChallenge, VowelHarmony} from '../types';
import {createHarmonyChallenge} from '../utils/createHarmonyChallenge';
import {classNames, getEndingDescription} from '../utils/utils';

export function HarmonyDrillPage() {
  const {data: verbs} = useSuspenseQuery(customVerbsQueryOptions);
  const [harmonyChallenge, setHarmonyChallenge] = useState<HarmonyChallenge>(() =>
    createHarmonyChallenge(verbs)
  );
  const [harmonyChoice, setHarmonyChoice] = useState<VowelHarmony | null>(null);
  const [harmonyFeedback, setHarmonyFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const harmonyAnswered = harmonyChoice !== null;

  // Get English pronoun and verb for the hint
  const pattern = indefinitePatterns.find((p) => p.pronoun === harmonyChallenge.pronoun);
  const englishPronoun = pattern?.english || '';
  const verbBase = harmonyChallenge.verb.english.replace(/^to /, '');
  const targetHint = `${pronounHints[harmonyChallenge.pronoun]} - ${englishPronoun} ${verbBase}`;

  const handleHarmonySubmit = (choice: VowelHarmony | null) => {
    if (!choice || harmonyAnswered) return;
    setHarmonyChoice(choice);
    if (choice === harmonyChallenge.verb.harmony) {
      setHarmonyFeedback('correct');
    } else {
      setHarmonyFeedback('incorrect');
    }
  };

  const handleHarmonyNext = () => {
    setHarmonyChoice(null);
    setHarmonyFeedback(null);
    setHarmonyChallenge(createHarmonyChallenge(verbs));
  };

  return (
    <div className="panel">
      <section className="panel__section">
        <h2>
          <LightBulbIcon aria-hidden="true" /> Harmony Drill
        </h2>
        <p className="section-intro">
          Identify the correct vowel harmony for each verb, then confirm to reveal the full form.
          Mastering harmony makes endings automatic.
        </p>
        <div className="harmony-card">
          <div className="harmony-card__body">
            <p className="harmony-card__label">Verb</p>
            <p className="harmony-card__verb">{harmonyChallenge.verb.stem}</p>
            <p className="harmony-card__meta">
              {harmonyChallenge.verb.infinitive} · {harmonyChallenge.verb.english}
            </p>
            <p className="harmony-card__clue">Target form: {targetHint}</p>
          </div>
          <RadioGroup
            value={harmonyChoice}
            onChange={handleHarmonySubmit}
            className="harmony-card__choices"
            disabled={harmonyAnswered}
          >
            <RadioGroup.Label className="sr-only">Choose vowel harmony</RadioGroup.Label>
            <div className="harmony-card__choice-grid">
              {(Object.keys(vowelHarmonyLabels) as VowelHarmony[]).map((key) => {
                const isCorrectAnswer = key === harmonyChallenge.verb.harmony;
                const isSelected = harmonyChoice === key;

                let statusClass = '';
                if (harmonyAnswered) {
                  if (isCorrectAnswer) {
                    statusClass = 'harmony-card__choice--correct';
                  } else if (isSelected) {
                    statusClass = 'harmony-card__choice--incorrect';
                  }
                } else if (isSelected) {
                  statusClass = 'harmony-card__choice--active';
                }

                return (
                  <Radio
                    key={key}
                    value={key}
                    disabled={harmonyAnswered}
                    className={classNames('harmony-card__choice', statusClass)}
                  >
                    <span className="harmony-card__choice-title">{vowelHarmonyLabels[key]}</span>
                    <span className="harmony-card__choice-ending">
                      {getEndingDescription(harmonyChallenge.pronoun, key)}
                    </span>
                  </Radio>
                );
              })}
            </div>
          </RadioGroup>
          {harmonyAnswered ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
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
                    <CheckCircleIcon aria-hidden="true" /> {harmonyChallenge.target}
                  </>
                ) : (
                  <>
                    <XCircleIcon aria-hidden="true" /> The correct ending is{' '}
                    {getEndingDescription(harmonyChallenge.pronoun, harmonyChallenge.verb.harmony)}.
                  </>
                )}
              </div>
              <button type="button" className="quiz__next" onClick={handleHarmonyNext}>
                <ArrowPathIcon color="white" className="w-4 h-4" /> Next
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
