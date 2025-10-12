import {
  ArrowPathIcon,
  CheckCircleIcon,
  SparklesIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import {useSuspenseQuery} from '@tanstack/react-query';
import {useState} from 'react';
import {pronounHints} from '../contants';
import {indefinitePatterns} from '../data/conjugation';
import {customVerbsQueryOptions} from '../hooks/useCustomVerbs';
import type {QuizQuestion} from '../types';
import {createQuizQuestion} from '../utils/createQuizQuestion';
import {buildConjugation, classNames} from '../utils/utils';

const QUIZ_LENGTH = 8;

export function QuizPage() {
  const {data: verbs} = useSuspenseQuery(customVerbsQueryOptions);
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion>(() => createQuizQuestion(verbs));
  const [quizSelection, setQuizSelection] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState({correct: 0, total: 0});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const quizAnswered = quizSelection !== null;
  const quizIsCorrect = quizSelection === quizQuestion.answer;

  // Get English pronoun and verb for the hint
  const pattern = indefinitePatterns.find((p) => p.pronoun === quizQuestion.pronoun);
  const englishPronoun = pattern?.english || '';
  const verbBase = quizQuestion.verb.english.replace(/^to /, '');
  const quizHint = `${pronounHints[quizQuestion.pronoun]} · ${englishPronoun} ${verbBase}`;

  const handleQuizPick = (option: string) => {
    if (quizAnswered || quizCompleted) return;
    setQuizSelection(option);
    setQuizScore((score) => {
      const next = {
        correct: score.correct + (option === quizQuestion.answer ? 1 : 0),
        total: score.total + 1,
      };
      if (next.total >= QUIZ_LENGTH) {
        setQuizCompleted(true);
      }
      return next;
    });
  };

  const handleQuizNext = () => {
    if (quizScore.total >= QUIZ_LENGTH) return;
    setQuizSelection(null);
    setQuizQuestion(createQuizQuestion(verbs));
  };

  const handleQuizReset = () => {
    setQuizSelection(null);
    setQuizQuestion(createQuizQuestion(verbs));
    setQuizScore({correct: 0, total: 0});
    setQuizCompleted(false);
  };

  return (
    <div className="panel">
      <section className="panel__section">
        <h2>
          <SparklesIcon aria-hidden="true" /> Quick Quiz
        </h2>
        <p className="section-intro">
          Pick the correct conjugated form. Each question mixes verbs and persons so you can
          practice recognition.
        </p>
        <div className="quiz">
          <div className="quiz__meta">
            <div>
              <div className="quiz__prompt">{quizQuestion.clue}</div>
              <div style={{fontSize: '0.9rem', color: '#6b7280', marginTop: '0.25rem'}}>
                {quizHint}
              </div>
            </div>
            <span className="quiz__score">
              {quizCompleted
                ? `Final score ${quizScore.correct}/${QUIZ_LENGTH}`
                : `Score ${quizScore.correct}/${quizScore.total}`}
            </span>
          </div>
          <div className="quiz__options">
            {quizQuestion.options.map((option) => {
              const selected = quizSelection === option;

              // Determine option status based on quiz state
              let status = 'idle';
              if (quizAnswered) {
                if (option === quizQuestion.answer) {
                  status = 'correct';
                } else if (selected) {
                  status = 'incorrect';
                }
              }

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
              );
            })}
          </div>
          {quizAnswered ? (
            <div className="quiz__feedback">
              {quizIsCorrect ? (
                <span className="quiz__feedback--good">
                  <CheckCircleIcon aria-hidden="true" /> Nagyszerű! (
                  {buildConjugation(quizQuestion.verb, quizQuestion.pronoun)})
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
    </div>
  );
}
