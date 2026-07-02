import { BattleAssets } from './BattleAssets';

const TAG_ICON_BY_ID: Record<string, string> = {
  icon_burn: BattleAssets.status.burn,
  icon_stun: BattleAssets.status.stun,
  icon_poison: BattleAssets.status.poison,
  icon_attack_up: BattleAssets.status.attackUp,
  icon_defense_up: BattleAssets.status.defenseUp,
  icon_shield: BattleAssets.status.shield,
  icon_regen: BattleAssets.status.regen,
};

export function resolveTagIcon(iconId: string): string {
  return TAG_ICON_BY_ID[iconId] ?? '●';
}

/** @deprecated Use resolveTagIcon */
export const resolveStatusIcon = resolveTagIcon;
