import { execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';
import {
  computeDashboardStats,
  enemyToAuthoringJson,
  migrateContent,
  normalizeEnemy,
  normalizeSkill,
  normalizeTag,
  processContent,
  rawEnemySchema,
  rawSkillSchema,
  rawTagSchema,
  skillToAuthoringJson,
  tagToAuthoringJson,
  type ContentDomain,
} from '../../packages/content-pipeline/src/index';

const DOMAINS: ContentDomain[] = ['skills', 'tags', 'enemies'];

function walkJson(
  dir: string,
  root: string,
  domain: ContentDomain,
): { id: string; relativePath: string; filePath: string; domain: ContentDomain }[] {
  const results: { id: string; relativePath: string; filePath: string; domain: ContentDomain }[] =
    [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkJson(full, root, domain));
    } else if (entry.endsWith('.json')) {
      const json = JSON.parse(readFileSync(full, 'utf-8')) as { id: string };
      results.push({
        id: json.id,
        relativePath: relative(root, full).replace(/\\/g, '/'),
        filePath: full,
        domain,
      });
    }
  }
  return results;
}

function findFileById(contentRoot: string, domain: ContentDomain, id: string): string | undefined {
  return walkJson(join(contentRoot, domain), contentRoot, domain).find((f) => f.id === id)
    ?.filePath;
}

function categoryPath(domain: ContentDomain, id: string, category?: string): string {
  const folder = category ?? 'misc';
  return join('content', domain, folder, `${id}.json`);
}

export function contentApiPlugin(repoRoot: string): Plugin {
  const contentRoot = join(repoRoot, 'content');
  const assetsRoot = join(repoRoot, 'assets');

  function runCodegen(): void {
    execSync('pnpm content:codegen', { cwd: repoRoot, stdio: 'inherit' });
  }

  function attach(server: ViteDevServer): void {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/')) return next();

      const url = new URL(req.url, 'http://localhost');
      const parts = url.pathname.split('/').filter(Boolean);

      try {
        if (
          parts[0] === 'api' &&
          parts[1] === 'content' &&
          parts[2] === 'sync' &&
          req.method === 'POST'
        ) {
          runCodegen();
          const processed = processContent(contentRoot);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true, stats: computeDashboardStats(processed) }));
          return;
        }

        if (parts[0] === 'api' && parts[1] === 'content' && parts[2] === 'dashboard') {
          const processed = processContent(contentRoot);
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              stats: computeDashboardStats(processed),
              errors: processed.errors,
              warnings: processed.warnings,
              references: processed.references,
            }),
          );
          return;
        }

        if (parts[0] === 'api' && parts[1] === 'content' && parts[2] === 'references' && parts[3]) {
          const processed = processContent(contentRoot);
          const id = parts[3]!;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              usedBy: processed.references.usedBy[id] ?? [],
              uses: processed.references.uses[id] ?? [],
            }),
          );
          return;
        }

        if (
          parts[0] === 'api' &&
          parts[1] === 'content' &&
          parts[2] === 'config' &&
          parts[3] === 'combat_stats'
        ) {
          const configPath = join(contentRoot, 'config', 'combat_stats.json');
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.end(readFileSync(configPath, 'utf-8'));
            return;
          }
          if (req.method === 'PUT') {
            let body = '';
            for await (const chunk of req) body += chunk;
            mkdirSync(dirname(configPath), { recursive: true });
            writeFileSync(configPath, JSON.stringify(JSON.parse(body), null, 2) + '\n');
            runCodegen();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
            return;
          }
        }

        if (
          parts[0] === 'api' &&
          parts[1] === 'content' &&
          parts[2] &&
          DOMAINS.includes(parts[2] as ContentDomain)
        ) {
          const domain = parts[2] as ContentDomain;

          if (parts.length === 3 && req.method === 'GET') {
            const files = walkJson(join(contentRoot, domain), contentRoot, domain);
            const processed = processContent(contentRoot);
            const normalized =
              domain === 'skills'
                ? processed.skills
                : domain === 'tags'
                  ? processed.tags
                  : processed.enemies;
            const list = files.map((f) => {
              const norm = normalized.find((n) => n.id === f.id);
              let name = norm?.name;
              if (!name) {
                try {
                  const raw = JSON.parse(readFileSync(f.filePath, 'utf-8')) as { name?: string };
                  name = raw.name;
                } catch {
                  /* use id fallback */
                }
              }
              return {
                ...f,
                name: name ?? f.id,
                category: (norm as { category?: string })?.category,
              };
            });
            list.sort((a, b) =>
              (a.name ?? a.id).localeCompare(b.name ?? b.id, undefined, { sensitivity: 'base' }),
            );
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(list));
            return;
          }

          if (parts.length === 4 && req.method === 'GET') {
            const id = parts[3]!;
            const filePath = findFileById(contentRoot, domain, id);
            if (!filePath) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Not found' }));
              return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(readFileSync(filePath, 'utf-8'));
            return;
          }

          if (parts.length === 4 && req.method === 'PUT') {
            const id = parts[3]!;
            let body = '';
            for await (const chunk of req) body += chunk;
            const data = JSON.parse(body);
            const filePath =
              findFileById(contentRoot, domain, id) ??
              join(contentRoot, domain, 'misc', `${id}.json`);
            mkdirSync(dirname(filePath), { recursive: true });
            writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
            runCodegen();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
            return;
          }

          if (parts.length === 4 && req.method === 'DELETE') {
            const id = parts[3]!;
            const filePath = findFileById(contentRoot, domain, id);
            if (filePath && existsSync(filePath)) unlinkSync(filePath);
            runCodegen();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
            return;
          }

          if (parts.length === 3 && req.method === 'POST') {
            let body = '';
            for await (const chunk of req) body += chunk;
            const data = JSON.parse(body) as { id: string; category?: string };
            const rel = categoryPath(domain, data.id, data.category);
            const filePath = join(repoRoot, rel);
            mkdirSync(dirname(filePath), { recursive: true });
            writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
            runCodegen();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, path: rel }));
            return;
          }
        }

        if (
          parts[0] === 'api' &&
          parts[1] === 'content' &&
          parts[2] === 'strip' &&
          req.method === 'POST'
        ) {
          let body = '';
          for await (const chunk of req) body += chunk;
          const { domain, data } = JSON.parse(body) as {
            domain: ContentDomain;
            data: Record<string, unknown>;
          };
          const migrated = migrateContent(data);
          if (domain === 'skills') {
            const raw = rawSkillSchema.parse(migrated);
            const normalized = normalizeSkill(raw);
            res.setHeader('Content-Type', 'application/json');
            res.end(skillToAuthoringJson(normalized, raw));
            return;
          }
          if (domain === 'tags') {
            const raw = rawTagSchema.parse(migrated);
            const normalized = normalizeTag(raw);
            res.setHeader('Content-Type', 'application/json');
            res.end(tagToAuthoringJson(normalized));
            return;
          }
          const raw = rawEnemySchema.parse(migrated);
          const normalized = normalizeEnemy(raw);
          res.setHeader('Content-Type', 'application/json');
          res.end(enemyToAuthoringJson(normalized));
          return;
        }

        if (parts[0] === 'api' && parts[1] === 'assets') {
          const type = parts[2];
          if (!type) {
            res.statusCode = 404;
            res.end();
            return;
          }

          if (parts[3] === 'list') {
            const dir = join(assetsRoot, type);
            const ids: string[] = [];
            if (existsSync(dir)) {
              for (const entry of readdirSync(dir)) {
                const match = entry.match(/^(.+)\.(png|webp|svg|jpg|jpeg)$/i);
                if (match) ids.push(match[1]!);
              }
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(ids.sort()));
            return;
          }

          const id = parts[3];
          if (!type || !id) {
            res.statusCode = 404;
            res.end();
            return;
          }
          const dir = join(assetsRoot, type);
          for (const ext of ['png', 'webp', 'svg', 'jpg', 'mp3', 'wav']) {
            const candidate = join(dir, `${id}.${ext}`);
            if (existsSync(candidate)) {
              res.setHeader('Content-Type', ext === 'svg' ? 'image/svg+xml' : `image/${ext}`);
              res.end(readFileSync(candidate));
              return;
            }
          }
          res.statusCode = 404;
          res.end();
          return;
        }

        res.statusCode = 404;
        res.end();
      } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }));
      }
    });
  }

  return {
    name: 'dawn-content-api',
    configureServer(server) {
      attach(server);
    },
    configurePreviewServer(server) {
      attach(server as ViteDevServer);
    },
  };
}
