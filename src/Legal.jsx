import { Link } from 'react-router-dom';
import SeoHead from './SeoHead.jsx';
import { ServiceNavbar, Footer, SectionLabel } from './shared.jsx';

const FOOTER_LINKS = [
    ['Home', '/'],
    ['Spec Studio', '/spec-studio'],
    ['Privacy', '/privacy'],
    ['Terms', '/terms'],
    ['Contact', '/#contact'],
];

function LegalShell({ path, title, children }) {
    return (
        <div className="w-full min-h-screen font-sans bg-[#0A0A0A] text-white selection:bg-amber-500 selection:text-black relative">
            <SeoHead path={path} />
            <ServiceNavbar />
            <main className="pt-32 pb-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <SectionLabel>Legal · DRAFT</SectionLabel>
                    </div>
                    <p className="text-amber-500 text-xs font-ui uppercase tracking-[0.2em] mb-6">
                        Draft for Hendrik review. Not final legal advice.
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.02em] mb-10">
                        {title}
                    </h1>
                    <div className="prose-legal space-y-6 text-zinc-400 text-sm md:text-base leading-relaxed">
                        {children}
                    </div>
                    <p className="mt-16 text-zinc-500 text-sm">
                        Questions:{' '}
                        <a href="mailto:hendrik@corefix.app" className="text-amber-500 hover:text-white">
                            hendrik@corefix.app
                        </a>
                        {' · '}
                        <Link to="/" className="text-amber-500 hover:text-white">
                            Home
                        </Link>
                    </p>
                </div>
            </main>
            <Footer links={FOOTER_LINKS} />
        </div>
    );
}

export function Privacy() {
    return (
        <LegalShell path="/privacy" title="Privacy Policy">
            <p>
                <strong className="text-white">Last updated:</strong> October 2026 (DRAFT)
            </p>
            <p>
                Corefix (&quot;we&quot;, &quot;us&quot;) operates corefix.app. This draft explains what we
                collect when you use the site, book a call, submit the contact form, or use the
                voice demo.
            </p>
            <h2 className="text-white text-xl font-bold pt-4">What we collect</h2>
            <ul className="list-disc pl-5 space-y-2">
                <li>
                    Contact details you provide (name, email, company, message) via the contact form
                    (processed by FormSubmit and emailed to hendrik@corefix.app).
                </li>
                <li>
                    Booking details when you schedule via Cal.com (name, email, time, timezone, and
                    any notes you share).
                </li>
                <li>
                    Voice demo: microphone audio for the live session, and any name/email/timezone
                    you give the agent so it can check availability and book on the calendar. Calls
                    are processed by our voice provider (Vapi) and related AI/speech vendors needed
                    to run the demo.
                </li>
            </ul>
            <h2 className="text-white text-xl font-bold pt-4">How we use it</h2>
            <p>
                To respond to inquiries, run demos, book intro calls, deliver services you request,
                and improve the site. We do not sell your personal information.
            </p>
            <h2 className="text-white text-xl font-bold pt-4">Retention and security</h2>
            <p>
                We keep inquiry and booking records as long as needed for the relationship and
                ordinary business records. Providers process data under their own terms. Use
                industry-standard protections appropriate to a small consulting practice.
            </p>
            <h2 className="text-white text-xl font-bold pt-4">Your choices</h2>
            <p>
                Email hendrik@corefix.app to access, correct, or delete personal information we
                hold about you, subject to legal retention needs.
            </p>
            <h2 className="text-white text-xl font-bold pt-4">Contact</h2>
            <p>
                Corefix · hendrik@corefix.app · Toronto, Canada (serves clients across North
                America and Europe).
            </p>
        </LegalShell>
    );
}

export function Terms() {
    return (
        <LegalShell path="/terms" title="Terms of Use">
            <p>
                <strong className="text-white">Last updated:</strong> October 2026 (DRAFT)
            </p>
            <p>
                By using corefix.app, the voice demo, or booking a call with Corefix, you agree to
                these draft terms.
            </p>
            <h2 className="text-white text-xl font-bold pt-4">The site and demos</h2>
            <p>
                Content is for information. Demos (including the live voice agent) are
                demonstrations of capability, not a guarantee of results for your business. Spec
                Studio examples use real production patterns; your deployment is scoped separately.
            </p>
            <h2 className="text-white text-xl font-bold pt-4">Bookings and paid work</h2>
            <p>
                Calendar bookings are introductory unless otherwise stated. Paid engagements
                (including voice-agent pilots and Spec Studio) are governed by a separate proposal
                or agreement. Voice-agent pricing shown on the site may change; Spec Studio is scoped
                without a published list price.
            </p>
            <h2 className="text-white text-xl font-bold pt-4">Acceptable use</h2>
            <p>
                Do not abuse the voice demo, scrape the site aggressively, or submit unlawful or
                harmful content through forms or calls.
            </p>
            <h2 className="text-white text-xl font-bold pt-4">Liability</h2>
            <p>
                The site is provided as-is. To the fullest extent allowed by law, Corefix is not
                liable for indirect or consequential damages arising from use of the site or demos.
            </p>
            <h2 className="text-white text-xl font-bold pt-4">Contact</h2>
            <p>hendrik@corefix.app</p>
        </LegalShell>
    );
}

export function NotFound() {
    return (
        <div className="w-full min-h-screen font-sans bg-[#0A0A0A] text-white flex flex-col">
            <SeoHead path="/404" />
            <ServiceNavbar />
            <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center">
                <p className="text-amber-500 text-xs font-ui uppercase tracking-[0.25em] mb-6">404</p>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Page not found</h1>
                <p className="text-zinc-400 mb-10 max-w-md">
                    That URL is not part of Corefix. Head home or book a call.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        to="/"
                        className="px-7 py-4 bg-white text-black font-bold text-[11px] font-ui uppercase tracking-[0.2em] hover:bg-amber-500"
                    >
                        Home
                    </Link>
                    <a
                        href="https://cal.com/corefix.ai/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-7 py-4 border border-white/60 text-white font-bold text-[11px] font-ui uppercase tracking-[0.2em] hover:bg-white hover:text-black"
                    >
                        Book a call
                    </a>
                </div>
            </main>
            <Footer links={FOOTER_LINKS} />
        </div>
    );
}
