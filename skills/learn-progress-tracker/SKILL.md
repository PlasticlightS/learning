---
name: learn-progress-tracker
description: Tracks learning progress across topics -- records sessions, phases completed, difficulty levels, and quiz scores. Provides summary stats and history.
---

## My Role

I manage persistent learning progress. I don't generate content -- I query and update the user's learning history. Use me to check what you've covered, what you haven't, and where you need to focus.

## Script Location

The progress script is bundled with this skill at:
```
scripts/progress.cjs
```

Run with:
```bash
node <skill-dir>/scripts/progress.cjs [options]
```

Where `<skill-dir>` is the skill installation directory (e.g., `~/.config/opencode/skills/learn-progress-tracker`).

## How I Work

When the user asks about progress, I run the script via bash:
```bash
node <skill-dir>/scripts/progress.cjs <command>
```

I interpret the JSON output and present it clearly to the user.

## Available Commands

### List All Tracked Topics

```bash
node scripts/progress.cjs --list
```

Returns array of topic summaries:
```json
[
  {"topic": "service-container-binding", "sessions": 3, "last_session": "2026-04-29", "phases_completed": ["learn", "practice", "review"]},
  {"topic": "queue-job-batching", "sessions": 1, "last_session": "2026-04-28", "phases_completed": ["learn"]}
]
```

Present this as a table.

### Get a Topic

```bash
node scripts/progress.cjs --get "<topic>"
```

Returns full topic record or `null` if not found.

### Add Progress

```bash
node scripts/progress.cjs --add "<topic>" "<phase>" [metadata]
```

- `phase`: learn, practice, review, master
- `metadata`: optional string (difficulty for practice, "3/5" for master score)

Returns `{"ok": true, "topic": "..."}` on success.

### Get Summary

```bash
node scripts/progress.cjs --summary
```

Returns:
```json
{
  "total_topics": 5,
  "phases_coverage": {"learn": 5, "practice": 3, "review": 2, "master": 1},
  "average_mastery": 4.2,
  "recent_topics": ["example"]
}
```

### Reset a Topic

```bash
node scripts/progress.cjs --reset "<topic>"
```

Removes the topic record entirely. Use with caution -- ask for confirmation first.

## Data File

Progress is stored at `~/.config/opencode/learning-progress.json`. The script creates it automatically if it doesn't exist.

Structure:
```json
{
  "topics": {
    "service-container-binding": {
      "first_session": "2026-04-29",
      "last_session": "2026-04-29",
      "sessions": 2,
      "phases_completed": ["learn", "practice"],
      "max_difficulty_reached": "intermediate",
      "quiz_scores": [
        {"format": "multiple-choice", "score": "4/5", "date": "2026-04-29"}
      ]
    }
  }
}
```

Topics are slugified (lowercase, hyphens). The script handles this automatically.

## When to Use Me

- User asks "What have I covered?" → run `--list`
- User asks "How am I doing on X?" → run `--get X`
- User finishes a learning phase → orchestrator calls `--add` automatically
- User asks "Show my stats" → run `--summary`
- User wants to restart a topic → run `--reset` (confirm first)
