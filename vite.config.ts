import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { sourcemap: false },
  server: { port: Number(process.env.PORT) || 5173, host: true },
  preview: { port: 4173, host: true },
});
