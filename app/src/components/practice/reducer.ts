import { Question, Results } from '~/src/types';
import {
  INITIALIZE_QUIZ,
  ADVANCE,
  GET_FEEDBACK,
  FINISH_QUIZ,
  Action,
} from './actions';

export interface State {
  quizState: 'question' | 'feedback' | 'complete' | 'select';
  question?: Question;
  questions?: Question[];
  questionIndex?: number;
  isLastQuestion?: boolean;
  isStartScreen?: boolean;
  isLastSet?: boolean;
  showQuizProgress?: boolean;
  results?: Results;
}

export const getInitialState = (): State => ({
  quizState: 'select',
  showQuizProgress: false,
  isStartScreen: false,
});

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case INITIALIZE_QUIZ:
      return {
        ...state,
        quizState: 'feedback',
        isStartScreen: true,
        questions: action.payload.questions,
        questionIndex: -1, // TODO fix hack
        showQuizProgress: false,
        results: {},
      };
    case GET_FEEDBACK:
      state.results![state.question!.caseId] = {
        time: action.payload.time,
        ratingType: action.payload.ratingType,
      };

      return {
        ...state,
        quizState: 'feedback',
        isStartScreen: false,
        isLastQuestion: state.questions!.length === state.questionIndex! + 1,
        showQuizProgress: true,
      };
    case ADVANCE:
      return {
        ...state,
        quizState: 'question',
        question: state.questions![state.questionIndex! + 1],
        questionIndex: state.questionIndex! + 1,
        showQuizProgress: true,
        isStartScreen: false,
      };
    case FINISH_QUIZ:
      return {
        ...state,
        quizState: 'complete',
        showQuizProgress: false,
        isStartScreen: false,
      };
  }
};
