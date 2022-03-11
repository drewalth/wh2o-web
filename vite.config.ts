import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
// process.env = {...process.env, ...loadEnv(mode, process.cwd())};
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: '/',
    server: {
      port: 8080
    },
    plugins: [react(), tsconfigPaths()],
    build: {
      sourcemap: true
    },
    envDir: '.'
  });
};
