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

  // Color palette rotation for cards
  const colorSchemes = [
    { bg: 'from-vibrant-orange/20 to-vibrant-orange/10', border: 'border-vibrant-orange/30', accent: 'vibrant-orange' },
    { bg: 'from-vibrant-pink/20 to-vibrant-pink/10', border: 'border-vibrant-pink/30', accent: 'vibrant-pink' },
    { bg: 'from-vibrant-cyan/20 to-vibrant-cyan/10', border: 'border-vibrant-cyan/30', accent: 'vibrant-cyan' },
  ];
  
  const colorScheme = colorSchemes[Math.hash?.(quiz.id) % colorSchemes.length || 0] || colorSchemes[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      className={`relative bg-white rounded-2xl overflow-hidden cursor-pointer h-full transition-all duration-300 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vibrant-purple border ${colorScheme.border}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Start quiz: ${quiz.title}`}
    >
      {/* Top gradient bar */}
      <div className={`h-2 bg-gradient-to-r from-${colorScheme.accent} to-vibrant-purple`} />

      {/* Header with background */}
      <div className={`px-6 pt-8 pb-6 bg-gradient-to-br ${colorScheme.bg}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{quiz.title}</h3>
          </div>
          <span className={`text-3xl`}>✨</span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{quiz.description}</p>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {quiz.questions?.length || 0} Questions
            </span>
          </div>
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
            2-3 min
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full px-4 py-3 font-semibold rounded-lg transition-all duration-300 text-white bg-gradient-to-r from-${colorScheme.accent} to-vibrant-purple hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-vibrant-purple`}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          Start Test
        </motion.button>
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full opacity-50" />
    </motion.div>
  );
};
