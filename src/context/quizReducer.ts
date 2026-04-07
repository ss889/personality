import { Answer, PersonalityResult, Quiz } from '@/types/quiz';

export type QuizAction =
  | { type: 'LOAD_QUIZ'; payload: Quiz }
  | { type: 'MOVE_TO_QUESTION'; payload: number }
  | { type: 'ANSWER_QUESTION'; payload: Answer }
  | { type: 'SET_RESULT'; payload: PersonalityResult }
  | { type: 'RESET_QUIZ' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export interface QuizState {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  answers: Answer[];
  result: PersonalityResult | null;
  loading: boolean;
  error: string | null;
}

export const initialState: QuizState = {
  currentQuiz: null,
  currentQuestionIndex: 0,
  answers: [],
  result: null,
  loading: false,
  error: null,
};

export const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'LOAD_QUIZ':
      return {
        ...state,
        currentQuiz: action.payload,
        currentQuestionIndex: 0,
        answers: [],
        error: null,
      };

    case 'MOVE_TO_QUESTION':
      return {
        ...state,
        currentQuestionIndex: action.payload,
      };

    case 'ANSWER_QUESTION': {
      const existingAnswerIndex = state.answers.findIndex(
        (a) => a.questionId === action.payload.questionId
      );
      const newAnswers =
        existingAnswerIndex >= 0
          ? state.answers.map((a, idx) =>
              idx === existingAnswerIndex ? action.payload : a
            )
          : [...state.answers, action.payload];

      return {
        ...state,
        answers: newAnswers,
      };
    }

    case 'SET_RESULT':
      return {
        ...state,
        result: action.payload,
      };

    case 'RESET_QUIZ':
      return initialState;

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
