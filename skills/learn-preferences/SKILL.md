---
name: learn-preferences
description: Manage user profiles so every learn-* skill can tailor its output to the right person. Acts as the single source of truth for stack, skill level, and focus.
---

# Skill: learn-preferences

## My Role

I manage user profiles so every learn-* skill can tailor its output to the right person. I'm the single source of truth for: stack, skill level, and focus. Every other learn skill must load me before generating content.

## Script Location

```
scripts/prefs.cjs
```

Run with:
```bash
node <skill-dir>/scripts/prefs.cjs [options]
```

## Preference Keys

| Key | Description | Valid Values | Default |
|-----|-------------|--------------|---------|
| `stack` | Primary engineering domain | `backend`, `frontend`, `fullstack` | `backend` |
| `focus` | Framework/language within that stack | `laravel`, `react`, `vue`, `go`, `python`, `rails`, `express`, etc. | `laravel` |
| `level` | Proficiency | `beginner`, `intermediate`, `advanced` | `intermediate` |

## Available Commands

### Get All Preferences

```bash
node scripts/prefs.cjs --get
```

Returns JSON:
```json
{
  "stack": "backend",
  "focus": "laravel",
  "level": "intermediate"
}
```

### Set a Preference

```bash
node scripts/prefs.cjs --set <key> <value>
```

Example: `node scripts/prefs.cjs --set focus react`

### Reset to Defaults

```bash
node scripts/prefs.cjs --reset
```

Prompts for confirmation. Clears all saved preferences back to defaults.

### Session Flags (temporary overrides)

```bash
node scripts/prefs.cjs --flags stack=frontend focus=react level=advanced
```

Returns the merged config (flags take precedence over saved values). These flags do NOT persist -- they only affect the current invocation. Use this when the user says "teach me react as an advanced dev" without wanting to change their defaults.

## Data File

Preferences are stored at `~/.config/opencode/learning-preferences.json`. The script creates it automatically if missing.

## How Other Skills Should Use Me

1. At the start of any learn session, load this skill.
2. Run `node <skill-dir>/scripts/prefs.cjs --get` to retrieve current preferences.
3. If the user provides session flags (e.g., "learn react routing" when their default is laravel), run with `--flags` instead to get a merged config.
4. Calibrate all content (analogies, code examples, difficulty, assumed knowledge) to the returned preferences.

**Calibration rules per skill:**

- **learn-tutor**: Adjust assumed knowledge. A beginner gets more fundamentals; a frontend dev gets React/Vue examples instead of Laravel.
- **learn-practice**: Generate exercises in the user's stack. Difficulty maps from level. Constraints match stack conventions.
- **learn-exam**: Design questions around the user's stack. Complexity matches level.
- **learn-review**: Evaluate code against conventions of the user's stack. Severity thresholds adjust to level.
- **learn-orchestrator**: Check preferences at session start. Accept flag overrides from user input.

## Don't

- Don't hard-code assumptions about the user anywhere else. All "who is the user" decisions go through this skill.
- Don't use session flags to silently persist changes. Flags are read-only overrides.

Base directory for this skill: file:///home/john/.config/opencode/skills/learn-preferences
Relative paths in this skill (e.g., scripts/, reference/) are relative to this base directory.
