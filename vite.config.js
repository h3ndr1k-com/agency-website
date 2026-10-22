import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
export default defineConfig({
    plugins: [react(), apiDevPlugin()],
})
