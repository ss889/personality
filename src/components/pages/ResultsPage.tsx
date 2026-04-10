import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Answer, PersonalityResult } from '@/types/quiz';
import { ResultsDisplay } from '@/components/quiz/ResultsDisplay';
import { ShareButtons } from '@/components/quiz/ShareButtons';
import { Button } from '@/components/common/Button';
import { useQuiz } from '@/hooks/useQuiz';
import { useRecommendations } from '@/hooks/useRecommendations';
import { Loading } from '@/components/common/Loading';

interface ResultsPageProps {
  answers: Answer[];
  onRetake: () => void;
}

export const ResultsPage: FC<ResultsPageProps> = ({ answers, onRetake }) => {
  const { currentQuiz } = useQuiz();
  const { result, loading, error, generate } = useRecommendations();
  const [selectedResult, setSelectedResult] = useState<PersonalityResult | null>(null);

  useEffect(() => {
    if (answers.length > 0) {
      void generate(answers);
    }
  }, [answers, generate]);

  useEffect(() => {
    if (result && !selectedResult) {
      setSelectedResult(result);
    }
  }, [result, selectedResult]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center"
      >
        <Loading message="Generating your personality insights..." />
      </motion.div>
    );
  }

  if (error || !selectedResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col items-center justify-center px-4"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error ? 'Something went wrong' : 'No results available'}
          </h2>
          <p className="text-gray-600 mb-8">
            {error || 'We couldn\'t generate your personality results. Please try again.'}
          </p>
          <Button onClick={onRetake} variant="primary">
            Retake Quiz
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-6 px-0 md:py-8"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10 text-center"
      >
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Results</p>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-vibrant-purple via-vibrant-pink to-vibrant-orange bg-clip-text text-transparent md:text-5xl">
          Your Personality Profile
        </h1>
        {currentQuiz && (
          <p className="text-lg text-gray-600">
            Based on <span className="font-semibold">{currentQuiz.title}</span>
          </p>
        )}
      </motion.div>

      {/* Main Results Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mx-auto mb-8 max-w-3xl px-0 md:px-0"
      >
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_20px_60px_rgba(16,53,61,0.08)] md:p-8">
          <ResultsDisplay result={selectedResult} />

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 border-t border-gray-200 pt-8"
          >
            <p className="mb-6 text-center font-semibold text-gray-600">Share your results</p>
            <ShareButtons result={selectedResult} />
          </motion.div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 flex flex-col justify-center gap-4 sm:flex-row"
      >
        <Button onClick={onRetake} variant="secondary">
          Retake Quiz
        </Button>
        <Button
          onClick={() => {
            onRetake();
            document.getElementById('home-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          variant="outline"
        >
          Back to Home
        </Button>
      </motion.div>
    </motion.div>
  );
};
