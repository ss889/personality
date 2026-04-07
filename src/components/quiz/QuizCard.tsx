import { FC, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Quiz } from '@/types/quiz';

interface QuizCardProps {
  quiz: Quiz;
  onClick?: () => void;
}

export const QuizCard: FC<QuizCardProps> = ({ quiz, onClick }) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -10, shadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-full transition-shadow hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vibrant-purple"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Start quiz: ${quiz.title}`}
    >
      <div className="pt-8 px-6 pb-4 bg-gradient-to-br from-vibrant-purple to-vibrant-pink h-32 relative">
        <div className="absolute inset-0 opacity-10 blob-shape" />
      </div>
      <div className="px-6 pb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{quiz.questions?.length || 0} questions</span>
          <button
            className="px-4 py-2 bg-vibrant-purple text-white rounded-lg hover:bg-vibrant-pink transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-vibrant-purple"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            Start
          </button>
        </div>
      </div>
    </motion.div>
  );
};
