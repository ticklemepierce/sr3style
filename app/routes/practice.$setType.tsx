import { useCallback, useReducer } from 'react';
import { reducer, getInitialState } from '~/src/components/practice/reducer';
import {
  advance,
  finishQuiz,
  getFeedback,
  initializeQuiz,
  restartQuiz,
} from '~/src/components/quiz/actions';
import { QuizQuestion } from '~/src/components/quiz/QuizQuestion';
import { QuizSummary } from '~/src/components/quiz/QuizSummary';
import { QuizFeedback } from '~/src/components/quiz/QuizFeedback';
import { QuizProgress } from '~/src/components/quiz/QuizProgress';
import { RatingType } from 'ts-fsrs';
import { Link, useParams, useSearchParams } from '@remix-run/react';
import { SetType } from '~/src/types';
import { CloseButton } from '@chakra/close-button';
import { HStack, Center, Flex, AbsoluteCenter } from '@chakra-ui/react';
import { FSRSProvider } from '~/src/context/fsrs';
import { sharedMeta } from '~/src/utils/meta';
import { PracticeSelector } from '~/src/components/practice/PracticeSelector';
import { useSessionContext } from '~/src/context/session';
import { createCardsForSets, shuffleCards } from '~/src/utils/cards';

export const meta = sharedMeta;

interface Params {
  setType: SetType;
}

export default function Practice() {
  const { settings, setTypeLetterSchemeMap } = useSessionContext();
  const { setType } = useParams<keyof Params>() as Params;
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const [searchParams] = useSearchParams();

  const startQuiz = useCallback((practiceSets: string[]) => {
    const cards = createCardsForSets({
      sets: practiceSets,
      autoAddInverse: settings.autoAddInverse,
      setTypeLetterSchemeMap,
      setType,
    });
    const questions = shuffleCards(cards);
    initializeQuiz({ dispatch, questions });
  }, []);

  if (state.quizState === 'complete') {
    return (
      <QuizSummary
        results={state.results!}
        onPracticeAgain={() => restartQuiz({ dispatch })}
      />
    );
  }

  return (
    <FSRSProvider>
      <Flex
        direction={'column'}
        height={'100vh'}
        width={'100vw'}
        overflowX={'hidden'}
      >
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
        {state.quizState === 'select' ? (
          <AbsoluteCenter axis={'horizontal'} mt={10}>
            <PracticeSelector setType={setType} startQuiz={startQuiz} />
          </AbsoluteCenter>
        ) : (
          <Center flex={1}>
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
                isPracticeMode
              />
            )}
            {state.quizState === 'feedback' && (
              <>
                <QuizFeedback
                  isLastQuestion={state.isLastQuestion!}
                  isStartScreen={state.isStartScreen!}
                  onAdvance={() =>
                    !state.isLastQuestion
                      ? advance({ dispatch })
                      : finishQuiz({ dispatch })
                  }
                />
              </>
            )}
          </Center>
        )}
      </Flex>
    </FSRSProvider>
  );
}
