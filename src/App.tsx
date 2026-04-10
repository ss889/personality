import { FC, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/components/pages/HomePage';
import { QuizPage } from '@/components/pages/QuizPage';
import { ResultsPage } from '@/components/pages/ResultsPage';
import { QuizProvider } from '@/context/QuizContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Answer } from '@/types/quiz';

type PageType = 'home' | 'quiz' | 'results';

const App: FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [completedAnswers, setCompletedAnswers] = useState<Answer[]>([]);

  const onQuizStart = (quizId: string): void => {
    setSelectedQuizId(quizId);
    setCurrentPage('quiz');
  };

  const handleQuizComplete = (answers: Answer[]): void => {
    setCompletedAnswers(answers);
    setCurrentPage('results');
  };

  const handleRetake = (): void => {
    setCurrentPage('home');
    setCompletedAnswers([]);
  };

  return (
    <ErrorBoundary>
      <QuizProvider>
        <Layout>
          <AnimatePresence mode="wait">
            {currentPage === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <HomePage onQuizSelect={onQuizStart} />
              </motion.div>
            )}
            {currentPage === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <QuizPage
                  quizId={selectedQuizId}
                  onComplete={handleQuizComplete}
                  onExit={() => setCurrentPage('home')}
                />
              </motion.div>
            )}
            {currentPage === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <ResultsPage answers={completedAnswers} onRetake={handleRetake} />
              </motion.div>
            )}
          </AnimatePresence>
        </Layout>
      </QuizProvider>
    </ErrorBoundary>
  );
};

export default App;
