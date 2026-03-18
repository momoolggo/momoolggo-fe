import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,        // ✅ 추가
          configure: (proxy) => {
            proxy.on('error', (err) => console.log('proxy error', err))
            proxy.on('proxyReq', (_, req) => console.log('보내는 요청:', req.method, req.url))
            proxy.on('proxyRes', (res) => console.log('받은 응답:', res.statusCode))
          }
        },
      '/pic': {
      target: 'http://localhost:8080',
      }
    }
  }
})
