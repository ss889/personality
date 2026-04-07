import { Quiz, Question, Option, Answer } from '@/types/quiz';

export const isValidQuiz = (quiz: unknown): quiz is Quiz => {
  if (!quiz || typeof quiz !== 'object') {
    return false;
  }

  const q = quiz as Record<string, unknown>;
  return (
    typeof q.id === 'string' &&
    typeof q.title === 'string' &&
    typeof q.description === 'string' &&
    Array.isArray(q.questions) &&
    q.questions.every(isValidQuestion)
  );
};

export const isValidQuestion = (question: unknown): question is Question => {
  if (!question || typeof question !== 'object') {
    return false;
  }

  const q = question as Record<string, unknown>;
  return (
    typeof q.id === 'string' &&
    typeof q.text === 'string' &&
    Array.isArray(q.options) &&
    q.options.every(isValidOption) &&
    (q.type === 'single' || q.type === 'multiple')
  );
};

export const isValidOption = (option: unknown): option is Option => {
  if (!option || typeof option !== 'object') {
    return false;
  }

  const o = option as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.text === 'string' &&
    typeof o.value === 'number'
  );
};

export const isValidAnswer = (answer: unknown): answer is Answer => {
  if (!answer || typeof answer !== 'object') {
    return false;
  }

  const a = answer as Record<string, unknown>;
  return (
    typeof a.questionId === 'string' &&
    Array.isArray(a.selectedOptionIds) &&
    a.selectedOptionIds.every((id) => typeof id === 'string')
  );
};

export const validateQuizAnswers = (quiz: Quiz, answers: Answer[]): boolean => {
  if (!quiz.questions) {
    return false;
  }

  return quiz.questions.every((question) =>
    answers.some((answer) => answer.questionId === question.id)
  );
};
