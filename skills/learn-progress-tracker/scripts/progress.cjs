#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_PATH = path.join(os.homedir(), '.config', 'opencode', 'learning-progress.json');

function load() {
  try {
    if (fs.existsSync(DATA_PATH)) {
      return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    }
  } catch (e) {
    // corrupt file -- start fresh
  }
  return { topics: {} };
}

function save(data) {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function parseFlags(args) {
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--flag=')) {
      const eq = args[i].indexOf('=');
      const parts = args[i].slice(eq + 1).split('=', 2);
      if (parts.length === 2) flags[parts[0]] = parts[1];
    }
  }
  return flags;
}

function cmdList(data) {
  const summaries = Object.entries(data.topics)
    .map(([topic, rec]) => ({
      topic,
      sessions: rec.sessions,
      last_session: rec.last_session,
      phases_completed: rec.phases_completed,
      max_difficulty_reached: rec.max_difficulty_reached,
      quiz_scores: rec.quiz_scores.length > 0
        ? rec.quiz_scores.map(s => `${s.score} (${s.format})`).join(', ')
        : 'none',
      focus: rec.focus || null,
      level: rec.level || null,
    }));
  console.log(JSON.stringify(summaries, null, 2));
}

function cmdGet(data, topic) {
  const rec = data.topics[topic] || null;
  console.log(JSON.stringify(rec, null, 2));
}

function cmdAdd(data, topic, phase, metadata, flags) {
  const slug = slugify(topic);
  if (!data.topics[slug]) {
    data.topics[slug] = {
      first_session: new Date().toISOString().split('T')[0],
      last_session: new Date().toISOString().split('T')[0],
      sessions: 1,
      phases_completed: [],
      max_difficulty_reached: null,
      quiz_scores: [],
      focus: flags.focus || null,
      level: flags.level || null,
    };
  } else {
    data.topics[slug].last_session = new Date().toISOString().split('T')[0];
    data.topics[slug].sessions++;

    if (flags.focus && data.topics[slug].focus !== flags.focus) {
      data.topics[slug].focus = flags.focus;
    }
    if (flags.level && data.topics[slug].level !== flags.level) {
      data.topics[slug].level = flags.level;
    }
  }

  const rec = data.topics[slug];

  if (phase === 'learn') {
    if (!rec.phases_completed.includes('learn')) rec.phases_completed.push('learn');
  } else if (phase === 'practice') {
    if (!rec.phases_completed.includes('practice')) rec.phases_completed.push('practice');
    if (metadata) rec.max_difficulty_reached = metadata;
  } else if (phase === 'review') {
    if (!rec.phases_completed.includes('review')) rec.phases_completed.push('review');
  } else if (phase === 'master') {
    if (!rec.phases_completed.includes('master')) rec.phases_completed.push('master');
    if (metadata) {
      const parts = metadata.trim().split(/\s+/);
      const score = parts[0] || metadata;
      const format = parts.slice(1).join(' ') || 'unknown';
      rec.quiz_scores.push({
        format,
        score,
        date: new Date().toISOString().split('T')[0],
      });
    }
  }

  save(data);
  console.log(JSON.stringify({ ok: true, topic: slug }, null, 2));
}

function cmdSummary(data) {
  const topics = Object.values(data.topics);
  const total_topics = topics.length;

  const phases_coverage = { learn: 0, practice: 0, review: 0, master: 0 };
  for (const t of topics) {
    for (const ph of t.phases_completed) {
      if (phases_coverage[ph] !== undefined) phases_coverage[ph]++;
    }
  }

  const scores = topics
    .flatMap(t => t.quiz_scores)
    .map(s => {
      const parts = s.score.split('/');
      return parts[0] && parts[1] ? parseFloat(parts[0]) / parseFloat(parts[1]) * 5 : null;
    })
    .filter(Boolean);

  const average_mastery = scores.length > 0
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
    : 0;

  const recent_topics = Object.entries(data.topics)
    .sort(([, a], [, b]) => b.last_session.localeCompare(a.last_session))
    .slice(0, 5)
    .map(([topic, rec]) => ({
      topic,
      last_session: rec.last_session,
      phases: rec.phases_completed,
      focus: rec.focus,
      level: rec.level,
    }));

  const focusBreakdown = {};
  for (const t of topics) {
    const f = t.focus || 'unknown';
    focusBreakdown[f] = (focusBreakdown[f] || 0) + 1;
  }

  const levelBreakdown = {};
  for (const t of topics) {
    const l = t.level || 'unknown';
    levelBreakdown[l] = (levelBreakdown[l] || 0) + 1;
  }

  console.log(JSON.stringify({
    total_topics,
    phases_coverage,
    average_mastery,
    recent_topics,
    focus_breakdown: focusBreakdown,
    level_breakdown: levelBreakdown,
  }, null, 2));
}

function cmdReset(data, topic) {
  delete data.topics[topic];
  save(data);
  console.log(JSON.stringify({ ok: true, removed: topic }, null, 2));
}

function main() {
  const args = process.argv.slice(2);
  const data = load();
  const flags = parseFlags(args);

  if (args.includes('--list')) return cmdList(data);
  if (args.includes('--get') && args[args.indexOf('--get') + 1])
    return cmdGet(data, args[args.indexOf('--get') + 1]);
  if (args.includes('--add') && args[args.indexOf('--add') + 1] && args[args.indexOf('--add') + 2])
    return cmdAdd(data, args[args.indexOf('--add') + 1], args[args.indexOf('--add') + 2], args[args.indexOf('--add') + 3] || null, flags);
  if (args.includes('--summary')) return cmdSummary(data);
  if (args.includes('--reset') && args[args.indexOf('--reset') + 1])
    return cmdReset(data, args[args.indexOf('--reset') + 1]);

  console.log('Usage: progress.cjs [--list | --get <topic> | --add <topic> <phase> [metadata] [--flag=focus=laravel] [--flag=level=intermediate] | --summary | --reset <topic>]');
}

main();
