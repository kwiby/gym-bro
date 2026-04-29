import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// @mediapipe/tasks-vision ships a sourceMappingURL comment pointing to a
// .map file that is not included in the package. Vite forwards that comment
// to the browser, which then tries (and fails) to load the missing file.
// This plugin strips the comment before the file is served.
const stripMissingSourcemaps: Plugin = {
  name: 'strip-missing-sourcemaps',
  enforce: 'pre',
  transform(code, id) {
    if (id.includes('@mediapipe/tasks-vision')) {
      return { code: code.replace(/\/\/# sourceMappingURL=\S+\.map/g, ''), map: null }
    }
  },
}

export default defineConfig({
  plugins: [react(), stripMissingSourcemaps],
  optimizeDeps: {
    exclude: ['@mediapipe/tasks-vision'],
  },
})
