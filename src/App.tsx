import { Fragment, useMemo, useState } from 'react'
import { Tab, RadioGroup, Transition } from '@headlessui/react'
import {
  AcademicCapIcon,
  ArrowPathIcon,
  BookOpenIcon,
  CheckCircleIcon,
  LightBulbIcon,
  SparklesIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import {
  buildConjugation,
  getEndingDescription,
  indefinitePatterns,
  pronounOrder,
  sampleVerbs,
  vowelHarmonyLabels,
  type Pronoun,
  type VerbEntry,
  type VowelHarmony
} from './data/conjugation'
import './App.css'

const pronounHints: Record<Pronoun, string> = {
  én: 'First person singular',
  te: 'Second person singular',
  ő: 'Third person singular',
  mi: 'First person plural',
  ti: 'Second person plural',
  ők: 'Third person plural'
}

interface QuizQuestion {
  verb: VerbEntry
  pronoun: Pronoun
  answer: string
  options: string[]
  clue: string
}

const QUIZ_LENGTH = 8

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function buildAllForms(): string[] {
  const combos = sampleVerbs.flatMap((verb) =>
    pronounOrder.map((pronoun) => buildConjugation(verb, pronoun))
  )
  return Array.from(new Set(combos))
}

const allForms = buildAllForms()

function createQuizQuestion(): QuizQuestion {
  const verb = randomItem(sampleVerbs)
  const pronoun = randomItem(pronounOrder)
  const answer = buildConjugation(verb, pronoun)
  const clue = `${pronounHints[pronoun]} · ${verb.english}`

  const distractors = new Set<string>()
  while (distractors.size < 3) {
    const candidate = randomItem(allForms)
    if (candidate !== answer) {
      distractors.add(candidate)
    }
    if (distractors.size + 1 >= allForms.length) {
      break
    }
  }

  const options = shuffle([answer, ...Array.from(distractors).slice(0, 3)])
  return { verb, pronoun, answer, options, clue }
}

interface HarmonyChallenge {
  verb: VerbEntry
  pronoun: Pronoun
  target: string
}

function createHarmonyChallenge(): HarmonyChallenge {
  const verb = randomItem(sampleVerbs)
  const pronounPool = pronounOrder.filter((item): item is Pronoun => item !== 'ő')
  const pronoun = randomItem(pronounPool)
  return {
    verb,
    pronoun,
    target: buildConjugation(verb, pronoun)
  }
}

function App() {
  const [selectedVerb, setSelectedVerb] = useState<VerbEntry>(sampleVerbs[0])
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion>(() => createQuizQuestion())
  const [quizSelection, setQuizSelection] = useState<string | null>(null)
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 })
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [harmonyChallenge, setHarmonyChallenge] = useState<HarmonyChallenge>(() => createHarmonyChallenge())
  const [harmonyChoice, setHarmonyChoice] = useState<VowelHarmony | null>(null)
  const [harmonyFeedback, setHarmonyFeedback] = useState<'correct' | 'incorrect' | null>(null)

  const conjugationTable = useMemo(() => {
    return pronounOrder.map((pronoun) => {
      const pattern = indefinitePatterns.find((item) => item.pronoun === pronoun)
      return {
        pronoun,
        english: pattern?.english ?? '',
        endings: pattern?.endings ?? { back: '', front: '', mixed: '' },
        note: pattern?.note ?? ''
      }
    })
  }, [])

  const selectedVerbConjugations = useMemo(() => {
    return pronounOrder.map((pronoun) => ({
      pronoun,
      form: buildConjugation(selectedVerb, pronoun),
      ending: getEndingDescription(pronoun, selectedVerb.harmony)
    }))
  }, [selectedVerb])

  const quizAnswered = quizSelection !== null
  const quizIsCorrect = quizSelection === quizQuestion.answer

  const handleQuizPick = (option: string) => {
    if (quizAnswered || quizCompleted) return
    setQuizSelection(option)
    setQuizScore((score) => {
      const next = {
        correct: score.correct + (option === quizQuestion.answer ? 1 : 0),
        total: score.total + 1
      }
      if (next.total >= QUIZ_LENGTH) {
        setQuizCompleted(true)
      }
      return next
    })
  }

  const handleQuizNext = () => {
    if (quizCompleted) return
    setQuizSelection(null)
    setQuizQuestion(createQuizQuestion())
  }

  const handleQuizReset = () => {
    setQuizSelection(null)
    setQuizQuestion(createQuizQuestion())
    setQuizScore({ correct: 0, total: 0 })
    setQuizCompleted(false)
  }

  const handleHarmonySubmit = (choice: VowelHarmony | null) => {
    if (!choice) return
    setHarmonyChoice(choice)
    if (choice === harmonyChallenge.verb.harmony) {
      setHarmonyFeedback('correct')
      setTimeout(() => {
        setHarmonyFeedback(null)
        setHarmonyChoice(null)
        setHarmonyChallenge(createHarmonyChallenge())
      }, 1200)
    } else {
      setHarmonyFeedback('incorrect')
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__icon">
          <SparklesIcon aria-hidden="true" />
        </div>
        <div>
          <h1>Magyar Verb Playground</h1>
          <p>
            Explore the indefinite present conjugation of Hungarian verbs that do not need connecting
            vowels. Learn the patterns, test yourself, and master vowel harmony along the way.
          </p>
        </div>
      </header>

      <Tab.Group>
        <Tab.List className="tab-list">
          {['Reference', 'Verb Lab', 'Quick Quiz', 'Harmony Drill'].map((label) => (
            <Tab key={label} className={({ selected }) => classNames('tab', selected && 'tab--active')}>
              {label}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="tab-panels">
          <Tab.Panel className="panel">
            <section className="panel__section">
              <h2>
                <BookOpenIcon aria-hidden="true" /> Reference Table
              </h2>
              <p className="section-intro">
                These endings apply to regular Hungarian verbs in the indefinite present tense when no connecting
                vowel is required. Match the ending to the verb&apos;s vowel harmony.
              </p>
              <div className="data-table">
                <div className="data-table__header">
                  <span>Pronoun</span>
                  <span>Meaning</span>
                  <span>Back</span>
                  <span>Front</span>
                  <span>Front (rounded)</span>
                </div>
                {conjugationTable.map((row) => (
                  <div key={row.pronoun} className="data-table__row">
                    <span className="data-table__pronoun">{row.pronoun}</span>
                    <span>{row.english}</span>
                    <span>{row.endings.back}</span>
                    <span>{row.endings.front}</span>
                    <span>{row.endings.mixed}</span>
                    {row.note ? <p className="data-table__note">{row.note}</p> : null}
                  </div>
                ))}
              </div>
            </section>
            <section className="panel__section">
              <h3>
                <LightBulbIcon aria-hidden="true" /> Study Tips
              </h3>
              <ul className="tips">
                <li>
                  Focus on the vowel harmony of the stem: back vowels take <code>-o-/-a-</code> endings, while front vowels
                  prefer <code>-e-/-i-</code>, and rounded front vowels use <code>-ö-/-ü-</code> forms.
                </li>
                <li>
                  First and third person singular can sound similar; rely on the subject pronoun or context to pick out the form.
                </li>
                <li>
                  Stems ending with consonant clusters may insert linking vowels, but the verbs here stay compact.
                </li>
              </ul>
            </section>
          </Tab.Panel>

          <Tab.Panel className="panel">
            <section className="panel__section">
              <h2>
                <AcademicCapIcon aria-hidden="true" /> Conjugation Lab
              </h2>
              <p className="section-intro">
                Choose a verb to see every person conjugated instantly. Compare the endings and read the sample sentences.
              </p>
              <RadioGroup value={selectedVerb} onChange={setSelectedVerb} className="verb-picker">
                <RadioGroup.Label className="sr-only">Select a verb</RadioGroup.Label>
                <div className="verb-picker__grid">
                  {sampleVerbs.map((verb) => (
                    <RadioGroup.Option
                      key={verb.infinitive}
                      value={verb}
                      className={({ checked }) =>
                        classNames('verb-card', checked && 'verb-card--active')
                      }
                    >
                      <div>
                        <p className="verb-card__stem">{verb.stem}</p>
                        <p className="verb-card__meta">{verb.infinitive} · {verb.english}</p>
                        <p className="verb-card__tag">{vowelHarmonyLabels[verb.harmony]}</p>
                      </div>
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>

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
            </section>
          </Tab.Panel>

          <Tab.Panel className="panel">
            <section className="panel__section">
              <h2>
                <SparklesIcon aria-hidden="true" /> Quick Quiz
              </h2>
              <p className="section-intro">
                Pick the correct conjugated form. Each question mixes verbs and persons so you can practice recognition.
              </p>
              <div className="quiz">
                <div className="quiz__meta">
                  <span className="quiz__prompt">{quizQuestion.clue}</span>
                  <span className="quiz__score">
                    {quizCompleted
                      ? `Final score ${quizScore.correct}/${QUIZ_LENGTH}`
                      : `Score ${quizScore.correct}/${quizScore.total}`}
                  </span>
                </div>
                <div className="quiz__options">
                  {quizQuestion.options.map((option) => {
                    const selected = quizSelection === option
                    const status = quizAnswered
                      ? option === quizQuestion.answer
                        ? 'correct'
                        : selected
                        ? 'incorrect'
                        : 'idle'
                      : 'idle'

                    return (
                      <button
                        key={option}
                        type="button"
                        className={classNames('quiz__option', `quiz__option--${status}`)}
                        onClick={() => handleQuizPick(option)}
                        disabled={quizAnswered || quizCompleted}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
                {quizAnswered ? (
                  <div className="quiz__feedback">
                    {quizIsCorrect ? (
                      <span className="quiz__feedback--good">
                        <CheckCircleIcon aria-hidden="true" /> Nagyszerű! ({buildConjugation(quizQuestion.verb, quizQuestion.pronoun)})
                      </span>
                    ) : (
                      <span className="quiz__feedback--bad">
                        <XCircleIcon aria-hidden="true" /> The correct form is {quizQuestion.answer}.
                      </span>
                    )}
                    {quizCompleted ? (
                      <button type="button" className="quiz__next" onClick={handleQuizReset}>
                        <ArrowPathIcon aria-hidden="true" /> Retake quiz
                      </button>
                    ) : (
                      <button type="button" className="quiz__next" onClick={handleQuizNext}>
                        <ArrowPathIcon aria-hidden="true" /> Next question
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </section>
          </Tab.Panel>

          <Tab.Panel className="panel">
            <section className="panel__section">
              <h2>
                <LightBulbIcon aria-hidden="true" /> Harmony Drill
              </h2>
              <p className="section-intro">
                Identify the correct vowel harmony for each verb, then confirm to reveal the full form. Mastering harmony makes
                endings automatic.
              </p>
              <div className="harmony-card">
                <div className="harmony-card__body">
                  <p className="harmony-card__label">Verb</p>
                  <p className="harmony-card__verb">{harmonyChallenge.verb.stem}</p>
                  <p className="harmony-card__meta">{harmonyChallenge.verb.infinitive} · {harmonyChallenge.verb.english}</p>
                  <p className="harmony-card__clue">Target form: {pronounHints[harmonyChallenge.pronoun]}</p>
                </div>
                <RadioGroup
                  value={harmonyChoice}
                  onChange={handleHarmonySubmit}
                  className="harmony-card__choices"
                >
                  <RadioGroup.Label className="sr-only">Choose vowel harmony</RadioGroup.Label>
                  <div className="harmony-card__choice-grid">
                    {(Object.keys(vowelHarmonyLabels) as VowelHarmony[]).map((key) => (
                      <RadioGroup.Option
                        key={key}
                        value={key}
                        className={({ checked }) =>
                          classNames('harmony-card__choice', checked && 'harmony-card__choice--active')
                        }
                      >
                        <span className="harmony-card__choice-title">{vowelHarmonyLabels[key]}</span>
                        <span className="harmony-card__choice-ending">
                          {getEndingDescription(harmonyChallenge.pronoun, key)}
                        </span>
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
                <Transition
                  show={harmonyFeedback !== null}
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
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
                        <CheckCircleIcon aria-hidden="true" /> {harmonyChallenge.target}
                      </>
                    ) : (
                      <>
                        <XCircleIcon aria-hidden="true" /> Try again – the correct ending is{' '}
                        {getEndingDescription(harmonyChallenge.pronoun, harmonyChallenge.verb.harmony)}.
                      </>
                    )}
                  </div>
                </Transition>
              </div>
            </section>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default App
