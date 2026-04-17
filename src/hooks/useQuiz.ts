import { useCallback } from 'react';
import { useQuizContext } from '@/context/QuizContext';
import { fetchQuizById } from '@/utils/api';
import { Answer, PersonalityResult, Quiz } from '@/types/quiz';

interface UseQuizReturn {
  currentQuestionIndex: number;
  answers: Answer[];
  result: PersonalityResult | null;
  loading: boolean;
  error: string | null;
  currentQuiz: Quiz | null;
  loadQuiz: (quizId: string) => Promise<void>;
  moveToQuestion: (questionIndex: number) => void;
  answerQuestion: (answer: Answer) => void;
  hydrateProgress: (answers: Answer[], questionIndex: number) => void;
  resetQuiz: () => void;
}

export const useQuiz = (): UseQuizReturn => {
  const { state, dispatch } = useQuizContext();

  const loadQuiz = useCallback(
    async (quizId: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const quiz = await fetchQuizById(quizId);
        dispatch({ type: 'LOAD_QUIZ', payload: quiz });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load quiz';
        dispatch({ type: 'SET_ERROR', payload: message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [dispatch]
  );

  const moveToQuestion = useCallback(
    (questionIndex: number) => {
      if (state.currentQuiz) {
        const maxIndex = state.currentQuiz.questions.length - 1;
        const clampedIndex = Math.max(0, Math.min(questionIndex, maxIndex));
        dispatch({ type: 'MOVE_TO_QUESTION', payload: clampedIndex });
      }
    },
    [dispatch, state.currentQuiz]
  );

  const answerQuestion = useCallback(
    (answer: Answer) => {
      dispatch({ type: 'ANSWER_QUESTION', payload: answer });
    },
    [dispatch]
  );

  const hydrateProgress = useCallback(
    (answers: Answer[], questionIndex: number) => {
      dispatch({
        type: 'HYDRATE_PROGRESS',
        payload: {
          answers,
          currentQuestionIndex: questionIndex,
        },
      });
    },
    [dispatch]
  );

  const resetQuiz = useCallback(() => {
    dispatch({ type: 'RESET_QUIZ' });
  }, [dispatch]);

  return {
    ...state,
    loadQuiz,
    moveToQuestion,
    answerQuestion,
    hydrateProgress,
    resetQuiz,
  };
};
