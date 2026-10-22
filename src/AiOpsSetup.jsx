import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { STACKS, stackLabel } from '../api/_lib/ai-ops-intake.js';
import { ServiceNavbar, Footer, BrightGrid, SectionGrid, SectionLabel, CornerButton } from './shared';

const CAL_LINK = (import.meta.env.VITE_CAL_AI_OPS_LINK || 'corefix.ai/aios-setup-session-60-min')
    .replace(/^https?:\/\/(www\.)?cal\.com\//, '')
    .replace(/^\//, '');
const CAL_URL = `https://cal.com/${CAL_LINK}`;
const INTAKE_KEY = 'corefix.aiOpsIntake';

const HOUR = [
    'Map top 3 time sinks',
    'Pick #1 that pays off first',
    'Leave with one-page priority list + one working starter (Grok Bot kit / n8n sketch / voice-agent outline)',
];

const FOOTER_LINKS = [
    ['Home', '/'],
    ['Bolt-Ons', '/#services'],
    ['Case Study', '/#case-study'],
    ['Free Audit', '/#audit'],
    ['Contact', '/#contact'],
];

const fieldClass = 'w-full px-5 py-5 bg-[#111] border border-zinc-700 text-white text-sm placeholder-zinc-400 focus:border-zinc-500 focus:outline-none transition-colors';

function readStoredIntake() {
    try {
        const raw = sessionStorage.getItem(INTAKE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function storeIntake(intake) {
    try {
        sessionStorage.setItem(INTAKE_KEY, JSON.stringify(intake));
    } catch {
        /* private mode */
    }
}

function SlotBadge({ slots, failed }) {
    if (failed) {
        return <span className="px-3 py-1 border border-white/20 text-zinc-400 text-[10px] font-bold font-ui uppercase tracking-[0.2em]">Free slots unavailable</span>;
    }
    if (!slots) {
        return <span className="px-3 py-1 border border-white/20 text-zinc-400 text-[10px] font-bold font-ui uppercase tracking-[0.2em]">Checking free slots</span>;
    }
    const label = `${slots.remaining} of ${slots.cap} free left`;
    if (slots.remaining > 0) {
        return <span className="px-3 py-1 bg-amber-500 text-black text-[10px] font-bold font-ui uppercase tracking-[0.2em]">{label}</span>;
    }
    return <span className="px-3 py-1 border border-white/30 text-zinc-300 text-[10px] font-bold font-ui uppercase tracking-[0.2em]">{label}</span>;
}

function Landing() {
    const ref = useRef(null);
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [slots, setSlots] = useState(null);
    const [slotsFailed, setSlotsFailed] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', company: '', stack: '', timeSink: '' });
    const [pending, setPending] = useState(null);
    const [error, setError] = useState('');
    const cancelled = params.get('checkout') === 'cancelled';

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.ops-el', { y: 28, opacity: 0, duration: 0.85, stagger: 0.07, ease: 'power2.out' });
        }, ref);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        let cancelledFetch = false;
        (async () => {
            try {
                const res = await fetch('/api/ai-ops-slots');
                const data = await res.json();
                if (!cancelledFetch && res.ok && typeof data.remaining === 'number') setSlots(data);
                else if (!cancelledFetch) setSlotsFailed(true);
            } catch {
                if (!cancelledFetch) setSlotsFailed(true);
            }
        })();
        return () => { cancelledFetch = true; };
    }, []);

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const startCheckout = async (intake) => {
        setPending('pay');
        const res = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(intake),
        });
        const data = await res.json().catch(() => ({}));
        if (data.url) {
            window.location.assign(data.url);
            return;
        }
        setPending(null);
        setError(data.blocker || data.error || 'Checkout is not available yet. Email hendrik@corefix.app.');
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setError('');
        if (!form.stack) {
            setError('Pick a stack');
            return;
        }
        const intake = {
            name: form.name.trim(),
            email: form.email.trim(),
            company: form.company.trim(),
            stack: form.stack,
            timeSink: form.timeSink.trim(),
        };
        storeIntake(intake);
        setPending('claim');
        try {
            const res = await fetch('/api/ai-ops-slots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(intake),
            });
            const data = await res.json().catch(() => ({}));
            if (data.ok && data.claimId) {
                navigate(`/ai-ops-setup/book?claim=${encodeURIComponent(data.claimId)}`);
                return;
            }
            if (data.code === 'full') {
                await startCheckout(intake);
                return;
            }
            if (data.code === 'storage_unconfigured') {
                navigate('/ai-ops-setup/book');
                return;
            }
            setPending(null);
            setError(data.error || 'Could not hold a seat. Email hendrik@corefix.app.');
            if (typeof data.remaining === 'number') {
                setSlots((current) => ({ ...(current || {}), ...data, remaining: data.remaining }));
            }
        } catch {
            setPending(null);
            setError('Could not reach the booking service. Email hendrik@corefix.app.');
        }
    };

    const payPath = slots && slots.remaining <= 0;

    return (
        <div ref={ref}>
            <section className="relative overflow-hidden">
                <img
                    src="/ai-ops-fog.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-[center_38%] grayscale contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/55 via-[#0A0A0A]/68 to-[#0A0A0A] pointer-events-none" aria-hidden="true" />
                <a
                    href="https://unsplash.com/photos/foggy-mountain-summit-1Z2niiBPg5A"
                    className="absolute right-6 top-28 z-30 text-[10px] font-ui uppercase tracking-[0.18em] text-white/70 hover:text-white transition-colors"
                >
                    Photo · v2osk
                </a>
                <BrightGrid z="z-20" />
                <div className="relative z-30 pt-28 md:pt-32">
                <div className="max-w-[1400px] mx-auto px-6 pb-20 md:pb-28">
                    <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-start">
                        <div>
                            <div className="ops-el mb-8">
                                <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 text-xs font-ui uppercase tracking-[0.2em] hover:text-white transition-colors group">
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                                </Link>
                            </div>
                            <div className="ops-el mb-6"><SectionLabel>AI Ops Setup</SectionLabel></div>
                            <h1 className="ops-el font-display uppercase leading-[0.9] tracking-[0.01em] text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl">
                                Get AI working in your business in 60 minutes
                            </h1>
                            <p className="ops-el mt-8 max-w-xl text-zinc-300 text-base md:text-lg leading-relaxed">
                                A live screen-share session — not a sales call. You leave with a plan and a working starter.
                            </p>

                            <div className="ops-el mt-8 flex flex-wrap items-center gap-4">
                                <span className="text-white font-ui text-sm uppercase tracking-[0.18em]">$97 · 60 min · 1:1</span>
                                <span aria-live="polite"><SlotBadge slots={slots} failed={slotsFailed} /></span>
                            </div>
                            <p className="ops-el mt-4 text-zinc-500 text-sm">$97 credited toward fixed-scope build of #1.</p>
                            {payPath && (
                                <p className="ops-el mt-2 text-zinc-500 text-xs font-ui uppercase tracking-[0.16em]">Checkout charges $97 CAD.</p>
                            )}

                            <div className="ops-el mt-10 max-w-xl">
                                <p className="text-zinc-500 text-[10px] font-ui uppercase tracking-[0.25em] mb-3">Who it&apos;s for</p>
                                <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                                    Solo operators and small teams (under ~20) who've tried ChatGPT but nothing stuck in the real workflow.
                                </p>
                            </div>
                        </div>

                        <form id="book" onSubmit={onSubmit} className="ops-el lg:sticky lg:top-28 border border-white/15 bg-[#0A0A0A] p-6 md:p-8 space-y-3">
                            <p className="text-[10px] font-ui uppercase tracking-[0.25em] text-zinc-500 mb-4">Short intake</p>
                            {cancelled && (
                                <p className="text-amber-500 text-xs font-ui uppercase tracking-[0.14em] mb-2">Checkout cancelled. Your details are still here.</p>
                            )}
                            <label className="block">
                                <span className="sr-only">Name</span>
                                <input name="name" required autoComplete="name" placeholder="Name" value={form.name} onChange={onChange} className={fieldClass} />
                            </label>
                            <label className="block">
                                <span className="sr-only">Email</span>
                                <input name="email" type="email" required autoComplete="email" placeholder="Work email" value={form.email} onChange={onChange} className={fieldClass} />
                            </label>
                            <label className="block">
                                <span className="sr-only">Company</span>
                                <input name="company" required autoComplete="organization" placeholder="Company" value={form.company} onChange={onChange} className={fieldClass} />
                            </label>
                            <fieldset>
                                <legend className="text-[10px] font-ui uppercase tracking-[0.22em] text-zinc-500 mb-2">Stack</legend>
                                <div className="grid grid-cols-2 gap-px bg-white/10">
                                    {STACKS.map((stack) => {
                                        const selected = form.stack === stack.value;
                                        return (
                                            <button
                                                key={stack.value}
                                                type="button"
                                                aria-pressed={selected}
                                                onClick={() => setForm((current) => ({ ...current, stack: stack.value }))}
                                                className={`px-4 py-4 text-left text-[11px] font-ui uppercase tracking-[0.16em] transition-colors ${selected ? 'bg-amber-500 text-black' : 'bg-[#111] text-zinc-300 hover:text-white'}`}
                                            >
                                                {stack.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </fieldset>
                            <label className="block">
                                <span className="sr-only">Top time sink</span>
                                <textarea name="timeSink" required rows={4} placeholder="Top time sink" value={form.timeSink} onChange={onChange} className={`${fieldClass} resize-none`} />
                            </label>
                            {error && <p className="text-red-400 text-xs leading-relaxed">{error}</p>}
                            <button
                                type="submit"
                                disabled={pending !== null}
                                className="relative w-full px-6 py-5 bg-white text-black font-bold text-[11px] font-ui uppercase tracking-[0.14em] sm:tracking-[0.18em] leading-relaxed text-center hover:bg-amber-500 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="inline-flex items-center justify-center gap-3 max-w-full whitespace-normal">
                                    {pending === 'pay' ? 'Redirecting to checkout' : pending === 'claim' ? 'Holding your seat' : 'Book your AI Ops Setup Session'}
                                    {pending === null && <ArrowUpRight size={14} className="shrink-0 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />}
                                </span>
                            </button>
                            <p className="text-zinc-600 text-[10px] font-ui uppercase tracking-[0.16em] text-center">
                                {payPath ? '$97 CAD · then pick a time' : 'Free while seats remain · then pick a time'}
                            </p>
                        </form>
                    </div>
                </div>
                </div>
            </section>

            <section className="relative py-20 md:py-28 border-t border-white/10 overflow-hidden">
                <SectionGrid />
                <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                    <div className="mb-8"><SectionLabel>In the hour</SectionLabel></div>
                    <div className="grid md:grid-cols-3 gap-px bg-white/10">
                        {HOUR.map((step, index) => (
                            <div key={step} className="bg-[#0A0A0A] p-8 md:p-10">
                                <div className="text-amber-500 font-ui text-xs tracking-[0.22em] mb-6">0{index + 1}</div>
                                <p className="text-white text-lg md:text-xl font-bold leading-snug">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function calHref(intake) {
    const url = new URL(CAL_URL);
    if (intake?.name) url.searchParams.set('name', intake.name);
    if (intake?.email) url.searchParams.set('email', intake.email);
    if (intake?.company || intake?.stack || intake?.timeSink) {
        const notes = [
            intake.company ? `Company: ${intake.company}` : '',
            intake.stack ? `Stack: ${stackLabel(intake.stack)}` : '',
            intake.timeSink ? `Top time sink: ${intake.timeSink}` : '',
        ].filter(Boolean).join('\n');
        url.searchParams.set('notes', notes);
    }
    return url.toString();
}

function openBooking() {
    const intake = readStoredIntake();
    if (intake?.name && intake?.email) return { kind: 'open', intake };
    return { kind: 'denied', message: 'Add your name and email on the setup page, then pick a time.' };
}

function BookSession() {
    const [params] = useSearchParams();
    const claimId = params.get('claim') || '';
    const sessionId = params.get('session_id') || '';
    const [auth, setAuth] = useState(() => (claimId || sessionId ? { kind: 'loading' } : openBooking()));

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                if (claimId) {
                    const res = await fetch(`/api/ai-ops-slots?claimId=${encodeURIComponent(claimId)}`);
                    const data = await res.json().catch(() => ({}));
                    if (cancelled) return;
                    if (data.ok && data.claim) setAuth({ kind: 'free', intake: { ...readStoredIntake(), ...data.claim } });
                    else setAuth({ kind: 'denied', message: data.error || 'That free seat was not found.' });
                    return;
                }
                if (sessionId) {
                    const res = await fetch(`/api/create-checkout?session_id=${encodeURIComponent(sessionId)}`);
                    const data = await res.json().catch(() => ({}));
                    if (cancelled) return;
                    if (data.paid && data.intake) setAuth({ kind: 'paid', intake: { ...readStoredIntake(), ...data.intake } });
                    else setAuth({ kind: 'denied', message: data.error || 'Payment is not confirmed yet.' });
                    return;
                }
                if (!cancelled) setAuth(openBooking());
            } catch {
                if (!cancelled) setAuth({ kind: 'denied', message: 'Could not confirm this booking. Email hendrik@corefix.app.' });
            }
        })();
        return () => { cancelled = true; };
    }, [claimId, sessionId]);

    useEffect(() => {
        if (auth.kind !== 'free' && auth.kind !== 'paid' && auth.kind !== 'open') return undefined;
        let active = true;
        (async () => {
            const api = await getCalApi({ namespace: 'ai-ops-setup' });
            if (!active) return;
            api('ui', { theme: 'dark', hideEventTypeDetails: false, layout: 'month_view' });
        })();
        return () => { active = false; };
    }, [auth.kind]);

    const intake = auth.intake;
    const calConfig = { layout: 'month_view', theme: 'dark' };
    if (intake?.name) calConfig.name = intake.name;
    if (intake?.email) calConfig.email = intake.email;
    const notes = [
        intake?.company ? `Company: ${intake.company}` : '',
        intake?.stack ? `Stack: ${stackLabel(intake.stack)}` : '',
        intake?.timeSink ? `Top time sink: ${intake.timeSink}` : '',
    ].filter(Boolean).join('\n');
    if (notes) calConfig.notes = notes;

    return (
        <section className="relative pt-28 pb-24 md:pt-32 overflow-hidden">
            <BrightGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="mb-6"><SectionLabel>AI Ops Setup</SectionLabel></div>
                <h1 className="font-display uppercase leading-[0.9] text-white text-5xl md:text-7xl max-w-4xl">
                    Book your AI Ops Setup Session
                </h1>
                <p className="mt-6 max-w-xl text-zinc-400 text-sm md:text-base leading-relaxed">
                    A live screen-share session — not a sales call. You leave with a plan and a working starter.
                </p>

                {auth.kind === 'loading' && (
                    <p className="mt-10 text-zinc-500 text-xs font-ui uppercase tracking-[0.2em]">Confirming your seat</p>
                )}

                {auth.kind === 'denied' && (
                    <div className="mt-12 max-w-xl border border-white/15 p-8">
                        <p className="text-white text-lg font-bold mb-3">{auth.message}</p>
                        <CornerButton to="/ai-ops-setup" filled>
                            Back to the setup page <ArrowUpRight size={14} />
                        </CornerButton>
                    </div>
                )}

                {(auth.kind === 'free' || auth.kind === 'paid' || auth.kind === 'open') && (
                    <>
                        <p className="mt-6 text-amber-500 text-xs font-ui uppercase tracking-[0.18em]">
                            {auth.kind === 'paid' ? 'Payment received — $97 CAD' : auth.kind === 'free' ? 'Free seat claimed' : 'Pick a time'}
                        </p>
                        <div className="mt-8 border border-white/15 bg-[#0A0A0A] overflow-hidden" style={{ minHeight: 640 }}>
                            <Cal
                                namespace="ai-ops-setup"
                                calLink={CAL_LINK}
                                style={{ width: '100%', height: '100%', minHeight: 640, overflow: 'scroll' }}
                                config={calConfig}
                            />
                        </div>
                        <div className="mt-6">
                            <CornerButton href={calHref(intake)}>
                                Open full calendar <ArrowUpRight size={14} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            </CornerButton>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default function AiOpsSetup() {
    const { pathname } = useLocation();
    const booking = pathname.endsWith('/book');

    useEffect(() => {
        const previousTitle = document.title;
        const description = document.querySelector('meta[name="description"]');
        const previousDescription = description?.getAttribute('content') || '';
        document.title = booking
            ? 'Book your AI Ops Setup Session — Corefix'
            : 'Get AI working in your business in 60 minutes — Corefix';
        if (description && !booking) {
            description.setAttribute('content', 'A live 60-minute screen-share. You leave with a plan and a working starter. $97 CAD, with the first 3 sessions free.');
        }
        return () => {
            document.title = previousTitle;
            if (description) description.setAttribute('content', previousDescription);
        };
    }, [booking]);

    return (
        <div className="w-full min-h-screen font-sans bg-[#0A0A0A] text-white selection:bg-amber-500 selection:text-black relative">
            <ServiceNavbar />
            {booking ? <BookSession /> : <Landing />}
            <Footer links={FOOTER_LINKS} />
        </div>
    );
}
