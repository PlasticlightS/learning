---
description: Generate a coding exercise for a topic at beginner, intermediate, or advanced difficulty
subtask: true
---
The user wants a coding exercise about $ARGUMENTS.

Load the learn-practice skill and present a coding challenge for this topic.

If the user has studied this topic before (check progress:
!`node ~/.config/opencode/skills/learn-progress-tracker/scripts/progress.cjs --get "$ARGUMENTS"`)
suggest starting at the appropriate difficulty level -- otherwise ask the user
for their preferred difficulty level.
