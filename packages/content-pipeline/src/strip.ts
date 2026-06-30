import type { EnemyDefinition, SkillDefinition, StatusDefinition } from '@dawn/types';
import type { RawSkill } from './schemas';
import { mergeSkillRaw } from './defaults';
import { rawToDefaultEnemy, rawToDefaultSkill, rawToDefaultStatus } from './inherit';

function isEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function diffRaw<T extends Record<string, unknown>>(
  normalized: T,
  defaults: T,
  parent?: T,
): Partial<T> {
  const result: Partial<T> = {};
  const baseline = parent ?? defaults;

  for (const key of Object.keys(normalized) as (keyof T)[]) {
    if (key === 'id' || key === 'name') continue;
    if (!isEqual(normalized[key], baseline[key])) {
      result[key] = normalized[key];
    }
  }

  return result;
}

export function stripSkillDefaults(
  skill: SkillDefinition,
  raw?: RawSkill,
  parentNormalized?: SkillDefinition,
): Record<string, unknown> {
  let parentRaw: RawSkill | undefined;
  if (raw?.inherits && parentNormalized) {
    parentRaw = rawToDefaultSkill(parentNormalized.id, parentNormalized.name);
    const merged = mergeSkillRaw(parentRaw, {
      ...rawToDefaultSkill(skill.id, skill.name),
      ...Object.fromEntries(
        Object.entries(skill).filter(
          ([k]) => !['id', 'name', 'animationKey', 'soundKey'].includes(k),
        ),
      ),
    } as RawSkill);
    const stripped = diffRaw(
      merged as unknown as Record<string, unknown>,
      rawToDefaultSkill(skill.id, skill.name) as unknown as Record<string, unknown>,
      parentRaw as unknown as Record<string, unknown>,
    );
    const output: Record<string, unknown> = { id: skill.id, name: skill.name };
    if (raw.inherits) output.inherits = raw.inherits;
    return { ...output, ...stripped };
  }

  const rawForm: Record<string, unknown> = {
    id: skill.id,
    name: skill.name,
    description: skill.description,
    hpCost: skill.hpCost,
    spCost: skill.spCost,
    apCost: skill.apCost,
    cooldown: skill.cooldown,
    effects: skill.effects,
    targeting: skill.targeting,
    iconId: skill.iconId,
    vfxId: skill.vfxId,
    sfxId: skill.sfxId,
    category: skill.category,
    element: skill.element,
    weaponType: skill.weaponType,
    job: skill.job,
    rarity: skill.rarity,
    tags: skill.tags,
    unlockLevel: skill.unlockLevel,
  };

  const stripped = diffRaw(rawForm, {
    ...rawToDefaultSkill(skill.id, skill.name),
  } as Record<string, unknown>);

  return { id: skill.id, name: skill.name, ...stripped };
}

export function stripStatusDefaults(status: StatusDefinition): Record<string, unknown> {
  const rawForm: Record<string, unknown> = { ...status };
  delete rawForm.animationKey;
  delete rawForm.soundKey;
  delete rawForm.vfxId;
  delete rawForm.sfxId;

  const stripped = diffRaw(
    rawForm,
    rawToDefaultStatus(status.id, status.name) as unknown as Record<string, unknown>,
  );
  return { id: status.id, name: status.name, ...stripped };
}

export function stripEnemyDefaults(enemy: EnemyDefinition): Record<string, unknown> {
  const rawForm: Record<string, unknown> = { ...enemy };
  const stripped = diffRaw(
    rawForm,
    rawToDefaultEnemy(enemy.id, enemy.name) as unknown as Record<string, unknown>,
  );
  return { id: enemy.id, name: enemy.name, ...stripped };
}

export function skillToAuthoringJson(skill: SkillDefinition, raw?: RawSkill): string {
  return JSON.stringify(stripSkillDefaults(skill, raw), null, 2);
}

export function statusToAuthoringJson(status: StatusDefinition): string {
  return JSON.stringify(stripStatusDefaults(status), null, 2);
}

export function enemyToAuthoringJson(enemy: EnemyDefinition): string {
  return JSON.stringify(stripEnemyDefaults(enemy), null, 2);
}
