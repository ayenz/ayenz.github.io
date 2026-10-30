import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'

// Mirror GitHub Pages: /signal -> /signal/ instead of falling back to the root page.
const trailingSlash = {
  name: 'trailing-slash',
  configureServer(s) { s.middlewares.use(redirect) },
  configurePreviewServer(s) { s.middlewares.use(redirect) },
}
function redirect(req, res, next) {
  if (req.url === '/signal' || req.url.startsWith('/signal?')) {
    res.statusCode = 301
    res.setHeader('Location', req.url.replace('/signal', '/signal/'))
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
        signal: resolve(import.meta.dirname, 'signal/index.html'),
      },
    },
  },
})
