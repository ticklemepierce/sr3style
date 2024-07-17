import type { MetaFunction } from '@remix-run/node';
import { useReducer, useEffect, useState, useCallback } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { reducer, getInitialState, State } from '~/src/components/quiz/reducer';
import { advance, finishQuiz, getFeedback, initializeCombinedQuiz, initializeQuiz, advanceToNextType } from '~/src/components/quiz/actions';
import { getCardReadyForReviewForCombinedQuiz, getCardsReadyForReview } from '~/src/utils/cards';
import { QuizQuestion } from '~/src/components/quiz/QuizQuestion';
import { QuizSummary } from '~/src/components/quiz/QuizSummary';
import { QuizFeedback } from '~/src/components/quiz/QuizFeedback';
import { QuizProgress } from '~/src/components/quiz/QuizProgress';
import { Rating } from 'ts-fsrs';
import { useParams } from "@remix-run/react";
import { SetType } from '~/src/types';

// https://remix.run/docs/en/main/route/meta
export const meta: MetaFunction = () => [
  { title: 'Remix Starter' },
  { name: 'description', content: 'Welcome to remix!' },
];

interface Params {
  type: SetType | 'combined';
}

// https://remix.run/docs/en/main/file-conventions/routes#basic-routes
export default function Quiz() {
  const { type } = useParams<keyof Params>() as Params;
  const [state, dispatch] = useReducer(reducer, getInitialState({ type }));

  // TODO move to loader
  useEffect(() => {
    if (type === 'combined') {
      const combinedSet = getCardReadyForReviewForCombinedQuiz();

      initializeCombinedQuiz({ dispatch, combinedSet });
    } else {
      const cards = getCardsReadyForReview({ type, shuffle: true });

      initializeQuiz({ dispatch, questions: cards, type });
    }
  }, []);

  const onAdvance = useCallback(() => {
    if (state.isCombinedQuiz && state.isLastQuestionOfType && !state.isLastSet) {
      return advanceToNextType({ dispatch });
    }
    return !state.isLastQuestionOfType ? advance({ dispatch }) : finishQuiz({ dispatch })
  }, [state.isCombinedQuiz, state.isLastQuestionOfType, state.isLastSet]);

  return (
    <>
      { state.showQuizProgress && <QuizProgress questionNumber={state.isStartScreen ? 0 : (state.questionIndex! + 1)} totalQuestions={state.questions!.length} />}
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        textAlign="center"
        justifyContent='center'
        sx={{ minHeight: '100vh' }}
      > 
        <Grid item xs={3}>
          { state.quizState === 'loading' && <CircularProgress /> }
          { state.quizState === 'question' && <QuizQuestion type={state.currentType} question={state.question} onAdvance={({ time, rating }: { time: number, rating: Rating }) => getFeedback({ dispatch, time, rating })} />}
          { state.quizState === 'feedback' && <QuizFeedback isLastQuestionOfType={state.isLastQuestionOfType!} isStartScreen={state.isStartScreen!} isLastSet={Boolean(state.isLastSet)} isCombinedQuiz={state.isCombinedQuiz} type={state.currentType} nextType={state.nextType!} onAdvance={onAdvance} /> }
          { state.quizState === 'complete' && <QuizSummary results={state.results!} />}
        </Grid>
      </Grid>
    </>
  );
}

