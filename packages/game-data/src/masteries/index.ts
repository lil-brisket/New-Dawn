export interface MasteryDefinition {
  id: string;
  name: string;
  description: string;
  maxLevel: number;
}

export const swordMastery: MasteryDefinition = {
  id: 'mastery_sword',
  name: 'Sword Mastery',
  description: 'Increases physical damage with swords.',
  maxLevel: 10,
};

export const fireMastery: MasteryDefinition = {
  id: 'mastery_fire',
  name: 'Fire Mastery',
  description: 'Increases fire skill damage.',
  maxLevel: 10,
};
