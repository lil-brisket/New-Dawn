import type { BaseStats } from '../definitions';
import type { EquippedGear } from '../equipment';

export interface PlayerStats extends BaseStats {
  level: number;
  xp: number;
  xpToNext: number;
}

export interface MasteryProgress {
  masteryId: string;
  level: number;
  xp: number;
}

export interface PlayerCharacter {
  id: string;
  definitionId: string;
  level: number;
  xp: number;
  equipment: EquippedGear;
  learnedSkillIds: string[];
  masteries: MasteryProgress[];
}

export interface PlayerProfile {
  id: string;
  displayName: string;
  characters: PlayerCharacter[];
  activeCharacterId: string | null;
}
