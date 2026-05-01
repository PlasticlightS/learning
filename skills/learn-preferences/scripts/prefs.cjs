#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_PATH = path.join(os.homedir(), '.config', 'opencode', 'learning-preferences.json');

const DEFAULTS = {
  stack: 'backend',
  focus: 'laravel',
  level: 'intermediate',
};

const VALID = {
  stack: ['backend', 'frontend', 'fullstack'],
  level: ['beginner', 'intermediate', 'advanced'],
};

function load() {
  try {
    if (fs.existsSync(DATA_PATH)) {
      const raw = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
      return { ...DEFAULTS, ...raw };
    }
  } catch (e) {
    // corrupt file -- start fresh
  }
  return { ...DEFAULTS };
}

function save(data) {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function cmdGet() {
  const prefs = load();
  console.log(JSON.stringify(prefs, null, 2));
}

function cmdSet(key, value) {
  if (!(key in DEFAULTS)) {
    console.error(`Unknown preference key: ${key}`);
    console.error(`Valid keys: ${Object.keys(DEFAULTS).join(', ')}`);
    process.exit(1);
  }

  if (VALID[key] && !VALID[key].includes(value)) {
    console.error(`Invalid value "${value}" for key "${key}"`);
    console.error(`Valid values: ${VALID[key].join(', ')}`);
    process.exit(1);
  }

  const prefs = load();
  prefs[key] = value;
  save(prefs);
  console.log(JSON.stringify({ ok: true, key, value }, null, 2));
}

function cmdReset() {
  save({ ...DEFAULTS });
  console.log(JSON.stringify({ ok: true, reset: true, defaults: DEFAULTS }, null, 2));
}

function cmdFlags(flagArgs) {
  const prefs = load();
  const flags = {};

  for (const arg of flagArgs) {
    const eqIdx = arg.indexOf('=');
    if (eqIdx === -1) {
      console.error(`Invalid flag format: "${arg}". Expected key=value`);
      process.exit(1);
    }
    const key = arg.slice(0, eqIdx);
    const value = arg.slice(eqIdx + 1);

    if (!(key in DEFAULTS)) {
      console.error(`Unknown flag key: ${key}. Valid keys: ${Object.keys(DEFAULTS).join(', ')}`);
      process.exit(1);
    }
    if (VALID[key] && !VALID[key].includes(value)) {
      console.error(`Invalid value "${value}" for flag "${key}". Valid: ${VALID[key].join(', ')}`);
      process.exit(1);
    }
    flags[key] = value;
  }

  const merged = { ...prefs, ...flags };
  console.log(JSON.stringify(merged, null, 2));
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--get')) return cmdGet();

  if (args.includes('--set') && args[args.indexOf('--set') + 1] && args[args.indexOf('--set') + 2]) {
    return cmdSet(args[args.indexOf('--set') + 1], args[args.indexOf('--set') + 2]);
  }

  if (args.includes('--reset')) return cmdReset();

  if (args.includes('--flags')) {
    const flagIdx = args.indexOf('--flags');
    const flagArgs = args.slice(flagIdx + 1);
    if (flagArgs.length === 0) {
      console.error('--flags requires at least one key=value pair');
      process.exit(1);
    }
    return cmdFlags(flagArgs);
  }

  console.log(`Usage: prefs.cjs [--get | --set <key> <value> | --reset | --flags key=value ...]

Manage learning preferences for the learn-* skill ecosystem.

Commands:
  --get                  Show current preferences
  --set <key> <value>    Set a preference (stack, focus, level)
  --reset                Reset all preferences to defaults
  --flags key=value ...  Merge session flags (read-only, does not save)

Preference keys:
  stack    backend | frontend | fullstack     (default: backend)
  focus    any framework/language slug         (default: laravel)
  level    beginner | intermediate | advanced  (default: intermediate)`);
}

main();
