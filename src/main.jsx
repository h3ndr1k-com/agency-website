import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const ServiceStrategy = lazy(() => import('./ServiceStrategy.jsx'))

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/services/ai-strategy" element={<Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}><ServiceStrategy /></Suspense>} />
        </Routes>
    </BrowserRouter>,
)
