import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import App from './App.jsx'
import SpecStudio from './SpecStudio.jsx'
import ServiceStrategy from './ServiceStrategy.jsx'
import VoiceAgent from './VoiceAgent.jsx'
import AiOpsSetup from './AiOpsSetup.jsx'
import { Privacy, Terms, NotFound } from './Legal.jsx'

function ScrollToHash() {
    const { pathname, hash } = useLocation()
    useEffect(() => {
        if (hash) {
            const t = setTimeout(() => {
                document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
            }, 150)
            return () => clearTimeout(t)
        }
        if (typeof window !== 'undefined') window.scrollTo(0, 0)
    }, [pathname, hash])
    return null
}

/** Shared route tree for SSR prerender and client hydrate (must match 1:1). */
export default function AppShell() {
    return (
        <>
            <ScrollToHash />
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/spec-studio" element={<SpecStudio />} />
                <Route path="/services/ai-strategy" element={<ServiceStrategy />} />
                <Route path="/services/voice-agent" element={<VoiceAgent />} />
                <Route path="/ai-ops-setup" element={<AiOpsSetup />} />
                <Route path="/ai-ops-setup/book" element={<AiOpsSetup />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}
