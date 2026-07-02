import type { EnemyDefinition, SkillDefinition, TagDefinition } from '@dawn/types';
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
  tags: TagDefinition[],
  enemies: EnemyDefinition[],
): { index: ReferenceIndex; tagIds: Set<string>; skillIds: Set<string> } {
  const index: ReferenceIndex = { usedBy: {}, uses: {} };
  const tagIds = new Set(tags.map((s) => s.id));
  const skillIds = new Set(skills.map((s) => s.id));

  for (const skill of skills) {
    for (const effect of skill.effects) {
      if (effect.type === 'apply_tag') {
        addRef(index, skill.id, effect.tagId);
      }
    }
  }

  for (const tag of tags) {
    for (const behavior of tag.behaviors) {
      if (behavior.type === 'summon') {
        addRef(index, tag.id, behavior.entityDefinitionId);
      }
      if (behavior.type === 'trigger' && behavior.effect.type === 'apply_tag') {
        addRef(index, tag.id, behavior.effect.tagId);
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

  return { index, tagIds, skillIds };
}

export function validateReferences(
  skills: SkillDefinition[],
  tags: TagDefinition[],
  enemies: EnemyDefinition[],
  knownLootTables: Set<string> = new Set(['loot_goblin', 'loot_goblin_chief']),
): PipelineError[] {
  const errors: PipelineError[] = [];
  const { tagIds, skillIds } = buildReferenceIndex(skills, tags, enemies);

  for (const skill of skills) {
    for (const effect of skill.effects) {
      if (effect.type === 'apply_tag' && !tagIds.has(effect.tagId)) {
        errors.push({
          file: skill.id,
          id: skill.id,
          message: `Unknown tagId: ${effect.tagId}`,
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
  tags: TagDefinition[],
  enemies: EnemyDefinition[],
): ReferenceIndex {
  return buildReferenceIndex(skills, tags, enemies).index;
}
