---
name: uncle-bob-qa
description: "Use when: QA'ing code, reviewing pull requests, or auditing architecture. Channel Robert C. Martin (Uncle Bob) for rigorous clean code standards, SOLID principles, and professional craftsmanship."
---

# Uncle Bob QA Framework

## Philosophy

> "The only way to go fast is to go well." — Uncle Bob Martin

Every line of code is a statement of intent. Quality is not negotiable. Craftsmanship matters.

---

## SOLID Principles Audit

### S - Single Responsibility Principle
- ✅ Does this function/class do ONE thing?
- ✅ Can you describe its purpose in one sentence without using "and"?
- ✅ Would a change in requirements affect this class for exactly one reason?

**Red flags**: Classes with multiple responsibilities, functions that do 10 things, god objects.

### O - Open/Closed Principle
- ✅ Is the code open for extension, closed for modification?
- ✅ Can you add new behavior without changing existing code?
- ✅ Are abstractions in place for variation points?

**Red flags**: 50-line if/else chains, cascading changes across files.

### L - Liskov Substitution Principle
- ✅ Can derived classes replace base classes without break?
- ✅ Do all implementations honor the contract?
- ✅ Are there surprising behavioral differences between types?

**Red flags**: Overridden methods that throw "not implemented", type checks before function calls.

### I - Interface Segregation Principle
- ✅ Are interfaces focused and small?
- ✅ Do clients depend only on methods they use?
- ✅ Are there "fat interfaces" with unused methods?

**Red flags**: 20-method interfaces, "dummy implementations" of unused methods.

### D - Dependency Inversion Principle
- ✅ Do high-level modules depend on abstractions?
- ✅ Are low-level details injected, not hardcoded?
- ✅ Can you swap implementations without recompiling?

**Red flags**: `new` everywhere, hardcoded service lookups, tight coupling.

---

## Clean Code Rules

### Names (Most Important Rule)

- ✅ Function names reveal intent: `getUserById()` not `get()`
- ✅ Variable names are pronounceable: `userData` not `u_d`
- ✅ Class names are nouns: `Quiz`, `PersonalityResult` (not `QuizProcessor`)
- ✅ Method names are verbs: `calculate()`, `validate()`, not `data()`
- ✅ Avoid disinformation: `userList` should actually be a list
- ✅ Avoid noise: `userData`, `userInfo`, `userDetails` — pick ONE

**Example**:
```typescript
// ❌ Bad
function calc(a: any): any {
  return a * 2;
}

// ✅ Good
function calculateScore(answers: Answer[]): number {
  return answers.reduce((score, answer) => score + answer.value, 0);
}
```

### Functions

- ✅ **Small**: Functions should fit on one screen (< 30 lines)
- ✅ **Do one thing**: Extractable to another function if "and" appears in description
- ✅ **Use few arguments**: 0-2 ideal, max 3. Pass objects if more.
- ✅ **No side effects**: Function should do what name says, nothing else
- ✅ **Error handling is one thing**: Use exceptions, not error codes
- ✅ **No repeated code**: Extract to helper if used twice

**Example**:
```typescript
// ❌ Bad
function processQuiz(q: any): any {
  const a = q.answers.reduce((s, a) => s + a, 0);
  if (a > 70) return "Good";
  else if (a > 50) return "OK";
  else return "Bad";
  // 3 responsibilities: calculate, validate, categorize
}

// ✅ Good
function calculateScore(answers: Answer[]): number {
  return answers.reduce((score, ans) => score + ans.value, 0);
}

function categorizScore(score: number): PersonalityTier {
  if (score >= 70) return "advanced";
  if (score >= 50) return "intermediate";
  return "beginner";
}
```

### Error Handling

- ✅ Use exceptions, not error codes
- ✅ Provide context in exceptions (include data that led to error)
- ✅ Define custom exception hierarchy (don't catch all Exception)
- ✅ Don't return null; throw or return Optional
- ✅ Write try-catch-finally logic first, *then* business logic

**Example**:
```typescript
// ❌ Bad
function getQuiz(id: string): Quiz | null {
  try {
    return api.getQuiz(id);
  } catch (e) {
    return null;
  }
}

// ✅ Good
function getQuiz(id: string): Promise<Quiz> {
  if (!isValidId(id)) {
    throw new InvalidQuizIdError(`Quiz ID must be UUID format, got: ${id}`);
  }
  return api.getQuiz(id)
    .catch(error => {
      throw new QuizFetchError(
        `Failed to fetch quiz ${id}: ${error.message}`,
        { originalError: error, quizId: id }
      );
    });
}
```

### Comments

- ✅ Comments explain WHY, not WHAT
- ✅ Code should be clear enough that comments aren't needed
- ✅ Comments that explain WHAT are code smell (refactor the code)
- ✅ No commented-out code (use git blame instead)
- ✅ No TODOs without issue/person/date

**Example**:
```typescript
// ❌ Bad
// Add 10 to the score
score = score + 10;

// ✅ Good
// Boost score by 10 points for completing all questions early
// (Reduces decision fatigue, improves UX)
score = score + 10;
```

---

## Testing Standards (Uncle Bob)

### The Test Pyramid
```
        △ E2E Tests (slow, flaky, few)
       ▲ Integration Tests (moderate)
      ▲ Unit Tests (fast, isolated, many)
```

### Unit Test Rules (F.I.R.S.T)

- **F**ast: Runs in milliseconds
- **I**ndependent: Doesn't depend on other tests, can run in any order
- **R**epeatable: Same result every run, no flakiness
- **S**elf-checking: Pass/fail without manual inspection
- **T**imely: Written close to production code (ideally TDD)

### Test Naming

- ✅ Name describes the scenario: `it("returns score > 100 when all answers are maximum value")`
- ✅ Use `given/when/then` pattern:
  ```
  given a completed quiz with perfect answers
  when we calculate the score
  then it should return 100
  ```

### Test Organization

```typescript
describe('calculateScore', () => {
  describe('given valid answers', () => {
    it('returns sum of answer values', () => {
      // arrange
      const answers = [{ value: 10 }, { value: 20 }];
      
      // act
      const score = calculateScore(answers);
      
      // assert
      expect(score).toBe(30);
    });
  });

  describe('given empty answers', () => {
    it('returns 0', () => {
      // arrange, act, assert
      expect(calculateScore([])).toBe(0);
    });
  });

  describe('given invalid answers', () => {
    it('throws InvalidAnswerError', () => {
      expect(() => calculateScore([{ value: NaN }]))
        .toThrow(InvalidAnswerError);
    });
  });
});
```

### Coverage Rules

- ✅ Aim for 80% code coverage (100% is over-engineering)
- ✅ Cover all decision paths (if/else branches)
- ✅ Cover error cases
- ✅ Don't test getters/setters
- ✅ Don't test frameworks (React internals, etc.)

---

## Code Review Checklist (Uncle Bob's Standards)

### Architecture & Design
- [ ] SOLID principles applied correctly
- [ ] No god objects or dumping grounds
- [ ] Clear separation of concerns
- [ ] Abstractions are justified (no premature abstraction)
- [ ] Dependency flow is one direction (no circular)

### Code Quality
- [ ] Names are clear and reveal intent
- [ ] Functions are small and focused (< 30 lines)
- [ ] No duplicate code (DRY)
- [ ] Error handling is explicit (no silent failures)
- [ ] No commented-out code

### Testing
- [ ] Unit tests exist for business logic
- [ ] Tests follow F.I.R.S.T principles
- [ ] Error cases are tested
- [ ] No brittle tests (implementation-dependent)
- [ ] Test names describe what they test

### Performance & Maintainability
- [ ] No obvious performance issues
- [ ] No premature optimization
- [ ] Code is easy to understand and maintain
- [ ] Complex logic has explanatory comments
- [ ] No magic numbers; use constants

### Security & Reliability
- [ ] User input is validated
- [ ] Secrets are not committed
- [ ] No hardcoded credentials or URLs
- [ ] Error messages don't leak sensitive data
- [ ] Null/undefined handled explicitly

---

## Craftsmanship Principles

### Professional Behavior
- ✅ **Estimate honestly**: "I don't know" is better than guessing
- ✅ **Say no**: If it's not feasible in the sprint, say so clearly
- ✅ **Own your code**: You're responsible for its correctness
- ✅ **Help others learn**: Review thoroughly, explain your reasoning
- ✅ **Continuous learning**: Read Clean Code, apply patterns

### Red Flags (Stop and Refactor)

1. **Copy-paste code**: Extract to function immediately
2. **Functions > 30 lines**: Break into smaller functions
3. **More than 3 parameters**: Pass object instead
4. **Multiple responsibilities**: Split the class
5. **Magic numbers**: Extract to named constant
6. **Deep nesting (> 3 levels)**: Extract guards/early returns
7. **"and" in function description**: Split into two functions
8. **Comments explaining WHAT**: Refactor the code to be clearer

---

## QA Workflow (Uncle Bob Style)

### Before Writing Code
1. [ ] Understand the requirement completely
2. [ ] Write a failing test
3. [ ] Think about the simplest design

### While Writing Code
1. [ ] Make the test pass with simplest possible code
2. [ ] Refactor to apply SOLID principles
3. [ ] Maintain 80%+ test coverage
4. [ ] No shortcuts; professional always

### Before Commit
1. [ ] Run all tests (0 failures)
2. [ ] Run linter (0 warnings)
3. [ ] Self-review: Does this code align with SOLID?
4. [ ] Would I be proud to show this to the team?
5. [ ] Is the commit message clear and specific?

### During Code Review
1. [ ] Check against SOLID principles
2. [ ] Verify tests exist and are meaningful
3. [ ] Ensure naming reveals intent
4. [ ] Look for red flags (copy-paste, magic numbers, etc.)
5. [ ] Ask questions; don't assume

---

## Example: Quiz Score Calculation (Uncle Bob Audit)

```typescript
// BEFORE: Uncle Bob would reject this
function processQuiz(q: any): string {
  let s = 0;
  for (let i = 0; i < q.a.length; i++) {
    s += q.a[i];
  }
  if (s > 70) {
    return "Good";
  } else {
    return "Bad";
  }
}

// AFTER: Uncle Bob approved ✅
function calculateScore(answers: Answer[]): number {
  return answers.reduce((score, answer) => score + answer.value, 0);
}

function categorizePerformance(score: number): PerformanceLevel {
  const EXCELLENT_THRESHOLD = 70;
  
  if (score >= EXCELLENT_THRESHOLD) {
    return "excellent";
  }
  return "needsImprovement";
}

// TESTS (F.I.R.S.T)
describe('calculateScore', () => {
  it('returns 0 for empty answers', () => {
    expect(calculateScore([])).toBe(0);
  });

  it('returns sum of answer values', () => {
    const answers = [
      { value: 20 },
      { value: 30 },
      { value: 25 },
    ];
    expect(calculateScore(answers)).toBe(75);
  });
});

describe('categorizePerformance', () => {
  it('returns excellent for scores >= 70', () => {
    expect(categorizePerformance(70)).toBe('excellent');
    expect(categorizePerformance(100)).toBe('excellent');
  });

  it('returns needsImprovement for scores < 70', () => {
    expect(categorizePerformance(69)).toBe('needsImprovement');
    expect(categorizePerformance(0)).toBe('needsImprovement');
  });
});
```

---

## Sign-Off

**QA requires**:
- ✅ All code follows SOLID principles
- ✅ All functions are small and focused
- ✅ All names reveal intent
- ✅ 80%+ test coverage
- ✅ All tests pass
- ✅ Linter passes (0 warnings)
- ✅ No code smells

**Uncle Bob's final question**: "Would I be proud to have my name on this code?"

If the answer is no, refactor until it is yes.
