---
name: qa-comprehensive
description: "Use when: QA'ing a sprint, reviewing code, or before commit. Comprehensive checklist covering functional, visual, a11y, performance, and Uncle Bob's craftsmanship standards."
---

# Comprehensive QA Checklist

## Quick Reference

Use this checklist at every phase:
1. **Phase 1**: Spec completeness
2. **Phase 2**: Sprint feasibility
3. **Phases 3-6**: Per-sprint functional + craftsmanship
4. **Phase 7**: Final comprehensive QA

---

## Phase 1-2: Planning QA

- [ ] All user flows documented (entry, happy path, edge cases)
- [ ] Component hierarchy is clear (no circular dependencies)
- [ ] API contracts show request/response with examples
- [ ] Performance targets quantified (not "should be fast")
- [ ] Scope fits 2-3 hour sprint window
- [ ] No ambiguities (could a dev implement independently?)
- [ ] WCAG 2.1 AA requirements listed explicitly
- [ ] Risk areas identified and mitigation planned

---

## Phase 3-6: Sprint QA (Per Sprint)

### Functional Testing

- [ ] All user flows work end-to-end
- [ ] Happy path complete without errors
- [ ] All edge cases handled (empty states, errors, timeouts)
- [ ] Form validation works (required fields, format checking)
- [ ] API responses handled (success + error states)
- [ ] Loading states display properly
- [ ] Error states show user-friendly messages
- [ ] No console errors or warnings
- [ ] No infinite loops or memory leaks
- [ ] Refresh/back button doesn't break anything

### Visual Testing (Channeling Josh Comeau + Adam Wathan)

- [ ] Design matches spec (colors, spacing, typography)
- [ ] Animations are smooth (60 FPS, no jank)
- [ ] No layout shifts (Cumulative Layout Shift < 0.1)
- [ ] Hover/focus states are clear and visible
- [ ] No visual regressions from previous sprint
- [ ] Consistent with Muttnik/New_Public aesthetic
- [ ] Blob shapes and organic curves render smoothly

### Responsive Design Testing

- [ ] Mobile (375px): Readable, tappable (48px touch targets)
- [ ] Tablet (768px): Balanced layout, no overflow
- [ ] Desktop (1440px): Full experience utilized
- [ ] Portrait/landscape both work
- [ ] No horizontal scroll on mobile
- [ ] Images scale appropriately (no distortion)

### Accessibility Testing (Channeling Sara Soueidan)

- [ ] Keyboard navigation works (Tab through all interactive)
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader announces content correctly (headings, labels, states)
- [ ] Color contrast >= WCAG AA (4.5:1 text, 3:1 graphics)
- [ ] No color alone conveys meaning
- [ ] Dynamic content updates announced (ARIA live regions)
- [ ] Form labels associated with inputs (`<label for="id">`)
- [ ] Alt text present for meaningful images
- [ ] Reduced motion respected (`prefers-reduced-motion`)
- [ ] No autoplay audio or video
- [ ] Skip link present (skip to main content)

### Performance Testing

- [ ] Lighthouse Performance Score >= 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3s
- [ ] Interaction to Next Paint < 200ms
- [ ] No render-blocking resources
- [ ] Images optimized (WebP, lazy-loaded)
- [ ] Code is minified and split appropriately
- [ ] Bundle size < 250KB gzipped

### Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS latest)
- [ ] Android Chrome (latest)

---

## Uncle Bob's Craftsmanship QA (Every Commit)

### SOLID Principles Audit

**S - Single Responsibility**
- [ ] Each class has one reason to change
- [ ] Function does ONE thing (no "and" in description)
- [ ] Utils file isn't a dumping ground

**O - Open/Closed**
- [ ] Code is open for extension, closed for modification
- [ ] New features don't require changing existing code
- [ ] Abstractions exist for variation points

**L - Liskov Substitution**
- [ ] Derived classes can replace base without breaking
- [ ] All implementations honor the contract
- [ ] No surprising behavioral differences

**I - Interface Segregation**
- [ ] Interfaces are focused and small
- [ ] Clients only depend on methods they use
- [ ] No "fat interfaces"

**D - Dependency Inversion**
- [ ] High-level modules depend on abstractions
- [ ] Low-level details are injected
- [ ] No tight coupling to concrete implementations

### Clean Code Audit

**Naming**
- [ ] Function names reveal intent (`calculateScore`, not `calc`)
- [ ] Variable names are pronounceable (not `u_d` or `a`)
- [ ] Class names are nouns (`Quiz`, not `QuizProcessor`)
- [ ] Method names are verbs (`validate`, not `check`)
- [ ] No misleading names (`userList` is actually a list)
- [ ] No disinformation (avoid `data`, `info`, `obj`)

**Functions**
- [ ] All functions < 30 lines
- [ ] All functions have 0-2 parameters (max 3)
- [ ] No side effects (function does what name says)
- [ ] Pure functions when possible
- [ ] No repeated code (DRY)
- [ ] Guard clauses used (early returns)

**Error Handling**
- [ ] Exceptions used, not error codes
- [ ] Custom exception hierarchy (not catching all)
- [ ] Exceptions provide context (include relevant data)
- [ ] Don't return null (throw or return Optional)
- [ ] Try-catch-finally logic first, business logic second

**Comments**
- [ ] Comments explain WHY, not WHAT
- [ ] Code is clear enough comments aren't needed
- [ ] No commented-out code (use git blame)
- [ ] No TODO without issue/person/date

### Testing Standards (F.I.R.S.T)

- [ ] **Fast**: Unit tests run in milliseconds
- [ ] **Independent**: Tests don't depend on each other
- [ ] **Repeatable**: Same results every run (no flakiness)
- [ ] **Self-checking**: Pass/fail without manual checks
- [ ] **Timely**: Tests written close to production code

**Coverage & Organization**
- [ ] Business logic has unit tests (80%+ coverage)
- [ ] All decision paths tested (if/else branches)
- [ ] Error cases tested
- [ ] Test names describe what they test (given/when/then)
- [ ] Tests organized in logical groups (describe blocks)
- [ ] Arrange/Act/Assert pattern used

### Code Review Standards

- [ ] ✅ SOLID principles followed
- [ ] ✅ Names reveal intent
- [ ] ✅ Functions small and focused
- [ ] ✅ No duplicate code
- [ ] ✅ Error handling explicit
- [ ] ✅ Tests exist and are meaningful
- [ ] ✅ No magic numbers
- [ ] ✅ No hardcoded secrets/URLs
- [ ] ✅ User input validated
- [ ] ✅ Would you be proud to have your name on this?

---

## Pre-Commit Ritual (Uncle Bob Style)

Before you commit, ask yourself:

1. **Does this code follow SOLID?**
   - Could I explain why each class exists?
   - Does it have one reason to change?

2. **Is this code clean?**
   - Would a junior dev understand it?
   - Are names clear and revealing?
   - Are functions small?

3. **Is this code tested?**
   - Do tests exist?
   - Do they test the right things?
   - Would tests catch a regression?

4. **Would I be proud of this?**
   - Would I show this in a code review?
   - Would I be happy if someone reviewed my code?
   - Am I maintaining professional standards?

If you answer "no" to any of these, refactor before committing.

---

## Red Flags (Stop & Fix)

| Red Flag | Action |
|----------|--------|
| Function > 30 lines | Extract into smaller functions |
| `new` keyword everywhere | Use dependency injection |
| Null checks before function calls | Throw exception or return Optional |
| Copy-paste code | Extract to shared function |
| Magic numbers | Extract to named constant |
| `catch (Exception e)` | Catch specific exceptions |
| Deep nesting (> 3 levels) | Extract guards/early returns |
| Function has "and" in purpose | Split into two functions |
| Comments explaining WHAT | Refactor to be self-explanatory |
| 50-line if/else chain | Use polymorphism or strategy pattern |
| Utils file with 200+ lines | Split into focused modules |

---

## QA Gates

### ✅ Before Phase 2 Sprint Doc
- [ ] Phase 1 spec passes QA completeness check
- [ ] All flows documented
- [ ] All components identified
- [ ] All types defined
- [ ] No ambiguities

### ✅ After Each Sprint (Phases 3-6)
- [ ] All functional tests pass
- [ ] No console errors
- [ ] All Uncle Bob criteria met (SOLID, clean code, tests)
- [ ] 80%+ test coverage
- [ ] Lighthouse >= 90
- [ ] Accessibility audit passes
- [ ] Code review complete

### ✅ Before Phase 7 Deployment
- [ ] All 4 sprints complete and passing QA
- [ ] Full end-to-end flow works
- [ ] All browser tests pass
- [ ] All accessibility tests pass
- [ ] Performance targets met
- [ ] SEO basics present
- [ ] Ready for production

---

## Success Metrics

| Category | Target | Measurement |
|----------|--------|-------------|
| **Functionality** | 100% | All flows work, no bugs |
| **Coverage** | 80%+ | Code coverage report |
| **Performance** | Lighthouse 90+ | Automated audit |
| **Accessibility** | WCAG AA | Manual + automated audit |
| **Code Quality** | SOLID + Clean | Code review approval |
| **Craftsmanship** | Uncle Bob approved | "Would I be proud?" test |

---

## When QA Finds Issues

1. **Document**: What is the issue? Where? How to reproduce?
2. **Severity**: Is it blocking? Can users work around it?
3. **Action**: Fix now (blocking) or create issue (non-blocking)?
4. **Prevention**: How do we catch this type in future?

### Severity Levels

- 🔴 **Critical**: Breaks core functionality, data loss, security
- 🟠 **High**: Major feature broken, significant UX issue
- 🟡 **Medium**: Minor functionality broken, workaround exists
- 🟢 **Low**: Polish, edge case, minor UX paper cut

---

## Final Sign-Off

**Uncle Bob's question**: 

> "Am I proud to have my name on this code? Would I trust another developer to maintain it? Is it better than the code I started with?"

If YES to all three, you're ready to deploy. If anything is uncertain, refactor until it's clear.

---

**Remember**: "The only way to go fast is to go well." Quality is not negotiable.
