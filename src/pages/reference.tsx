import { BookOpenIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';
import { indefinitePatterns } from '../data/conjugation';
import '../App.css';
import { pronounOrder } from '../contants';

export function ReferencePage() {
  const conjugationTable = useMemo(() => {
    return pronounOrder.map(pronoun => {
      const pattern = indefinitePatterns.find(item => item.pronoun === pronoun);
      return {
        pronoun,
        english: pattern?.english ?? '',
        endings: pattern?.endings ?? { back: '', front: '', mixed: '' },
        note: pattern?.note ?? '',
      };
    });
  }, []);

  return (
    <div className='panel'>
      <section className='panel__section'>
        <h2>
          <BookOpenIcon aria-hidden='true' /> Reference Table
        </h2>
        <p className='section-intro'>
          These endings apply to regular Hungarian verbs in the indefinite present tense when no
          connecting vowel is required. Match the ending to the verb&apos;s vowel harmony.
        </p>
        <div className='data-table'>
          <div className='data-table__header'>
            <span>Pronoun</span>
            <span>Meaning</span>
            <span>Back</span>
            <span>Front</span>
            <span>Front (rounded)</span>
          </div>
          {conjugationTable.map(row => (
            <div key={row.pronoun} className='data-table__row'>
              <span className='data-table__pronoun'>{row.pronoun}</span>
              <span>{row.english}</span>
              <span>{row.endings.back}</span>
              <span>{row.endings.front}</span>
              <span>{row.endings.mixed}</span>
              {row.note ? <p className='data-table__note'>{row.note}</p> : null}
            </div>
          ))}
        </div>
      </section>
      <section className='panel__section'>
        <h3>
          <LightBulbIcon aria-hidden='true' /> Study Tips
        </h3>
        <ul className='tips'>
          <li>
            Focus on the vowel harmony of the stem: back vowels take <code>-o-/-a-</code> endings,
            while front vowels prefer <code>-e-/-i-</code>, and rounded front vowels use{' '}
            <code>-ö-/-ü-</code> forms.
          </li>
          <li>
            First and third person singular can sound similar; rely on the subject pronoun or
            context to pick out the form.
          </li>
          <li>
            Stems ending with consonant clusters may insert linking vowels, but the verbs here stay
            compact.
          </li>
        </ul>
      </section>
    </div>
  );
}
