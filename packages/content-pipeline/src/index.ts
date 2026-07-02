export {
  rawSkillSchema,
  rawTagSchema,
  rawStatusSchema,
  rawEnemySchema,
  contentMetadataSchema,
  type RawSkill,
  type RawTag,
  type RawStatus,
  type RawEnemy,
} from './schemas';

export {
  defaultSkillFields,
  defaultTagFields,
  defaultStatusFields,
  defaultEnemyFields,
  inferCategoryFromPath,
} from './defaults';

export { normalizeSkill, normalizeTag, normalizeStatus, normalizeEnemy } from './normalize';

export {
  resolveSkillInheritance,
  resolveTagInheritance,
  resolveStatusInheritance,
  resolveEnemyInheritance,
  type PipelineError,
} from './inherit';

export type { ContentDomain } from './domains';

export {
  processContent,
  computeDashboardStats,
  type ProcessedContent,
  type ContentFile,
} from './process';

export { getReferenceIndex, validateReferences, type ReferenceIndex } from './references';

export {
  stripSkillDefaults,
  stripTagDefaults,
  stripStatusDefaults,
  stripEnemyDefaults,
  skillToAuthoringJson,
  tagToAuthoringJson,
  statusToAuthoringJson,
  enemyToAuthoringJson,
} from './strip';

export { migrateToV2, migrateToV3, migrateContent, loadCombatStatsConfig } from './migrations';
export { createFormulaSchemas, combatStatsConfigSchema } from './schemas';
