#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_DIR="$HOME/.config/opencode/skills"
COMMANDS_DIR="$HOME/.config/opencode/commands"

echo "Installing learning skills and commands..."

mkdir -p "$SKILLS_DIR" "$COMMANDS_DIR"

echo ""
echo "Linking skills..."

for skill in learn-tutor learn-practice learn-review learn-exam learn-orchestrator learn-progress-tracker; do
  target="$SKILLS_DIR/$skill"
  source="$REPO_DIR/skills/$skill"
  if [[ -L "$target" ]]; then
    rm "$target"
  elif [[ -d "$target" ]]; then
    rm -rf "$target"
  fi
  ln -sfn "$source" "$target"
  echo "  $skill → $source"
done

echo ""
echo "Linking commands..."

for cmd in learn practice quiz; do
  target="$COMMANDS_DIR/$cmd.md"
  source="$REPO_DIR/opencode/commands/$cmd.md"
  if [[ -L "$target" ]]; then
    rm "$target"
  elif [[ -f "$target" ]]; then
    rm -f "$target"
  fi
  ln -sfn "$source" "$target"
  echo "  $cmd.md → $source"
done

echo ""
echo "Copying opencode config..."
CONFIG_TARGET="$HOME/.config/opencode/config.json"
if [[ -f "$CONFIG_TARGET" ]]; then
  echo "  Warning: $CONFIG_TARGET already exists. Merging skill permissions..."
  python3 -c "
import json
src = json.load(open('$REPO_DIR/opencode/opencode.json'))
try:
  dst = json.load(open('$CONFIG_TARGET'))
except (FileNotFoundError, json.JSONDecodeError):
  dst = {}
dst.setdefault('permission', {}).setdefault('skill', {}).update(
  src.get('permission', {}).get('skill', {})
)
json.dump(dst, open('$CONFIG_TARGET', 'w'), indent=2)
print('  Merged skill permissions into', '$CONFIG_TARGET')
"
else
  cp "$REPO_DIR/opencode/opencode.json" "$CONFIG_TARGET"
  echo "  opencode.json → $CONFIG_TARGET"
fi

echo ""
echo "Installation complete."
echo "Skills directory: $SKILLS_DIR"
echo "Commands directory: $COMMANDS_DIR"
echo ""
echo "Skills installed:"
ls -la "$SKILLS_DIR" | grep 'learn-' | awk '{print "  ", $NF}'
echo ""
echo "Commands installed:"
ls -la "$COMMANDS_DIR" | grep '.md' | awk '{print "  ", $NF}'
