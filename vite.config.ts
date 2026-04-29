import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@mediapipe/tasks-vision'],
  },
  server: {
    // Stop Vite trying to resolve .map files that aren't shipped
    // with node_modules packages (e.g. @mediapipe/tasks-vision)
    sourcemapIgnoreList: (sourcePath) => sourcePath.includes('node_modules'),
  },
})
