/** Migrate legacy v1 skill/status/enemy JSON to v2 StatFormula shape */
export function migrateToV2(raw: Record<string, unknown>): Record<string, unknown> {
  const version = (raw.schemaVersion as number | undefined) ?? 1;
  if (version >= 2) return raw;

  const migrated: Record<string, unknown> = { ...raw, schemaVersion: 2 };

  if (Array.isArray(migrated.effects)) {
    migrated.effects = (migrated.effects as Record<string, unknown>[]).map(migrateEffect);
  }

  if (Array.isArray(migrated.behaviors)) {
    migrated.behaviors = (migrated.behaviors as Record<string, unknown>[]).map(migrateBehavior);
  }

  if (migrated.baseStats && typeof migrated.baseStats === 'object') {
    migrated.baseStats = migrateBaseStats(migrated.baseStats as Record<string, unknown>);
  }

  return migrated;
}

function migrateEffect(effect: Record<string, unknown>): Record<string, unknown> {
  const type = effect.type as string;

  if (type === 'damage') {
    if ('value' in effect) return effect;
    const multiplier = (effect.multiplier as number | undefined) ?? 1;
    const flatBonus = (effect.flatBonus as number | undefined) ?? 0;
    const { multiplier: _m, flatBonus: _f, ...rest } = effect;
    return {
      ...rest,
      value: {
        base: flatBonus,
        terms: [{ source: 'stat', key: 'attack', ratio: multiplier }],
      },
    };
  }

  if (type === 'heal') {
    if ('value' in effect) return effect;
    const multiplier = (effect.multiplier as number | undefined) ?? 1;
    const flatBonus = (effect.flatBonus as number | undefined) ?? 0;
    const { multiplier: _m, flatBonus: _f, ...rest } = effect;
    return {
      ...rest,
      value: {
        base: flatBonus,
        terms: [{ source: 'stat', key: 'attack', ratio: multiplier }],
      },
    };
  }

  return effect;
}

function migrateBehavior(behavior: Record<string, unknown>): Record<string, unknown> {
  const type = behavior.type as string;

  if (type === 'dot') {
    if ('damagePerTurn' in behavior) return behavior;
    const damagePerStack = (behavior.damagePerStack as number | undefined) ?? 0;
    const { damagePerStack: _d, ...rest } = behavior;
    return {
      ...rest,
      damagePerTurn: { base: damagePerStack, terms: [] },
    };
  }

  if (type === 'stat_mod') {
    if ('value' in behavior) return behavior;
    const amountPerStack = (behavior.amountPerStack as number | undefined) ?? 0;
    const { amountPerStack: _a, ...rest } = behavior;
    return {
      ...rest,
      value: { base: amountPerStack, terms: [] },
    };
  }

  if (type === 'trigger' && behavior.effect && typeof behavior.effect === 'object') {
    return {
      ...behavior,
      effect: migrateEffect(behavior.effect as Record<string, unknown>),
    };
  }

  return behavior;
}

function migrateBaseStats(stats: Record<string, unknown>): Record<string, unknown> {
  const { critRate: _cr, critDamage: _cd, ...rest } = stats;
  return {
    ...rest,
    willpower: (rest.willpower as number | undefined) ?? 10,
    resistance: (rest.resistance as number | undefined) ?? 10,
  };
}
