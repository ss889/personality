import { FC } from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  count?: number;
  className?: string;
}

export const SkeletonLoader: FC<SkeletonLoaderProps> = ({
  count = 3,
  className = 'h-48',
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`${className} bg-gray-200 rounded-lg`}
        />
      ))}
    </div>
  );
};
