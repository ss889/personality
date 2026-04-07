import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizCard } from '@/components/quiz/QuizCard';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { Quiz } from '@/types/quiz';
import { fetchQuizzes } from '@/utils/api';

interface HomePageProps {
  onQuizSelect?: (quizId: string) => void;
}

export const HomePage: FC<HomePageProps> = ({ onQuizSelect }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuizzes = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchQuizzes();
        setQuizzes(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load quizzes';
        setError(message);
        console.error('Error loading quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    void loadQuizzes();
  }, []);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-vibrant-purple to-vibrant-pink text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-vibrant-purple via-vibrant-pink to-vibrant-orange bg-clip-text text-transparent">
          Discover Your Personality
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Take our AI-powered quizzes to understand yourself better. Get personalized insights in seconds.
        </p>
      </motion.div>

      {/* Quiz Grid */}
      {loading ? (
        <SkeletonLoader count={3} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onClick={() => onQuizSelect?.(quiz.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
