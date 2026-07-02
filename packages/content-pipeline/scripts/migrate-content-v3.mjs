#!/usr/bin/env node
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const contentRoot = join(repoRoot, 'content');

function walkJson(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) results.push(...walkJson(full));
    else if (entry.endsWith('.json')) results.push(full);
  }
  return results;
}

function convertEffect(effect) {
  if (effect.type === 'apply_tag') return effect;
  if (effect.type === 'apply_status') {
    const { statusId, type, ...rest } = effect;
    return { type: 'apply_tag', tagId: statusId.replace(/^status_/, 'tag_'), ...rest };
  }
  if (effect.type === 'damage') {
    const { type, element, value, pierce, multiplier, flatBonus, ...rest } = effect;
    let damageValue = value;
    if (!damageValue) {
      damageValue = {
        base: flatBonus ?? 0,
        terms: [{ source: 'stat', key: 'attack', ratio: multiplier ?? 1 }],
      };
    }
    return {
      type: 'apply_tag',
      tagId: 'tag_damage',
      chance: 1,
      ...rest,
      overrides: {
        instant_damage: { element: element ?? 'physical', value: damageValue, ...(pierce ? { pierce } : {}) },
      },
    };
  }
  if (effect.type === 'heal') {
    const { type, value, multiplier, flatBonus, ...rest } = effect;
    let healValue = value;
    if (!healValue) {
      healValue = {
        base: flatBonus ?? 0,
        terms: [{ source: 'stat', key: 'attack', ratio: multiplier ?? 1 }],
      };
    }
    return {
      type: 'apply_tag',
      tagId: 'tag_instant_heal',
      chance: 1,
      ...rest,
      overrides: { instant_heal: { value: healValue } },
    };
  }
  if (effect.type === 'shield') {
    const { type, value, duration, ...rest } = effect;
    return {
      type: 'apply_tag',
      tagId: 'tag_shield_grant',
      chance: 1,
      ...rest,
      overrides: { shield_grant: { value, duration } },
    };
  }
  if (effect.type === 'move') {
    const { type, range, rangeFormula, ...rest } = effect;
    return {
      type: 'apply_tag',
      tagId: 'tag_move',
      chance: 1,
      ...rest,
      overrides: { move: { range, ...(rangeFormula ? { rangeFormula } : {}) } },
    };
  }
  if (effect.type === 'teleport') {
    const { type, range, rangeFormula, ...rest } = effect;
    return {
      type: 'apply_tag',
      tagId: 'tag_teleport',
      chance: 1,
      ...rest,
      overrides: { teleport: { range, ...(rangeFormula ? { rangeFormula } : {}) } },
    };
  }
  if (effect.type === 'summon') {
    const { type, entityDefinitionId, position, ...rest } = effect;
    return {
      type: 'apply_tag',
      tagId: 'tag_summon',
      chance: 1,
      ...rest,
      overrides: { summon: { entityDefinitionId, ...(position ? { position } : {}) } },
    };
  }
  return effect;
}

function migrateTagJson(raw) {
  const migrated = { ...raw, schemaVersion: 3 };
  if (migrated.tags && !migrated.labels) {
    migrated.labels = migrated.tags;
    delete migrated.tags;
  }
  if (typeof migrated.id === 'string') {
    migrated.id = migrated.id.replace(/^status_/, 'tag_');
  }
  if (Array.isArray(migrated.behaviors)) {
    migrated.behaviors = migrated.behaviors.map((b) => {
      if (b.type === 'trigger' && b.effect) {
        return { ...b, effect: convertEffect(b.effect) };
      }
      return b;
    });
  }
  return migrated;
}

function migrateSkillJson(raw) {
  const migrated = { ...raw, schemaVersion: 3 };
  if (migrated.tags && !migrated.labels) {
    migrated.labels = migrated.tags;
    delete migrated.tags;
  }
  if (Array.isArray(migrated.effects)) {
    migrated.effects = migrated.effects.map(convertEffect);
  }
  return migrated;
}

// Migrate statuses -> tags
const statusesDir = join(contentRoot, 'statuses');
const tagsDir = join(contentRoot, 'tags');
try {
if (statSync(statusesDir).isDirectory()) {
  for (const file of walkJson(statusesDir)) {
    const rel = file.slice(statusesDir.length + 1);
    const dest = join(tagsDir, rel.replace(/status_/g, 'tag_'));
    mkdirSync(dirname(dest), { recursive: true });
    const raw = JSON.parse(readFileSync(file, 'utf-8'));
    writeFileSync(dest, JSON.stringify(migrateTagJson(raw), null, 2) + '\n');
  }
  rmSync(statusesDir, { recursive: true, force: true });
}
} catch { /* statuses already migrated */ }

// Base tag templates
const baseTags = [
  {
    path: 'instant/tag_damage.json',
    data: {
      schemaVersion: 3,
      id: 'tag_damage',
      name: 'Instant Damage',
      description: 'Deals damage immediately on apply.',
      duration: 0,
      stackable: false,
      maxStacks: 1,
      category: 'instant',
      behaviors: [
        {
          type: 'instant_damage',
          element: 'physical',
          value: { base: 0, terms: [{ source: 'stat', key: 'attack', ratio: 1 }] },
        },
      ],
    },
  },
  {
    path: 'instant/tag_instant_heal.json',
    data: {
      schemaVersion: 3,
      id: 'tag_instant_heal',
      name: 'Instant Heal',
      description: 'Heals immediately on apply.',
      duration: 0,
      stackable: false,
      maxStacks: 1,
      category: 'instant',
      behaviors: [
        {
          type: 'instant_heal',
          value: { base: 0, terms: [{ source: 'stat', key: 'attack', ratio: 1 }] },
        },
      ],
    },
  },
  {
    path: 'instant/tag_shield_grant.json',
    data: {
      schemaVersion: 3,
      id: 'tag_shield_grant',
      name: 'Shield',
      description: 'Grants a damage-absorbing shield.',
      duration: 0,
      stackable: false,
      maxStacks: 1,
      category: 'instant',
      behaviors: [
        {
          type: 'shield_grant',
          value: { base: 0, terms: [{ source: 'stat', key: 'attack', ratio: 1 }] },
          duration: 2,
        },
      ],
    },
  },
  {
    path: 'instant/tag_move.json',
    data: {
      schemaVersion: 3,
      id: 'tag_move',
      name: 'Move',
      description: 'Moves the caster toward a destination.',
      duration: 0,
      stackable: false,
      maxStacks: 1,
      category: 'instant',
      behaviors: [{ type: 'move', range: 1 }],
    },
  },
  {
    path: 'instant/tag_teleport.json',
    data: {
      schemaVersion: 3,
      id: 'tag_teleport',
      name: 'Teleport',
      description: 'Teleports the caster to a tile.',
      duration: 0,
      stackable: false,
      maxStacks: 1,
      category: 'instant',
      behaviors: [{ type: 'teleport', range: 1 }],
    },
  },
  {
    path: 'instant/tag_summon.json',
    data: {
      schemaVersion: 3,
      id: 'tag_summon',
      name: 'Summon',
      description: 'Summons an entity.',
      duration: 0,
      stackable: false,
      maxStacks: 1,
      category: 'instant',
      behaviors: [{ type: 'summon', entityDefinitionId: 'enemy_goblin' }],
    },
  },
  {
    path: 'buff/tag_absorb.json',
    data: {
      schemaVersion: 3,
      id: 'tag_absorb',
      name: 'Absorb',
      description: 'Converts a portion of damage taken into healed HP.',
      duration: 3,
      stackable: false,
      maxStacks: 1,
      category: 'buff',
      behaviors: [
        { type: 'absorb', percent: { base: 0.1, terms: [{ source: 'stat', key: 'resistance', ratio: 0.01 }] } },
      ],
    },
  },
  {
    path: 'buff/tag_lifesteal.json',
    data: {
      schemaVersion: 3,
      id: 'tag_lifesteal',
      name: 'Life Steal',
      description: 'Converts a portion of damage dealt into healed HP.',
      duration: 3,
      stackable: false,
      maxStacks: 1,
      category: 'buff',
      behaviors: [
        { type: 'lifesteal', percent: { base: 0.1, terms: [{ source: 'stat', key: 'attack', ratio: 0.005 }] } },
      ],
    },
  },
  {
    path: 'buff/tag_reflect.json',
    data: {
      schemaVersion: 3,
      id: 'tag_reflect',
      name: 'Reflect',
      description: 'Returns a portion of damage taken to the attacker.',
      duration: 3,
      stackable: false,
      maxStacks: 1,
      category: 'buff',
      behaviors: [
        { type: 'reflect', percent: { base: 0.15, terms: [{ source: 'stat', key: 'defense', ratio: 0.005 }] } },
      ],
    },
  },
  {
    path: 'buff/tag_cleanse.json',
    data: {
      schemaVersion: 3,
      id: 'tag_cleanse',
      name: 'Cleanse',
      description: 'Removes negative effects from self.',
      duration: 0,
      stackable: false,
      maxStacks: 1,
      category: 'buff',
      behaviors: [{ type: 'cleanse', polarity: 'negative' }],
    },
  },
  {
    path: 'debuff/tag_clear.json',
    data: {
      schemaVersion: 3,
      id: 'tag_clear',
      name: 'Clear',
      description: 'Removes positive effects from the enemy.',
      duration: 0,
      stackable: false,
      maxStacks: 1,
      category: 'debuff',
      behaviors: [{ type: 'clear', polarity: 'positive' }],
    },
  },
  {
    path: 'debuff/tag_damage.json',
    data: {
      schemaVersion: 3,
      id: 'tag_damage',
      name: 'Damage',
      description: 'Persistent damage over time.',
      duration: 3,
      stackable: true,
      maxStacks: 3,
      category: 'debuff',
      behaviors: [
        {
          type: 'dot',
          element: 'physical',
          damagePerTurn: { base: 5, terms: [{ source: 'stat', key: 'attack', ratio: 0.2 }] },
        },
      ],
    },
  },
];

for (const { path, data } of baseTags) {
  const dest = join(tagsDir, path);
  mkdirSync(dirname(dest), { recursive: true });
  if (!statSync(dest, { throwIfNoEntry: false })) {
    writeFileSync(dest, JSON.stringify(data, null, 2) + '\n');
  }
}

// Migrate skills
for (const file of walkJson(join(contentRoot, 'skills'))) {
  const raw = JSON.parse(readFileSync(file, 'utf-8'));
  writeFileSync(file, JSON.stringify(migrateSkillJson(raw), null, 2) + '\n');
}

// Migrate enemies labels
for (const file of walkJson(join(contentRoot, 'enemies'))) {
  const raw = JSON.parse(readFileSync(file, 'utf-8'));
  const migrated = { ...raw, schemaVersion: 3 };
  if (migrated.tags && !migrated.labels) {
    migrated.labels = migrated.tags;
    delete migrated.tags;
  }
  writeFileSync(file, JSON.stringify(migrated, null, 2) + '\n');
}

// Update combat_stats.json
const combatStatsPath = join(contentRoot, 'config', 'combat_stats.json');
const combatStats = JSON.parse(readFileSync(combatStatsPath, 'utf-8'));
if (combatStats.formulas?.statusApplication) {
  combatStats.formulas.tagApplication = combatStats.formulas.statusApplication;
  delete combatStats.formulas.statusApplication;
}
combatStats.schemaVersion = 3;
writeFileSync(combatStatsPath, JSON.stringify(combatStats, null, 2) + '\n');

console.log('Content migration v3 complete');
