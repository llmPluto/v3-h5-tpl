import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import tailwindcss from '@tailwindcss/vite'

const AIM_ENV = process.env.AIM_ENV

const apiConfig = {
  dev: 'https://tqgm.taoqi.games/',
  prod: 'https://tqgm.taoqiyouxi.com/',
}

// https://vite.dev/config/
export default defineConfig({
  base: '/h5/',
  define: {
    API_CONFIG: JSON.stringify({ AIM_ENV: process.env.AIM_ENV }),
  },
  server: {
    open: true,
    port: 5274,
    proxy: {
      // 代理所有以 /api 开头的请求
      '/proxy': {
        target: apiConfig[AIM_ENV],
        // target: 'http://localhost:2230/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy/, ''),
      },
    },
  },

  plugins: [
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      resolvers: [VantResolver()],
    }),
    tailwindcss(),
    Components({
      resolvers: [VantResolver()],
    }),
    vue(),
    vueJsx(),
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: AIM_ENV === 'prod' ? './dist/prod' : './dist/dev',
  },
})
