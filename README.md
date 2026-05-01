# Learning Skills

Guided learning through a Learn → Practice → Review → Master cycle. Stack and skill level aware.

## Skills

| Skill                    | Description                                                                                                         |
|--------------------------|---------------------------------------------------------------------------------------------------------------------|
| `learn-preferences`      | Manages user profiles — stack, focus (framework), and proficiency level. Every other skill calibrates to these.     |
| `learn-tutor`            | Explains software engineering concepts through analogies, core mechanics, real-world use cases, and common pitfalls |
| `learn-practice`         | Generates coding exercises at Beginner, Intermediate, or Advanced difficulty in the user's stack                    |
| `learn-review`           | Reviews submitted code against best practices, correctness, and efficiency with an ideal version                    |
| `learn-exam`             | Tests abstract understanding through Multiple Choice, Spot-the-Flaw, or Tradeoff Debate questions                   |
| `learn-orchestrator`     | Guides through the full Learn → Practice → Review → Master cycle by chaining the other skills                       |
| `learn-progress-tracker` | Tracks learning progress across topics — records sessions, phases, difficulty levels, and quiz scores               |

## Install

### Via skills CLI

```bash
npx skills add PlasticlightS/learning
```

This installs all seven skills to your agent. Works with any [supported agent](https://skills.sh) including OpenCode, Claude Code, Codex, Cursor, and more.

### OpenCode-specific setup (commands + permissions)

```bash
./.opencode/install.sh
```

This symlinks the skills, commands (`/learn`, `/practice`, `/quiz`), and merges skill permissions into your OpenCode config.

## Getting Started

### 1. Set up your preferences

On first run, the orchestrator will ask about your background:

```
What's your primary stack? [backend / frontend / fullstack]
What framework/language are you most focused on? [laravel, react, vue, go, python, ...]
What's your proficiency level? [beginner / intermediate / advanced]
```

You can also set these manually at any time:

```bash
node ~/.config/opencode/skills/learn-preferences/scripts/prefs.cjs --set focus laravel
node ~/.config/opencode/skills/learn-preferences/scripts/prefs.cjs --set level intermediate
node ~/.config/opencode/skills/learn-preferences/scripts/prefs.cjs --set stack backend
```

Check your current settings:

```bash
node ~/.config/opencode/skills/learn-preferences/scripts/prefs.cjs --get
```

### 2. Start a learning session

```
/learn service-container
```

Or ask your agent directly: "Teach me service container binding."

The orchestrator handles the full cycle — tutoring, a practice exercise, code review, and a quiz.

### 3. One-off sessions with a different stack

Want to learn React state management but your default is Laravel? Just say so:

```
/learn react-state-management
```

The orchestrator detects the different focus, uses it as a temporary flag for the session, and records the topic as `focus=react` without changing your default. Nothing to configure.

You can also set an explicit override:

```
Teach me goroutines as an advanced Go developer.
```

### 4. Track your progress

Check everything you've covered:

```bash
node ~/.config/opencode/skills/learn-progress-tracker/scripts/progress.cjs --list
```

Get an overview with focus/level breakdowns:

```bash
node ~/.config/opencode/skills/learn-progress-tracker/scripts/progress.cjs --summary
```

Progress is stored at `~/.config/opencode/learning-progress.json`.

## Continuing an In-Progress Topic

Pick up where you left off — the orchestrator knows what phases you've completed.

### Resume from the next phase

```
Continue with service-container
```

If you completed `learn` and `practice` but never did the quiz, it skips straight to `Master`. Already aced the quiz? It tells you so and suggests a new topic.

### Jump to a specific phase

```
Review my queue-jobs code
Quiz me on Eloquent relationships (spot-the-flaw)
Let me practice middleware
```

### Check what's left

```bash
node ~/.config/opencode/skills/learn-progress-tracker/scripts/progress.cjs --get service-container
```

Shows which phases are done, your quiz scores, difficulty reached, and the focus/level the topic was studied at.

### Restart a topic

```bash
node ~/.config/opencode/skills/learn-progress-tracker/scripts/progress.cjs --reset service-container
```

The orchestrator will warn before calling `--reset`.

## Learning Cycle

```
LEARN ──→ PRACTICE ──→ REVIEW ──→ MASTER
  │          │            │           │
  └─ tutor   └─ practice  └─ review   └─ exam
```

Start with `/learn <topic>` or ask your agent to explain a concept.
