import { lazy, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const ServiceStrategy = lazy(() => import('./ServiceStrategy.jsx'))
const ServiceAgents = lazy(() => import('./ServiceAgents.jsx'))
const AiOpsSetup = lazy(() => import('./AiOpsSetup.jsx'))
const SpecStudio = lazy(() => import('./SpecStudio.jsx'))
const Privacy = lazy(() => import('./Legal.jsx').then((m) => ({ default: m.Privacy })))
const Terms = lazy(() => import('./Legal.jsx').then((m) => ({ default: m.Terms })))
const NotFound = lazy(() => import('./Legal.jsx').then((m) => ({ default: m.NotFound })))

const Loading = () => <div className="min-h-screen bg-[#0A0A0A]" />

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
            <Route path="/spec-studio" element={<Suspense fallback={<Loading />}><SpecStudio /></Suspense>} />
            <Route path="/services/ai-strategy" element={<Suspense fallback={<Loading />}><ServiceStrategy /></Suspense>} />
            <Route path="/services/custom-agents" element={<Suspense fallback={<Loading />}><ServiceAgents /></Suspense>} />
            <Route path="/ai-ops-setup" element={<Suspense fallback={<Loading />}><AiOpsSetup /></Suspense>} />
            <Route path="/ai-ops-setup/book" element={<Suspense fallback={<Loading />}><AiOpsSetup /></Suspense>} />
            <Route path="/privacy" element={<Suspense fallback={<Loading />}><Privacy /></Suspense>} />
            <Route path="/terms" element={<Suspense fallback={<Loading />}><Terms /></Suspense>} />
            <Route path="*" element={<Suspense fallback={<Loading />}><NotFound /></Suspense>} />
        </Routes>
    </BrowserRouter>,
)
