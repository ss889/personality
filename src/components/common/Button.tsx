import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const baseClasses =
    'px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vibrant-purple';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-vibrant-purple to-vibrant-pink text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.6),0_0_40px_rgba(236,72,153,0.3)] focus-visible:outline-white',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 hover:shadow-[0_0_15px_rgba(0,0,0,0.1)]',
    outline: 'border-2 border-vibrant-purple text-vibrant-purple hover:bg-purple-50 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};
