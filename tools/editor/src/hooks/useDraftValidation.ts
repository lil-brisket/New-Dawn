import type { ContentDomain } from '@dawn/content-pipeline';
import { rawEnemySchema, rawSkillSchema, rawStatusSchema } from '@dawn/content-pipeline';
import { useMemo } from 'react';

export type DraftIssue = { path: string; message: string };

export function validateDraft(domain: ContentDomain, draft: Record<string, unknown>): DraftIssue[] {
  if (!draft.id || !draft.name) return [];

  const schema =
    domain === 'skills' ? rawSkillSchema : domain === 'statuses' ? rawStatusSchema : rawEnemySchema;

  const result = schema.safeParse(draft);
  if (result.success) return [];
  return result.error.issues.map((i) => ({
    path: i.path.join('.'),
    message: i.message,
  }));
}

export function useDraftValidation(
  domain: ContentDomain,
  draft: Record<string, unknown>,
): DraftIssue[] {
  return useMemo(() => validateDraft(domain, draft), [domain, draft]);
}

export function issueAt(issues: DraftIssue[], pathPrefix: string): string | undefined {
  const match = issues.find((i) => i.path === pathPrefix || i.path.startsWith(`${pathPrefix}.`));
  return match?.message;
}
