import { defineConfig, loadEnv } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const emdashTarget = env.VITE_EMDASH_URL || 'http://localhost:4321';

  return {
    plugins: [devtools(), solidPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/_emdash': {
          target: emdashTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      target: 'esnext',
    },
  };
});

