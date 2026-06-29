export interface ProfessionDefinition {
  id: string;
  name: string;
  description: string;
}

export const warrior: ProfessionDefinition = {
  id: 'prof_warrior',
  name: 'Warrior',
  description: 'Masters of melee combat.',
};

export const mage: ProfessionDefinition = {
  id: 'prof_mage',
  name: 'Mage',
  description: 'Wielders of arcane power.',
};
