import type { TagBehavior } from '@dawn/types';

export const TAG_BEHAVIOR_SUMMARIES: Record<TagBehavior['type'], string> = {
  instant_damage: 'Deals damage once when the tag is applied (used by skill templates).',
  instant_heal: 'Heals once when the tag is applied (used by skill templates).',
  shield_grant: 'Grants shield HP when applied (used by skill templates).',
  move: 'Moves the unit on apply. Skills can override range; set teleport for tile-target skills like Blink.',
  teleport: 'Legacy movement type — use Move with teleport instead.',
  summon: 'Spawns an entity when applied (used by skill templates).',
  dot: 'Deals damage every turn while the tag is active.',
  stat_mod: 'Modifies a combat stat (flat or percent) while the tag is active.',
  control: 'Applies a control effect (stun or bind) while active.',
  trigger: 'Runs another tag application when a combat event fires.',
  absorb: 'Converts a portion of incoming HP damage into healing.',
  lifesteal: 'Heals the attacker for a portion of HP damage dealt.',
  reflect: 'Returns a portion of incoming HP damage to the attacker.',
  clear: 'On apply, removes positive (buff) tags from the target.',
  cleanse: 'On apply, removes negative (debuff) tags from the target.',
};

export function describeTagBehaviors(behaviors: readonly TagBehavior[]): string[] {
  return behaviors.map((b) => TAG_BEHAVIOR_SUMMARIES[b.type] ?? b.type);
}
