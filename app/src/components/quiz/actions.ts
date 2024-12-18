import { Rating } from 'ts-fsrs';
import { Dispatch } from 'react';
import { Questions } from '~/src/types';

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Action = { type: any; payload?: any };

export const INITIALIZE_QUIZ = 'initialize';
export const initializeQuiz = ({
  dispatch,
  questions,
}: {
  dispatch: Dispatch<Action>;
  questions: Questions;
}) => {
  dispatch({ type: INITIALIZE_QUIZ, payload: { questions } });
};

export const GET_FEEDBACK = 'get feedback';
export const getFeedback = ({
  dispatch,
  time,
  rating,
}: {
  dispatch: Dispatch<Action>;
  time: number;
  rating: Rating;
}) => {
  dispatch({ type: GET_FEEDBACK, payload: { time, rating } });
};

export const ADVANCE = 'advance';
export const advance = ({ dispatch }: { dispatch: Dispatch<Action> }) => {
  dispatch({ type: ADVANCE });
};

export const ADVANCE_TO_NEXT_TYPE = 'advance to next type';
export const advanceToNextType = ({
  dispatch,
}: {
  dispatch: Dispatch<Action>;
}) => {
  dispatch({ type: ADVANCE_TO_NEXT_TYPE });
};

export const FINISH_QUIZ = 'finish quiz';
export const finishQuiz = ({ dispatch }: { dispatch: Dispatch<Action> }) => {
  dispatch({ type: FINISH_QUIZ });
};
