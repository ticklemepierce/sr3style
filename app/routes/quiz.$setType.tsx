import type { MetaFunction } from '@remix-run/node';
import { useReducer, useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { reducer, getInitialState } from '~/src/components/quiz/reducer';
import {
  advance,
  finishQuiz,
  getFeedback,
  initializeQuiz,
} from '~/src/components/quiz/actions';
import { QuizQuestion } from '~/src/components/quiz/QuizQuestion';
import { QuizSummary } from '~/src/components/quiz/QuizSummary';
import { QuizFeedback } from '~/src/components/quiz/QuizFeedback';
import { QuizProgress } from '~/src/components/quiz/QuizProgress';
import { Rating } from 'ts-fsrs';
import { Link, useParams, useSearchParams } from '@remix-run/react';
import { SetType } from '~/src/types';
import CloseIcon from '@mui/icons-material/Close';
import { getCardsReadyForReview } from '~/src/utils/cards';
import { useSessionContext } from '~/src/context/session';

// https://remix.run/docs/en/main/route/meta
export const meta: MetaFunction = () => [
  { title: 'Remix Starter' },
  { name: 'description', content: 'Welcome to remix!' },
];

interface Params {
  setType: SetType;
}

// https://remix.run/docs/en/main/file-conventions/routes#basic-routes
export default function Quiz() {
  const { setType } = useParams<keyof Params>() as Params;
  const { setTypeMap } = useSessionContext();
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const questions = getCardsReadyForReview({
      cards: setTypeMap?.[setType] ?? {},
      shuffle: true,
    });

    initializeQuiz({ dispatch, questions });
  }, [setTypeMap]);

  return (
    <>
      <Link
        style={{ position: 'absolute', top: '15px', left: '15px' }}
        color={'gray'}
        to={{
          pathname: `/`,
          search: searchParams.toString(),
        }}
      >
        <CloseIcon htmlColor={'gray'} />
      </Link>
      {state.showQuizProgress && (
        <QuizProgress
          questionNumber={state.isStartScreen ? 0 : state.questionIndex! + 1}
          totalQuestions={state.questions!.length}
        />
      )}
      <Grid
        container
        spacing={0}
        direction={'column'}
        alignItems={'center'}
        textAlign={'center'}
        justifyContent={'center'}
        sx={{ minHeight: '100vh' }}
      >
        <Grid item xs={3}>
          {state.quizState === 'loading' && <CircularProgress />}
          {state.quizState === 'question' && (
            <QuizQuestion
              setType={setType}
              question={state.question!}
              onAdvance={({ time, rating }: { time: number; rating: Rating }) =>
                getFeedback({ dispatch, time, rating })
              }
            />
          )}
          {state.quizState === 'feedback' && (
            <QuizFeedback
              isLastQuestion={state.isLastQuestion!}
              isStartScreen={state.isStartScreen!}
              onAdvance={() =>
                !state.isLastQuestion
                  ? advance({ dispatch })
                  : finishQuiz({ dispatch })
              }
            />
          )}
          {state.quizState === 'complete' && (
            <QuizSummary results={state.results!} />
          )}
        </Grid>
      </Grid>
    </>
  );
}
