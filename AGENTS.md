# AGENTS.md

## Repo nature

This is an AI agent **skill pack**, not an application. It contains 7 learning skills used by agents. There is no build, test, lint, or CI pipeline. There is an OpenCode specific installer script for OpenCode specific features.

## Directory map

- `skills/<name>/SKILL.md` — skill definitions (one file per skill, loaded by agents skill tool)
- `.opencode` — contains extras specific to OpenCode
- `.opencode/commands/` — slash command definitions (`/learn`, `/practice`, `/quiz`) that load the orchestrator skill
- `.opencode/opencode.json` — pre-approves the 7 skill names so they run without permission prompts
- `.opencode/install.sh` — symlinks skills into `~/.config/opencode/skills/` and commands into `~/.config/opencode/commands/`, then merges `opencode.json` into `~/.config/opencode/config.json`

## Skill structure conventions

Each skill's `SKILL.md` contains instructions and workflows. Skills reference each other by name (e.g. the orchestrator loads `learn-tutor`, `learn-practice`, etc.). If renaming or adding a skill, update:
1. Any orchestrator skill references
2. `install.sh` loop
3. `opencode.json` permissions

## Progress data

Progress is stored externally at `~/.config/opencode/learning-progress.json`, not in this repo. The progress-tracker skill defines the schema.

## Installation

Run `.opencode/install.sh` from the repo root. It expects `$REPO_DIR/skills/` to contain all 7 skill directories.
