import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { CombatStatsConfig } from '@dawn/types';
import { combatStatsConfigSchema } from '../schemas';

export function loadCombatStatsConfig(contentRoot: string): CombatStatsConfig {
  const path = join(contentRoot, 'config', 'combat_stats.json');
  const raw = JSON.parse(readFileSync(path, 'utf-8')) as Record<string, unknown>;

  if (raw.formulas && typeof raw.formulas === 'object') {
    const formulas = raw.formulas as Record<string, unknown>;
    if ('statusApplication' in formulas && !('tagApplication' in formulas)) {
      formulas.tagApplication = formulas.statusApplication;
      delete formulas.statusApplication;
    }
  }

  return combatStatsConfigSchema.parse(raw);
}
