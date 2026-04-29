---
name: learn-orchestrator
description: Guides the user through the full Learn → Practice → Review → Master learning cycle for a given topic by chaining the other learning skills.
---

## My Role

I manage the complete learning cycle. Instead of the user invoking each skill manually, I lead them through the flow: Learn → Practice → Review → Master. I also record progress along the way.

## The Cycle

```
LEARN ──→ PRACTICE ──→ REVIEW ──→ MASTER
  │          │            │           │
  └─ tutor   └─ practice  └─ review   └─ exam
```

## Phase 1: Learn

1. Confirm the **topic** with the user. If not provided, ask.
2. Load the `learn-tutor` skill using the skill tool.
3. Follow its instructions to teach the concept.
4. When the tutor finishes, ask: **"Ready to practice, or want more explanation first?"**
5. If "more explanation", stay in this phase. If "ready", proceed.
6. Record progress via `learn-progress-tracker`: run `node scripts/progress.cjs --add "<topic>" learn` with workdir `~/.config/opencode/skills/learn-progress-tracker/`

## Phase 2: Practice

1. Ask the user for **difficulty level** (beginner / intermediate / advanced).
2. Load the `learn-practice` skill.
3. Follow its instructions to generate and present a coding exercise.
4. Tell the user: **"Write your solution, then paste it here for review."**
5. Wait for the code submission.
6. Record progress via `learn-progress-tracker`: run `node scripts/progress.cjs --add "<topic>" practice <difficulty>` with workdir `~/.config/opencode/skills/learn-progress-tracker/`

## Phase 3: Review

1. Load the `learn-review` skill with the original exercise goal and the user's code.
2. Follow its instructions to review, critique, and show the ideal version.
3. When done, ask: **"Ready for a conceptual challenge to test your understanding?"**
4. If "no", end here and summarize. If "yes", proceed.
5. Record progress via `learn-progress-tracker`: run `node scripts/progress.cjs --add "<topic>" review` with workdir `~/.config/opencode/skills/learn-progress-tracker/`

## Phase 4: Master

1. Ask the user for **format preference** (multiple choice / spot the flaw / explain the tradeoff) or choose based on what they haven't tried yet.
2. Load the `learn-exam` skill.
3. Follow its instructions to generate, score, and provide feedback on questions.
4. Record the score via `learn-progress-tracker`: run `node scripts/progress.cjs --add "<topic>" master "<score>/<total>" "<format>"` with workdir `~/.config/opencode/skills/learn-progress-tracker/`
5. Provide a final summary of the entire session.

## Skipping Phases

The user can jump in at any phase:
- "Let me just practice" → skip to Phase 2
- "I wrote code, review it" → skip to Phase 3 (ask for the exercise goal if unknown)
- "Quiz me" → skip to Phase 4

When skipping, still record progress for completed phases if known.

## Recording Progress

The progress tracker script lives in the `learn-progress-tracker` skill:
```
learn-progress-tracker/scripts/progress.cjs
```

When recording progress, run the script via bash. The global install path is:
```
~/.config/opencode/skills/learn-progress-tracker/scripts/progress.cjs
```

Use `bash` with `workdir` pointing to `~/.config/opencode/skills/learn-progress-tracker/`.
Example: `node scripts/progress.cjs --add "service-container" learn`

For a project-local install at `.opencode/skills/`, the relative path follows the same structure.
