---
name: learn-orchestrator
description: Guides the user through the full Learn → Practice → Review → Master learning cycle for a given topic by chaining the other learning skills.
---

## My Role

I manage the complete learning cycle. Instead of the user invoking each skill manually, I lead them through the flow: Learn → Practice → Review → Master. I also record progress along the way.

## Before Starting: Preferences & Setup

**Always do this first.** Before any learning cycle begins:

1. **Load learn-preferences**: Run the prefs script to check if the user has set up preferences.
   ```bash
   node ~/.config/opencode/skills/learn-preferences/scripts/prefs.cjs --get
   ```

2. **If preferences don't exist** (first run, or the data file is empty), the script still returns defaults. BUT -- ask the user to set up their profile:
   - Use the `question` tool to ask: **stack** (backend/frontend/fullstack), **focus** (laravel/react/vue/go/python/etc.), and **level** (beginner/intermediate/advanced).
   - Write the answers via prefs.cjs `--set` commands.

   ```
   I don't see any saved learning preferences. Let me set those up quickly.

   What's your primary stack? [backend / frontend / fullstack]
   What framework/language are you most focused on? [e.g., laravel, react, vue, go, python]
   What's your proficiency level? [beginner / intermediate / advanced]
   ```

3. **Store the preferences** by running:
   ```bash
   node ~/.config/opencode/skills/learn-preferences/scripts/prefs.cjs --set stack <value>
   node ~/.config/opencode/skills/learn-preferences/scripts/prefs.cjs --set focus <value>
   node ~/.config/opencode/skills/learn-preferences/scripts/prefs.cjs --set level <value>
   ```

4. **Hold the loaded prefs in context** for the entire session and pass them to every learn skill you invoke below.

### Handling Flags (On-the-Fly Overrides)

If the user says something like "teach me react state management" when their default focus is laravel:

1. Recognise the flag: `focus=react` (and potentially different `level` based on how they phrase it).
2. Run the prefs script with `--flags` to get the merged config:
   ```bash
   node ~/.config/opencode/skills/learn-preferences/scripts/prefs.cjs --flags focus=react level=advanced
   ```
3. Use that merged config for the entire session. Do NOT persist it.
4. When recording progress, pass these flags so progress records show the correct context:
   ```bash
   node ~/.config/opencode/skills/learn-progress-tracker/scripts/progress.cjs --add "react-state-management" learn --flag=focus=react --flag=level=advanced
   ```

### Flag Parsing Heuristics

Detect flag overrides from user input:
- Mention of a different framework than their default → flag `focus`
- "as a beginner", "I'm new to...", "at an advanced level" → flag `level`
- "full stack perspective", "from a frontend angle" → flag `stack`

When uncertain, ask: "I notice you mentioned React — your default focus is Laravel. Treat this as a React session?"

## The Cycle

```
LEARN ──→ PRACTICE ──→ REVIEW ──→ MASTER
  │          │            │           │
  └─ tutor   └─ practice  └─ review   └─ exam
```

All phases use the preferences (or merged flags) to calibrate output.

## Phase 1: Learn

1. Confirm the **topic** with the user. If not provided, ask.
2. Load the `learn-tutor` skill using the skill tool.
3. Provide it with the current preferences (stack, focus, level) so it calibrates.
4. Follow its instructions to teach the concept.
5. When the tutor finishes, ask: **"Ready to practice, or want more explanation first?"**
6. If "more explanation", stay in this phase. If "ready", proceed.
7. Record progress:
   ```bash
   node ~/.config/opencode/skills/learn-progress-tracker/scripts/progress.cjs --add "<topic>" learn --flag=focus=<focus> --flag=level=<level>
   ```

## Phase 2: Practice

1. Ask the user for **difficulty level** (beginner / intermediate / advanced) or use their saved level as default.
2. Load the `learn-practice` skill.
3. Provide it with the current preferences (stack, focus, level, difficulty).
4. Follow its instructions to generate and present a coding exercise.
5. Tell the user: **"Write your solution, then paste it here for review."**
6. Wait for the code submission.
7. Record progress:
   ```bash
   node ~/.config/opencode/skills/learn-progress-tracker/scripts/progress.cjs --add "<topic>" practice <difficulty> --flag=focus=<focus> --flag=level=<level>
   ```

## Phase 3: Review

1. Load the `learn-review` skill with the original exercise goal, user's code, and current preferences.
2. Follow its instructions to review, critique, and show the ideal version.
3. When done, ask: **"Ready for a conceptual challenge to test your understanding?"**
4. If "no", end here and summarise. If "yes", proceed.
5. Record progress:
   ```bash
   node ~/.config/opencode/skills/learn-progress-tracker/scripts/progress.cjs --add "<topic>" review --flag=focus=<focus> --flag=level=<level>
   ```

## Phase 4: Master

1. Ask the user for **format preference** (multiple choice / spot the flaw / explain the tradeoff) or choose based on what they haven't tried yet.
2. Load the `learn-exam` skill.
3. Provide it with the current preferences.
4. Follow its instructions to generate, score, and provide feedback on questions.
5. Record the score:
   ```bash
   node ~/.config/opencode/skills/learn-progress-tracker/scripts/progress.cjs --add "<topic>" master "<score>/<total> <format>" --flag=focus=<focus> --flag=level=<level>
   ```
6. Provide a final summary of the entire session.

## Skipping Phases

The user can jump in at any phase:
- "Let me just practice" → skip to Phase 2
- "I wrote code, review it" → skip to Phase 3 (ask for the exercise goal if unknown)
- "Quiz me" → skip to Phase 4

When skipping, still record progress for completed phases if known. Always run the prefs check first.

## Recording Progress

The progress tracker script is at:
```
~/.config/opencode/skills/learn-progress-tracker/scripts/progress.cjs
```

Always pass `--flag=focus=<focus>` and `--flag=level=<level>` on every `--add` call so records are tagged correctly.
