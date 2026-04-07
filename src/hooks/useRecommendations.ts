import { useCallback, useState } from 'react';
import { getRecommendations } from '@/utils/api';
import { Answer, PersonalityResult } from '@/types/quiz';

interface UseRecommendationsReturn {
  result: PersonalityResult | null;
  loading: boolean;
  error: string | null;
  generate: (answers: Answer[]) => Promise<void>;
}

export const useRecommendations = (): UseRecommendationsReturn => {
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (answers: Answer[]): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const recommendation = await getRecommendations(answers);
      setResult(recommendation);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error generating recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, generate };
};
