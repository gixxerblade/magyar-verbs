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
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
              1. Start with the pronouns - memorize these first!
            </h4>
            <ul className='tips' style={{ marginTop: '0.5rem' }}>
              <li><strong>én</strong> (I) - always ends in <code>-ok/-ek/-ök</code></li>
              <li><strong>te</strong> (you) - always ends in <code>-sz</code></li>
              <li><strong>ő</strong> (he/she/it) - no ending, just the verb stem</li>
              <li><strong>mi</strong> (we) - always ends in <code>-unk/-ünk</code></li>
              <li><strong>ti</strong> (you all) - always ends in <code>-tok/-tek/-tök</code></li>
              <li><strong>ők</strong> (they) - always ends in <code>-nak/-nek</code></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
              2. Pick the right column based on the verb's vowels
            </h4>
            <ul className='tips' style={{ marginTop: '0.5rem' }}>
              <li><strong>Back vowels</strong> (a, á, o, ó, u, ú) → Use the "Back" column</li>
              <li><strong>Front unrounded</strong> (e, é, i, í) → Use the "Front" column</li>
              <li><strong>Front rounded</strong> (ö, ő, ü, ű) → Use the "Front (rounded)" column</li>
            </ul>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#4d5a6a', fontStyle: 'italic' }}>
              Example: "tanul" has "a" and "u" (back vowels), so use the Back column
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
              3. Watch out for these tricky ones
            </h4>
            <ul className='tips' style={{ marginTop: '0.5rem' }}>
              <li><strong>ő</strong> (he/she/it) has NO ending - just use the verb stem as-is</li>
              <li><strong>te</strong> (you) always ends in <code>-sz</code> regardless of vowel harmony</li>
              <li>When listening, <strong>én</strong> (I) and <strong>ő</strong> (he/she/it) can sound similar - pay attention to context</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
