export type ElementType =
  'physical' | 'fire' | 'ice' | 'lightning' | 'wind' | 'earth' | 'light' | 'dark';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type BattlePhase =
  'setup' | 'player_turn' | 'enemy_turn' | 'resolution' | 'victory' | 'defeat';

export type BattleOutcome = 'ongoing' | 'victory' | 'defeat' | 'draw';

export type Faction = 'player' | 'enemy' | 'neutral';

export type EquipmentSlot = 'weapon' | 'armor' | 'helmet' | 'accessory' | 'boots' | 'relic';
