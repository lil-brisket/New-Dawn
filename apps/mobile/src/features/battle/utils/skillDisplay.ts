import type { SkillDefinition } from '@dawn/types';

export function getSkillAoeLabel(skill: SkillDefinition): string | undefined {
  if (skill.targeting.type !== 'area') return undefined;
  return `AoE ${skill.targeting.radius}`;
}
