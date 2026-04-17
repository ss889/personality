import { FC, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/components/pages/HomePage';
import { QuizPage } from '@/components/pages/QuizPage';
import { ResultsPage } from '@/components/pages/ResultsPage';
import { QuizProvider } from '@/context/QuizContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Answer } from '@/types/quiz';
import {
  cleanupExpiredSessionState,
  loadSessionState,
  saveSessionState,
} from '@/utils/sessionState';

type PageType = 'home' | 'quiz' | 'results';

const APP_SESSION_KEY = 'spark-app-state';
const APP_SESSION_TTL_MS = 1000 * 60 * 60 * 12;

interface AppSessionState {
  selectedQuizId: string;
  completedAnswers: Answer[];
}

const isAnswerArray = (value: unknown): value is Answer[] =>
  Array.isArray(value) &&
  value.every((item) =>
    Boolean(
      item &&
      typeof item === 'object' &&
      typeof (item as Answer).questionId === 'string' &&
      Array.isArray((item as Answer).selectedOptionIds)
    )
  );

const isAppSessionState = (value: unknown): value is AppSessionState => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as AppSessionState;
  return typeof candidate.selectedQuizId === 'string' && isAnswerArray(candidate.completedAnswers);
};

const parseRouteFromHash = (): { page: PageType; quizId: string } => {
  const raw = window.location.hash.replace('#', '').trim();

  if (raw.startsWith('quiz/')) {
    const quizId = raw.slice('quiz/'.length);
    return { page: quizId ? 'quiz' : 'home', quizId };
  }

  if (raw === 'results') {
    return { page: 'results', quizId: '' };
  }

  return { page: 'home', quizId: '' };
};

const App: FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [completedAnswers, setCompletedAnswers] = useState<Answer[]>([]);
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);

  useEffect(() => {
    cleanupExpiredSessionState('spark-');

    const { page, quizId } = parseRouteFromHash();
    setCurrentPage(page);
    setSelectedQuizId(quizId);

    const saved = loadSessionState(APP_SESSION_KEY, isAppSessionState);
    if (!saved) {
      return;
    }

    if (saved.selectedQuizId && !quizId) {
      setSelectedQuizId(saved.selectedQuizId);
    }

    if (saved.completedAnswers.length > 0) {
      setCompletedAnswers(saved.completedAnswers);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = (): void => {
      const { page, quizId } = parseRouteFromHash();
      setCurrentPage(page);
      if (quizId) {
        setSelectedQuizId(quizId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (currentPage === 'results' && completedAnswers.length === 0) {
      setCurrentPage('home');
    }
  }, [currentPage, completedAnswers.length]);

  useEffect(() => {
    const hash =
      currentPage === 'quiz'
        ? `quiz/${selectedQuizId}`
        : currentPage === 'results'
          ? 'results'
          : 'home';

    if (window.location.hash !== `#${hash}`) {
      window.location.hash = hash;
    }
  }, [currentPage, selectedQuizId]);

  useEffect(() => {
    const payload: AppSessionState = {
      selectedQuizId,
      completedAnswers,
    };

    saveSessionState(APP_SESSION_KEY, payload, APP_SESSION_TTL_MS);
  }, [selectedQuizId, completedAnswers]);

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
    window.sessionStorage.removeItem(APP_SESSION_KEY);
  };

  const handleHeaderNavigate = (sectionId: string): void => {
    setTargetSectionId(sectionId);
    if (currentPage !== 'home') {
      setCurrentPage('home');
    }
  };

  const clearTargetSection = (): void => {
    setTargetSectionId(null);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QuizProvider>
          <Layout onNavigate={handleHeaderNavigate}>
            <AnimatePresence mode="wait">
              {currentPage === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  <HomePage
                    onQuizSelect={onQuizStart}
                    scrollToSectionId={targetSectionId}
                    onScrollComplete={clearTargetSection}
                  />
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
                    onExit={() => {
                      setCurrentPage('home');
                      setTargetSectionId('home-hero');
                    }}
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
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
