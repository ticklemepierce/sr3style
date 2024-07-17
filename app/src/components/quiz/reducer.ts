import { CombinedSet, Question, Questions, Results, SetType } from "~/src/types";
import { INITIALIZE_QUIZ, INITIALIZE_COMBINED_QUIZ, ADVANCE, GET_FEEDBACK, FINISH_QUIZ, ADVANCE_TO_NEXT_TYPE } from "./actions";
import { Rating, RatingType } from "ts-fsrs";
import { setTypes } from "~/src/utils/constants";

type Advance = { type: typeof ADVANCE }
type AdvanceToNextType = { type: typeof ADVANCE_TO_NEXT_TYPE }
type InitializeQuiz = { type: typeof INITIALIZE_QUIZ, payload: { questions: Questions, type: SetType }}
type InitializeCombinedQuiz = { type: typeof INITIALIZE_COMBINED_QUIZ, payload: { combinedSet: CombinedSet }}
type GetFeedback = { type: typeof GET_FEEDBACK, payload: { time: number, rating: RatingType }}
type Complete = { type: typeof FINISH_QUIZ }

type Action = Advance | AdvanceToNextType | InitializeQuiz | InitializeCombinedQuiz | GetFeedback | Complete;

export interface State {
  quizState: 'loading' | 'question' | 'feedback' | 'complete',
  question?: Question,
  questions?: Question[],
  combinedSet?: CombinedSet,
  currentType: SetType,
  nextType?: SetType,
  questionIndex?: number,
  setIndex?: number,
  isLastQuestionOfType?: boolean,
  isCombinedQuiz: boolean,
  isStartScreen?: boolean,
  isLastSet?: boolean,
  showQuizProgress?: boolean,
  results?: Results,
}

export const getInitialState = ({ type }: { type: SetType | 'combined' }): State => ({
  quizState: 'loading',
  showQuizProgress: false,
  isStartScreen: false,
  currentType: type === 'combined' ? setTypes[0] : type,
  isCombinedQuiz: type === 'combined',
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
        showQuizProgress: true,
        results: {},
      }
    case INITIALIZE_COMBINED_QUIZ:
      return {
        ...state,
        quizState: 'feedback',
        isStartScreen: true,
        isCombinedQuiz: true,
        combinedSet: action.payload.combinedSet,
        questions: action.payload.combinedSet[state.currentType],
        setIndex: 0,
        questionIndex: -1, // TODO fix hack
        showQuizProgress: true,
        results: {},
      }
    case GET_FEEDBACK:
      state.results![state.question.pair] = {
        time: action.payload.time,
        rating: Rating[action.payload.rating],
      }

      // TODO fix isLastSet bug
      const isLastQuestionOfType = state.questions!.length === (state.questionIndex! + 1);
      const isLastSet = setTypes.length === state.setIndex! + 1;

      if (isLastQuestionOfType && !isLastSet) {
        state.nextType = setTypes[state.setIndex! + 1];
      }
  
      return {
        ...state,
        quizState: 'feedback',
        isStartScreen: false,
        isLastQuestionOfType,
        isLastSet,
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
    case ADVANCE_TO_NEXT_TYPE:
      const newQuestions = state.combinedSet![state.nextType!];

      return {
        ...state,
        quizState: 'question',
        questions: newQuestions,
        question: newQuestions[0],
        currentType: state.nextType!,
        nextType: undefined,
        questionIndex: 0,
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
}


