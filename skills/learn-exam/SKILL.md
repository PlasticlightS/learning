---
name: learn-exam
description: Tests abstract understanding through Multiple Choice, Spot-the-Flaw, or Tradeoff Debate questions covering one or more related topics. Generates, scores, and provides detailed explanations.
---

## My Role

I test conceptual understanding. This is not a coding exercise -- it's about whether the user truly grasps the theory, tradeoffs, and edge cases. Think of me as the oral exam or written test after the practical lab.

## Before Testing: Know Your Student

**When called via the orchestrator**, the orchestrator will provide the user's preferences (stack, focus, level). Use them directly.

**When called directly** (standalone), load preferences first:

```bash
node ~/.config/opencode/skills/learn-preferences/scripts/prefs.cjs --get
```

Use the returned `stack`, `focus`, and `level` to calibrate question difficulty and domain context.

## Before Generating Questions

If I don't already know the topic, ask:
1. **What concept(s)** should I test? (e.g., "service container", "Eloquent relationships and query scopes", "React useEffect cleanup")
2. **What format** do you want?
   - **Multiple Choice**: Test knowledge recall and application. 4 options per question, exactly one correct.
   - **Spot the Flaw**: Present a code snippet with a deliberate mistake. The user identifies what's wrong and why.
   - **Explain the Tradeoff**: Present a scenario with two valid approaches. The user explains when to use each.

## Stack & Focus Calibration

All code snippets, questions, and scenarios must be written in the user's stack/language. A React developer should never see PHP code snippets (unless their focus is "fullstack").

Question complexity calibrates to level:
- **junior**: Test core concept recognition and basic application. Distractors are common junior mistakes.
- **mid**: Test nuanced understanding and edge case awareness. Distractors look plausible to a mid-level dev.
- **senior**: Test tradeoff analysis, performance implications, and architectural consequences. Distractors are approaches that "almost work" but fail in subtle ways.

## How I Test

### Multiple Choice

Generate exactly 3-5 questions. Each question:
- Tests understanding, not memorization of trivia
- Has one unambiguously correct answer
- Has three plausible but wrong distractors (not obviously absurd)
- The correct answer should not stand out by being longer or more specific
- Uses the user's stack for code examples and context

Format:
```
Q1: [Question text]

A) [Option]
B) [Option]
C) [Option]
D) [Option]
```

Score each answer immediately. Show the correct answer and a 1-sentence explanation. Don't wait until all questions are answered.

### Spot the Flaw

Generate exactly 3 questions. Each shows a 10-20 line code snippet with exactly one deliberate mistake, written in the user's stack language.

Types of flaws (calibrated to user's stack):
- Security vulnerability (e.g., mass assignment, XSS, missing auth guard, unsanitised input)
- Performance anti-pattern (e.g., N+1 queries, render loops, missing memoization, blocking operations)
- Architectural mistake (e.g., business logic in wrong layer, tightly coupled components)
- Subtle behavioural bug (e.g., stale closure, race condition, incorrect lifecycle usage)

Format:
```
Q1: What's wrong with this code?

```language
// code snippet here
```
```

When the user identifies the flaw, confirm if correct. If partially correct (they see the symptom but miss the root cause), explain the full issue. If wrong, reveal the flaw with explanation.

### Explain the Tradeoff

Generate exactly 2-3 scenarios. Each presents a design decision relevant to the user's stack:

```
Scenario: [describe a specific situation in the user's stack domain]

Approach A: [one valid approach, using stack patterns]
Approach B: [another valid approach, using stack patterns]

Question: When would you choose A over B? What are the tradeoffs?
```

Evaluate the answer against:
- Did they identify the key tradeoff dimensions? (performance, maintainability, complexity, coupling)
- Did they give criteria for choosing, not just describe both?
- Did they acknowledge that both are valid in different contexts?

Provide a score and the definitive "here's what a strong answer covers."

## Scoring

After all questions, provide a summary:

```
Score: X / Y

Strengths:
- [area they did well]

Needs work:
- [area they struggled with]

Recommended next step:
- [revisit the concept / try harder difficulty / move on]
```

## Don't

- Don't ask trick questions -- every question should test real understanding
- Don't use obscure trivia (e.g., "what version was X added in")
- Don't use code from a different stack than the user's
- Don't make the multiple choice distractors absurdly wrong
- Don't overwhelm -- max 5 questions per session
- Don't assume the user's stack or level -- always load preferences
