import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'

// Mirror GitHub Pages: /world -> /world/ (etc.) instead of falling back to the root page.
const trailingSlash = {
  name: 'trailing-slash',
  configureServer(s) { s.middlewares.use(redirect) },
  configurePreviewServer(s) { s.middlewares.use(redirect) },
}
function redirect(req, res, next) {
  const m = req.url.match(/^\/(world|signal)(\?.*)?$/)
  if (m) {
    res.statusCode = 301
    res.setHeader('Location', `/${m[1]}/${m[2] || ''}`)
    return res.end()
  }
  next()
}

export default defineConfig({
  plugins: [vue(), trailingSlash],
  appType: 'mpa',
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        world: resolve(import.meta.dirname, 'world/index.html'),
        signal: resolve(import.meta.dirname, 'signal/index.html'),
      },
    },
  },
})
