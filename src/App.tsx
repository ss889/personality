import { FC, useState } from 'react';
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
          {currentPage === 'home' && <HomePage onQuizSelect={onQuizStart} />}
          {currentPage === 'quiz' && (
            <QuizPage
              quizId={selectedQuizId}
              onComplete={handleQuizComplete}
              onExit={() => setCurrentPage('home')}
            />
          )}
          {currentPage === 'results' && (
            <ResultsPage answers={completedAnswers} onRetake={handleRetake} />
          )}
        </Layout>
      </QuizProvider>
    </ErrorBoundary>
  );
};

export default App;
