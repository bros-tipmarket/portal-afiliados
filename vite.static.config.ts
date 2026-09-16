// Build estático (SPA) para publicação no GitHub Pages.
// O app local continua sendo servido por `npm run dev` (vinext + Cloudflare).
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: process.env.PORTAL_BASE ?? '/',
  root: path.resolve(dir, 'static'),
  publicDir: path.resolve(dir, 'public'),
  plugins: [react()],
  resolve: {alias: {'@': dir}},
  build: {outDir: path.resolve(dir, 'dist-static'), emptyOutDir: true},
});
