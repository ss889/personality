import { FC, useState, useEffect, useRef, type MutableRefObject } from 'react';
import { motion } from 'framer-motion';
import { useQuiz } from '@/hooks/useQuiz';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { Answer, Question } from '@/types/quiz';
import { loadSessionState, saveSessionState } from '@/utils/sessionState';

interface QuizPageProps {
  quizId: string;
  onComplete: (answers: Answer[]) => void;
  onExit: () => void;
}

interface StoredProgress {
  answers: Answer[];
  currentQuestionIndex: number;
}

interface QuizFlowSharedContext {
  isLastQuestion: boolean;
  answers: Answer[];
  currentQuestionId: string;
  currentQuestionIndex: number;
  onComplete: (answers: Answer[]) => void;
  moveToQuestion: (questionIndex: number) => void;
  setAnswered: (value: boolean) => void;
}

interface QuizPageController {
  currentQuizTitle: string;
  currentQuestion: NonNullable<ReturnType<typeof useQuiz>['currentQuiz']>['questions'][number] | null;
  currentQuestionIndex: number;
  currentQuestionCount: number;
  currentAnswerId?: string;
  loading: boolean;
  showExitConfirm: boolean;
  autoAdvance: boolean;
  answered: boolean;
  liveMessage: string;
  isReady: boolean;
  openExitConfirm: () => void;
  closeExitConfirm: () => void;
  toggleAutoAdvance: () => void;
  handleSelectOption: (optionId: string) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleExit: () => void;
}

interface QuizPageViewProps {
  controller: QuizPageController;
  currentQuestion: Question;
}

const getProgressStorageKey = (quizId: string): string => `spark-quiz-progress:${quizId}`;
const QUIZ_PROGRESS_TTL_MS = 1000 * 60 * 60 * 4;

const isStoredProgress = (value: unknown): value is StoredProgress => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as StoredProgress;
  return Array.isArray(candidate.answers) && typeof candidate.currentQuestionIndex === 'number';
};

const restoreQuizProgress = (
  storageKey: string,
  hydrateProgress: (answers: Answer[], questionIndex: number) => void,
  setLiveMessage: (message: string) => void
): void => {
  const saved = loadSessionState(storageKey, isStoredProgress);
  if (saved) {
    hydrateProgress(saved.answers, saved.currentQuestionIndex);
    setLiveMessage('Previous quiz progress restored.');
  }
};

const getNextAnswers = (answers: Answer[], questionId: string, selectedOptionId: string): Answer[] => [
  ...answers.filter((existingAnswer) => existingAnswer.questionId !== questionId),
  {
    questionId,
    selectedOptionIds: [selectedOptionId],
  },
];

const clearAdvanceTimer = (timerRef: MutableRefObject<number | null>): void => {
  if (timerRef.current !== null) {
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }
};

const scheduleNextQuestionAdvance = ({
  timerRef,
  isLastQuestion,
  nextAnswers,
  onComplete,
  moveToQuestion,
  currentQuestionIndex,
  setAnswered,
}: {
  timerRef: MutableRefObject<number | null>;
  isLastQuestion: boolean;
  nextAnswers: Answer[];
  onComplete: (answers: Answer[]) => void;
  moveToQuestion: (questionIndex: number) => void;
  currentQuestionIndex: number;
  setAnswered: (value: boolean) => void;
}): void => {
  clearAdvanceTimer(timerRef);

  timerRef.current = window.setTimeout(() => {
    if (isLastQuestion) {
      onComplete(nextAnswers);
      return;
    }

    moveToQuestion(currentQuestionIndex + 1);
    setAnswered(false);
  }, 220);
};

const submitSelectedAnswer = ({
  optionId,
  currentQuestionId,
  answers,
  answerQuestion,
  autoAdvance,
  isLastQuestion,
  timerRef,
  onComplete,
  moveToQuestion,
  currentQuestionIndex,
  setAnswered,
  setLiveMessage,
}: {
  optionId: string;
  currentQuestionId: string;
  answers: Answer[];
  answerQuestion: (answer: Answer) => void;
  autoAdvance: boolean;
  isLastQuestion: boolean;
  timerRef: MutableRefObject<number | null>;
  onComplete: (answers: Answer[]) => void;
  moveToQuestion: (questionIndex: number) => void;
  currentQuestionIndex: number;
  setAnswered: (value: boolean) => void;
  setLiveMessage: (message: string) => void;
}): void => {
  const answer = {
    questionId: currentQuestionId,
    selectedOptionIds: [optionId],
  } satisfies Answer;

  const nextAnswers = getNextAnswers(answers, currentQuestionId, optionId);
  answerQuestion(answer);

  if (!autoAdvance) {
    setLiveMessage('Answer saved. Use Next to continue.');
    return;
  }

  setAnswered(true);
  setLiveMessage(isLastQuestion ? 'Answer selected. Preparing your results.' : 'Answer selected. Moving to next question.');
  scheduleNextQuestionAdvance({
    timerRef,
    isLastQuestion,
    nextAnswers,
    onComplete,
    moveToQuestion,
    currentQuestionIndex,
    setAnswered,
  });
};

const getCurrentQuestionAnswers = (answers: Answer[], questionId: string): Answer[] => {
  const latestAnswer = answers.find((answer) => answer.questionId === questionId);
  return latestAnswer
    ? getNextAnswers(answers, questionId, latestAnswer.selectedOptionIds[0])
    : answers;
};

const continueFromNext = ({
  flow,
  progressStorageKey,
}: {
  flow: QuizFlowSharedContext;
  progressStorageKey: string;
}): void => {
  if (flow.isLastQuestion) {
    window.sessionStorage.removeItem(progressStorageKey);
    flow.onComplete(getCurrentQuestionAnswers(flow.answers, flow.currentQuestionId));
    return;
  }

  flow.moveToQuestion(flow.currentQuestionIndex + 1);
  flow.setAnswered(false);
};

const useQuizPageController = (
  quizId: string,
  onComplete: (answers: Answer[]) => void,
  onExit: () => void
): QuizPageController => {
  const {
    currentQuiz,
    currentQuestionIndex,
    answers,
    loading,
    loadQuiz,
    moveToQuestion,
    answerQuestion,
    hydrateProgress,
  } = useQuiz();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [liveMessage, setLiveMessage] = useState('');
  const advanceTimerRef = useRef<number | null>(null);
  const progressStorageKey = getProgressStorageKey(quizId);

  useEffect(() => {
    const initializeQuiz = async (): Promise<void> => {
      await loadQuiz(quizId);
      restoreQuizProgress(progressStorageKey, hydrateProgress, setLiveMessage);
    };

    void initializeQuiz();
  }, [quizId, loadQuiz, hydrateProgress, progressStorageKey]);

  useEffect(() => {
    return () => {
      clearAdvanceTimer(advanceTimerRef);
    };
  }, []);

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex] ?? null;
  const currentQuestionCount = currentQuiz?.questions.length ?? 0;
  const currentAnswer = currentQuestion
    ? answers.find((answer) => answer.questionId === currentQuestion.id)
    : undefined;
  const isReady = Boolean(!loading && currentQuiz && currentQuestion);

  useEffect(() => {
    setAnswered(Boolean(currentAnswer));
  }, [currentAnswer]);

  useEffect(() => {
    const data: StoredProgress = {
      answers,
      currentQuestionIndex,
    };

    saveSessionState(progressStorageKey, data, QUIZ_PROGRESS_TTL_MS);
  }, [answers, currentQuestionIndex, progressStorageKey]);

  const handleSelectOption = (optionId: string): void => {
    if (!currentQuestion) {
      return;
    }

    submitSelectedAnswer({
      optionId,
      currentQuestionId: currentQuestion.id,
      answers,
      answerQuestion,
      autoAdvance,
      isLastQuestion: Boolean(currentQuiz && currentQuestionIndex === currentQuiz.questions.length - 1),
      timerRef: advanceTimerRef,
      onComplete,
      moveToQuestion,
      currentQuestionIndex,
      setAnswered,
      setLiveMessage,
    });
  };

  const handleNext = (): void => {
    if (!currentQuestion) {
      return;
    }

    clearAdvanceTimer(advanceTimerRef);

    const flow: QuizFlowSharedContext = {
      isLastQuestion: Boolean(currentQuiz && currentQuestionIndex === currentQuiz.questions.length - 1),
      answers,
      currentQuestionId: currentQuestion.id,
      currentQuestionIndex,
      onComplete,
      moveToQuestion,
      setAnswered,
    };

    continueFromNext({
      flow,
      progressStorageKey,
    });
  };

  const handlePrevious = (): void => {
    clearAdvanceTimer(advanceTimerRef);
    moveToQuestion(currentQuestionIndex - 1);
    setAnswered(false);
  };

  const handleExit = (): void => {
    window.sessionStorage.removeItem(progressStorageKey);
    onExit();
  };

  return {
    currentQuizTitle: currentQuiz?.title ?? '',
    currentQuestion,
    currentQuestionIndex,
    currentQuestionCount,
    currentAnswerId: currentAnswer?.selectedOptionIds[0],
    loading,
    showExitConfirm,
    autoAdvance,
    answered,
    liveMessage,
    isReady,
    openExitConfirm: () => setShowExitConfirm(true),
    closeExitConfirm: () => setShowExitConfirm(false),
    toggleAutoAdvance: () => setAutoAdvance((prev) => !prev),
    handleSelectOption,
    handleNext,
    handlePrevious,
    handleExit,
  };
};

const QuizPageView: FC<QuizPageViewProps> = ({ controller, currentQuestion }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-6 md:py-8"
    >
      <div className="mx-auto max-w-5xl space-y-8 px-0 md:px-4">
        <p aria-live="polite" className="sr-only">
          {controller.liveMessage}
        </p>

        {/* Exit Confirmation Dialog */}
        {controller.showExitConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          >
            <div className="mx-auto max-w-sm rounded-[1.75rem] bg-white p-8 shadow-[0_20px_60px_rgba(16,53,61,0.2)]">
              <h3 className="mb-4 text-xl font-bold text-gray-900">Exit quiz?</h3>
              <p className="mb-6 text-gray-600">Your progress will be lost. Are you sure?</p>
              <div className="flex gap-4">
                <Button variant="secondary" onClick={controller.closeExitConfirm}>
                  Continue Quiz
                </Button>
                <Button variant="outline" onClick={controller.handleExit}>
                  Exit Quiz
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quiz Header */}
        <div className="flex flex-col gap-4 rounded-[1.75rem] bg-white/90 px-6 py-5 shadow-[0_14px_40px_rgba(16,53,61,0.06)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Quiz mode</p>
            <h2 className="mt-1 text-2xl font-extrabold text-gray-900 md:text-3xl">{controller.currentQuizTitle}</h2>
          </div>
          <Button variant="outline" onClick={controller.openExitConfirm}>
            ✕ Exit
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-white/80 px-5 py-3 shadow-[0_10px_26px_rgba(16,53,61,0.06)]">
          <p className="text-sm font-medium text-gray-600">Auto-advance after selecting an answer</p>
          <button
            type="button"
            role="switch"
            aria-checked={controller.autoAdvance}
            onClick={controller.toggleAutoAdvance}
            className={`relative h-7 w-12 rounded-full transition-colors ${controller.autoAdvance ? 'bg-[#123e47]' : 'bg-gray-300'}`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${controller.autoAdvance ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          currentIndex={controller.currentQuestionIndex}
          totalQuestions={controller.currentQuestionCount}
          onSelectOption={controller.handleSelectOption}
          selectedOptionId={controller.currentAnswerId}
          lockSelection={controller.autoAdvance && controller.answered}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 md:pt-6">
          <Button
            variant="secondary"
            onClick={controller.handlePrevious}
            disabled={controller.currentQuestionIndex === 0}
          >
            ← Previous
          </Button>

          <Button
            variant="primary"
            onClick={controller.handleNext}
            disabled={!controller.currentAnswerId}
            className={controller.autoAdvance ? 'hidden' : ''}
          >
            {controller.currentQuestionIndex === controller.currentQuestionCount - 1 ? 'See Results' : 'Next →'}
          </Button>
        </div>
        <p className="text-center text-sm text-gray-500">
          {controller.autoAdvance
            ? 'Answers move forward automatically. You can still go back if you want to change one.'
            : 'Manual mode is on. Select an answer and use Next to continue.'}
        </p>
      </div>
    </motion.div>
  );
};

export const QuizPage: FC<QuizPageProps> = ({ quizId, onComplete, onExit }) => {
  const controller = useQuizPageController(quizId, onComplete, onExit);

  if (controller.loading || !controller.isReady || !controller.currentQuestion) {
    return <Loading message="Loading quiz..." />;
  }

  return <QuizPageView controller={controller} currentQuestion={controller.currentQuestion} />;
};
