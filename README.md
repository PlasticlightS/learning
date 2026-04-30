# Learning Skills

First go at agent skills for guided learning through a Learn → Practice → Review → Master cycle.

## Skills

| Skill | Description |
|---|---|
| `learn-tutor` | Explains software engineering concepts through analogies, core mechanics, real-world use cases, and common pitfalls |
| `learn-practice` | Generates coding exercises at Beginner, Intermediate, or Advanced difficulty in realistic Laravel scenarios |
| `learn-review` | Reviews submitted code against best practices, correctness, and efficiency with an ideal version |
| `learn-exam` | Tests abstract understanding through Multiple Choice, Spot-the-Flaw, or Tradeoff Debate questions |
| `learn-orchestrator` | Guides through the full Learn → Practice → Review → Master cycle by chaining the other skills |
| `learn-progress-tracker` | Tracks learning progress across topics — records sessions, phases, difficulty levels, and quiz scores |

## Install

### Via skills CLI

```bash
npx skills add PlasticlightS/learning
```

This installs all six skills to your agent. Works with any [supported agent](https://skills.sh) including OpenCode, Claude Code, Codex, Cursor, and more.

### OpenCode-specific setup (commands + permissions)

The `.opencode/` directory contains slash commands and agent config for OpenCode users:

```bash
./.opencode/install.sh
```

This symlinks the commands (`/learn`, `/practice`, `/quiz`) and merges skill permissions into your OpenCode config.

## Learning Cycle

```
LEARN ──→ PRACTICE ──→ REVIEW ──→ MASTER
  │          │            │           │
  └─ tutor   └─ practice  └─ review   └─ exam
```

Start with `/learn <topic>` or ask your agent to explain a concept.
