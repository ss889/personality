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
      className="relative max-w-3xl mx-auto overflow-hidden rounded-[2rem] border border-black/5 bg-white/95 p-6 shadow-[0_20px_60px_rgba(16,53,61,0.08)] md:p-8"
    >
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-vibrant-orange via-vibrant-pink to-vibrant-cyan" />

      {/* Progress Bar */}
      <div className="mb-8 pt-2">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-semibold uppercase tracking-[0.2em] text-gray-500">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="font-medium text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#eef2f6]">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-vibrant-purple to-vibrant-pink"
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6 inline-flex rounded-full bg-[#fff3e6] px-4 py-2 text-sm font-semibold text-[#9b531f]">
        Choose the answer that feels most like you
      </div>
      <h2 className="mb-8 text-2xl font-extrabold leading-tight text-gray-900 md:text-3xl">{question.text}</h2>

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
