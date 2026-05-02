# Learning Skills

Guided learning through a Learn → Practice → Review → Master cycle. Stack and skill level aware.

## Skills

| Skill                    | Description                                                                                                         |
|--------------------------|---------------------------------------------------------------------------------------------------------------------|
| `learn-preferences`      | Manages user profiles — stack, focus (framework), and proficiency level. Every other skill calibrates to these.     |
| `learn-tutor`            | Explains software engineering concepts through analogies, core mechanics, real-world use cases, and common pitfalls |
| `learn-practice`         | Generates coding exercises at Junior, Mid, or Senior difficulty in the user's stack                                 |
| `learn-review`           | Reviews submitted code against best practices, correctness, and efficiency with an ideal version                    |
| `learn-exam`             | Tests abstract understanding through Multiple Choice, Spot-the-Flaw, or Tradeoff Debate questions                   |
| `learn-orchestrator`     | Guides through the full Learn → Practice → Review → Master cycle by chaining the other skills                       |
| `learn-progress-tracker` | Tracks learning progress across topics — records sessions, phases, difficulty levels, and quiz scores               |
| `learn-speech`           | Adds voice interaction — speaks learning content aloud via Piper TTS and listens for spoken answers via whisper.cpp |

## Install

### Via skills CLI

```bash
npx skills add PlasticlightS/learning
```

This installs all eight skills to your agent. Works with any [supported agent](https://skills.sh) including OpenCode, Claude Code, Codex, Cursor, and more.

### OpenCode-specific setup (commands + permissions)

```bash
./.opencode/install.sh
```

This symlinks the skills, commands (`/learn`, `/practice`, `/quiz`), and merges skill permissions into your OpenCode config.

## Voice Interaction (Optional)

The `learn-speech` skill can speak learning content aloud and listen for your spoken answers. This requires three free tools:

| Tool                                                   | What it does                          |
|--------------------------------------------------------|---------------------------------------|
| [Piper](https://github.com/OHF-Voice/piper1-gpl)       | Neural text-to-speech (natural voice) |
| [whisper.cpp](https://github.com/ggml-org/whisper.cpp) | Speech-to-text transcription          |
| [sox](http://sox.sourceforge.net/)                     | Audio recording with VAD auto-stop    |

When Piper and whisper.cpp are installed, the agent will:

- **Offer to speak** explanations and quiz questions aloud ("Shall I read this aloud?")
- **Listen for answers** during quizzes — speak your answer and pause, VAD auto-stops the recording
- **Fall back silently** to text-only mode if the tools are missing — no errors, no prompts
- Only activate the microphone during active learning sessions — never left open between utterances

### Setup

<details>
<summary>Docker</summary>

Build the image (once). The agent runs it automatically during learning sessions — no further action needed:

```bash
docker build -t learn-speech .
```

The agent passes host audio through (`--device /dev/snd`) and shells out to `piper | play` for TTS and `rec ... | whisper-cli` for STT inside the container.

</details>

<details>
<summary>Native install</summary>

<details>
<summary>Linux</summary>

#### Prerequisites

- C++ compiler (`gcc-c++` / `build-essential` / `clang`)
- `git`
- `cmake`
- `pip`
- `wget`

#### Arch Linux

```bash
sudo pacman -S sox
```

#### Ubuntu / Debian

```bash
sudo apt install sox
```

#### Fedora

```bash
sudo dnf install sox
```

#### Common Steps

```bash
pip install piper-tts

git clone https://github.com/ggml-org/whisper.cpp.git /tmp/whisper.cpp
cmake -S /tmp/whisper.cpp -B /tmp/whisper.cpp/build -DCMAKE_BUILD_TYPE=Release
cmake --build /tmp/whisper.cpp/build -j
sudo cp /tmp/whisper.cpp/build/bin/whisper-cli /usr/local/bin/
rm -rf /tmp/whisper.cpp
```

</details>

<details>
<summary>macOS</summary>

#### Prerequisites

- `brew`
- `pip`

```bash
brew install sox whisper-cpp
pip install piper-tts
```

</details>

<details>
<summary>Windows (WSL)</summary>

Run the Linux instructions for your WSL distro inside WSL. Everything works identically — no Windows-specific steps needed.

</details>

### Common steps (all native installs)

Download the voice model and whisper model:

```bash
mkdir -p ~/.local/share/piper-voices
wget -O ~/.local/share/piper-voices/en_GB-semaine-medium.onnx \
  https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_GB/semaine/medium/en_GB-semaine-medium.onnx
wget -O ~/.local/share/piper-voices/en_GB-semaine-medium.onnx.json \
  https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_GB/semaine/medium/en_GB-semaine-medium.onnx.json

mkdir -p ~/.local/share/whisper-cpp
wget -O ~/.local/share/whisper-cpp/ggml-base.en.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin
```

### Verify installation

```bash
echo "Hello, this is your voice assistant." \
  | piper --model ~/.local/share/piper-voices/en_GB-semaine-medium.onnx | play -t wav -

rec -r 16000 -c 1 -b 16 /tmp/speech.wav trim 0 60 silence 1 0.1 2% 1 2.0 2%
whisper-cli -m ~/.local/share/whisper-cpp/ggml-base.en.bin -f /tmp/speech.wav --no-timestamps
```

</details>

## Getting Started

### 1. Set up your preferences

On first run, the orchestrator will ask about your background:

```
What's your primary stack? [backend / frontend / fullstack]
What framework/language are you most focused on? [laravel, react, vue, go, python, ...]
What's your proficiency level? [junior / mid / senior]
```

You can also ask your agent to update preferences at any time:

```
Set my focus to Laravel and level to mid.
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
Teach me goroutines as a senior Go developer.
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
