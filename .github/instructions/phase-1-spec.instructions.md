---
name: phase-1-spec
description: "Phase 1 Feature Specification with user flows, component hierarchy, data structures, API contracts, a11y requirements, and performance targets"
---

# Phase 1: Feature Specification

## User Flows

### Flow 1: Quiz Discovery & Selection
```
User lands on hub → Sees 3 quiz cards → Clicks one → Quiz starts
Entry: Home page
Happy path: Select quiz → Enter quiz detail
Edge cases: 
  - Slow loading (show skeleton)
  - No quizzes available (show empty state)
```

### Flow 2: Quiz Completion
```
Start question 1 → Answer question 1 → Move to Q2 → ... → Final answer → Results screen
Entry: Quiz detail page
Happy path: Answer each Q → See next Q → Complete all Qs
Edge cases:
  - User refreshes mid-quiz (lose progress)
  - Network error during answer submission (retry)
  - Back button pressed (confirm exit)
```

### Flow 3: Recommendation Generation
```
All answers submitted → Loading state → AI generates recommendation → Display results
Entry: Last quiz question answered
Happy path: Get recommendation → Show personality type + description
Edge cases:
  - API timeout (show error, offer retry)
  - Malformed response (fallback to generic recommendation)
```

### Flow 4: Result Sharing
```
See results → Share button clicked → Copy link/social → Paste elsewhere
Entry: Results screen
Happy path: Generate shareable link → Copy → Share
Edge cases:
  - Copy to clipboard fails (show manual text option)
```

## Component Hierarchy

```
App
├── Header
│   └── Logo + Navigation
├── Router
│   ├── HomePage
│   │   ├── Hero
│   │   ├── QuizCardGrid
│   │   │   ├── QuizCard (×3)
│   │   │   │   ├── CardTitle
│   │   │   │   ├── CardDescription
│   │   │   │   └── CTAButton
│   │   │   └── LoadingSkeleton (if fetching)
│   │   └── Footer
│   ├── QuizPage
│   │   ├── QuizProgress
│   │   ├── QuestionCard
│   │   │   ├── QuestionText
│   │   │   └── OptionsList
│   │   │       └── OptionButton (×3-4)
│   │   ├── NavigationButtons (Previous/Next)
│   │   └── ExitConfirmDialog
│   └── ResultsPage
│       ├── ResultHeader
│       │   ├── PersonalityTypeDisplay
│       │   └── ScoreBreakdown
│       ├── PersonalityDescription
│       ├── RecommendationsList
│       ├── ShareButtons
│       └── RetakeButton
└── Footer
```

## Data Structures

```typescript
// types/quiz.ts
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
```

## API Contracts

### GET /api/quizzes
Return all available quizzes
```json
{
  "status": "success",
  "data": [
    {
      "id": "quiz-1",
      "title": "What's Your Personality Type?",
      "description": "Discover your personality across the Big Five dimensions",
      "imageUrl": "https://...",
      "questionsCount": 10
    }
  ]
}
```

### GET /api/quizzes/:id
Return quiz with full questions
```json
{
  "status": "success",
  "data": {
    "id": "quiz-1",
    "title": "...",
    "questions": [
      {
        "id": "q1",
        "text": "When at a party, I'm usually...",
        "options": [
          { "id": "opt1", "text": "The life of the party", "value": 5 },
          { "id": "opt2", "text": "Chatting with close friends", "value": 3 }
        ]
      }
    ]
  }
}
```

### POST /api/recommendations (via Groq)
Send answers, get personality recommendation
```json
{
  "quizId": "quiz-1",
  "answers": [
    { "questionId": "q1", "selectedOptionIds": ["opt1"] }
  ]
}
```

Response:
```json
{
  "personalityType": "ENFP",
  "score": 87,
  "description": "You're a spontaneous, creative extrovert...",
  "recommendations": ["Try improv comedy", "Join a social club"],
  "traits": [
    { "name": "Extroversion", "strength": 92 },
    { "name": "Openness", "strength": 88 }
  ]
}
```

## Accessibility Requirements

- ✅ WCAG 2.1 AA compliance
- ✅ Keyboard navigation: Tab through all interactive elements
- ✅ Screen reader support: Proper heading hierarchy, ARIA labels
- ✅ Color contrast: 4.5:1 for text, 3:1 for graphics
- ✅ Focus indicators: Visible on all buttons, inputs
- ✅ Reduced motion: Respect `prefers-reduced-motion` media query
- ✅ Form accessibility: Proper labels, error messages, input hints
- ✅ Dynamic content: Use ARIA live regions for quiz progress updates

## Performance Targets

- ✅ First Contentful Paint: < 1.5s
- ✅ Largest Contentful Paint: < 2.5s
- ✅ Cumulative Layout Shift: < 0.1
- ✅ Time to Interactive: < 3s
- ✅ Lighthouse Performance Score: >= 90
- ✅ Bundle size: < 250KB (gzipped)
- ✅ API response time: < 500ms

## QA Checklist - Feature Spec Phase

- [ ] All 4 user flows documented with entry points, happy paths, and edge cases
- [ ] Component hierarchy is a clear tree (no circular dependencies)
- [ ] All TypeScript interfaces defined and exported from types/
- [ ] API contracts show request/response shapes with examples
- [ ] WCAG 2.1 AA requirements explicitly listed
- [ ] Performance targets quantified (real metrics, not vague)
- [ ] No ambiguities in spec (reviewer can implement independently)
- [ ] Spec fits 2-3 hour sprint window (scope is realistic)
- [ ] Expert guidance clear (which expert to channel for each component)
- [ ] Risk areas identified (API delays, rendering performance, etc.)

**Sign-off Required**: Phase 1 spec approved before moving to Phase 2 sprint doc.
