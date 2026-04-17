import { Answer, PersonalityResult, Quiz } from '@/types/quiz';

export type QuizAction =
  | { type: 'LOAD_QUIZ'; payload: Quiz }
  | { type: 'MOVE_TO_QUESTION'; payload: number }
  | { type: 'ANSWER_QUESTION'; payload: Answer }
  | {
      type: 'HYDRATE_PROGRESS';
      payload: { answers: Answer[]; currentQuestionIndex: number };
    }
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

const mergeAnswer = (answers: Answer[], nextAnswer: Answer): Answer[] => {
  const existingAnswerIndex = answers.findIndex((answer) => answer.questionId === nextAnswer.questionId);

  if (existingAnswerIndex >= 0) {
    return answers.map((answer, index) => (index === existingAnswerIndex ? nextAnswer : answer));
  }

  return [...answers, nextAnswer];
};

const clampQuestionIndex = (quiz: Quiz, questionIndex: number): number => {
  const maxIndex = quiz.questions.length - 1;
  return Math.max(0, Math.min(questionIndex, maxIndex));
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
      return {
        ...state,
        answers: mergeAnswer(state.answers, action.payload),
      };
    }

    case 'HYDRATE_PROGRESS': {
      if (!state.currentQuiz) {
        return state;
      }

      return {
        ...state,
        answers: action.payload.answers,
        currentQuestionIndex: clampQuestionIndex(state.currentQuiz, action.payload.currentQuestionIndex),
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
