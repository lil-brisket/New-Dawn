import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { CombatStatsConfig } from '@dawn/types';
import { combatStatsConfigSchema } from '../schemas';

export function loadCombatStatsConfig(contentRoot: string): CombatStatsConfig {
  const path = join(contentRoot, 'config', 'combat_stats.json');
  const raw = JSON.parse(readFileSync(path, 'utf-8'));
  return combatStatsConfigSchema.parse(raw);
}

export { migrateToV2 } from './v1-to-v2';

export { migrateContent } from './migrate';
