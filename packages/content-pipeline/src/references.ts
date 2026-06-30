import type { EnemyDefinition, SkillDefinition, StatusDefinition } from '@dawn/types';
import type { PipelineError } from './inherit';

export interface ReferenceIndex {
  usedBy: Record<string, string[]>;
  uses: Record<string, string[]>;
}

function addRef(index: ReferenceIndex, from: string, to: string): void {
  if (!index.usedBy[to]) index.usedBy[to] = [];
  if (!index.usedBy[to]!.includes(from)) index.usedBy[to]!.push(from);

  if (!index.uses[from]) index.uses[from] = [];
  if (!index.uses[from]!.includes(to)) index.uses[from]!.push(to);
}

export function buildReferenceIndex(
  skills: SkillDefinition[],
  statuses: StatusDefinition[],
  enemies: EnemyDefinition[],
): { index: ReferenceIndex; statusIds: Set<string>; skillIds: Set<string> } {
  const index: ReferenceIndex = { usedBy: {}, uses: {} };
  const statusIds = new Set(statuses.map((s) => s.id));
  const skillIds = new Set(skills.map((s) => s.id));

  for (const skill of skills) {
    for (const effect of skill.effects) {
      if (effect.type === 'apply_status') {
        addRef(index, skill.id, effect.statusId);
      }
      if (effect.type === 'summon') {
        addRef(index, skill.id, effect.entityDefinitionId);
      }
    }
  }

  for (const enemy of enemies) {
    for (const skillId of enemy.skillIds) {
      addRef(index, enemy.id, skillId);
    }
    if (enemy.lootTableId) {
      addRef(index, enemy.id, enemy.lootTableId);
    }
    if (enemy.aiProfileId) {
      addRef(index, enemy.id, enemy.aiProfileId);
    }
  }

  return { index, statusIds, skillIds };
}

export function validateReferences(
  skills: SkillDefinition[],
  statuses: StatusDefinition[],
  enemies: EnemyDefinition[],
  knownLootTables: Set<string> = new Set(['loot_goblin', 'loot_goblin_chief']),
): PipelineError[] {
  const errors: PipelineError[] = [];
  const { statusIds, skillIds } = buildReferenceIndex(skills, statuses, enemies);

  for (const skill of skills) {
    for (const effect of skill.effects) {
      if (effect.type === 'apply_status' && !statusIds.has(effect.statusId)) {
        errors.push({
          file: skill.id,
          id: skill.id,
          message: `Unknown statusId: ${effect.statusId}`,
          severity: 'error',
        });
      }
    }
  }

  for (const enemy of enemies) {
    for (const skillId of enemy.skillIds) {
      if (!skillIds.has(skillId)) {
        errors.push({
          file: enemy.id,
          id: enemy.id,
          message: `Unknown skillId: ${skillId}`,
          severity: 'error',
        });
      }
    }
    if (enemy.lootTableId && !knownLootTables.has(enemy.lootTableId)) {
      errors.push({
        file: enemy.id,
        id: enemy.id,
        message: `Unknown lootTableId: ${enemy.lootTableId}`,
        severity: 'warning',
      });
    }
  }

  return errors;
}

export function getReferenceIndex(
  skills: SkillDefinition[],
  statuses: StatusDefinition[],
  enemies: EnemyDefinition[],
): ReferenceIndex {
  return buildReferenceIndex(skills, statuses, enemies).index;
}
