import { FC } from 'react';
import { motion } from 'framer-motion';
import { PersonalityResult } from '@/types/quiz';

interface ResultsDisplayProps {
  result: PersonalityResult;
}

export const ResultsDisplay: FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto"
    >
      {/* Personality Type */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-vibrant-purple to-vibrant-pink mb-2">
            {result.personalityType}
          </h2>
          <p className="text-lg text-gray-600">Score: {result.score}/100</p>
        </motion.div>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <p className="text-lg text-gray-700 mb-6">{result.description}</p>

        {/* Traits */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Traits</h3>
          {result.traits.map((trait, idx) => (
            <motion.div
              key={trait.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-700">{trait.name}</span>
                <span className="text-sm text-gray-600">{trait.strength}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${trait.strength}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + idx * 0.1 }}
                  className="h-full bg-gradient-to-r from-vibrant-purple to-vibrant-pink"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
