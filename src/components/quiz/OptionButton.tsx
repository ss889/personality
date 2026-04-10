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
      className={`group relative w-full overflow-hidden rounded-[1.4rem] border px-5 py-4 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vibrant-orange ${
        isSelected
          ? 'border-[#123e47] bg-[#123e47] text-white shadow-[0_16px_35px_rgba(16,53,61,0.18)]'
          : 'border-[#eadfce] bg-[#fffaf4] text-gray-900 hover:border-[#f4a328] hover:bg-white hover:shadow-[0_10px_26px_rgba(16,53,61,0.06)]'
      } ${disabled ? 'cursor-default opacity-75' : 'cursor-pointer'}`}
    >
      <div
        className={`absolute left-0 top-0 h-full w-1 transition-colors duration-300 ${
          isSelected ? 'bg-vibrant-orange' : 'bg-transparent group-hover:bg-vibrant-orange/70'
        }`}
      />
      <div className="flex items-center justify-between">
        <span className="pr-4 text-[1rem] leading-6 font-semibold">{option.text}</span>
        {isSelected && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="h-5 w-5 flex-shrink-0 text-vibrant-orange"
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
