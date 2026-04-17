import { Answer, PersonalityResult } from '@/types/quiz';

export type RecommendationSource = 'mcp' | 'static';

export interface RecommendationResult {
  result: PersonalityResult;
  source: RecommendationSource;
  confidence: number;
  fromCache: boolean;
}

interface CachedRecommendation {
  signature: string;
  result: PersonalityResult;
  source: RecommendationSource;
  confidence: number;
  savedAt: number;
}

interface McpRecommendationPayload {
  personalityType?: string;
  score?: number;
  description?: string;
  recommendations?: string[];
  traits?: Array<{ name?: string; strength?: number }>;
  confidence?: number;
}

const CACHE_PREFIX = 'spark-recommendation-cache:v1:';
const CACHE_TTL_MS = 1000 * 60 * 60;
const MIN_CONFIDENCE = 0.5;

const toSignature = (answers: Answer[]): string =>
  answers
    .slice()
    .sort((a, b) => a.questionId.localeCompare(b.questionId))
    .map((answer) => `${answer.questionId}:${answer.selectedOptionIds.slice().sort().join('|')}`)
    .join(';');

const toCacheKey = (signature: string): string => `${CACHE_PREFIX}${signature}`;

const toClampedStrength = (value: number): number => Math.max(0, Math.min(100, Math.round(value)));

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isValidTrait = (value: unknown): value is PersonalityResult['traits'][number] => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as PersonalityResult['traits'][number];
  return typeof candidate.name === 'string' && isFiniteNumber(candidate.strength);
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isValidPersonalityResult = (value: unknown): value is PersonalityResult => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as PersonalityResult;
  return (
    typeof candidate.personalityType === 'string' &&
    isFiniteNumber(candidate.score) &&
    typeof candidate.description === 'string' &&
    isStringArray(candidate.recommendations) &&
    Array.isArray(candidate.traits) &&
    candidate.traits.every(isValidTrait)
  );
};

const readCached = (signature: string): RecommendationResult | null => {
  const key = toCacheKey(signature);
  const raw = window.sessionStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as CachedRecommendation;
    const expired = Date.now() - parsed.savedAt > CACHE_TTL_MS;
    if (expired || parsed.signature !== signature || !isValidPersonalityResult(parsed.result)) {
      window.sessionStorage.removeItem(key);
      return null;
    }

    return {
      result: parsed.result,
      source: parsed.source,
      confidence: parsed.confidence,
      fromCache: true,
    };
  } catch {
    window.sessionStorage.removeItem(key);
    return null;
  }
};

const writeCached = (
  signature: string,
  recommendation: Omit<RecommendationResult, 'fromCache'>
): RecommendationResult => {
  const key = toCacheKey(signature);
  const payload: CachedRecommendation = {
    signature,
    result: recommendation.result,
    source: recommendation.source,
    confidence: recommendation.confidence,
    savedAt: Date.now(),
  };

  window.sessionStorage.setItem(key, JSON.stringify(payload));

  return {
    ...recommendation,
    fromCache: false,
  };
};

const sanitizeMcpResponse = (payload: McpRecommendationPayload): RecommendationResult | null => {
  if (!payload.personalityType || !isFiniteNumber(payload.score) || !payload.description?.trim()) {
    return null;
  }

  const recommendations = Array.isArray(payload.recommendations)
    ? payload.recommendations.filter((item): item is string => typeof item === 'string').slice(0, 5)
    : [];

  const traits = Array.isArray(payload.traits)
    ? payload.traits
        .filter((trait): trait is { name: string; strength: number } =>
          Boolean(trait && typeof trait.name === 'string' && typeof trait.strength === 'number')
        )
        .slice(0, 6)
        .map((trait) => ({ name: trait.name, strength: toClampedStrength(trait.strength) }))
    : [];

  const confidence = isFiniteNumber(payload.confidence)
    ? Math.max(0, Math.min(1, payload.confidence))
    : 0;

  if (confidence < MIN_CONFIDENCE) {
    return null;
  }

  return {
    source: 'mcp',
    confidence,
    fromCache: false,
    result: {
      personalityType: payload.personalityType.trim().toUpperCase(),
      score: toClampedStrength(payload.score),
      description: payload.description,
      recommendations,
      traits,
    },
  };
};

const fetchMcpRecommendation = async (answers: Answer[]): Promise<RecommendationResult | null> => {
  const endpoint = import.meta.env.VITE_MCP_RECOMMENDER_URL;
  if (typeof endpoint !== 'string' || endpoint.trim().length === 0) {
    return null;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as McpRecommendationPayload;
    return sanitizeMcpResponse(payload);
  } catch {
    return null;
  }
};

const buildStaticRecommendation = (answers: Answer[]): RecommendationResult => {
  const total = answers.reduce((sum, answer) => {
    const optionId = answer.selectedOptionIds[0] || '';
    const numeric = Number.parseInt(optionId.replace(/\D/g, ''), 10);
    return sum + (Number.isNaN(numeric) ? 3 : (numeric % 5) + 1);
  }, 0);

  const score = toClampedStrength((total / Math.max(answers.length, 1)) * 20);
  const personalityType = score > 75 ? 'VISIONARY' : score > 50 ? 'STRATEGIST' : 'EXPLORER';
  const description =
    personalityType === 'VISIONARY'
      ? 'You are bold, future-focused, and energized by opportunities. You naturally gravitate toward leadership and new ideas.'
      : personalityType === 'STRATEGIST'
        ? 'You balance ambition with practicality. You think ahead, communicate clearly, and execute with steady focus.'
        : 'You are curious, adaptable, and open-minded. You thrive when discovering new perspectives and experiences.';

  return {
    source: 'static',
    confidence: 0.78,
    fromCache: false,
    result: {
      personalityType,
      score,
      description,
      recommendations: [
        'Lean into environments that reward your natural strengths.',
        'Build routines that support your decision-making style.',
        'Collaborate with people whose strengths complement your own.',
      ],
      traits: [
        { name: 'Creativity', strength: Math.min(100, score + 5) },
        { name: 'Focus', strength: Math.max(30, score - 10) },
        { name: 'Empathy', strength: Math.min(95, 100 - Math.abs(70 - score)) },
        { name: 'Resilience', strength: Math.max(40, score - 5) },
      ],
    },
  };
};

export const getRecommendation = async (answers: Answer[]): Promise<RecommendationResult> => {
  const signature = toSignature(answers);

  const cached = readCached(signature);
  if (cached) {
    return cached;
  }

  const mcpResult = await fetchMcpRecommendation(answers);
  if (mcpResult) {
    return writeCached(signature, mcpResult);
  }

  return writeCached(signature, buildStaticRecommendation(answers));
};
