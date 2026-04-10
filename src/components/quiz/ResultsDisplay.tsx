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
      className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_20px_60px_rgba(16,53,61,0.08)] md:p-8"
    >
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-vibrant-orange via-vibrant-pink to-vibrant-cyan" />

      {/* Personality Type */}
      <div className="mb-8 pt-2 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4 inline-flex rounded-full bg-[#fff3e6] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#9b531f]">
            Your result
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-vibrant-purple via-vibrant-pink to-vibrant-orange mb-3 md:text-5xl">
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
        <p className="text-lg leading-8 text-gray-700 mb-8">{result.description}</p>

        {/* Traits */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your traits</h3>
          {result.traits.map((trait, idx) => (
            <motion.div
              key={trait.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="rounded-2xl bg-[#f8fbff] p-4 ring-1 ring-black/5"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-700">{trait.name}</span>
                <span className="text-sm font-semibold text-gray-600">{trait.strength}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
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
