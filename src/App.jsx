import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, ArrowUpRight, RotateCw } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Cal, { getCalApi } from '@calcom/embed-react';
import Flagship from './Flagship.jsx';
import VoiceSection from './VoiceSection.jsx';

gsap.registerPlugin(ScrollTrigger);

const CAL_LINK = 'corefix.ai/30min';
const CAL_URL = 'https://cal.com/corefix.ai/30min';

// ── Section Grid (decorative background grid for sections) ──
const gridLineColor = 'rgba(255,255,255,0.05)';
const gridPlusStyle = {
    color: 'rgba(255,255,255,0.15)',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 300,
    lineHeight: '0',
    userSelect: 'none',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
};
const gridVPositions = ['left-6', 'left-1/3', 'left-2/3', 'right-6'];
const gridHPositions = ['25%', '50%', '75%'];

const SectionGrid = () => (
    <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        {/* Horizontal lines — full width */}
        {gridHPositions.map((top, i) => (
            <div key={`h-${i}`} className="absolute left-0 right-0 h-[1px]" style={{ background: gridLineColor, top }} />
        ))}
        {/* Vertical lines + plus markers at every intersection */}
        <div className="max-w-[1400px] mx-auto h-full px-6 relative">
            {gridVPositions.map((pos, i) => (
                <div key={`v-${i}`} className={`absolute inset-y-0 ${pos} w-[1px]`} style={{ background: gridLineColor }}>
                    {gridHPositions.map(top => (
                        <span key={top} style={{ ...gridPlusStyle, top }}>+</span>
                    ))}
                </div>
            ))}
        </div>
    </div>
);

// ── Corner-accent button ──
const CornerButton = ({ href, children, filled, className = '' }) => {
    const base = filled
        ? 'bg-white text-black hover:bg-amber-500'
        : 'bg-black/40 backdrop-blur-sm text-white border border-white/60 hover:bg-white hover:text-black';
    const external = typeof href === 'string' && href.startsWith('http');
    const extProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return (
        <a href={href} {...extProps} className={`relative inline-flex items-center gap-3 px-7 py-4 font-bold text-[11px] font-ui uppercase tracking-[0.2em] transition-all duration-200 group ${base} ${className}`}>
            <span className="absolute -top-[3px] -left-[3px] w-3 h-3 border-t-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute -bottom-[3px] -right-[3px] w-3 h-3 border-b-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
            {children}
        </a>
    );
};

// ── Section label pill ──
const SectionLabel = ({ children }) => (
    <span className="inline-flex items-center gap-2.5 px-5 py-2.5 border border-white/40 text-white text-xs font-ui uppercase tracking-[0.25em]">
        <span className="w-1.5 h-1.5 bg-amber-500" />
        {children}
    </span>
);

// ── Navbar ──
const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-white/30 ${scrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-xl' : 'bg-[#0A0A0A]/40 backdrop-blur-md'}`}>
            <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                <a href="#" className="font-ui font-black tracking-[0.18em] text-white text-lg flex items-center gap-3">
                    <svg viewBox="0 0 32 32" className="w-7 h-7"><path d="M16 4 L27.3 10.5 L27.3 21.5 L16 28 L4.7 21.5 L4.7 10.5 Z" fill="none" stroke="#F59E0B" strokeWidth="2"/></svg>
                    COREFIX&reg;
                </a>
                <div className="hidden md:flex items-center gap-8 text-xs font-ui font-medium text-zinc-400 uppercase tracking-[0.18em]">
                    <a href="#services" className="hover:text-white transition-colors">Services</a>
                    <a href="#team" className="hover:text-white transition-colors">About</a>
                </div>
                <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex relative items-center px-6 py-3 bg-white text-black font-semibold text-xs font-ui uppercase tracking-[0.15em] hover:bg-amber-500 transition-all duration-200 group">
                    <span className="absolute -top-[2px] -left-[2px] w-2.5 h-2.5 border-t-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute -bottom-[2px] -right-[2px] w-2.5 h-2.5 border-b-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    Let&apos;s Talk
                </a>
                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
                    <div className="flex flex-col gap-1.5">
                        <span className={`block w-6 h-[2px] bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
                        <span className={`block w-6 h-[2px] bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-6 h-[2px] bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
                    </div>
                </button>
            </div>
            {menuOpen && (
                <div className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/5 px-6 py-8 flex flex-col gap-6">
                    {[['Services', '#services'], ['About', '#team']].map(([item, href]) => (
                        <a key={item} href={href} onClick={() => setMenuOpen(false)} className="text-zinc-300 text-lg font-ui uppercase tracking-widest hover:text-white">{item}</a>
                    ))}
                    <a href={CAL_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="text-amber-500 text-lg font-ui uppercase tracking-widest hover:text-white">Let&apos;s Talk</a>
                </div>
            )}
        </nav>
    );
};

// ── Hero ──
const Hero = () => {
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hero-line', { y: 80, opacity: 0, duration: 1.2, stagger: 0.08, ease: 'power3.out', delay: 0.2 });
            gsap.from('.hero-el', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power2.out', delay: 0.9 });
        }, ref);
        return () => ctx.revert();
    }, []);

    const tags = [
        { label: 'AI Strategy', href: '/services/ai-strategy', route: true },
        { label: 'Custom Agents', href: '#voice-demo' },
        { label: 'Spec Reviewer', href: '#flagship' },
        { label: 'Automation', href: '#services' },
    ];

    return (
        <section ref={ref} className="relative min-h-screen flex flex-col justify-end pb-12 md:pb-20 overflow-hidden pt-32">
            <div className="absolute inset-0 z-0" style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=60&auto=format)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(100%) contrast(1.1)'
            }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/30 to-[#0A0A0A] z-10 pointer-events-none" />
            <GridOverlay />

            {/* Tags in top-right sky area — clickable */}
            <div className="absolute top-40 md:top-52 right-6 md:right-[calc((100%-1400px)/2+24px)] z-40">
                <div className="hero-el flex flex-col gap-2 items-end">
                    {tags.map(tag => {
                        const cls = 'group/tag inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-ui uppercase tracking-[0.18em] text-white/80 border border-white/20 bg-black/30 backdrop-blur-sm hover:border-amber-500 hover:text-white transition-colors';
                        const inner = (<>{tag.label}<ArrowUpRight size={11} className="opacity-0 group-hover/tag:opacity-100 transition-opacity" /></>);
                        return tag.route
                            ? <Link key={tag.label} to={tag.href} className={cls}>{inner}</Link>
                            : <a key={tag.label} href={tag.href} className={cls}>{inner}</a>;
                    })}
                    <a
                        href="#spec-reviewer-walkthrough"
                        className="group/watch mt-3 inline-flex items-center gap-2 border border-amber-500 bg-amber-500 px-4 py-3 text-[10px] font-ui font-bold uppercase tracking-[0.18em] text-black transition-colors duration-200 hover:bg-white active:translate-y-px"
                    >
                        Watch What It Can Do
                        <ChevronRight size={13} className="transition-transform duration-200 group-hover/watch:translate-x-1" aria-hidden="true" />
                    </a>
                </div>
            </div>

            {/* Hero heading — sits ABOVE the grid */}
            <div className="relative z-40 max-w-[1400px] mx-auto px-6 w-full">
                <h1 className="font-display leading-[0.9] tracking-[0.01em] uppercase" style={{ WebkitTextStroke: '0' }}>
                    <span className="block overflow-hidden"><span className="hero-line block text-[20vw] md:text-[13.5vw] lg:text-[12vw] text-white">Your AI</span></span>
                    <span className="block overflow-hidden"><span className="hero-line block text-[20vw] md:text-[13.5vw] lg:text-[12vw] text-white">Growth</span></span>
                    <span className="block overflow-hidden"><span className="hero-line block text-[20vw] md:text-[13.5vw] lg:text-[12vw] text-zinc-500">Partner</span></span>
                </h1>
            </div>

            <div className="relative z-40 max-w-[1400px] mx-auto px-6 w-full">
                <div className="grid md:grid-cols-2 gap-8 mt-10 md:mt-14 items-end">
                    <p className="hero-el max-w-xl text-zinc-400 text-sm md:text-base leading-relaxed pl-2">
                        Production-ready AI systems that catch expensive errors, take live calls, and automate real work &mdash; built by the person you talk to.
                    </p>
                    <div className="hero-el flex justify-end gap-3 flex-wrap">
                        <CornerButton href="#flagship">
                            See the Work <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </CornerButton>
                        <CornerButton href={CAL_URL} filled className="text-[13px] px-9 py-5">
                            Let&apos;s Talk <ArrowUpRight size={15} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        </CornerButton>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ── Clients + Toolchain strip ──
const LogoMarquee = () => {
    const clients = [
        { name: 'POINT 1 DISPLAYS', tag: 'Display Manufacturing — Montreal' },
        { name: 'EVITAS AI', tag: 'AI Consulting — Partner Network' },
    ];
    const stack = ['ANTHROPIC', 'OPENAI', 'VAPI', 'CAL.COM', 'ELEVENLABS', 'MAKE', 'N8N', 'SUPABASE', 'VERCEL'];
    return (
        <section className="py-20 bg-[#080808]">
            <div className="max-w-[900px] mx-auto px-6">
                <div className="flex justify-center mb-10">
                    <SectionLabel>In Production With</SectionLabel>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 border-y border-white/40 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
                    {clients.map((c) => (
                        <div key={c.name} className="py-10 px-6 text-center group">
                            <div className="text-white font-ui font-black text-xl md:text-2xl tracking-[0.15em] uppercase group-hover:text-amber-500 transition-colors">
                                {c.name}
                            </div>
                            <div className="text-zinc-600 text-[9px] font-ui uppercase tracking-[0.25em] mt-2">{c.tag}</div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />
                    <div className="flex animate-marquee whitespace-nowrap items-center">
                        {[...stack, ...stack, ...stack].map((name, i) => (
                            <div key={i} className="mx-8 flex-shrink-0 flex items-center gap-8">
                                <span className="text-zinc-500 font-ui font-bold text-xs tracking-[0.25em] uppercase hover:text-zinc-300 transition-colors">{name}</span>
                                {i % stack.length === stack.length - 1 && <span className="w-1.5 h-1.5 bg-amber-500/60" />}
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <span className="text-zinc-700 text-[8px] font-ui uppercase tracking-[0.3em]">Toolchain</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ── Services ──
const Services = () => {
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.svc-card', {
                scrollTrigger: { trigger: ref.current, start: 'top 70%' },
                y: 60, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out'
            });
            gsap.from('.svc-title', {
                scrollTrigger: { trigger: ref.current, start: 'top 80%' },
                y: 40, opacity: 0, duration: 1, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    const services = [
        { num: '01', title: 'Voice Agents That Take Calls', desc: 'Live agents that answer, qualify, and book straight into your calendar — like the one on this page.', link: '/services/custom-agents' },
        { num: '02', title: 'Email Triage & Workflow Automation', desc: 'Inbox classification, follow-up tracking, and automations wired into the systems you already run.' },
        { num: '03', title: 'Document & Data Intelligence', desc: 'Systems that read your PDFs, drawings, and databases — and act on what they find.' },
        { num: '04', title: 'AI Strategy & Advisory', desc: 'A clear, execution-ready plan for where AI actually saves you money. No slideware.', link: '/services/ai-strategy' },
    ];

    return (
        <section id="services" ref={ref} className="py-24 md:py-40">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="mb-10">
                    <SectionLabel>Bolt-Ons</SectionLabel>
                </div>
                <h2 className="svc-title text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] max-w-5xl leading-[1.05] mb-8">
                    One flagship. <span className="text-zinc-500">Modular bolt-ons.</span>
                </h2>
                <p className="svc-title text-zinc-300 mb-20 max-w-xl text-sm">Each one ships as a working system in your stack — not a proof of concept.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((svc, i) => {
                        const Card = svc.link ? Link : 'div';
                        const cardProps = svc.link ? { to: svc.link } : {};
                        return (
                            <Card key={i} {...cardProps} className="svc-card group p-8 md:p-10 bg-[#0A0A0A] border border-white/40 hover:border-amber-500 hover:bg-[#111] transition-colors block cursor-pointer">
                                <div className="flex items-start gap-6">
                                    <span className="text-[10px] font-ui font-bold uppercase tracking-[0.25em] text-amber-500">{svc.num}</span>
                                    <div className="flex-1">
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{svc.title}</h3>
                                        <p className="text-zinc-300 text-sm leading-relaxed">{svc.desc}</p>
                                        {svc.link && (
                                            <span className="inline-flex items-center gap-1.5 mt-4 text-[10px] font-ui uppercase tracking-[0.2em] text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Learn More <ChevronRight size={12} />
                                            </span>
                                        )}
                                    </div>
                                    <ArrowUpRight size={20} className="text-zinc-500 group-hover:text-amber-500 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-12 p-8 md:p-12 bg-[#111] border border-white/40 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                    <p className="text-zinc-200 text-base md:text-lg max-w-2xl">Start with a conversation. Tell us about your business, your goals, and the problems you want solved.</p>
                    <CornerButton href={CAL_URL} filled className="whitespace-nowrap">
                        Let&apos;s Talk <ArrowUpRight size={14} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    </CornerButton>
                </div>
            </div>
        </section>
    );
};

// ── Reactor Knob Tick ──
const KnobTick = ({ currentRotation, angle }) => {
    const opacity = useTransform(currentRotation, (r) => r >= angle ? 1 : 0.2);
    const color = useTransform(currentRotation, (r) => r >= angle ? '#f97316' : '#404040');
    const shadow = useTransform(currentRotation, (r) => r >= angle ? '0 0 8px rgba(249,115,22,0.6)' : 'none');
    return <motion.div style={{ backgroundColor: color, opacity, boxShadow: shadow }} className="w-1 h-2.5" />;
};

// ── Reactor Knob Display ──
const KnobDisplay = ({ value }) => {
    const [display, setDisplay] = useState(0);
    useMotionValueEvent(value, 'change', (v) => setDisplay(Math.round(v)));
    return (
        <div className="relative">
            <span className="absolute inset-0 blur-sm text-orange-500/50 font-ui text-2xl font-black tabular-nums tracking-widest">
                {display.toString().padStart(3, '0')}
            </span>
            <span className="relative font-ui text-2xl text-orange-500 font-black tabular-nums tracking-widest">
                {display.toString().padStart(3, '0')}
                <span className="text-sm text-zinc-600 ml-1">%</span>
            </span>
        </div>
    );
};

// ── Capabilities (Reactor Knob + Cave Image) ──
const Capabilities = () => {
    const capabilities = [
        { label: 'Conversational AI & Chatbots', href: '#voice-demo' },
        { label: 'Customer Support Automation', href: '#services' },
        { label: 'Voice & Call Agents', href: '#voice-demo' },
        { label: 'Internal Ops & Admin Automation', href: '#services' },
        { label: 'Document & Data Intelligence', href: '#flagship' },
        { label: 'API & Tool Integrations', href: '#services' },
        { label: 'Sales & Lead Qualification Agents', href: '#voice-demo' },
        { label: 'Fine-tuned LLM Systems', href: '#services' },
    ];

    const MIN_DEG = -135;
    const MAX_DEG = 135;
    const MID_DEG = 0; // midpoint = 50%
    const TOTAL_TICKS = 40;
    const DEGREES_PER_TICK = (MAX_DEG - MIN_DEG) / TOTAL_TICKS;

    const [isDragging, setIsDragging] = useState(false);
    const rawRotation = useMotionValue(MID_DEG);
    const snappedRotation = useMotionValue(MID_DEG);
    const smoothRotation = useSpring(snappedRotation, { stiffness: 400, damping: 35, mass: 0.8 });
    const displayValue = useTransform(smoothRotation, [MIN_DEG, MAX_DEG], [0, 100]);
    const lightOpacity = useTransform(rawRotation, [MIN_DEG, MAX_DEG], [0.02, 0.35]);
    const indicatorShadow = useTransform(rawRotation, (r) => `0 0 ${Math.max(5, (r + 135) / 10)}px orange`);
    const knobRef = useRef(null);

    const handlePointerDown = useCallback(() => {
        setIsDragging(true);
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    }, []);

    useEffect(() => {
        if (!isDragging) return;
        const handlePointerMove = (e) => {
            if (!knobRef.current) return;
            const rect = knobRef.current.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            let degs = Math.atan2(y, x) * (180 / Math.PI) + 90;
            if (degs > 180) degs -= 360;
            if (degs < MIN_DEG && degs > -180) degs = MIN_DEG;
            if (degs > MAX_DEG) degs = MAX_DEG;
            rawRotation.set(degs);
            snappedRotation.set(Math.round(degs / DEGREES_PER_TICK) * DEGREES_PER_TICK);
        };
        const handlePointerUp = () => {
            setIsDragging(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isDragging, rawRotation, snappedRotation, DEGREES_PER_TICK]);

    const ticks = Array.from({ length: TOTAL_TICKS + 1 });

    // Start half-revealed (knob sits at 50%); a one-time nudge hints it's draggable.
    const [revealCount, setRevealCount] = useState(Math.floor(capabilities.length / 2));
    useMotionValueEvent(displayValue, 'change', (v) => {
        setRevealCount(Math.round((v / 100) * capabilities.length));
    });

    useEffect(() => {
        if (isDragging) return;
        const t = setTimeout(() => {
            const nudge = MID_DEG + DEGREES_PER_TICK * 2;
            snappedRotation.set(nudge);
            setTimeout(() => snappedRotation.set(MID_DEG), 420);
        }, 1400);
        return () => clearTimeout(t);
        // one-shot on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const capPositions = [
        { top: '15%', left: '8%' },
        { top: '12%', right: '12%' },
        { top: '38%', left: '5%' },
        { top: '35%', right: '5%' },
        { top: '62%', left: '10%' },
        { top: '58%', right: '8%' },
        { top: '80%', left: '15%' },
        { top: '78%', right: '15%' },
    ];

    return (
        <section className="relative overflow-hidden bg-[#0A0A0A]">
            {/* Cave image hero */}
            <div className="relative w-full" style={{ aspectRatio: '16/9', maxHeight: '75vh' }}>
                <div className="absolute inset-0" style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=60)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) contrast(1.2) brightness(0.7)'
                }} />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

                {/* Section label centered above knob */}
                <div className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 z-20">
                    <SectionLabel>AI Capabilities</SectionLabel>
                </div>

                {/* Floating capability labels scattered over image — clickable */}
                {capabilities.map((cap, i) => {
                    const shown = i < revealCount;
                    return (
                        <div
                            key={i}
                            className="absolute z-20 transition-all duration-700 ease-out hidden lg:block"
                            style={{
                                ...capPositions[i],
                                opacity: shown ? 1 : 0,
                                transform: shown ? 'scale(1)' : 'scale(0.8)',
                                pointerEvents: shown ? 'auto' : 'none',
                            }}
                        >
                            <a href={cap.href} className="group/cap inline-flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-white/20 hover:border-amber-500 text-white text-[10px] md:text-xs font-ui uppercase tracking-[0.15em] transition-colors">
                                <span className="w-1.5 h-1.5 bg-amber-500 flex-shrink-0" />
                                {cap.label}
                                <ArrowUpRight size={11} className="opacity-0 group-hover/cap:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    );
                })}

                {/* Reactor Knob centered over image */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="relative w-52 h-52 md:w-64 md:h-64 select-none allow-round">
                        {/* Glow */}
                        <motion.div className="absolute inset-0 bg-orange-500 rounded-full blur-3xl" style={{ opacity: lightOpacity }} />

                        {/* Tick marks ring */}
                        <div className="absolute inset-0 pointer-events-none">
                            {ticks.map((_, i) => {
                                const angle = (i / TOTAL_TICKS) * (MAX_DEG - MIN_DEG) + MIN_DEG;
                                return (
                                    <div key={i} className="absolute top-0 left-1/2 w-1 h-full -translate-x-1/2" style={{ transform: `rotate(${angle}deg)` }}>
                                        <KnobTick currentRotation={smoothRotation} angle={angle} />
                                    </div>
                                );
                            })}
                        </div>

                        {/* The knob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40">
                            <motion.div
                                ref={knobRef}
                                className={`relative w-full h-full rounded-full touch-none z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                                style={{ rotate: smoothRotation }}
                                onPointerDown={handlePointerDown}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="w-full h-full rounded-full bg-neutral-900 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-neutral-800 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%),conic-gradient(from_0deg,transparent_0deg,#000_360deg)]" />
                                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-neutral-950 shadow-[inset_0_2px_5px_rgba(0,0,0,1)] border border-neutral-800/50 flex items-center justify-center">
                                        <motion.div
                                            className="absolute top-3 w-1.5 h-5 bg-orange-500 rounded-full"
                                            style={{ boxShadow: indicatorShadow }}
                                        />
                                        <span className="font-ui text-[9px] text-zinc-600 tracking-[0.25em] mt-4">LEVEL</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Digital readout */}
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                            <span className="inline-flex items-center gap-1.5 text-[10px] text-amber-500 font-ui tracking-[0.25em] mb-2">
                                <RotateCw size={12} className="animate-spin" style={{ animationDuration: '3.5s' }} />
                                DRAG TO SPIN
                            </span>
                            <span className="text-[9px] text-zinc-600 font-ui tracking-[0.25em] mb-1">OUTPUT</span>
                            <KnobDisplay value={displayValue} />
                        </div>
                    </div>
                </div>

                {/* COREFIX® label below knob */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                    <span className="text-zinc-500 text-sm font-ui font-bold tracking-[0.2em]">COREFIX&reg;</span>
                </div>
            </div>

            {/* Mobile-only capabilities list (floating labels need desktop space) */}
            <div className="lg:hidden max-w-[1400px] mx-auto px-6 py-12">
                <div className="grid grid-cols-2 gap-4">
                    {capabilities.map((cap, i) => (
                        <a key={i} href={cap.href} className="flex items-start gap-2 group">
                            <div className="w-1.5 h-1.5 bg-amber-500 mt-1.5 flex-shrink-0" />
                            <span className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors">{cap.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── Process ──
const Process = () => {
    const ref = useRef(null);
    const marqueeRef = useRef(null);
    const [activeStep, setActiveStep] = useState(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.proc-step', {
                scrollTrigger: { trigger: '.proc-grid', start: 'top 75%' },
                y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out'
            });
            gsap.to(marqueeRef.current, {
                xPercent: -50, duration: 25, repeat: -1, ease: 'none'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    const steps = [
        {
            num: '01', title: 'Diagnose',
            desc: 'We analyze workflows, data, and bottlenecks to identify high-impact opportunities.',
            details: ['Workflow & process mapping', 'Data and tooling audit', 'Bottleneck & cost analysis', 'Opportunity shortlist with ROI estimates'],
        },
        {
            num: '02', title: 'Design',
            desc: 'We architect the right AI system and define clear success metrics.',
            details: ['System architecture & data flows', 'Tool and model selection', 'Success metrics definition', 'Phased delivery plan'],
        },
        {
            num: '03', title: 'Build',
            desc: 'We develop, test, and integrate the solution into real workflows.',
            details: ['Agent development & integration', 'Testing against real workflows', 'Team training & documentation', 'Staged rollout'],
        },
        {
            num: '04', title: 'Deploy & Improve',
            desc: 'We launch, monitor performance, and continuously optimize.',
            details: ['Production launch & monitoring', 'Performance dashboards', 'Continuous tuning & retraining', 'Quarterly optimization reviews'],
        },
    ];

    return (
        <section id="process" ref={ref} className="py-24 md:py-32 overflow-hidden border-y border-white/20">
            <div className="mb-20 overflow-hidden">
                <div ref={marqueeRef} className="flex whitespace-nowrap">
                    {Array(6).fill(null).map((_, i) => (
                        <span key={i} className="text-[6rem] md:text-[16rem] font-display uppercase tracking-tight text-white mx-2 select-none leading-none">
                            OUR PROCESS &bull;
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 mb-12">
                <SectionLabel>Our Process</SectionLabel>
            </div>

            <div className="proc-grid max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {steps.map((step, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveStep(activeStep === i ? null : i)}
                        className={`proc-step text-left w-full p-8 md:p-10 bg-[#0A0A0A] border transition-colors group ${activeStep === i ? 'border-amber-500 bg-[#111]' : 'border-white/40 hover:border-amber-500 hover:bg-[#111]'}`}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <span className="text-[10px] font-ui font-bold uppercase tracking-[0.25em] text-amber-500">&mdash; {step.num}</span>
                            <span className={`text-xl leading-none transition-transform duration-300 ${activeStep === i ? 'text-amber-500 rotate-45' : 'text-zinc-500 group-hover:text-white'}`}>+</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{step.title}</h3>
                        <p className="text-zinc-300 text-sm leading-relaxed max-w-md">{step.desc}</p>
                        <AnimatePresence>
                            {activeStep === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: 'easeOut' }}
                                    className="overflow-hidden"
                                >
                                    <ul className="mt-6 pt-6 border-t border-white/10 space-y-3">
                                        {step.details.map((d, j) => (
                                            <motion.li
                                                key={j}
                                                initial={{ opacity: 0, x: -12 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 + j * 0.07, duration: 0.3 }}
                                                className="flex items-start gap-3 text-zinc-300 text-sm"
                                            >
                                                <span className="w-1 h-1 bg-amber-500 mt-2 flex-shrink-0" />
                                                {d}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                ))}
            </div>

            <div className="max-w-[1400px] mx-auto px-6 mt-16 text-center">
                <p className="text-zinc-300 text-sm mb-6 max-w-xl mx-auto">See How These Solutions Translate Into Measurable Impact.</p>
                <CornerButton href="#audit" filled>
                    Start Your AI Journey <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </CornerButton>
            </div>
        </section>
    );
};

// ── CountUp helper ──
const CountUp = ({ target, visible, prefix = '', suffix = '' }) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!visible) return;
        let start = 0;
        const step = () => {
            start += Math.ceil(target / 40);
            if (start >= target) { setVal(target); return; }
            setVal(start);
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [visible, target]);
    return <span>{prefix}{val}{suffix}</span>;
};

// ── Featured Case Study — Point 1 Displays ──
const CaseStudy = () => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setVisible(true);
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const stats = [
        { value: 500, prefix: '~$', label: 'Saved per caught spec error' },
        { value: 17, label: 'Company standards in the knowledge base' },
        { value: 8, label: 'Categories scored on every review' },
    ];

    return (
        <section id="case-study" ref={ref} className="py-24 md:py-32 bg-[#0A0A0A] border-y border-white/5">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="mb-6"><SectionLabel>Featured Case Study</SectionLabel></div>
                        <h3 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-8 leading-[1.05]">
                            Point 1 Displays lost their pre-production designer. We replaced the review step with AI.
                        </h3>
                        <p className="text-zinc-400 text-base leading-relaxed mb-6 max-w-xl">
                            The Montreal display manufacturer had a costly gap: every spec error that slipped into production burned roughly $500 &mdash; worst case $2,000. We ingested 17 of their real production standards &mdash; FEFCO codes, digital print guidelines, press specs, Kongsberg tooling rules &mdash; and built a reviewer that grades every incoming spec before the floor ever sees it.
                        </p>
                        <p className="text-zinc-400 text-base leading-relaxed mb-10 italic border-l-2 border-amber-500 pl-6">
                            No mailbox access. No workflow disruption. A spec goes in; a cited, client-presentable verdict comes out.
                        </p>
                        <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-10">
                            {stats.map((stat, i) => (
                                <div key={i}>
                                    <div className="text-3xl md:text-5xl font-bold text-white tracking-tight"><CountUp target={stat.value} visible={visible} prefix={stat.prefix || ''} /></div>
                                    <div className="text-zinc-500 text-[10px] mt-3 font-ui uppercase tracking-[0.2em]">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-square overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=900&q=60" alt="Corrugated packaging production" loading="lazy" className="absolute inset-0 w-full h-full object-cover grayscale" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
                        <div className="absolute top-6 left-6 right-6 flex justify-between text-[10px] font-ui uppercase tracking-[0.25em] text-white/60">
                            <span>// FLAGSHIP DEPLOYMENT</span>
                            <span>2026</span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="text-[10px] font-ui uppercase tracking-[0.25em] text-amber-500">POINT 1 DISPLAYS &mdash; MONTREAL</span>
                            <h4 className="text-white font-black text-3xl md:text-4xl mt-2 tracking-tight uppercase">Spec Reviewer in Production</h4>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ── Spec Reviewer VSL ──
const SpecReviewerVSL = () => {
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.vsl-reveal', {
                scrollTrigger: { trigger: ref.current, start: 'top 72%' },
                y: 36, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section id="spec-reviewer-walkthrough" ref={ref} className="py-24 md:py-32 border-b border-white/5">
            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.7fr)] gap-8 lg:gap-16 items-center">
                <div className="vsl-reveal relative aspect-video bg-[#111] border border-white/10 overflow-hidden">
                    <video
                        controls
                        playsInline
                        preload="metadata"
                        poster="/assets/spec-reviewer-vsl-poster.jpg"
                        className="w-full h-full object-cover"
                        aria-label="Spec Reviewer walkthrough video"
                    >
                        <source src="/assets/spec-reviewer-vsl.mp4" type="video/mp4" />
                        Your browser does not support embedded video. Please use a modern browser to watch this walkthrough.
                    </video>
                </div>
                <div className="vsl-reveal">
                    <div className="mb-6"><SectionLabel>Before the Call</SectionLabel></div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-6">
                        See the Spec Reviewer catch a real production issue.
                    </h2>
                    <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-md">
                        A 3-minute walkthrough of the system, the standard it checks against, and the cited verdict your team receives before a job reaches production.
                    </p>
                    <a href="#audit" className="inline-flex items-center gap-3 px-6 py-4 bg-white text-black font-bold text-[11px] font-ui uppercase tracking-[0.2em] hover:bg-amber-500 active:translate-y-px transition-all">
                        Get a Free Audit <ChevronRight size={15} aria-hidden="true" />
                    </a>
                </div>
            </div>
        </section>
    );
};

// ── Testimonial ──
const Testimonials = () => {
    const t = { title: "The first person I call for an urgent handoff.", quote: "When a client project needed an urgent handoff, Hendrik was the first person I called. He got up to speed fast, took the meeting, and delivered with confidence. Honestly, his technical depth made him a better fit than I would have been. That is the kind of partner you want in your corner.", name: 'Evan Gutman', role: 'Evitas AI', logo: '/evitas-ai-logo-white.png' };

    return (
        <section className="py-24 md:py-40 relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="mb-10"><SectionLabel>Peer Voices</SectionLabel></div>

                <div>
                    <span className="text-amber-500 font-ui text-6xl md:text-8xl leading-none block mb-8 select-none" aria-hidden="true">&ldquo;</span>
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-10 tracking-[-0.02em] leading-[1.1] max-w-4xl">{t.title}</h3>
                    <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-12 max-w-3xl">{t.quote}</p>
                    <div className="flex items-center gap-4 pt-8 border-t border-white/10">
                        <span className="text-white font-bold text-base">{t.name}</span>
                        <span className="text-zinc-600 text-sm">&mdash; {t.role}</span>
                        <img src={t.logo} alt="Evitas AI logo" className="h-5 w-auto ml-2 opacity-90" />
                    </div>
                </div>
            </div>
        </section>
    );
};

// ── Free AI Audit funnel ──
const FreeAudit = () => {
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.price-card', {
                scrollTrigger: { trigger: ref.current, start: 'top 65%' },
                y: 60, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    const auditItems = [
        'A 30-minute teardown of how your business actually runs',
        'A map of where hours and money leak out of your workflows',
        'A shortlist of automations ranked by ROI — not by hype',
        'A recorded walkthrough that’s yours to keep, either way',
    ];
    const buildItems = [
        'Fixed-price proposal scoped from your audit — no surprise invoices',
        'Flagship-grade engineering: tested against your real workflows',
        'Staged delivery with working software every step',
        'Production monitoring, tuning, and support after launch',
    ];

    return (
        <section id="audit" ref={ref} className="py-24 md:py-40 border-y border-white/5">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="mb-8"><SectionLabel>The Offer</SectionLabel></div>
                <div className="grid md:grid-cols-2 gap-8 mb-16 items-end">
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05]">
                        Start with a free audit. <span className="text-zinc-600">Everything else is custom.</span>
                    </h2>
                    <p className="text-zinc-500 text-sm md:text-base">No pricing tiers, no retainers you don’t need. We find the money first &mdash; then scope the build that captures it.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                    <div className="price-card p-8 md:p-12 bg-[#0A0A0A] relative">
                        <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 border border-amber-500/60 text-amber-500 text-[10px] font-bold font-ui uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 bg-amber-500 animate-pulse" />
                            3 slots / month
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Free AI Audit</h3>
                        <p className="text-zinc-500 text-sm mb-10 max-w-sm">For operators who suspect they’re bleeding hours &mdash; and want receipts before spending a dollar.</p>
                        <div className="flex items-baseline gap-3 mb-10">
                            <span className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight">$0</span>
                            <span className="text-zinc-500 text-xs font-ui uppercase tracking-widest">No pitch.<br />No obligation.</span>
                        </div>
                        <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="block text-center w-full px-6 py-4 bg-white text-black font-bold text-[11px] font-ui uppercase tracking-[0.2em] hover:bg-amber-500 transition-colors mb-4">
                            Claim an Audit Slot
                        </a>
                        <button onClick={() => document.querySelector('#voice-demo')?.scrollIntoView({ behavior: 'smooth' })} className="block text-center w-full px-6 py-4 border border-zinc-700 text-zinc-300 font-bold text-[11px] font-ui uppercase tracking-[0.2em] hover:border-amber-500 hover:text-white transition-colors mb-10">
                            Or Book It By Voice
                        </button>
                        <ul className="space-y-4">
                            {auditItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-zinc-400 text-sm">
                                    <div className="w-1 h-1 bg-amber-500 mt-2.5 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="text-zinc-600 text-xs mt-10 pt-6 border-t border-white/10">If we can’t find you real savings, we say so &mdash; and you keep the audit.</p>
                    </div>

                    <div className="price-card p-8 md:p-12 bg-white text-black relative">
                        <div className="absolute top-6 right-6 px-3 py-1 bg-black text-white text-[10px] font-bold font-ui uppercase tracking-[0.2em]">After the audit</div>
                        <h3 className="text-2xl font-bold mb-3">Custom Builds</h3>
                        <p className="text-zinc-600 text-sm mb-10 max-w-sm">For companies ready to turn the audit’s findings into working systems.</p>
                        <div className="flex items-baseline gap-3 mb-10">
                            <span className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">Custom</span>
                            <span className="text-zinc-500 text-xs font-ui uppercase tracking-widest">Scoped to<br />your operation</span>
                        </div>
                        <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="block text-center w-full px-6 py-4 bg-black text-white font-bold text-[11px] font-ui uppercase tracking-[0.2em] hover:bg-zinc-900 transition-colors mb-10">
                            Book a Call
                        </a>
                        <ul className="space-y-4">
                            {buildItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-zinc-600 text-sm">
                                    <div className="w-1 h-1 bg-amber-500 mt-2.5 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="text-zinc-500 text-xs mt-10 pt-6 border-t border-black/10">Every engagement starts with the free audit. That’s the whole funnel.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ── Why Us ──
const WhyUs = () => {
    const ref = useRef(null);
    const attributes = ['Execution', 'Reliability', 'Speed', 'Impact'];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.why-el', {
                scrollTrigger: { trigger: ref.current, start: 'top 60%' },
                y: 50, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out'
            });
            gsap.from('.why-img', {
                scrollTrigger: { trigger: ref.current, start: 'top 60%' },
                scale: 1.15, opacity: 0, duration: 1.4, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="py-24 md:py-40 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <div className="why-el mb-8"><SectionLabel>Why Us</SectionLabel></div>
                    <h2 className="why-el text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-[-0.04em] mb-8 leading-[0.85] uppercase">
                        Why<br />Us?
                    </h2>
                    <p className="why-el text-zinc-400 text-sm md:text-base leading-relaxed mb-12 max-w-lg">
                        Most agencies sell you a deck and hand the build to whoever's free. Here, the person who scopes your system is the person who ships it &mdash; grounded in your real workflows, measured in dollars saved, running in production. Not experimental toys.
                    </p>
                    <div className="why-el flex flex-wrap gap-2">
                        {attributes.map(attr => (
                            <span key={attr} className="px-4 py-2 text-[11px] font-ui uppercase tracking-[0.18em] text-zinc-300 border border-zinc-700 bg-white/[0.02] hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-colors cursor-default">
                                {attr}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="why-img relative group">
                    <div className="aspect-[3/4] overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=60" alt="" loading="lazy" className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" />
                    </div>
                    <div className="absolute top-6 left-6 right-6 flex justify-between text-[10px] font-ui uppercase tracking-[0.25em] text-white/60">
                        <span>// IMPACT</span>
                        <span>2026</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ── The Operator ──
const Team = () => {
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.team-card', {
                scrollTrigger: { trigger: ref.current, start: 'top 65%' },
                y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    const crew = [
        { role: 'Research Agents', desc: 'Sweep docs, codebases, and markets before a single line is scoped.' },
        { role: 'Build Agents', desc: 'Parallel implementation tracks, running around the clock.' },
        { role: 'Review Loops', desc: 'Adversarial QA passes on everything before it reaches you.' },
    ];

    return (
        <section id="team" ref={ref} className="py-24 md:py-32 bg-[#0A0A0A] relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="mb-8"><SectionLabel>The Operator</SectionLabel></div>
                <h2 className="text-5xl md:text-8xl lg:text-[9rem] font-display text-white tracking-tight leading-[0.85] uppercase mb-20">
                    One Founder.<br />A Fleet of Agents.
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    <div className="team-card group relative bg-[#0A0A0A] border border-white/10 overflow-hidden hover:border-amber-500/60 hover:-translate-y-1 transition-all duration-500">
                        <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full overflow-hidden min-h-[420px]">
                            <img src="/Hendrik.jpg" alt="Hendrik, founder of Corefix" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <p className="text-white font-bold text-2xl">Hendrik</p>
                                <p className="text-zinc-400 text-[10px] font-ui uppercase tracking-[0.2em] mt-1">Founder &mdash; scopes it, builds it, ships it</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="team-card p-8 md:p-10 bg-[#0A0A0A] border border-white/10 flex-1">
                            <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
                                No account managers, no hand-offs, no junior devs learning on your dime. The person who takes your first call is the person who architects, builds, and stands behind the system. Behind him: an orchestrated fleet of AI agents doing the heavy lifting &mdash; the same capability Corefix sells, applied to itself.
                            </p>
                        </div>
                        {crew.map((c, i) => (
                            <div key={i} className="team-card p-6 md:p-8 bg-[#0A0A0A] border border-white/10 flex items-start gap-6 group hover:border-amber-500 transition-colors">
                                <span className="text-[10px] font-ui font-bold uppercase tracking-[0.25em] text-amber-500 mt-1">{String(i + 1).padStart(2, '0')}</span>
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-1">{c.role}</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed">{c.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ── FAQ ──
const FAQ = () => {
    const [open, setOpen] = useState(null);
    const faqs = [
        { q: 'What exactly happens in the free AI audit?', a: 'A 30-minute call where we tear down how your business runs, map where hours and money leak out, and shortlist automations by ROI. You get a recorded walkthrough either way. Three slots per month — that’s all one person can do properly.' },
        { q: 'Why is there no pricing on this site?', a: 'Because every build is scoped from your audit, not from a menu. You get a fixed-price proposal before any work starts — no hourly billing, no surprise invoices.' },
        { q: 'Is the Spec Reviewer only for display manufacturers?', a: 'It was built for print, packaging, and display production — but the pattern (grade incoming documents against your own standards, cite every flag) transfers to any industry that bleeds money on non-conformant paperwork.' },
        { q: 'Is the voice agent on this page real?', a: 'Yes — it’s a live agent, not a recording. It checks the real calendar and books real meetings. It’s also exactly what we’d build for your business.' },
        { q: 'Do you work under NDA?', a: 'Yes. Client engagements run under NDA by default, which is also why we describe some work in general terms.' },
        { q: 'Who actually does the work?', a: 'Hendrik — the founder — scopes, builds, and ships every engagement personally, with an orchestrated fleet of AI agents doing the heavy lifting. No hand-offs to a junior team.' },
    ];

    return (
        <section className="py-24 md:py-32 bg-[#0A0A0A] relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 md:gap-6">
                    {/* Left column */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display text-white tracking-tight leading-[0.95] uppercase mb-8">
                                Everything You Need to Know Before We Build
                            </h2>
                            <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                                We don't sell AI concepts or recycled demos. We design and deploy production-ready AI systems grounded in your workflows, your data, and measurable business outcomes.
                            </p>
                        </div>
                        <div className="mt-10 flex items-center gap-6">
                            <span className="text-white font-display text-2xl md:text-3xl uppercase">Got More Questions?</span>
                            <CornerButton href={CAL_URL} filled>
                                Reach Us
                            </CornerButton>
                        </div>
                    </div>

                    {/* Right column — FAQ items */}
                    <div>
                        {faqs.map((faq, i) => (
                            <div key={i} className="border-b border-white/10 last:border-0">
                                <button
                                    onClick={() => setOpen(open === i ? null : i)}
                                    className="w-full flex items-center justify-between py-5 md:py-6 text-left group"
                                >
                                    <span className="text-white text-[11px] md:text-xs font-ui font-semibold uppercase tracking-[0.12em] pr-6 leading-snug">
                                        {faq.q}
                                    </span>
                                    <span className={`text-lg flex-shrink-0 transition-transform duration-300 ${open === i ? 'text-amber-500 rotate-45' : 'text-zinc-500 group-hover:text-white'}`}>
                                        +
                                    </span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ${open === i ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                                    <p className="text-zinc-400 text-sm leading-relaxed pr-8">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ── Articles ──
const Articles = () => {
    const ref = useRef(null);
    const articles = [
        { title: 'The Foundation of AI: Why Your Knowledge Base is Your Competitive Advantage', desc: 'Learn how to solve the "messy data" problem and build a centralized AI knowledge system.', date: 'JAN 2026', read: '4 MIN READ', img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=60' },
        { title: 'The Ethical AI Roadmap: Building Trust in an Automated World', desc: 'Navigate the ethical landscape of AI — from data privacy to bias mitigation.', date: 'DEC 2025', read: '10 MIN READ', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=60' },
        { title: 'The Crystal Ball: Using AI Simulation to De-Risk Your 2026 Strategy', desc: 'How AI digital twins and predictive simulation help business leaders plan ahead.', date: 'DEC 2025', read: '8 MIN READ', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=60' },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.article-card', {
                scrollTrigger: { trigger: ref.current, start: 'top 70%' },
                y: 50, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section id="insights" ref={ref} className="py-24 md:py-32">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="mb-8"><SectionLabel>Articles</SectionLabel></div>
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-16 leading-[1.05]">
                    Insights & <span className="text-zinc-600">Field Notes</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
                    {articles.map((a, i) => (
                        <a key={i} href="#" className="article-card group block bg-[#0A0A0A] hover:bg-[#111] transition-colors p-4">
                            <div className="relative aspect-[4/5] overflow-hidden mb-5">
                                <img src={a.img} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
                            </div>
                            <div className="px-2 pb-2">
                                <div className="flex items-center gap-3 text-zinc-600 text-[10px] font-ui uppercase tracking-[0.2em] mb-4">
                                    <span>{a.date}</span>
                                    <span className="w-1 h-1 bg-zinc-700" />
                                    <span>{a.read}</span>
                                </div>
                                <h3 className="text-white font-bold text-base md:text-lg leading-snug mb-3">{a.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">{a.desc}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── Contact ──
const Contact = () => {
    const ref = useRef(null);
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        const ctx = gsap.context(() => {
            (async () => {
                const api = await getCalApi({ namespace: 'intro-call' });
                api('ui', { theme: 'dark', hideEventTypeDetails: false, layout: 'month_view' });
            })();
        }, ref);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.contact-el', {
                scrollTrigger: { trigger: ref.current, start: 'top 65%' },
                y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        const form = e.target;
        const payload = {
            name: form.name.value,
            email: form.email.value,
            company: form.company.value,
            interest: form.interest.value,
            message: form.message.value,
            _subject: `[${form.interest.value}] New inquiry from corefix.app`,
        };
        try {
            const res = await fetch('https://formsubmit.co/ajax/hendrik@corefix.app', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setStatus('success');
                form.reset();
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <section id="contact" ref={ref} className="py-24 md:py-40 bg-[#0A0A0A] border-y border-white/5 relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-start">
                    <div>
                        <div className="contact-el mb-8"><SectionLabel>Let&apos;s Talk</SectionLabel></div>
                        <h2 className="contact-el text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-[-0.03em] mb-8 leading-[0.95]">
                            Book a Call<br /><span className="text-zinc-600">Right Here</span>
                        </h2>
                        <p className="contact-el text-zinc-500 text-sm md:text-base max-w-md mb-8">Pick a time and it drops straight onto the calendar &mdash; a 30-minute intro, no pitch. Or let the voice agent above book it for you.</p>
                        <div className="contact-el flex flex-col gap-3 max-w-xs">
                            <CornerButton href={CAL_URL} filled className="justify-center">
                                Open Full Calendar <ArrowUpRight size={14} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            </CornerButton>
                            <a href="mailto:hendrik@corefix.app" className="text-zinc-500 text-xs font-ui uppercase tracking-[0.2em] hover:text-amber-500 transition-colors pl-1">Or email hendrik@corefix.app</a>
                        </div>
                    </div>

                    <div className="contact-el border border-white/15 bg-[#0A0A0A] overflow-hidden" style={{ minHeight: 640 }}>
                        <Cal
                            namespace="intro-call"
                            calLink={CAL_LINK}
                            style={{ width: '100%', height: '100%', minHeight: 640, overflow: 'scroll' }}
                            config={{ layout: 'month_view', theme: 'dark' }}
                        />
                    </div>
                </div>

                {/* Secondary — written inquiry */}
                <div className="mt-20 pt-16 border-t border-white/10 grid md:grid-cols-2 gap-16 items-start">
                    <div>
                        <h3 className="contact-el text-2xl md:text-4xl font-bold text-white tracking-[-0.02em] mb-4">Prefer to write?</h3>
                        <p className="contact-el text-zinc-500 text-sm md:text-base max-w-md">Tell us what you want AI to fix and we&apos;ll come back with a clear, no-fluff plan of attack.</p>
                    </div>

                    {status === 'success' ? (
                        <div className="contact-el flex flex-col items-center justify-center text-center p-12 border border-amber-500/30 bg-amber-500/[0.03]">
                            <div className="w-12 h-12 border-2 border-amber-500 flex items-center justify-center mb-6">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Message Sent</h3>
                            <p className="text-zinc-400 text-sm mb-8">We'll get back to you within 24 hours with a clear plan of attack.</p>
                            <button onClick={() => setStatus('idle')} className="text-amber-500 text-xs font-ui uppercase tracking-[0.2em] hover:text-white transition-colors">
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form className="contact-el space-y-3" onSubmit={handleSubmit}>
                            <input type="text" name="name" required placeholder="Name" className="w-full px-5 py-5 bg-[#111] border border-zinc-700 text-white text-sm placeholder-zinc-400 focus:border-zinc-500 focus:outline-none transition-colors" />
                            <input type="email" name="email" required placeholder="Work Email" className="w-full px-5 py-5 bg-[#111] border border-zinc-700 text-white text-sm placeholder-zinc-400 focus:border-zinc-500 focus:outline-none transition-colors" />
                            <input type="text" name="company" placeholder="Company" className="w-full px-5 py-5 bg-[#111] border border-zinc-700 text-white text-sm placeholder-zinc-400 focus:border-zinc-500 focus:outline-none transition-colors" />
                            <div className="relative">
                                <select name="interest" defaultValue="Free AI Audit" className="w-full px-5 py-5 bg-[#111] border border-zinc-700 text-white text-sm focus:border-zinc-500 focus:outline-none transition-colors appearance-none cursor-pointer">
                                    <option>Free AI Audit</option>
                                    <option>Spec Reviewer</option>
                                    <option>Voice Agent</option>
                                    <option>Custom Build</option>
                                    <option>Something Else</option>
                                </select>
                                <ChevronRight size={14} className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-zinc-500 pointer-events-none" />
                            </div>
                            <textarea name="message" required placeholder="What do you want to discuss?" rows={5} className="w-full px-5 py-5 bg-[#111] border border-zinc-700 text-white text-sm placeholder-zinc-400 focus:border-zinc-500 focus:outline-none transition-colors resize-none" />
                            <button type="submit" disabled={status === 'sending'} className="w-full px-8 py-6 bg-white text-black font-bold text-[11px] font-ui uppercase tracking-[0.3em] hover:bg-amber-500 transition-colors flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed">
                                {status === 'sending' ? 'Sending...' : 'Submit'} {status !== 'sending' && <ArrowUpRight size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />}
                            </button>
                            {status === 'error' && (
                                <p className="text-red-400 text-xs font-ui text-center mt-2">Something went wrong. Try again or email hendrik@corefix.app directly.</p>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

// ── Footer ──
const Footer = () => (
    <footer className="bg-[#050505] pt-24 pb-10 px-6">
        <div className="max-w-[1400px] mx-auto">
            <div className="mb-20 overflow-hidden">
                <h2 className="text-[18vw] md:text-[15vw] font-black uppercase tracking-tighter text-white/[0.15] leading-none select-none">
                    COREFIX&reg;
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 pb-12 border-b border-white/10">
                <div className="md:col-span-2 max-w-md">
                    <h4 className="font-ui font-black tracking-[0.18em] text-white text-base flex items-center gap-2 mb-6">
                        <svg viewBox="0 0 32 32" className="w-5 h-5"><path d="M16 4 L27.3 10.5 L27.3 21.5 L16 28 L4.7 21.5 L4.7 10.5 Z" fill="none" stroke="#F59E0B" strokeWidth="2"/></svg> COREFIX&reg;
                    </h4>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-sm">
                        We design, build, and deploy reliable AI systems and automation workflows.
                    </p>
                    <div className="space-y-3">
                        <a href="mailto:hendrik@corefix.app" className="block text-white font-bold text-base hover:text-amber-500 transition-colors">
                            HENDRIK@COREFIX.APP
                        </a>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <span className="text-zinc-500 text-[10px] font-ui uppercase tracking-[0.25em] mb-3">Navigation</span>
                    {[['Home', '#'], ['Services', '#services'], ['About', '#team'], ['Insights', '#insights']].map(([link, href]) => (
                        <a key={link} href={href} className="text-zinc-300 text-sm hover:text-amber-500 transition-colors font-ui uppercase tracking-wider py-2">{link}</a>
                    ))}
                    <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="text-amber-500 text-sm hover:text-white transition-colors font-ui uppercase tracking-wider py-2">Let&apos;s Talk</a>
                </div>
                <div className="flex flex-col gap-3">
                    <span className="text-zinc-500 text-[10px] font-ui uppercase tracking-[0.25em] mb-3">Social</span>
                    <a href="https://www.linkedin.com/in/hendrikcorefix/" target="_blank" rel="noopener noreferrer" className="text-zinc-300 text-sm hover:text-amber-500 transition-colors font-ui uppercase tracking-wider py-2">LinkedIn</a>
                    <a href="https://www.instagram.com/hendrikunfiltered/" target="_blank" rel="noopener noreferrer" className="text-zinc-300 text-sm hover:text-amber-500 transition-colors font-ui uppercase tracking-wider py-2">Instagram</a>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 animate-pulse" />
                    <span className="font-ui text-[10px] text-zinc-500 tracking-[0.25em] uppercase">System Operational &mdash; {new Date().getFullYear()}</span>
                </div>
                <p className="text-zinc-600 text-[10px] font-ui uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} Corefix. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="text-zinc-500 text-[10px] font-ui uppercase tracking-[0.2em] hover:text-amber-500 transition-colors">Terms</a>
                    <a href="#" className="text-zinc-500 text-[10px] font-ui uppercase tracking-[0.2em] hover:text-amber-500 transition-colors">Privacy</a>
                </div>
            </div>
        </div>
    </footer>
);

// ── Bright Grid (hero-style, reusable) ──
const heroLineColor = 'rgba(255,255,255,0.14)';
const heroPlusStyle = {
    ...gridPlusStyle,
    color: 'rgba(255,255,255,0.30)',
};

const BrightGrid = ({ z = 'z-0' }) => (
    <div className={`absolute inset-0 ${z} pointer-events-none`} aria-hidden="true">
        {gridHPositions.map((top, i) => (
            <div key={`h-${i}`} className="absolute left-0 right-0 h-[1px]" style={{ background: heroLineColor, top }} />
        ))}
        <div className="max-w-[1400px] mx-auto h-full px-6 relative">
            {gridVPositions.map((pos, i) => (
                <div key={`v-${i}`} className={`absolute inset-y-0 ${pos} w-[1px]`} style={{ background: heroLineColor }}>
                    {gridHPositions.map(top => (
                        <span key={top} style={{ ...heroPlusStyle, top }}>+</span>
                    ))}
                </div>
            ))}
        </div>
    </div>
);

const GridOverlay = () => <BrightGrid z="z-30" />;

// ── Main App ──
function App() {
    return (
        <div className="w-full min-h-screen font-sans bg-[#0A0A0A] text-white selection:bg-amber-500 selection:text-black relative">
            <Navbar />
            <Hero />
            <LogoMarquee />
            <Flagship />
            <Services />
            <Capabilities />
            <Process />
            <CaseStudy />
            <Testimonials />
            <VoiceSection />
            <SpecReviewerVSL />
            <FreeAudit />
            <WhyUs />
            <Team />
            <FAQ />
            <Articles />
            <Contact />
            <Footer />
        </div>
    );
}

export default App;
