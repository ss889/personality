import { FC } from 'react';
import { motion } from 'framer-motion';
import { Option } from '@/types/quiz';

interface OptionButtonProps {
  option: Option;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export const OptionButton: FC<OptionButtonProps> = ({
  option,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onSelect}
      disabled={disabled}
      className={`
        w-full p-4 rounded-lg text-left font-semibold transition-all duration-200
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vibrant-purple
        ${
          isSelected
            ? 'bg-gradient-to-r from-vibrant-purple to-vibrant-pink text-white shadow-lg'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-center justify-between">
        <span>{option.text}</span>
        {isSelected && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </motion.svg>
        )}
      </div>
    </motion.button>
  );
};
