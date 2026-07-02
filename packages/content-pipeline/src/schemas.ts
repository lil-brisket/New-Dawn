import type { ApplyTagEffect, TagBehavior } from '@dawn/types';
import { z } from 'zod';

const elementType = z.enum([
  'physical',
  'fire',
  'ice',
  'lightning',
  'wind',
  'earth',
  'light',
  'dark',
]);

const itemRarity = z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']);

const formulaTermSource = z.enum([
  'stat',
  'stacks',
  'level',
  'missing_hp',
  'hp_percent',
  'distance',
]);

export const combatStatsConfigSchema = z.object({
  schemaVersion: z.number().int().min(1),
  stats: z.array(
    z.object({
      id: z.string().min(1),
      label: z.string().min(1),
    }),
  ),
  formulas: z.object({
    tagApplication: z.object({
      attackerStat: z.string().min(1),
      defenderStat: z.string().min(1),
      perPointDelta: z.number(),
    }),
    durationReduction: z.object({
      defenderStat: z.string().min(1),
      perPointReduction: z.number().min(0),
      minDuration: z.number().int().min(0),
    }),
  }),
});

export const contentMetadataSchema = z
  .object({
    category: z.string().optional(),
    element: elementType.optional(),
    weaponType: z.string().optional(),
    job: z.string().optional(),
    rarity: itemRarity.optional(),
    labels: z.array(z.string()).optional(),
    unlockLevel: z.number().int().min(0).optional(),
  })
  .strict()
  .partial();

export function createFormulaSchemas(statIds: readonly string[]) {
  const statIdSchema = z.string().refine((id) => statIds.includes(id), {
    message: `Unknown stat: must be one of ${statIds.join(', ')}`,
  });

  const hexCoordSchema = z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  });

  const formulaTermSchema = z.object({
    source: formulaTermSource,
    key: z.string(),
    ratio: z.number(),
  });

  const statFormulaSchema = z.object({
    base: z.number(),
    terms: z.array(formulaTermSchema),
  });

  const durationFormulaSchema = z.object({
    stat: statIdSchema,
    ratio: z.number(),
    maxBonus: z.number().optional(),
  });

  const applicationFormulaSchema = z.object({
    attackerStat: statIdSchema,
    defenderStat: statIdSchema,
    perPointDelta: z.number(),
  });

  const tagBehaviorOverridesSchema = z
    .object({
      instant_damage: z
        .object({
          element: elementType.optional(),
          value: statFormulaSchema.optional(),
          pierce: z.boolean().optional(),
        })
        .optional(),
      instant_heal: z.object({ value: statFormulaSchema.optional() }).optional(),
      shield_grant: z
        .object({
          value: statFormulaSchema.optional(),
          duration: z.number().int().min(1).max(2).optional(),
        })
        .optional(),
      move: z
        .object({
          range: z.number().int().min(0).optional(),
          rangeFormula: statFormulaSchema.optional(),
          teleport: z.boolean().optional(),
        })
        .optional(),
      teleport: z
        .object({
          range: z.number().int().min(0).optional(),
          rangeFormula: statFormulaSchema.optional(),
        })
        .optional(),
      summon: z
        .object({
          entityDefinitionId: z.string().optional(),
          position: hexCoordSchema.optional(),
        })
        .optional(),
    })
    .optional();

  const applyTagEffectSchema: z.ZodType<ApplyTagEffect> = z.lazy(() =>
    z.object({
      type: z.literal('apply_tag'),
      tagId: z.string(),
      chance: z.number().min(0).max(1),
      duration: z.number().int().min(0).optional(),
      durationFormula: durationFormulaSchema.optional(),
      applicationFormula: applicationFormulaSchema.optional(),
      overrides: tagBehaviorOverridesSchema,
    }),
  ) as z.ZodType<ApplyTagEffect>;

  const skillEffectSchema = applyTagEffectSchema;

  const targetingSchema = z.discriminatedUnion('type', [
    z.object({ type: z.literal('single_enemy'), range: z.number().int().min(0) }),
    z.object({ type: z.literal('single_ally'), range: z.number().int().min(0) }),
    z.object({ type: z.literal('self') }),
    z.object({ type: z.literal('tile'), range: z.number().int().min(0) }),
    z.object({
      type: z.literal('area'),
      range: z.number().int().min(0),
      radius: z.number().int().min(0),
      filter: z.enum(['enemy', 'ally', 'all']),
      center: z.enum(['unit', 'tile']),
    }),
  ]);

  const tagBehaviorSchema: z.ZodType<TagBehavior> = z.lazy(() =>
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('instant_damage'),
        element: elementType,
        value: statFormulaSchema,
        pierce: z.boolean().optional(),
      }),
      z.object({
        type: z.literal('instant_heal'),
        value: statFormulaSchema,
      }),
      z.object({
        type: z.literal('shield_grant'),
        value: statFormulaSchema,
        duration: z.number().int().min(1).max(2).optional(),
      }),
      z.object({
        type: z.literal('move'),
        range: z.number().int().min(0),
        rangeFormula: statFormulaSchema.optional(),
        teleport: z.boolean().optional(),
      }),
      z.object({
        type: z.literal('teleport'),
        range: z.number().int().min(0),
        rangeFormula: statFormulaSchema.optional(),
      }),
      z.object({
        type: z.literal('summon'),
        entityDefinitionId: z.string(),
        position: hexCoordSchema.optional(),
      }),
      z.object({
        type: z.literal('dot'),
        element: elementType,
        damagePerTurn: statFormulaSchema,
      }),
      z.object({
        type: z.literal('control'),
        effect: z.enum(['stun', 'bind']),
      }),
      z.object({
        type: z.literal('stat_mod'),
        stat: statIdSchema,
        mode: z.enum(['flat', 'percent']),
        value: statFormulaSchema,
      }),
      z.object({
        type: z.literal('trigger'),
        event: z.enum(['on_hit', 'on_damaged', 'on_turn_start', 'on_move', 'on_attack']),
        effect: applyTagEffectSchema,
      }),
      z.object({
        type: z.literal('absorb'),
        percent: statFormulaSchema,
      }),
      z.object({
        type: z.literal('lifesteal'),
        percent: statFormulaSchema,
      }),
      z.object({
        type: z.literal('reflect'),
        percent: statFormulaSchema,
      }),
      z.object({
        type: z.literal('clear'),
        polarity: z.literal('positive'),
      }),
      z.object({
        type: z.literal('cleanse'),
        polarity: z.literal('negative'),
      }),
    ]),
  ) as z.ZodType<TagBehavior>;

  const baseStatsSchema = z.object({
    hp: z.number().int().min(0),
    maxHp: z.number().int().min(0),
    mp: z.number().int().min(0),
    maxMp: z.number().int().min(0),
    attack: z.number().int().min(0),
    defense: z.number().int().min(0),
    speed: z.number().int().min(0),
    willpower: z.number().int().min(0),
    resistance: z.number().int().min(0),
  });

  const rawSkillSchema = z
    .object({
      schemaVersion: z.number().int().min(1).optional(),
      id: z.string().regex(/^skill_[a-z0-9_]+$/),
      inherits: z.string().optional(),
      name: z.string().min(1),
      description: z.string().optional(),
      hpCost: z.number().int().min(0).optional(),
      spCost: z.number().int().min(0).optional(),
      apCost: z.number().int().min(0).optional(),
      mpCost: z.number().int().min(0).optional(),
      cooldown: z.number().int().min(0).optional(),
      effects: z.array(skillEffectSchema).optional(),
      targeting: targetingSchema.optional(),
      shapeType: z.enum(['line', 'aoe', 'cone']).optional(),
      iconId: z.string().optional(),
      vfxId: z.string().optional(),
      sfxId: z.string().optional(),
    })
    .merge(contentMetadataSchema);

  const rawTagSchema = z
    .object({
      schemaVersion: z.number().int().min(1).optional(),
      id: z.string().regex(/^tag_[a-z0-9_]+$/),
      inherits: z.string().optional(),
      name: z.string().min(1),
      description: z.string().optional(),
      duration: z.number().int().min(0).optional(),
      stackable: z.boolean().optional(),
      maxStacks: z.number().int().min(1).optional(),
      iconId: z.string().optional(),
      behaviors: z.array(tagBehaviorSchema).optional(),
      applicationFormula: applicationFormulaSchema.optional(),
      durationFormula: durationFormulaSchema.optional(),
    })
    .merge(contentMetadataSchema);

  const rawEnemySchema = z
    .object({
      schemaVersion: z.number().int().min(1).optional(),
      id: z.string().regex(/^enemy_[a-z0-9_]+$/),
      inherits: z.string().optional(),
      name: z.string().min(1),
      description: z.string().optional(),
      portraitId: z.string().optional(),
      spriteId: z.string().optional(),
      baseStats: baseStatsSchema.partial().optional(),
      skillIds: z.array(z.string()).optional(),
      aiProfileId: z.string().optional(),
      lootTableId: z.string().optional(),
      element: elementType.optional(),
    })
    .merge(contentMetadataSchema);

  return {
    rawSkillSchema,
    rawTagSchema,
    rawEnemySchema,
    statFormulaSchema,
    durationFormulaSchema,
    applicationFormulaSchema,
  };
}

/** Default schemas using built-in stat ids — used when config not yet loaded */
const defaultSchemas = createFormulaSchemas([
  'attack',
  'defense',
  'speed',
  'willpower',
  'resistance',
]);

export const rawSkillSchema = defaultSchemas.rawSkillSchema;
export const rawTagSchema = defaultSchemas.rawTagSchema;
export const rawEnemySchema = defaultSchemas.rawEnemySchema;

/** @deprecated Use rawTagSchema */
export const rawStatusSchema = rawTagSchema;

export type RawSkill = z.infer<typeof rawSkillSchema>;
export type RawTag = z.infer<typeof rawTagSchema>;
export type RawEnemy = z.infer<typeof rawEnemySchema>;
/** @deprecated Use RawTag */
export type RawStatus = RawTag;
