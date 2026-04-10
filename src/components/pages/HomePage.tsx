import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizCard } from '@/components/quiz/QuizCard';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { Quiz } from '@/types/quiz';
import { fetchQuizzes } from '@/utils/api';

interface HomePageProps {
  onQuizSelect?: (quizId: string) => void;
  scrollToSectionId?: string | null;
  onScrollComplete?: () => void;
}

export const HomePage: FC<HomePageProps> = ({
  onQuizSelect,
  scrollToSectionId,
  onScrollComplete,
}) => {
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

  useEffect(() => {
    if (!scrollToSectionId) {
      return;
    }

    requestAnimationFrame(() => {
      const target = document.getElementById(scrollToSectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      onScrollComplete?.();
    });
  }, [scrollToSectionId, onScrollComplete]);

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
    <div className="space-y-16 scroll-mt-24">
      {/* Hero Section */}
      <motion.div
        id="home-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-16 md:px-12 md:py-20"
      >
        {/* Decorative elements */}
        <div className="absolute top-10 right-20 w-40 h-40 bg-vibrant-orange rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-32 h-32 bg-vibrant-cyan rounded-full opacity-10 blur-3xl" />
        
        {/* Content */}
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Where we empower you to embrace your <span className="text-vibrant-orange">unique</span> personality
            </h1>
            
            <p className="text-lg text-gray-300 mb-8">
              Unleash your full potential and discover insights that matter
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (quizzes.length > 0) {
                  onQuizSelect?.(quizzes[0].id);
                }
              }}
              className="px-8 py-3 bg-vibrant-orange text-white font-semibold rounded-lg mb-8 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all duration-300"
            >
              Start Test
            </motion.button>

            {/* Stats */}
            <div className="flex gap-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-3xl font-bold text-vibrant-orange">236+</div>
                <div className="text-sm text-gray-400">Tests Completed</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-3xl font-bold text-vibrant-cyan">98%</div>
                <div className="text-sm text-gray-400">User Satisfaction</div>
              </motion.div>
            </div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {['Self discovery', 'AI powered', 'Personal growth'].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 border border-gray-600 text-gray-300 text-sm rounded-full hover:border-vibrant-orange hover:text-vibrant-orange transition-colors duration-300"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Placeholder for Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden md:flex items-center justify-center"
          >
            <div className="relative w-64 h-64 bg-gradient-to-br from-vibrant-orange/20 to-vibrant-cyan/20 rounded-2xl flex items-center justify-center border border-vibrant-orange/30">
              <span className="text-6xl">🎯</span>
              {/* Decorative circles */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-vibrant-orange rounded-full" />
              <div className="absolute bottom-8 left-4 w-4 h-4 bg-vibrant-cyan rounded-full" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mission Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Our mission is to provide individuals with<br />
          <span className="bg-gradient-to-r from-vibrant-orange to-vibrant-pink bg-clip-text text-transparent">valuable insights into their personality</span>
        </h2>
      </motion.div>

      {/* Quiz Grid */}
      <div id="personality-types" className="scroll-mt-28">
        <h3 className="text-3xl font-bold text-gray-900 mb-8">Choose Your Quiz</h3>
        {loading ? (
          <SkeletonLoader count={3} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
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

      <motion.section
        id="teams"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="scroll-mt-28 rounded-3xl bg-white border border-gray-100 p-8 md:p-10 shadow-sm"
      >
        <h3 className="text-3xl font-bold text-gray-900 mb-4">For teams that care about people</h3>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Use personality insights for better communication, stronger collaboration, and healthier team dynamics.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Hiring fit', 'Team chemistry', 'Leadership growth'].map((item) => (
            <div key={item} className="rounded-2xl bg-gradient-to-br from-vibrant-cyan/15 to-vibrant-purple/10 p-5 border border-vibrant-cyan/20">
              <p className="text-gray-900 font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="resources"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="scroll-mt-28 rounded-3xl bg-gradient-to-r from-vibrant-orange/15 via-vibrant-pink/10 to-vibrant-cyan/15 border border-gray-100 p-8 md:p-10"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Resources to go deeper</h3>
            <p className="text-gray-700 max-w-2xl">
              Explore guides and frameworks to turn quiz outcomes into actionable growth plans.
            </p>
          </div>
          <motion.a
            href="#personality-types"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-vibrant-purple to-vibrant-pink transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.45)]"
          >
            Explore Quizzes
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
};
