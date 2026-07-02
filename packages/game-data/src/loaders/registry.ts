import type {
  CharacterDefinition,
  CombatStatsConfig,
  EnemyDefinition,
  EquipmentDefinition,
  ItemDefinition,
  SkillDefinition,
  TagDefinition,
  MapData,
} from '@dawn/types';
import * as characters from '../characters';
import * as equipment from '../equipment';
import * as items from '../items';
import * as maps from '../maps';
import * as loot from '../loot';
import * as professions from '../professions';
import * as masteries from '../masteries';
import { skills, tags, enemies } from '../generated/content';
import { combatStatsConfig } from '../generated/combat-stats';

export interface DefinitionRegistry {
  getCharacter(id: string): CharacterDefinition | undefined;
  getSkill(id: string): SkillDefinition | undefined;
  getEquipment(id: string): EquipmentDefinition | undefined;
  getItem(id: string): ItemDefinition | undefined;
  getEnemy(id: string): EnemyDefinition | undefined;
  getTag(id: string): TagDefinition | undefined;
  getMap(id: string): MapData | undefined;
  getLootTable(id: string): loot.LootTable | undefined;
  getProfession(id: string): professions.ProfessionDefinition | undefined;
  getMastery(id: string): masteries.MasteryDefinition | undefined;
  getCombatStatsConfig(): CombatStatsConfig;
  getAllSkills(): SkillDefinition[];
  getAllTags(): TagDefinition[];
  getAllEnemies(): EnemyDefinition[];
  /** @deprecated Use getTag */
  getStatus(id: string): TagDefinition | undefined;
  /** @deprecated Use getAllTags */
  getAllStatuses(): TagDefinition[];
}

function buildRegistry<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

export function createDefinitionRegistry(): DefinitionRegistry {
  const characterMap = buildRegistry(Object.values(characters));
  const skillMap = buildRegistry(skills);
  const equipmentMap = buildRegistry(Object.values(equipment));
  const itemMap = buildRegistry(Object.values(items));
  const enemyMap = buildRegistry(enemies);
  const tagMap = buildRegistry(tags);
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
    getTag: (id) => tagMap.get(id),
    getStatus: (id) => tagMap.get(id),
    getMap: (id) => mapMap.get(id),
    getLootTable: (id) => lootMap.get(id),
    getProfession: (id) => professionMap.get(id),
    getMastery: (id) => masteryMap.get(id),
    getCombatStatsConfig: () => combatStatsConfig,
    getAllSkills: () => skills,
    getAllTags: () => tags,
    getAllStatuses: () => tags,
    getAllEnemies: () => enemies,
  };
}

export const defaultRegistry = createDefinitionRegistry();
