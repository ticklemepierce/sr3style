import { useReducer, useEffect } from 'react';
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
import { RatingType } from 'ts-fsrs';
import { Link, useParams, useSearchParams } from '@remix-run/react';
import { SetType } from '~/src/types';
import { CloseButton } from '@chakra/close-button';
import { HStack, Center, Spinner, Flex } from '@chakra-ui/react';
import { FSRSProvider } from '~/src/context/fsrs';
import { getCardsReadyForReview } from '~/src/utils/cards';
import { useSessionContext } from '~/src/context/session';
import { sharedMeta } from '~/src/utils/meta';

export const meta = sharedMeta;

interface Params {
  setType: SetType;
}

export default function Quiz() {
  const { setType } = useParams<keyof Params>() as Params;
  const { learningCases } = useSessionContext();
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (state.quizState === 'loading') {
      const questions = getCardsReadyForReview({
        cards: learningCases?.[setType] ?? {},
        shuffle: true,
      });

      initializeQuiz({ dispatch, questions });
    }
  }, [learningCases]);

  return (
    <FSRSProvider>
      <Flex direction={'column'} height={'100vh'} width={'100vw'}>
        <HStack width={'100vw'} flexShrink={0}>
          <Link
            to={{
              pathname: `/`,
              search: searchParams.toString(),
            }}
          >
            <CloseButton />
          </Link>
          {state.showQuizProgress && (
            <QuizProgress
              questionNumber={
                state.isStartScreen ? 0 : state.questionIndex! + 1
              }
              totalQuestions={state.questions!.length}
            />
          )}
        </HStack>
        {state.quizState !== 'complete' && (
          <Center flex={1}>
            {state.quizState === 'loading' && <Spinner />}
            {state.quizState === 'question' && (
              <QuizQuestion
                setType={setType}
                question={state.question!}
                onAdvance={({
                  time,
                  ratingType,
                }: {
                  time: number;
                  ratingType: RatingType;
                }) => getFeedback({ dispatch, time, ratingType })}
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
          </Center>
        )}
        {state.quizState === 'complete' && (
          <QuizSummary results={state.results!} />
        )}
      </Flex>
    </FSRSProvider>
  );
}
