import { Quiz, Answer, PersonalityResult } from '@/types/quiz';
import { mockQuizzes } from '@/utils/mockQuizzes';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public originalError: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await fetch(`${BASE_URL}/quizzes`);
    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch quizzes: ${response.statusText}`,
        response.status,
        null
      );
    }
    const data = await response.json();
    return data.data || data;
  } catch {
    // Fall back to mock quizzes for development
    return mockQuizzes;
  }
};

export const fetchQuizById = async (id: string): Promise<Quiz> => {
  try {
    const response = await fetch(`${BASE_URL}/quizzes/${id}`);
    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch quiz: ${response.statusText}`,
        response.status,
        null
      );
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    // Fall back to mock quizzes for development
    const quiz = mockQuizzes.find((q) => q.id === id);
    if (quiz) {
      return quiz;
    }
    throw new ApiError(`Quiz not found: ${id}`, 404, error);
  }
};

export const getRecommendations = async (
  answers: Answer[]
): Promise<PersonalityResult> => {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return generateFallbackRecommendation(answers);
  }

  try {
    const prompt = buildRecommendationPrompt(answers);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new ApiError(
        `Groq API error: ${response.statusText}`,
        response.status,
        null
      );
    }

    const data = await response.json();
    return parseGroqResponse(data);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    return generateFallbackRecommendation(answers);
  }
};

const generateFallbackRecommendation = (answers: Answer[]): PersonalityResult => {
  const total = answers.reduce((sum, answer) => {
    const optionId = answer.selectedOptionIds[0] || '';
    const numeric = Number.parseInt(optionId.replace(/\D/g, ''), 10);
    return sum + (Number.isNaN(numeric) ? 3 : (numeric % 5) + 1);
  }, 0);

  const score = Math.min(100, Math.max(0, Math.round((total / Math.max(answers.length, 1)) * 20)));
  const personalityType = score > 75 ? 'VISIONARY' : score > 50 ? 'STRATEGIST' : 'EXPLORER';
  let description =
    'You are curious, adaptable, and open-minded. You thrive when discovering new perspectives and experiences.';

  if (personalityType === 'VISIONARY') {
    description =
      'You are bold, future-focused, and energized by opportunities. You naturally gravitate toward leadership and new ideas.';
  }

  if (personalityType === 'STRATEGIST') {
    description =
      'You balance ambition with practicality. You think ahead, communicate clearly, and execute with steady focus.';
  }

  return {
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
  };
};

export const buildRecommendationPrompt = (answers: Answer[]): string => {
  const answerSummary = answers
    .map((a) => `Question ${a.questionId}: Selected option ${a.selectedOptionIds[0]}`)
    .join('\n');

  return `Based on these quiz answers, generate a personality profile:
${answerSummary}

Provide a JSON response with this structure:
{
  "personalityType": "A 4-8 letter type code",
  "score": number between 0-100,
  "description": "2-3 sentence description",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "traits": [
    { "name": "trait name", "strength": number 0-100 },
    { "name": "trait name", "strength": number 0-100 }
  ]
}`;
};

export const parseGroqResponse = (data: unknown): PersonalityResult => {
  try {
    const responseData = data as { choices?: Array<{ message?: { content?: string } }> };
    const content = responseData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in response');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as PersonalityResult;
    return parsed;
  } catch (error) {
    console.error('Failed to parse Groq response:', error);
    // Return a fallback result
    return {
      personalityType: 'UNKNOWN',
      score: 0,
      description: 'Unable to generate personality profile. Please try again.',
      recommendations: [],
      traits: [],
    };
  }
};
