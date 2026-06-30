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

export const contentMetadataSchema = z
  .object({
    category: z.string().optional(),
    element: elementType.optional(),
    weaponType: z.string().optional(),
    job: z.string().optional(),
    rarity: itemRarity.optional(),
    tags: z.array(z.string()).optional(),
    unlockLevel: z.number().int().min(0).optional(),
  })
  .strict()
  .partial();

const skillEffectSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('damage'),
    element: elementType,
    multiplier: z.number(),
    flatBonus: z.number().optional(),
  }),
  z.object({
    type: z.literal('heal'),
    multiplier: z.number(),
    flatBonus: z.number().optional(),
  }),
  z.object({
    type: z.literal('move'),
    range: z.number().int().min(0),
  }),
  z.object({
    type: z.literal('teleport'),
    range: z.number().int().min(0),
  }),
  z.object({
    type: z.literal('apply_status'),
    statusId: z.string(),
    chance: z.number().min(0).max(1),
    duration: z.number().int().min(0).optional(),
  }),
  z.object({
    type: z.literal('summon'),
    entityDefinitionId: z.string(),
    position: z.object({ q: z.number(), r: z.number() }).optional(),
  }),
]);

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

export const rawSkillSchema = z
  .object({
    id: z.string().regex(/^skill_[a-z0-9_]+$/),
    inherits: z.string().optional(),
    name: z.string().min(1),
    description: z.string().optional(),
    hpCost: z.number().int().min(0).optional(),
    spCost: z.number().int().min(0).optional(),
    apCost: z.number().int().min(0).optional(),
    /** @deprecated use spCost */
    mpCost: z.number().int().min(0).optional(),
    cooldown: z.number().int().min(0).optional(),
    effects: z.array(skillEffectSchema).optional(),
    targeting: targetingSchema.optional(),
    iconId: z.string().optional(),
    vfxId: z.string().optional(),
    sfxId: z.string().optional(),
  })
  .merge(contentMetadataSchema);

const statusBehaviorSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('dot'),
    element: elementType,
    damagePerStack: z.number(),
  }),
  z.object({
    type: z.literal('control'),
    effect: z.literal('stun'),
  }),
  z.object({
    type: z.literal('stat_mod'),
    stat: z.enum(['attack', 'defense']),
    mode: z.enum(['flat', 'percent']),
    amountPerStack: z.number(),
  }),
  z.object({
    type: z.literal('trigger'),
    event: z.enum(['on_hit', 'on_damaged', 'on_turn_start']),
    effect: skillEffectSchema,
  }),
]);

export const rawStatusSchema = z
  .object({
    id: z.string().regex(/^status_[a-z0-9_]+$/),
    inherits: z.string().optional(),
    name: z.string().min(1),
    description: z.string().optional(),
    duration: z.number().int().min(0).optional(),
    stackable: z.boolean().optional(),
    maxStacks: z.number().int().min(1).optional(),
    iconId: z.string().optional(),
    behaviors: z.array(statusBehaviorSchema).optional(),
  })
  .merge(contentMetadataSchema);

const baseStatsSchema = z.object({
  hp: z.number().int().min(0),
  maxHp: z.number().int().min(0),
  mp: z.number().int().min(0),
  maxMp: z.number().int().min(0),
  attack: z.number().int().min(0),
  defense: z.number().int().min(0),
  speed: z.number().int().min(0),
  critRate: z.number().min(0).max(1),
  critDamage: z.number().min(0),
});

export const rawEnemySchema = z
  .object({
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

export type RawSkill = z.infer<typeof rawSkillSchema>;
export type RawStatus = z.infer<typeof rawStatusSchema>;
export type RawEnemy = z.infer<typeof rawEnemySchema>;
