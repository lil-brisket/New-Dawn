import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contentApiPlugin } from './vite-plugin-content';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');

export default defineConfig({
  plugins: [react(), contentApiPlugin(repoRoot)],
  server: { port: 5174, host: true },
  resolve: {
    alias: {
      '@': join(dirname(fileURLToPath(import.meta.url)), 'src'),
      '@dawn/game-core': join(repoRoot, 'packages/game-core/src'),
      '@dawn/game-data': join(repoRoot, 'packages/game-data/src'),
      '@dawn/content-pipeline': join(repoRoot, 'packages/content-pipeline/src'),
      '@dawn/types': join(repoRoot, 'packages/types/src'),
      '@dawn/utils': join(repoRoot, 'packages/utils/src'),
    },
  },
});
