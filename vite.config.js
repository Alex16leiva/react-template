import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    // Backend uses https://localhost:7217 with a .NET dev certificate.
    // Run: dotnet dev-certs https --trust
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
