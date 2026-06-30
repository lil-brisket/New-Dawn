import { BattleAssets } from './BattleAssets';

const STATUS_ICON_BY_ID: Record<string, string> = {
  icon_burn: BattleAssets.status.burn,
  icon_stun: BattleAssets.status.stun,
  icon_poison: BattleAssets.status.poison,
  icon_attack_up: BattleAssets.status.attackUp,
  icon_defense_up: BattleAssets.status.defenseUp,
  icon_shield: BattleAssets.status.shield,
  icon_regen: BattleAssets.status.regen,
};

export function resolveStatusIcon(iconId: string): string {
  return STATUS_ICON_BY_ID[iconId] ?? '●';
}
