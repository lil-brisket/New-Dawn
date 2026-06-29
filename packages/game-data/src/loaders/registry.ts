import type {
  CharacterDefinition,
  EnemyDefinition,
  EquipmentDefinition,
  ItemDefinition,
  SkillDefinition,
  StatusDefinition,
  MapData,
} from '@dawn/types';
import * as characters from '../characters';
import * as skills from '../skills';
import * as equipment from '../equipment';
import * as items from '../items';
import * as enemies from '../enemies';
import * as status from '../status';
import * as maps from '../maps';
import * as loot from '../loot';
import * as professions from '../professions';
import * as masteries from '../masteries';

export interface DefinitionRegistry {
  getCharacter(id: string): CharacterDefinition | undefined;
  getSkill(id: string): SkillDefinition | undefined;
  getEquipment(id: string): EquipmentDefinition | undefined;
  getItem(id: string): ItemDefinition | undefined;
  getEnemy(id: string): EnemyDefinition | undefined;
  getStatus(id: string): StatusDefinition | undefined;
  getMap(id: string): MapData | undefined;
  getLootTable(id: string): loot.LootTable | undefined;
  getProfession(id: string): professions.ProfessionDefinition | undefined;
  getMastery(id: string): masteries.MasteryDefinition | undefined;
}

function buildRegistry<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

export function createDefinitionRegistry(): DefinitionRegistry {
  const characterMap = buildRegistry(Object.values(characters));
  const skillMap = buildRegistry(Object.values(skills));
  const equipmentMap = buildRegistry(Object.values(equipment));
  const itemMap = buildRegistry(Object.values(items));
  const enemyMap = buildRegistry(Object.values(enemies));
  const statusMap = buildRegistry(Object.values(status));
  const mapMap = buildRegistry(Object.values(maps));
  const lootMap = buildRegistry(Object.values(loot));
  const professionMap = buildRegistry(Object.values(professions));
  const masteryMap = buildRegistry(Object.values(masteries));

  return {
    getCharacter: (id) => characterMap.get(id),
    getSkill: (id) => skillMap.get(id),
    getEquipment: (id) => equipmentMap.get(id),
    getItem: (id) => itemMap.get(id),
    getEnemy: (id) => enemyMap.get(id),
    getStatus: (id) => statusMap.get(id),
    getMap: (id) => mapMap.get(id),
    getLootTable: (id) => lootMap.get(id),
    getProfession: (id) => professionMap.get(id),
    getMastery: (id) => masteryMap.get(id),
  };
}

export const defaultRegistry = createDefinitionRegistry();
