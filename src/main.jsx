import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppShell from './AppShell.jsx'
import './index.css'

const container = document.getElementById('root')
const app = (
    <BrowserRouter>
        <AppShell />
    </BrowserRouter>
)

if (container.hasChildNodes()) {
    hydrateRoot(container, app)
} else {
    createRoot(container).render(app)
}
