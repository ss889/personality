import { FC, useState, useEffect } from 'react';
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

  useEffect(() => {
    void loadQuiz(quizId);
  }, [quizId, loadQuiz]);

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
    answerQuestion(answer);
    setAnswered(true);
  };

  const handleNext = (): void => {
    if (isLastQuestion) {
      onComplete(answers);
    } else {
      moveToQuestion(currentQuestionIndex + 1);
      setAnswered(false);
    }
  };

  const handlePrevious = (): void => {
    moveToQuestion(currentQuestionIndex - 1);
    setAnswered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Exit Confirmation Dialog */}
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg p-8 max-w-sm mx-auto">
              <h3 className="text-xl font-bold mb-4">Exit Quiz?</h3>
              <p className="text-gray-600 mb-6">Your progress will be lost. Are you sure?</p>
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{currentQuiz.title}</h2>
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
        <div className="flex items-center justify-between pt-8">
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
          >
            {isLastQuestion ? 'See Results' : 'Next →'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
