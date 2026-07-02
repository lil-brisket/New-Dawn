/** Migrate v2 content JSON to v3 tags-first format (in-memory, at load time) */
export function migrateToV3(raw: Record<string, unknown>): Record<string, unknown> {
  const version = (raw.schemaVersion as number | undefined) ?? 1;
  let migrated = { ...raw };

  if (version < 2) {
    return migrated;
  }

  if (version >= 3) {
    return migrated;
  }

  migrated = { ...migrated, schemaVersion: 3 };

  if ('tags' in migrated && !('labels' in migrated)) {
    migrated.labels = migrated.tags;
    delete migrated.tags;
  }

  if (typeof migrated.id === 'string') {
    migrated.id = (migrated.id as string).replace(/^status_/, 'tag_');
  }

  if (Array.isArray(migrated.effects)) {
    migrated.effects = (migrated.effects as Record<string, unknown>[]).map(convertEffectToApplyTag);
  }

  if (Array.isArray(migrated.behaviors)) {
    migrated.behaviors = (migrated.behaviors as Record<string, unknown>[]).map(migrateBehavior);
  }

  return migrated;
}

function convertEffectToApplyTag(effect: Record<string, unknown>): Record<string, unknown> {
  const type = effect.type as string;

  if (type === 'apply_tag') return effect;

  if (type === 'apply_status') {
    const statusId = (effect.statusId as string).replace(/^status_/, 'tag_');
    const { statusId: _s, type: _t, ...rest } = effect;
    return { type: 'apply_tag', tagId: statusId, ...rest };
  }

  if (type === 'damage') {
    const { type: _t, element, value, pierce, multiplier, flatBonus, ...rest } = effect;
    let damageValue = value;
    if (!damageValue && multiplier !== undefined) {
      damageValue = {
        base: (flatBonus as number | undefined) ?? 0,
        terms: [{ source: 'stat', key: 'attack', ratio: (multiplier as number) ?? 1 }],
      };
    }
    return {
      type: 'apply_tag',
      tagId: 'tag_damage',
      chance: 1,
      ...rest,
      overrides: {
        instant_damage: {
          element: element ?? 'physical',
          value: damageValue,
          ...(pierce !== undefined ? { pierce } : {}),
        },
      },
    };
  }

  if (type === 'heal') {
    const { type: _t, value, multiplier, flatBonus, ...rest } = effect;
    let healValue = value;
    if (!healValue && multiplier !== undefined) {
      healValue = {
        base: (flatBonus as number | undefined) ?? 0,
        terms: [{ source: 'stat', key: 'attack', ratio: (multiplier as number) ?? 1 }],
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

  if (type === 'shield') {
    const { type: _t, value, duration, ...rest } = effect;
    return {
      type: 'apply_tag',
      tagId: 'tag_shield_grant',
      chance: 1,
      ...rest,
      overrides: { shield_grant: { value, duration } },
    };
  }

  if (type === 'move') {
    const { type: _t, range, rangeFormula, ...rest } = effect;
    return {
      type: 'apply_tag',
      tagId: 'tag_move',
      chance: 1,
      ...rest,
      overrides: { move: { range, ...(rangeFormula ? { rangeFormula } : {}) } },
    };
  }

  if (type === 'teleport') {
    const { type: _t, range, rangeFormula, ...rest } = effect;
    return {
      type: 'apply_tag',
      tagId: 'tag_move',
      chance: 1,
      ...rest,
      overrides: {
        move: { range, teleport: true, ...(rangeFormula ? { rangeFormula } : {}) },
      },
    };
  }

  if (type === 'summon') {
    const { type: _t, entityDefinitionId, position, ...rest } = effect;
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

function migrateBehavior(behavior: Record<string, unknown>): Record<string, unknown> {
  if (behavior.type === 'trigger' && behavior.effect && typeof behavior.effect === 'object') {
    return {
      ...behavior,
      effect: convertEffectToApplyTag(behavior.effect as Record<string, unknown>),
    };
  }
  return behavior;
}
