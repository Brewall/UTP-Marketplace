import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Inyectar automáticamente variables, mixins, funciones y responsive helpers
        // Ahora puedes usar $primary-color, @include flex-center, @include respond-above(md), etc.
        // en cualquier .scss o .module.scss sin importar nada
        additionalData: `
          @use "@/styles/abstracts/variables" as *;
          @use "@/styles/tools" as *;
        `,
        // Silenciar deprecaciones conocidas de Bootstrap con Dart Sass moderno
        silenceDeprecations: [
          'legacy-js-api',
          'mixed-decls',
          'color-functions',
          'global-builtin',
          'import'
        ]
      }
    }
  }
})
