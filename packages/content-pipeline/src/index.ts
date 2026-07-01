export {
  rawSkillSchema,
  rawStatusSchema,
  rawEnemySchema,
  contentMetadataSchema,
  type RawSkill,
  type RawStatus,
  type RawEnemy,
} from './schemas';

export {
  defaultSkillFields,
  defaultStatusFields,
  defaultEnemyFields,
  inferCategoryFromPath,
} from './defaults';

export { normalizeSkill, normalizeStatus, normalizeEnemy } from './normalize';

export {
  resolveSkillInheritance,
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
  stripStatusDefaults,
  stripEnemyDefaults,
  skillToAuthoringJson,
  statusToAuthoringJson,
  enemyToAuthoringJson,
} from './strip';

export { migrateToV2, migrateContent, loadCombatStatsConfig } from './migrations';
export { createFormulaSchemas, combatStatsConfigSchema } from './schemas';
