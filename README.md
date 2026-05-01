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

You can also ask your agent to update preferences at any time:

```
Set my focus to Laravel and level to intermediate.
Show my current preferences.
```

### 2. Start a learning session

Ask your agent in natural language:

```
Teach me service container binding.
```

The orchestrator handles the full cycle — tutoring, a practice exercise, code review, and a quiz.

When using OpenCode, you can also use the `/learn` slash command:

```
/learn service-container
```

### 3. One-off sessions with a different stack

Want to learn React state management but your default is Laravel? Just say so:

```
Teach me React state management.
```

The orchestrator detects the different focus, uses it as a temporary flag for the session, and records the topic as `focus=react` without changing your default. Nothing to configure.

You can also set an explicit override:

```
Teach me goroutines as an advanced Go developer.
```

### 4. Track your progress

Ask your agent about your progress:

```
What have I covered?
Show my learning stats.
How am I doing on service-container?
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

```
What's left on service-container?
```

Shows which phases are done, your quiz scores, difficulty reached, and the focus/level the topic was studied at.

### Restart a topic

```
Reset my progress on service-container
```

The orchestrator will warn before calling `--reset`.

## Learning Cycle

```
LEARN ──→ PRACTICE ──→ REVIEW ──→ MASTER
  │          │            │           │
  └─ tutor   └─ practice  └─ review   └─ exam
```

Start by asking your agent to explain a concept. If you use OpenCode, you can also use `/learn <topic>`.
