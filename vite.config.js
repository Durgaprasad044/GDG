import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // Enable fast refresh
    fastRefresh: true,
    // Skip dev-time checks for faster builds
    jsxRuntime: 'automatic'
  })],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Increase chunk size limit to reduce chunking overhead
    chunkSizeWarningLimit: 1500,
    // Use faster minifier for development/testing
    minify: process.env.NODE_ENV === 'development' ? 'esbuild' : 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace']
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        // More efficient chunking
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('react') && !id.includes('recharts')) {
            return 'vendor';
          }
          // Charts library (largest dependency)
          if (id.includes('recharts')) {
            return 'charts';
          }
          // Routing
          if (id.includes('react-router')) {
            return 'router';
          }
          // Utilities and icons
          if (id.includes('axios') || id.includes('lucide-react')) {
            return 'utils';
          }
          // Everything else stays in main bundle
        }
      }
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'axios'],
      exclude: ['@testing-library/react', '@testing-library/jest-dom']
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  // Enable caching for faster subsequent builds
  cacheDir: 'node_modules/.vite',
  base: '/'
})