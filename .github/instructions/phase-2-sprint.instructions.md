---
name: phase-2-sprint
description: "Phase 2 Sprint Documentation. 4 sprints (30-45 min each), task breakdown, time estimates, success criteria, expert guidance, and QA checklist"
---

# Phase 2: Sprint Documentation

## Sprint Overview

**Total Duration**: 2-3 hours (4 sprints across one coding session)

| Sprint | Duration | Focus | Expert |
|--------|----------|-------|--------|
| **Sprint 1** | 30 min | Setup → Components | Dan Abramov |
| **Sprint 2** | 45 min | State & Interactions | Josh Comeau |
| **Sprint 3** | 45 min | API & Data Flow | Tanner Linsley |
| **Sprint 4** | 30 min | Polish & Responsive | Adam Wathan |

---

## Sprint 1: Project Setup & Component Scaffolding (30 min)

**Expert Guidance**: Dan Abramov (architecture clarity, React patterns)

### Objectives
- ✅ Install dependencies
- ✅ Create folder structure
- ✅ Scaffold main components
- ✅ Set up data context
- ✅ Verify linting passes

### Tasks

#### 1.1 Install Dependencies (5 min)
```bash
npm install
npm run build  # Verify no errors
```
**Success**: No dependency conflicts, build succeeds

#### 1.2 Create Folder Structure (5 min)
```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── QuizPage.tsx
│   │   └── ResultsPage.tsx
│   ├── quiz/
│   │   ├── QuizCard.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── OptionButton.tsx
│   │   ├── ResultsDisplay.tsx
│   │   └── ShareButtons.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Loading.tsx
│       ├── ErrorBoundary.tsx
│       └── SkeletonLoader.tsx
├── hooks/
│   ├── useQuiz.ts
│   └── useRecommendations.ts
├── context/
│   └── QuizContext.tsx
├── utils/
│   ├── api.ts
│   └── validation.ts
├── styles/
│   └── index.css (already exists)
├── types/
│   └── quiz.ts (already exists)
├── App.tsx (already exists)
└── main.tsx (already exists)
```

**Success**: Folder structure created, empty component files exist

#### 1.3 Scaffold Component Files (10 min)
Each component follows this pattern:

```typescript
// components/common/Button.tsx
import { FC, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};
```

**Success**: All component files created with proper TypeScript interfaces, linter passes

#### 1.4 Create Context & Custom Hooks (7 min)

**Context** (`context/QuizContext.tsx`):
```typescript
import { createContext, useContext, ReactNode, FC } from 'react';
import { QuizState } from '@/types/quiz';

interface QuizContextType {
  state: QuizState;
  dispatch: (action: QuizAction) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within QuizProvider');
  }
  return context;
};
```

**Success**: Context created with proper error boundaries

#### 1.5 Linting & TypeScript Check (3 min)
```bash
npm run lint
npm run type-check
```

**Success**: 0 lint errors, 0 TypeScript errors

### Success Criteria for Sprint 1

- [ ] All dependencies installed without errors
- [ ] Folder structure matches spec above
- [ ] All component files created with proper TypeScript interfaces
- [ ] Context setup complete with useQuizContext hook
- [ ] Linter passes (0 errors)
- [ ] TypeScript compilation succeeds (no type errors)
- [ ] SOLID check: Each component has single responsibility

### Uncle Bob Checklist (Sprint 1)

- [ ] No SOLID violations in component structure
- [ ] Names are clear (`QuizCard`, not `Card` or `QuizDisplay`)
- [ ] No magic strings/numbers
- [ ] Error handling for context (proper error boundary)
- [ ] No commented-out code

---

## Sprint 2: State Management & Core Interactions (45 min)

**Expert Guidance**: Josh Comeau (component design, animations, delightful UX)

### Objectives
- ✅ Implement Quiz state reducer
- ✅ Build HomePage with quiz cards
- ✅ Build QuestionCard component
- ✅ Implement quiz navigation
- ✅ Add smooth transitions

### Tasks

#### 2.1 Quiz State Reducer (10 min)

```typescript
// context/quizReducer.ts
import { QuizState, Answer } from '@/types/quiz';

export type QuizAction =
  | { type: 'LOAD_QUIZ'; payload: string }
  | { type: 'MOVE_TO_QUESTION'; payload: number }
  | { type: 'ANSWER_QUESTION'; payload: Answer }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'LOAD_QUIZ':
      return { ...state, currentQuizId: action.payload };
    case 'MOVE_TO_QUESTION':
      return { ...state, currentQuestionIndex: action.payload };
    case 'ANSWER_QUESTION':
      return {
        ...state,
        answers: [...state.answers, action.payload],
      };
    // ... more cases
    default:
      return state;
  }
};

export const initialState: QuizState = {
  currentQuizId: null,
  currentQuestionIndex: 0,
  answers: [],
  result: null,
  loading: false,
  error: null,
};
```

**Success**: Reducer handles all actions, TypeScript strict mode passes

#### 2.2 HomePage Component (15 min)

- Fetch quizzes on mount
- Display 3 quiz cards in grid
- Add loading skeleton
- Handle error state

```typescript
// components/pages/HomePage.tsx
export const HomePage: FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes()
      .then(setQuizzes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
};
```

**Success**: Quiz cards render, loading/error states work, responsive grid

#### 2.3 QuestionCard Component (10 min)

- Display question text
- Render option buttons
- Handle click/selection
- Show progress

```typescript
// components/quiz/QuestionCard.tsx
interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onSelectOption: (optionId: string) => void;
  selectedOptionId?: string;
}

export const QuestionCard: FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onSelectOption,
  selectedOptionId,
}) => {
  return (
    <div className="question-card">
      <div className="progress">
        {currentIndex + 1} / {totalQuestions}
      </div>
      <h2 className="question-text">{question.text}</h2>
      <div className="options">
        {question.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            isSelected={selectedOptionId === option.id}
            onSelect={() => onSelectOption(option.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

**Success**: Question renders with all options, selection works

#### 2.4 Quiz Navigation (7 min)

- Previous/Next buttons
- Quiz page transitions
- Prevent accidental exit

**Success**: Navigation between questions works, exit confirmation present

#### 2.5 Add Framer Motion Animations (3 min)

```typescript
import { motion } from 'framer-motion';

// Fade in: New question appears
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <QuestionCard {...props} />
</motion.div>

// Slide: Answer option selection
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Option
</motion.button>
```

**Success**: Animations smooth, 60 FPS, no jank

### Success Criteria for Sprint 2

- [ ] Quiz reducer handles all actions
- [ ] HomePage displays quizzes (or loading skeleton)
- [ ] QuestionCard renders with all options
- [ ] Navigation between questions works
- [ ] Animations are smooth (no layout shifts)
- [ ] Error boundaries catch errors gracefully
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] 80%+ component tests pass

### Uncle Bob Checklist (Sprint 2)

- [ ] Each component has single responsibility
- [ ] No props drilling (> 3 levels deep)
- [ ] Custom hooks extract reusable logic
- [ ] No side effects in render
- [ ] Error handling explicit (try/catch, error states)
- [ ] Tests exist for reducer logic

---

## Sprint 3: API Integration & Data Fetching (45 min)

**Expert Guidance**: Tanner Linsley (data fetching, query patterns, caching)

### Objectives
- ✅ Create API utilities
- ✅ Implement Groq integration for recommendations
- ✅ Handle API errors gracefully
- ✅ Add loading/success/error states
- ✅ Mock API for testing

### Tasks

#### 3.1 API Utilities (10 min)

```typescript
// utils/api.ts
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const BASE_URL = '/api';

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
    return response.json();
  } catch (error) {
    throw new ApiError(
      'Network error fetching quizzes',
      0,
      error
    );
  }
};

export const getRecommendations = async (
  answers: Answer[]
): Promise<PersonalityResult> => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: buildRecommendationPrompt(answers),
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
    throw new ApiError(
      'Failed to get recommendations',
      0,
      error
    );
  }
};
```

**Success**: API utilities handle errors, have proper types

#### 3.2 Custom Hook: useRecommendations (10 min)

```typescript
// hooks/useRecommendations.ts
export const useRecommendations = () => {
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (answers: Answer[]) => {
    setLoading(true);
    setError(null);
    try {
      const recommendation = await getRecommendations(answers);
      setResult(recommendation);
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, generate };
};
```

**Success**: Hook properly manages async state, error handling

#### 3.3 Implement ResultsPage (15 min)

```typescript
// components/pages/ResultsPage.tsx
export const ResultsPage: FC = () => {
  const { state } = useQuizContext();
  const { result, loading, error } = useRecommendations();

  useEffect(() => {
    if (state.answers.length > 0) {
      // Would call generate() here when quiz completes
    }
  }, [state.answers]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!result) return <div>No results</div>;

  return (
    <div className="results-page">
      <PersonalityDisplay result={result} />
      <RecommendationsList recommendations={result.recommendations} />
      <ShareButtons result={result} />
      <Button onClick={() => window.location.reload()}>
        Retake Quiz
      </Button>
    </div>
  );
};
```

**Success**: Results display correctly, error handling works, sharing ready

#### 3.4 Mock API for Testing (7 min)

```typescript
// utils/mocks.ts
export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'What\'s Your Personality Type?',
    description: 'Discover your personality across dimensions',
    imageUrl: '/quiz-1.jpg',
    questions: mockQuestions,
    createdAt: new Date(),
  },
];

export const mockResult: PersonalityResult = {
  personalityType: 'ENFP',
  score: 87,
  description: 'You\'re a spontaneous, creative extrovert...',
  recommendations: ['Try improv', 'Join a social club'],
  traits: [
    { name: 'Extroversion', strength: 92 },
  ],
};
```

**Success**: Mocks available for testing and development

### Success Criteria for Sprint 3

- [ ] API utilities properly handle errors
- [ ] Groq integration tested (success + error paths)
- [ ] useRecommendations hook works correctly
- [ ] ResultsPage displays results
- [ ] Mock API available for testing
- [ ] All API calls have proper error boundaries
- [ ] Loading states visible during API calls
- [ ] Network errors don't crash the app

### Uncle Bob Checklist (Sprint 3)

- [ ] Error handling explicit with custom error classes
- [ ] No error swallowing (errors logged properly)
- [ ] API functions are pure and testable
- [ ] Hooks follow React rules
- [ ] No tight coupling between components and API
- [ ] Tests mock API calls (don't call real API in tests)

---

## Sprint 4: Polish, Animations & Final QA (30 min)

**Expert Guidance**: Adam Wathan (utility-first styling, design systems, responsive)

### Objectives
- ✅ Apply final Tailwind styling
- ✅ Ensure responsive across all breakpoints
- ✅ Add Framer Motion polish animations
- ✅ Accessibility audit (keyboard nav, screen reader)
- ✅ Performance optimization
- ✅ Final bug fixes

### Tasks

#### 4.1 Responsive Design Polish (10 min)

- Mobile (375px): Stack vertically, large touch targets
- Tablet (768px): 2-column layout
- Desktop (1440px): Full experience

```typescript
// Example: QuizCard responsive
export const QuizCard: FC<QuizCardProps> = ({ quiz }) => {
  return (
    <motion.div
      className="
        w-full h-full
        sm:max-w-sm
        md:max-w-md
        bg-white rounded-lg shadow-lg
        hover:shadow-xl transition-shadow
        p-4 sm:p-6
      "
    >
      {/* Content */}
    </motion.div>
  );
};
```

**Success**: All breakpoints responsive, no horizontal scroll on mobile

#### 4.2 Animation Polish (8 min)

- Page transitions (fade in/out)
- Button hover states
- Quiz option selection (scale + color)
- Results reveal (staggered animation)

```typescript
// Staggered results reveal
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ staggerChildren: 0.1 }}
>
  {recommendations.map((rec, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {rec}
    </motion.div>
  ))}
</motion.div>
```

**Success**: Animations smooth, respects `prefers-reduced-motion`

#### 4.3 Accessibility Audit (8 min)

- [ ] Tab navigation works end-to-end
- [ ] Focus indicators visible
- [ ] Screen reader announces: questions, options, results
- [ ] Color contrast >= 4.5:1
- [ ] Keyboard shortcuts for common actions (Enter to submit)

```typescript
// Example: Keyboard support
<button
  onClick={handleAnswer}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAnswer();
    }
  }}
>
  Option
</button>
```

**Success**: Keyboard navigable, screen reader compatible

#### 4.4 Performance Check (3 min)

```bash
npm run build
# Check bundle size < 250KB gzipped
# Check Lighthouse >= 90
```

**Success**: Build succeeds, bundle size acceptable, Lighthouse high score

#### 4.5 Final Test & Bug Fixes (1 min)

- Play through full quiz flow
- Test error states
- Verify animations smooth
- Check mobile layout

**Success**: No blockers, ready for Phase 7 final QA

### Success Criteria for Sprint 4

- [ ] Responsive design passes all breakpoints
- [ ] Animations smooth (60 FPS)
- [ ] Accessibility audit passes (keyboard, screen reader)
- [ ] Color contrast >= WCAG AA
- [ ] Bundle size < 250KB gzipped
- [ ] Lighthouse score >= 90
- [ ] No console errors
- [ ] End-to-end flow works perfectly

### Uncle Bob Checklist (Sprint 4)

- [ ] No hardcoded responsive values (use Tailwind)
- [ ] No duplicate CSS classes (DRY)
- [ ] Animation library used consistently
- [ ] Accessibility not an afterthought (built in)
- [ ] Performance not sacrificed for features
- [ ] No technical debt left

---

## Transition: Phases 3-6 During Implementation

During actual coding (Phases 3-6), follow this rhythm:

1. **Start sprint**: Read sprint brief
2. **Implement**: Follow expert guidance, apply SOLID/clean code
3. **Test**: Run tests, linter, type-check
4. **Review**: Self-review against Uncle Bob checklist
5. **Commit**: Only commit when all checks pass

### Between Sprints

- 5-minute rest
- Verify previous sprint passed all tests
- Staging review (run app locally, spot-check features)

---

## QA Checklist - Sprint Doc Phase

- [ ] 4 sprints fit into 2-3 hour window (30+45+45+30=150 min)
- [ ] Each sprint has clear success criteria
- [ ] Expert guidance provided for each sprint
- [ ] Task breakdown is specific (not vague)
- [ ] Time estimates are realistic
- [ ] Risk areas identified (API integration, animations performance)
- [ ] Dependencies clear (Sprint 1 before Sprint 2, etc.)
- [ ] Definition of done: Tests pass, linter passes, Uncle Bob approved
- [ ] No unknown unknowns (all requirements understood)

**Sign-off Required**: Phase 2 sprint doc approved before start of implementation.

---

## Ready to Implement?

Questions before we start Sprint 1?

- Are sprint durations realistic?
- Are expert focuses clear?
- Are success criteria measurable?
- Any scope concerns?

If all good → Begin implementation immediately.
