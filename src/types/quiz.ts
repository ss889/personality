// Quiz types
export interface Quiz {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  questions: Question[];
  createdAt: Date;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  type: 'single' | 'multiple';
}

export interface Option {
  id: string;
  text: string;
  value: number;
}

export interface Answer {
  questionId: string;
  selectedOptionIds: string[];
}

export interface PersonalityResult {
  personalityType: string;
  score: number;
  description: string;
  recommendations: string[];
  traits: Trait[];
}

export interface Trait {
  name: string;
  strength: number; // 0-100
}

export interface QuizState {
  currentQuizId: string | null;
  currentQuestionIndex: number;
  answers: Answer[];
  result: PersonalityResult | null;
  loading: boolean;
  error: string | null;
}
