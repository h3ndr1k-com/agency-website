import { lazy, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const ServiceStrategy = lazy(() => import('./ServiceStrategy.jsx'))
const ServiceAgents = lazy(() => import('./ServiceAgents.jsx'))

const Loading = () => <div className="min-h-screen bg-[#0A0A0A]" />

// Scrolls to #hash targets after route changes (Link to="/#contact" etc.)
function ScrollToHash() {
    const { pathname, hash } = useLocation()
    useEffect(() => {
        if (hash) {
            const t = setTimeout(() => {
                document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
            }, 150)
            return () => clearTimeout(t)
        }
        window.scrollTo(0, 0)
    }, [pathname, hash])
    return null
}

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ScrollToHash />
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/services/ai-strategy" element={<Suspense fallback={<Loading />}><ServiceStrategy /></Suspense>} />
            <Route path="/services/custom-agents" element={<Suspense fallback={<Loading />}><ServiceAgents /></Suspense>} />
        </Routes>
    </BrowserRouter>,
)
