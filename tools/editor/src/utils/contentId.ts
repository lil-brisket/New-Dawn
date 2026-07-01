export type ContentIdPrefix = 'skill' | 'status';

/** Derive a content id from a display name (e.g. "Arcane Burst" → skill_arcane_burst). */
export function nameToContentId(name: string, prefix: ContentIdPrefix): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
  return slug ? `${prefix}_${slug}` : `${prefix}_`;
}

export function applyNameWithId(
  draft: Record<string, unknown>,
  name: string,
  prefix: ContentIdPrefix,
): Record<string, unknown> {
  return { ...draft, name, id: nameToContentId(name, prefix) };
}
