import type { ContentDomain } from '@dawn/content-pipeline';

export interface ContentListItem {
  id: string;
  name: string;
  relativePath: string;
  domain: ContentDomain;
  category?: string;
}

export async function listContent(domain: ContentDomain): Promise<ContentListItem[]> {
  const res = await fetch(`/api/content/${domain}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getContent(
  domain: ContentDomain,
  id: string,
): Promise<Record<string, unknown>> {
  const res = await fetch(`/api/content/${domain}/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveContent(
  domain: ContentDomain,
  id: string,
  data: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(`/api/content/${domain}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function createContent(
  domain: ContentDomain,
  data: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(`/api/content/${domain}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteContent(domain: ContentDomain, id: string): Promise<void> {
  const res = await fetch(`/api/content/${domain}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
}

export async function syncContent(): Promise<void> {
  const res = await fetch('/api/content/sync', { method: 'POST' });
  if (!res.ok) throw new Error(await res.text());
}

export async function getReferences(id: string): Promise<{ usedBy: string[]; uses: string[] }> {
  const res = await fetch(`/api/content/references/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getDashboard(): Promise<{
  stats: Record<string, number | string>;
  errors: { file: string; message: string }[];
  warnings: { file: string; message: string }[];
}> {
  const res = await fetch('/api/content/dashboard');
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function stripDefaults(
  domain: ContentDomain,
  data: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const res = await fetch('/api/content/strip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain, data }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
