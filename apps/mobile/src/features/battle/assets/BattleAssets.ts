/** Placeholder battle asset registry — swap for real assets later */
export const BattleAssets = {
  terrain: {
    grass: 'terrain_grass',
    water: 'terrain_water',
    lava: 'terrain_lava',
    wall: 'terrain_wall',
    cover: 'terrain_cover',
    obstacle: 'terrain_obstacle',
    default: 'terrain_default',
  },
  icons: {
    attack: '⚔',
    item: '🎒',
    move: '👟',
    skill: '✨',
    endTurn: '⏭',
    heal: '❤',
    shield: '🛡',
    poison: '☠',
    fire: '⚡',
    death: '💀',
    turn: '🔄',
    victory: '🏆',
    defeat: '💔',
    error: '⚠',
    debug: '🔧',
  },
  status: {
    shield: '🛡',
    poison: '☠',
    regen: '💚',
    burn: '🔥',
    stun: '⚡',
  },
  portraits: {
    placeholder: 'portrait_placeholder',
    knight: 'portrait_knight',
    goblin: 'portrait_goblin',
  },
  units: {
    knight: 'unit_knight',
    goblin: 'unit_goblin',
  },
  floating: {
    critical: 'floating_critical',
    miss: 'floating_miss',
    dodge: 'floating_dodge',
  },
} as const;

export type BattleAssetKey = typeof BattleAssets;
