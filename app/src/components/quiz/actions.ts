import { Rating } from "ts-fsrs";
import { Questions, CombinedSet, SetType } from "~/src/types";

export const INITIALIZE_QUIZ = 'initialize';
export const initializeQuiz = ({ dispatch, questions }: { dispatch: Function, questions: Questions, type: SetType}) => {
  dispatch({ type: INITIALIZE_QUIZ, payload: { questions }});
}

export const INITIALIZE_COMBINED_QUIZ = 'initialize combined';
export const initializeCombinedQuiz = ({ dispatch, combinedSet }: { dispatch: Function, combinedSet: CombinedSet}) => {
  dispatch({ type: INITIALIZE_COMBINED_QUIZ, payload: { combinedSet }});
}


export const GET_FEEDBACK = 'get feedback';
export const getFeedback = ({ dispatch, time, rating }: { dispatch: Function, time: number, rating: Rating }) => {
  dispatch({ type: GET_FEEDBACK, payload: { time, rating } })
}

export const ADVANCE = 'advance';
export const advance = ({ dispatch }: { dispatch: Function }) => {
  dispatch({ type: ADVANCE })
}

export const ADVANCE_TO_NEXT_TYPE = 'advance to next type';
export const advanceToNextType = ({ dispatch }: { dispatch: Function }) => {
  dispatch({ type: ADVANCE_TO_NEXT_TYPE })
}

export const FINISH_QUIZ = 'finish quiz';
export const finishQuiz = ({ dispatch }: { dispatch: Function }) => {
  dispatch({ type: FINISH_QUIZ })
}