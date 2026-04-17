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
    'px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--app-accent)]';

  const variantClasses = {
    primary: 'bg-[linear-gradient(135deg,var(--app-accent-strong)_0%,var(--app-accent)_100%)] text-white hover:shadow-[0_14px_30px_var(--app-shadow)] focus-visible:outline-white',
    secondary: 'bg-[color:var(--app-control)] text-[color:var(--app-control-text)] hover:bg-[color:var(--app-control)]/80 hover:shadow-[0_10px_22px_var(--app-shadow)]',
    outline: 'border-2 border-[color:var(--app-border)] text-[var(--app-text)] hover:border-[color:var(--app-accent)] hover:bg-[color:var(--app-control)]/70 hover:shadow-[0_10px_22px_var(--app-shadow)]',
  };

  return (
    <motion.button
      type="button"
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
