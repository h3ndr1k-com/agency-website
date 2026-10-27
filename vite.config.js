import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * MPA clean URLs for preview: /spec-studio -> /spec-studio/index.html when that
 * file exists. Unknown paths stay 404 (no SPA fallback to home).
 */
function prerenderCleanUrlsPlugin() {
    return {
        name: 'corefix-prerender-clean-urls',
        configurePreviewServer(server) {
            server.middlewares.use((req, _res, next) => {
                if (!req.url || req.method !== 'GET') return next()
                const raw = req.url.split('?')[0]
                if (raw === '/' || raw.includes('.')) return next()
                const clean = raw.replace(/\/$/, '')
                const indexRel = join(clean.slice(1), 'index.html')
                const indexAbs = join(server.config.root, 'dist', indexRel)
                if (existsSync(indexAbs)) {
                    req.url = `/${indexRel.replace(/\\/g, '/')}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`
                }
                next()
            })
        },
    }
}

// Vite does not serve the Vercel functions in /api. This mounts them in `npm run dev` only.
function apiDevPlugin() {
    return {
        name: 'corefix-api-dev',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const url = req.url || ''
                const route = url.startsWith('/api/ai-ops-slots')
                    ? 'ai-ops-slots.js'
                    : url.startsWith('/api/create-checkout')
                        ? 'create-checkout.js'
                        : null
                if (!route) return next()

                if (typeof res.status !== 'function') {
                    res.status = (code) => {
                        res.statusCode = code
                        return {
                            json(body) {
                                if (!res.headersSent) res.setHeader('Content-Type', 'application/json; charset=utf-8')
                                res.end(JSON.stringify(body))
                            },
                        }
                    }
                }

                try {
                    const href = pathToFileURL(join(server.config.root, 'api', route)).href
                    const mod = await import(href)
                    await mod.default(req, res)
                } catch (err) {
                    console.error(err)
                    if (!res.headersSent) {
                        res.statusCode = 500
                        res.setHeader('Content-Type', 'application/json; charset=utf-8')
                        res.end(JSON.stringify({ error: 'API failed' }))
                    }
                }
            })
        },
    }
}

// https://vitejs.dev/config/
// appType mpa: preview/serve must use per-route prerendered HTML (no SPA
// fallback to index.html). That keeps hydrateRoot matched to the right tree.
export default defineConfig({
    appType: 'mpa',
    plugins: [react(), apiDevPlugin(), prerenderCleanUrlsPlugin()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return
                    if (id.includes('three') || id.includes('@react-three')) return 'three'
                    if (id.includes('gsap')) return 'gsap'
                    if (id.includes('framer-motion')) return 'framer'
                    if (id.includes('@calcom')) return 'cal'
                    if (id.includes('@vapi-ai')) return 'vapi'
                    if (id.includes('lucide-react')) return 'icons'
                    if (id.includes('react-dom') || id.includes('/react/') || id.includes('react-router')) return 'react-vendor'
                },
            },
        },
    },
})
