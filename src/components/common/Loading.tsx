import { FC } from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  message?: string;
}

export const Loading: FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-vibrant-purple border-t-vibrant-pink rounded-full"
      />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};
