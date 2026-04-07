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
      className="min-h-screen py-12 px-4"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4">
          Your Personality Profile
        </h1>
        {currentQuiz && (
          <p className="text-xl text-gray-600">
            Based on <span className="font-semibold">{currentQuiz.title}</span>
          </p>
        )}
      </motion.div>

      {/* Main Results Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto mb-8"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <ResultsDisplay result={selectedResult} />

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-8 border-t border-gray-200"
          >
            <p className="text-center text-gray-600 font-semibold mb-6">Share your results</p>
            <ShareButtons result={selectedResult} />
          </motion.div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center gap-4 mt-12"
      >
        <Button onClick={onRetake} variant="secondary">
          Retake Quiz
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Back to Home
        </Button>
      </motion.div>
    </motion.div>
  );
};
