import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  esbuild: {
    target: 'esnext',
  },
  build: {
    target: 'esnext', // Ensures compatibility with top-level await
  },
});
