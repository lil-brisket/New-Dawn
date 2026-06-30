import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { EnemyDefinition, SkillDefinition, StatusDefinition } from '@dawn/types';
import {
  rawEnemySchema,
  rawSkillSchema,
  rawStatusSchema,
  type RawEnemy,
  type RawSkill,
  type RawStatus,
} from './schemas';
import {
  resolveEnemyInheritance,
  resolveSkillInheritance,
  resolveStatusInheritance,
  type PipelineError,
} from './inherit';
import { normalizeEnemy, normalizeSkill, normalizeStatus } from './normalize';
import { getReferenceIndex, validateReferences } from './references';

export interface ContentFile {
  id: string;
  domain: ContentDomain;
  filePath: string;
  relativePath: string;
}

export type ContentDomain = 'skills' | 'statuses' | 'enemies';

export interface ProcessedContent {
  skills: SkillDefinition[];
  statuses: StatusDefinition[];
  enemies: EnemyDefinition[];
  errors: PipelineError[];
  warnings: PipelineError[];
  references: ReturnType<typeof getReferenceIndex>;
  files: ContentFile[];
}

function walkJsonFiles(dir: string, root: string, domain: ContentDomain): ContentFile[] {
  const results: ContentFile[] = [];
  try {
    if (!statSync(dir).isDirectory()) return results;
  } catch {
    return results;
  }

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkJsonFiles(full, root, domain));
    } else if (entry.endsWith('.json')) {
      const raw = JSON.parse(readFileSync(full, 'utf-8')) as { id: string };
      results.push({
        id: raw.id,
        domain,
        filePath: full,
        relativePath: relative(root, full).replace(/\\/g, '/'),
      });
    }
  }
  return results;
}

function loadDomain<T>(
  files: ContentFile[],
  schema: { parse: (v: unknown) => T },
): { items: Map<string, T>; fileMap: Map<string, string>; errors: PipelineError[] } {
  const items = new Map<string, T>();
  const fileMap = new Map<string, string>();
  const errors: PipelineError[] = [];

  for (const file of files) {
    try {
      const json = JSON.parse(readFileSync(file.filePath, 'utf-8'));
      const parsed = schema.parse(json);
      const id = (parsed as { id: string }).id;
      if (items.has(id)) {
        errors.push({
          file: file.relativePath,
          id,
          message: `Duplicate id: ${id}`,
          severity: 'error',
        });
        continue;
      }
      items.set(id, parsed);
      fileMap.set(id, file.relativePath);
    } catch (e) {
      errors.push({
        file: file.relativePath,
        message: e instanceof Error ? e.message : String(e),
        severity: 'error',
      });
    }
  }

  return { items, fileMap, errors };
}

export function processContent(contentRoot: string): ProcessedContent {
  const skillFiles = walkJsonFiles(join(contentRoot, 'skills'), contentRoot, 'skills');
  const statusFiles = walkJsonFiles(join(contentRoot, 'statuses'), contentRoot, 'statuses');
  const enemyFiles = walkJsonFiles(join(contentRoot, 'enemies'), contentRoot, 'enemies');

  const skillLoad = loadDomain(skillFiles, rawSkillSchema);
  const statusLoad = loadDomain(statusFiles, rawStatusSchema);
  const enemyLoad = loadDomain(enemyFiles, rawEnemySchema);

  const errors: PipelineError[] = [...skillLoad.errors, ...statusLoad.errors, ...enemyLoad.errors];

  const skillResolved = resolveSkillInheritance(
    skillLoad.items as Map<string, RawSkill>,
    skillLoad.fileMap,
  );
  const statusResolved = resolveStatusInheritance(
    statusLoad.items as Map<string, RawStatus>,
    statusLoad.fileMap,
  );
  const enemyResolved = resolveEnemyInheritance(
    enemyLoad.items as Map<string, RawEnemy>,
    enemyLoad.fileMap,
  );

  errors.push(...skillResolved.errors, ...statusResolved.errors, ...enemyResolved.errors);

  const skills: SkillDefinition[] = [];
  for (const [id, raw] of skillResolved.resolved) {
    const filePath = skillLoad.fileMap.get(id) ?? id;
    skills.push(normalizeSkill(raw, filePath));
  }

  const statuses: StatusDefinition[] = [];
  for (const [id, raw] of statusResolved.resolved) {
    const filePath = statusLoad.fileMap.get(id) ?? id;
    statuses.push(normalizeStatus(raw, filePath));
  }

  const enemies: EnemyDefinition[] = [];
  for (const [id, raw] of enemyResolved.resolved) {
    const filePath = enemyLoad.fileMap.get(id) ?? id;
    enemies.push(normalizeEnemy(raw, filePath));
  }

  const refErrors = validateReferences(skills, statuses, enemies);
  const warnings = refErrors.filter((e) => e.severity === 'warning');
  const refErrs = refErrors.filter((e) => e.severity === 'error');
  errors.push(...refErrs);

  return {
    skills,
    statuses,
    enemies,
    errors,
    warnings,
    references: getReferenceIndex(skills, statuses, enemies),
    files: [...skillFiles, ...statusFiles, ...enemyFiles],
  };
}

export function computeDashboardStats(
  processed: ProcessedContent,
  _assetsRoot?: string,
): Record<string, number | string> {
  const avgMp =
    processed.skills.length > 0
      ? processed.skills.reduce((s, sk) => s + sk.mpCost, 0) / processed.skills.length
      : 0;
  const avgHp =
    processed.enemies.length > 0
      ? processed.enemies.reduce((s, e) => s + e.baseStats.hp, 0) / processed.enemies.length
      : 0;

  return {
    skillCount: processed.skills.length,
    statusCount: processed.statuses.length,
    enemyCount: processed.enemies.length,
    brokenReferences: processed.errors.filter((e) => e.message.includes('Unknown')).length,
    warnings: processed.warnings.length,
    avgSkillMpCost: Math.round(avgMp * 10) / 10,
    avgEnemyHp: Math.round(avgHp),
  };
}

export type { PipelineError };
