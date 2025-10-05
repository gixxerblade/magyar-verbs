import {
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { classNames, buildConjugation } from '../utils/utils';
import { useState } from 'react';
import { createQuizQuestion } from '../utils/createQuizQuestion';
import { QuizQuestion } from '../types';

const QUIZ_LENGTH = 8;

export function QuizPage() {
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion>(() => createQuizQuestion());
  const [quizSelection, setQuizSelection] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizCompleted, setQuizCompleted] = useState(false);
  const quizAnswered = quizSelection !== null;
  const quizIsCorrect = quizSelection === quizQuestion.answer;

  const handleQuizPick = (option: string) => {
    if (quizAnswered || quizCompleted) return;
    setQuizSelection(option);
    setQuizScore(score => {
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
    if (quizCompleted) return;
    setQuizSelection(null);
    setQuizQuestion(createQuizQuestion());
  };

  const handleQuizReset = () => {
    setQuizSelection(null);
    setQuizQuestion(createQuizQuestion());
    setQuizScore({ correct: 0, total: 0 });
    setQuizCompleted(false);
  };

  return (
    <div className='panel'>
      <section className='panel__section'>
        <h2>
          <SparklesIcon aria-hidden='true' /> Quick Quiz
        </h2>
        <p className='section-intro'>
          Pick the correct conjugated form. Each question mixes verbs and persons so you can
          practice recognition.
        </p>
        <div className='quiz'>
          <div className='quiz__meta'>
            <span className='quiz__prompt'>{quizQuestion.clue}</span>
            <span className='quiz__score'>
              {quizCompleted
                ? `Final score ${quizScore.correct}/${QUIZ_LENGTH}`
                : `Score ${quizScore.correct}/${quizScore.total}`}
            </span>
          </div>
          <div className='quiz__options'>
            {quizQuestion.options.map(option => {
              const selected = quizSelection === option;
              const status = quizAnswered
                ? option === quizQuestion.answer
                  ? 'correct'
                  : selected
                    ? 'incorrect'
                    : 'idle'
                : 'idle';

              return (
                <button
                  key={option}
                  type='button'
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
            <div className='quiz__feedback'>
              {quizIsCorrect ? (
                <span className='quiz__feedback--good'>
                  <CheckCircleIcon aria-hidden='true' /> Nagyszerű! (
                  {buildConjugation(quizQuestion.verb, quizQuestion.pronoun)})
                </span>
              ) : (
                <span className='quiz__feedback--bad'>
                  <XCircleIcon aria-hidden='true' /> The correct form is {quizQuestion.answer}.
                </span>
              )}
              {quizCompleted ? (
                <button type='button' className='quiz__next' onClick={handleQuizReset}>
                  <ArrowPathIcon aria-hidden='true' /> Retake quiz
                </button>
              ) : (
                <button type='button' className='quiz__next' onClick={handleQuizNext}>
                  <ArrowPathIcon aria-hidden='true' /> Next question
                </button>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
