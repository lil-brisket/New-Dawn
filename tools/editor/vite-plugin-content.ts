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
  processContent,
  skillToAuthoringJson,
  statusToAuthoringJson,
  type ContentDomain,
} from '@dawn/content-pipeline';

const DOMAINS: ContentDomain[] = ['skills', 'statuses', 'enemies'];

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
                : domain === 'statuses'
                  ? processed.statuses
                  : processed.enemies;
            const list = files.map((f) => {
              const norm = normalized.find((n) => n.id === f.id);
              return {
                ...f,
                name: norm?.name ?? f.id,
                category: (norm as { category?: string })?.category,
              };
            });
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
          const processed = processContent(contentRoot);
          if (domain === 'skills') {
            const norm = processed.skills.find((s) => s.id === data.id);
            if (!norm) throw new Error('Skill not found');
            res.setHeader('Content-Type', 'application/json');
            res.end(skillToAuthoringJson(norm, data as never));
            return;
          }
          if (domain === 'statuses') {
            const norm = processed.statuses.find((s) => s.id === data.id);
            if (!norm) throw new Error('Status not found');
            res.setHeader('Content-Type', 'application/json');
            res.end(statusToAuthoringJson(norm));
            return;
          }
          const norm = processed.enemies.find((e) => e.id === data.id);
          if (!norm) throw new Error('Enemy not found');
          res.setHeader('Content-Type', 'application/json');
          res.end(enemyToAuthoringJson(norm));
          return;
        }

        if (parts[0] === 'api' && parts[1] === 'assets') {
          const type = parts[2];
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
