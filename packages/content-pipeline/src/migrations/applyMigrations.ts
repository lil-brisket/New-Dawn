import { migrateToV2 } from './v1-to-v2';
import { migrateToV3 } from './v2-to-v3';

export { migrateToV2 } from './v1-to-v2';
export { migrateToV3 } from './v2-to-v3';

/** Apply all version migrations to raw content JSON (browser-safe). */
export function migrateContent(raw: Record<string, unknown>): Record<string, unknown> {
  return migrateToV3(migrateToV2(raw));
}

export { migrateContent as migrate };
