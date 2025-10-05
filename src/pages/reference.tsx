import { BookOpenIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';
import { indefinitePatterns } from '../data/conjugation';
import '../App.css';
import { pronounOrder, pronounHints, pronounExplanations } from '../contants';

export function ReferencePage() {
  const conjugationTable = useMemo(() => {
    return pronounOrder.map(pronoun => {
      const pattern = indefinitePatterns.find(item => item.pronoun === pronoun);
      return {
        pronoun,
        person: pronounHints[pronoun],
        explanation: pronounExplanations[pronoun],
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
        <div className='section-intro'>
          <p>
            These endings apply to regular Hungarian verbs in the indefinite present tense when no
            connecting vowel is required. Match the ending to the verb&apos;s vowel harmony.
          </p>
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Understanding Pronouns:</h3>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
              <li><strong>1st person</strong> = the speaker (I, we)</li>
              <li><strong>2nd person</strong> = the person(s) being spoken to (you)</li>
              <li><strong>3rd person</strong> = the person(s) or thing(s) being spoken about (he, she, it, they)</li>
              <li><strong>Singular</strong> = one person/thing</li>
              <li><strong>Plural</strong> = multiple people/things</li>
            </ul>
          </div>
        </div>
        <div className='data-table'>
          <div className='data-table__header'>
            <span>Pronoun</span>
            <span>Person</span>
            <span>Meaning</span>
            <span>Back</span>
            <span>Front</span>
            <span>Front (rounded)</span>
          </div>
          {conjugationTable.map(row => (
            <div key={row.pronoun} className='data-table__row'>
              <span className='data-table__pronoun' title={row.explanation}>{row.pronoun}</span>
              <span style={{ fontSize: '0.875rem', color: 'rgb(107, 114, 128)' }} title={row.explanation}>{row.person}</span>
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
