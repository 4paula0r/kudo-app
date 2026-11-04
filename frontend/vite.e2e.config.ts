import { defineConfig, mergeConfig } from 'vite'
import baseConfig from './vite.config'

export default mergeConfig(baseConfig, defineConfig({
  server: {
    proxy: {
      '/api': { target: 'http://127.0.0.1:4401', changeOrigin: true },
    },
  },
}))