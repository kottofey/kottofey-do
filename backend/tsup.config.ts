import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { server: 'src/fastify/server.ts' },
  format: ['esm'],
  clean: true,
  splitting: false,
  skipNodeModulesBundle: true,
});
