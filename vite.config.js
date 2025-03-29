import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  define: {
    'process.env': import.meta.env
  },
  plugins: [
    react(),
    visualizer({
      open: false, 
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    minify: 'terser', // Используем Terser для более агрессивной минимизации
    sourcemap: false, // Отключение source map для уменьшения итогового размера
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          bootstrap: ['react-bootstrap'],
          forms: ['react-hook-form'],
          carousel: ['react-multi-carousel']
        },
        chunkFileNames: '[name]-[hash].js', // Оптимизация имен файлов
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true, // Для улучшения совместимости с CommonJS
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
