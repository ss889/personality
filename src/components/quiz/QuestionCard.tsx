import { FC } from 'react';
import { motion } from 'framer-motion';
import { Question } from '@/types/quiz';
import { OptionButton } from './OptionButton';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onSelectOption: (optionId: string) => void;
  selectedOptionId?: string;
  isAnswered?: boolean;
}

export const QuestionCard: FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onSelectOption,
  selectedOptionId,
  isAnswered = false,
}) => {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto"
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-600">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-vibrant-purple to-vibrant-pink"
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-2xl font-bold text-gray-900 mb-8">{question.text}</h2>

      {/* Options */}
      <div className="space-y-4">
        {question.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            isSelected={selectedOptionId === option.id}
            onSelect={() => {
              if (!isAnswered) {
                onSelectOption(option.id);
              }
            }}
            disabled={isAnswered}
          />
        ))}
      </div>
    </motion.div>
  );
};
