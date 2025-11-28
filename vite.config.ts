import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    base: "./",                    // 🔥 Required to fix 404 on Vercel
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_KEY': JSON.stringify(env.API_KEY) // 🔥 Safe env usage
    },
    build: {
      outDir: "dist",
    }
  };
});
