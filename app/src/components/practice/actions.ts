import { RatingType } from 'ts-fsrs';
import { Dispatch } from 'react';
import { Question } from '~/src/types';

export const INITIALIZE_QUIZ = 'initialize';
export const GET_FEEDBACK = 'get feedback';
export const ADVANCE = 'advance';
export const FINISH_QUIZ = 'finish quiz';
export const RESTART_QUIZ = 'restart quiz';

type InitializeAction = {
  type: typeof INITIALIZE_QUIZ;
  payload: { questions: Question[] };
};
type GetFeedbackAction = {
  type: typeof GET_FEEDBACK;
  payload: { time: number; ratingType: RatingType };
};
type AdvanceAction = { type: typeof ADVANCE };
type FinishQuizAction = { type: typeof FINISH_QUIZ };
type RestartQuizAction = { type: typeof RESTART_QUIZ };

export type Action =
  | InitializeAction
  | GetFeedbackAction
  | AdvanceAction
  | FinishQuizAction
  | RestartQuizAction;

export const initializeQuiz = ({
  dispatch,
  questions,
}: {
  dispatch: Dispatch<InitializeAction>;
  questions: Question[];
}) => {
  dispatch({ type: INITIALIZE_QUIZ, payload: { questions } });
};

export const getFeedback = ({
  dispatch,
  time,
  ratingType,
}: {
  dispatch: Dispatch<GetFeedbackAction>;
  time: number;
  ratingType: RatingType;
}) => {
  dispatch({ type: GET_FEEDBACK, payload: { time, ratingType } });
};

export const advance = ({
  dispatch,
}: {
  dispatch: Dispatch<AdvanceAction>;
}) => {
  dispatch({ type: ADVANCE });
};

export const finishQuiz = ({
  dispatch,
}: {
  dispatch: Dispatch<FinishQuizAction>;
}) => {
  dispatch({ type: FINISH_QUIZ });
};

export const restartQuiz = ({
  dispatch,
}: {
  dispatch: Dispatch<RestartQuizAction>;
}) => {
  dispatch({ type: RESTART_QUIZ });
};
