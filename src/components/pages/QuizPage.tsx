import { FC, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuiz } from '@/hooks/useQuiz';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { Answer } from '@/types/quiz';

interface QuizPageProps {
  quizId: string;
  onComplete: (answers: Answer[]) => void;
  onExit: () => void;
}

export const QuizPage: FC<QuizPageProps> = ({ quizId, onComplete, onExit }) => {
  const { currentQuiz, currentQuestionIndex, answers, loading, loadQuiz, moveToQuestion, answerQuestion } = useQuiz();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [answered, setAnswered] = useState(false);
  const advanceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    void loadQuiz(quizId);
  }, [quizId, loadQuiz]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  if (loading || !currentQuiz) {
    return <Loading message="Loading quiz..." />;
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);

  const handleSelectOption = (optionId: string): void => {
    const answer: Answer = {
      questionId: currentQuestion.id,
      selectedOptionIds: [optionId],
    };

    const nextAnswers = [
      ...answers.filter((existingAnswer) => existingAnswer.questionId !== currentQuestion.id),
      answer,
    ];

    answerQuestion(answer);
    setAnswered(true);

    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
    }

    advanceTimerRef.current = window.setTimeout(() => {
      if (isLastQuestion) {
        onComplete(nextAnswers);
        return;
      }

      moveToQuestion(currentQuestionIndex + 1);
      setAnswered(false);
    }, 220);
  };

  const handleNext = (): void => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    if (isLastQuestion) {
      const latestAnswer = answers.find((answer) => answer.questionId === currentQuestion.id);
      const nextAnswers = latestAnswer
        ? [
            ...answers.filter((answer) => answer.questionId !== currentQuestion.id),
            latestAnswer,
          ]
        : answers;

      onComplete(nextAnswers);
    } else {
      moveToQuestion(currentQuestionIndex + 1);
      setAnswered(false);
    }
  };

  const handlePrevious = (): void => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    moveToQuestion(currentQuestionIndex - 1);
    setAnswered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-6 md:py-8"
    >
      <div className="mx-auto max-w-5xl space-y-8 px-0 md:px-4">
        {/* Exit Confirmation Dialog */}
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          >
            <div className="mx-auto max-w-sm rounded-[1.75rem] bg-white p-8 shadow-[0_20px_60px_rgba(16,53,61,0.2)]">
              <h3 className="mb-4 text-xl font-bold text-gray-900">Exit quiz?</h3>
              <p className="mb-6 text-gray-600">Your progress will be lost. Are you sure?</p>
              <div className="flex gap-4">
                <Button variant="secondary" onClick={() => setShowExitConfirm(false)}>
                  Continue Quiz
                </Button>
                <Button variant="outline" onClick={onExit}>
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
            <h2 className="mt-1 text-2xl font-extrabold text-gray-900 md:text-3xl">{currentQuiz.title}</h2>
          </div>
          <Button variant="outline" onClick={() => setShowExitConfirm(true)}>
            ✕ Exit
          </Button>
        </div>

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          currentIndex={currentQuestionIndex}
          totalQuestions={currentQuiz.questions.length}
          onSelectOption={handleSelectOption}
          selectedOptionId={currentAnswer?.selectedOptionIds[0]}
          isAnswered={answered}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 md:pt-6">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </Button>

          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!answered}
            className="hidden"
          >
            {isLastQuestion ? 'See Results' : 'Next →'}
          </Button>
        </div>
        <p className="text-center text-sm text-gray-500">
          Answers move forward automatically. You can still go back if you want to change one.
        </p>
      </div>
    </motion.div>
  );
};
