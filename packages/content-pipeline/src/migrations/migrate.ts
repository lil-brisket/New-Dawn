import { migrateToV2 } from './v1-to-v2';

/** Apply all version migrations to raw content JSON */
export function migrateContent(raw: Record<string, unknown>): Record<string, unknown> {
  return migrateToV2(raw);
}
