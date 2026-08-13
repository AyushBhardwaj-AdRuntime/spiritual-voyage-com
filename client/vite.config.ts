import { defineConfig } from 'vite';
import { nitro } from 'nitro/vite';
import viteReact from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
      nitro(),
    viteReact(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
