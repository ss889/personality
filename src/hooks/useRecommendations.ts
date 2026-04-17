import { useCallback, useState } from 'react';
import { Answer, PersonalityResult } from '@/types/quiz';
import {
  getRecommendation,
  type RecommendationSource,
} from '@/services/recommendationService';

interface UseRecommendationsReturn {
  result: PersonalityResult | null;
  loading: boolean;
  error: string | null;
  source: RecommendationSource | null;
  confidence: number | null;
  fromCache: boolean;
  generate: (answers: Answer[]) => Promise<void>;
}

export const useRecommendations = (): UseRecommendationsReturn => {
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<RecommendationSource | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const generate = useCallback(async (answers: Answer[]): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const recommendation = await getRecommendation(answers);
      setResult(recommendation.result);
      setSource(recommendation.source);
      setConfidence(recommendation.confidence);
      setFromCache(recommendation.fromCache);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error generating recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    result,
    loading,
    error,
    source,
    confidence,
    fromCache,
    generate,
  };
};
