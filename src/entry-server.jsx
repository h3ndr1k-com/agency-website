/**
 * SSR entry for build-time prerender. Same AppShell the client hydrates.
 */
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import AppShell from './AppShell.jsx'

export function render(path) {
    return renderToString(
        <StaticRouter location={path}>
            <AppShell />
        </StaticRouter>
    )
}
