import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, ChevronDown, ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// ── Section Grid (decorative background grid for sections) ──
const SectionGrid = () => (
    <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="max-w-[1400px] mx-auto h-full px-6 relative">
            {['left-6', 'left-1/3', 'left-2/3', 'right-6'].map((pos, i) => (
                <div key={i} className={`absolute inset-y-0 ${pos} w-[1px]`} style={{ background: 'rgba(255,255,255,0.06)' }} />
            ))}
            {['25%', '50%', '75%'].map((top, i) => (
                <div key={i} className="absolute left-6 right-6 h-[1px]" style={{ background: 'rgba(255,255,255,0.06)', top }} />
            ))}
        </div>
    </div>
);

// ── Corner-accent button ──
const CornerButton = ({ href, children, filled, className = '' }) => {
    const base = filled
        ? 'bg-white text-black hover:bg-amber-500'
        : 'bg-transparent text-white border border-white/60 hover:bg-white hover:text-black';
    return (
        <a href={href} className={`relative inline-flex items-center gap-3 px-7 py-4 font-bold text-[11px] font-ui uppercase tracking-[0.2em] transition-all duration-200 group ${base} ${className}`}>
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
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-white/30 ${scrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-xl' : 'bg-[#0A0A0A]/40 backdrop-blur-md'}`}>
            <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                <a href="#" className="font-ui font-black tracking-[0.18em] text-white text-base flex items-center gap-2">
                    <svg viewBox="0 0 32 32" className="w-5 h-5"><path d="M16 4 L27.3 10.5 L27.3 21.5 L16 28 L4.7 21.5 L4.7 10.5 Z" fill="none" stroke="#F59E0B" strokeWidth="2"/></svg>
                    COREFIX&reg;
                </a>
                <div className="hidden md:flex items-center gap-8 text-[11px] font-ui font-medium text-zinc-400 uppercase tracking-[0.18em]">
                    <a href="#services" className="hover:text-white transition-colors">Services</a>
                    <a href="#process" className="hover:text-white transition-colors">Process</a>
                    <a href="#works" className="hover:text-white transition-colors">Case Studies</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    <a href="#contact" className="hover:text-white transition-colors">Contact</a>
                </div>
                <a href="#contact" className="hidden md:inline-flex relative items-center px-5 py-2.5 bg-white text-black font-semibold text-[11px] font-ui uppercase tracking-[0.15em] hover:bg-amber-500 transition-all duration-200 group">
                    <span className="absolute -top-[2px] -left-[2px] w-2.5 h-2.5 border-t-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute -bottom-[2px] -right-[2px] w-2.5 h-2.5 border-b-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    Talk To Us
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
                    {['Services', 'Process', 'Case Studies', 'Pricing', 'Contact'].map(item => (
                        <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} onClick={() => setMenuOpen(false)} className="text-zinc-300 text-lg font-ui uppercase tracking-widest hover:text-white">{item}</a>
                    ))}
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

    const tags = ['AI Strategy', 'Process Automation', 'Custom Agents', 'Data Intelligence'];

    return (
        <section ref={ref} className="relative min-h-screen flex flex-col justify-end pb-12 md:pb-20 overflow-hidden pt-32">
            <div className="absolute inset-0 z-0" style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&auto=format)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(100%) contrast(1.1)'
            }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A] z-10 pointer-events-none" />
            <GridOverlay />

            {/* Hero heading — sits ABOVE the grid */}
            <div className="relative z-40 max-w-[1400px] mx-auto px-6 w-full">
                <h1 className="font-display leading-[0.9] tracking-[0.01em] uppercase">
                    <span className="block overflow-hidden"><span className="hero-line block text-[20vw] md:text-[13.5vw] lg:text-[12vw] bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">We Build</span></span>
                    <span className="block overflow-hidden"><span className="hero-line block text-[20vw] md:text-[13.5vw] lg:text-[12vw] bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">AI Systems</span></span>
                    <span className="block overflow-hidden"><span className="hero-line block text-[20vw] md:text-[13.5vw] lg:text-[12vw] bg-gradient-to-r from-white/60 to-white/30 bg-clip-text text-transparent">For Businesses</span></span>
                </h1>
            </div>

            <div className="relative z-40 max-w-[1400px] mx-auto px-6 w-full">
                <div className="grid md:grid-cols-2 gap-8 mt-10 md:mt-14 items-end">
                    <p className="hero-el max-w-xl text-zinc-400 text-sm md:text-base leading-relaxed">
                        Build real, production-ready AI systems that automate work, improve performance, and deliver measurable business results.
                    </p>
                    <div className="hero-el flex flex-col items-start md:items-end gap-4">
                        <div className="flex flex-wrap gap-2 md:justify-end">
                            {tags.map(tag => (
                                <span key={tag} className="px-3 py-1.5 text-[10px] font-ui uppercase tracking-[0.18em] text-zinc-300 border border-zinc-700 bg-white/[0.02]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <CornerButton href="#process" filled>
                            How It Works <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </CornerButton>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ── Logo Marquee ──
const LogoMarquee = () => {
    const partners = ['ACME CORP', 'TECHFLOW', 'NEXUS AI', 'DATASYNC', 'CLOUDWAVE', 'METRIX', 'QUANTLAB'];
    return (
        <section className="py-20 bg-[#080808]">
            <div className="max-w-[900px] mx-auto px-6">
                <div className="flex justify-center mb-10">
                    <SectionLabel>Our Trusted Partners</SectionLabel>
                </div>
                <div className="border-y border-white/40 py-10 overflow-hidden">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />
                        <div className="flex animate-marquee whitespace-nowrap">
                            {[...partners, ...partners, ...partners].map((name, i) => (
                                <div key={i} className="mx-12 flex-shrink-0 text-white font-ui font-black text-xl md:text-2xl tracking-[0.15em] uppercase opacity-70 hover:opacity-100 transition-opacity">
                                    {name}
                                </div>
                            ))}
                        </div>
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
        { num: '01', title: 'AI Strategy & Advisory', desc: 'Clear, execution-ready AI plans aligned with business goals.' },
        { num: '02', title: 'Custom AI Agents', desc: 'Tailored agents designed to handle real operational tasks.' },
        { num: '03', title: 'Workflow Automation', desc: 'Automations that connect tools, data, and teams seamlessly.' },
        { num: '04', title: 'AI Product Development', desc: 'Scalable AI-powered features, tools, and internal systems.' },
    ];

    return (
        <section id="services" ref={ref} className="py-24 md:py-40">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="mb-10">
                    <SectionLabel>Our Services</SectionLabel>
                </div>
                <h2 className="svc-title text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] max-w-5xl leading-[1.05] mb-8">
                    End-to-end partnership from strategy to deployment &mdash; so AI actually <span className="text-zinc-500">ships, works, and delivers.</span>
                </h2>
                <p className="svc-title text-zinc-300 mb-20 max-w-xl text-sm">End-to-end services covering strategy, build, and deployment.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((svc, i) => (
                        <div key={i} className="svc-card group p-8 md:p-10 bg-[#0A0A0A] border border-white/40 hover:border-amber-500 hover:bg-[#111] transition-colors">
                            <div className="flex items-start gap-6">
                                <span className="text-[10px] font-ui font-bold uppercase tracking-[0.25em] text-amber-500">{svc.num}</span>
                                <div className="flex-1">
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{svc.title}</h3>
                                    <p className="text-zinc-300 text-sm leading-relaxed">{svc.desc}</p>
                                </div>
                                <ArrowUpRight size={20} className="text-zinc-500 group-hover:text-amber-500 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-8 md:p-12 bg-[#111] border border-white/40 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                    <p className="text-zinc-200 text-base md:text-lg max-w-2xl">Start with a conversation. Tell us about your business, your goals, and the problems you want solved.</p>
                    <CornerButton href="#contact" filled className="whitespace-nowrap">
                        Talk To Us <ArrowUpRight size={14} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
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
        'Conversational AI & Chatbots', 'Customer Support Automation', 'Voice & Call Agents',
        'Internal Ops & Admin Automation', 'Document & Data Intelligence', 'API & Tool Integrations',
        'Sales & Lead Qualification Agents', 'Fine-tuned LLM Systems'
    ];

    const MIN_DEG = -135;
    const MAX_DEG = 135;
    const TOTAL_TICKS = 40;
    const DEGREES_PER_TICK = (MAX_DEG - MIN_DEG) / TOTAL_TICKS;

    const [isDragging, setIsDragging] = useState(false);
    const rawRotation = useMotionValue(MIN_DEG);
    const snappedRotation = useMotionValue(MIN_DEG);
    const smoothRotation = useSpring(snappedRotation, { stiffness: 400, damping: 35, mass: 0.8 });
    const displayValue = useTransform(smoothRotation, [MIN_DEG, MAX_DEG], [0, 100]);
    const lightOpacity = useTransform(rawRotation, [MIN_DEG, MAX_DEG], [0.02, 0.35]);
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

    const [revealCount, setRevealCount] = useState(0);
    useMotionValueEvent(displayValue, 'change', (v) => {
        setRevealCount(Math.floor((v / 100) * capabilities.length));
    });

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
                    backgroundImage: 'url(https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=85)',
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

                {/* Floating capability labels scattered over image */}
                {capabilities.map((cap, i) => (
                    <div
                        key={i}
                        className="absolute z-20 pointer-events-none transition-all duration-700 ease-out hidden md:block"
                        style={{
                            ...capPositions[i],
                            opacity: i < revealCount ? 1 : 0,
                            transform: i < revealCount ? 'scale(1)' : 'scale(0.8)',
                        }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-white/20 text-white text-[10px] md:text-xs font-ui uppercase tracking-[0.15em]">
                            <span className="w-1.5 h-1.5 bg-amber-500 flex-shrink-0" />
                            {cap}
                        </span>
                    </div>
                ))}

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
                                            style={{ boxShadow: useTransform(rawRotation, (r) => `0 0 ${Math.max(5, (r + 135) / 10)}px orange`) }}
                                        />
                                        <span className="font-ui text-[9px] text-zinc-600 tracking-[0.25em] mt-4">LEVEL</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Digital readout */}
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                            <span className="text-[10px] text-zinc-400 font-ui tracking-[0.2em] mb-2 animate-pulse">SPIN ME</span>
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
            <div className="md:hidden max-w-[1400px] mx-auto px-6 py-12">
                <div className="grid grid-cols-2 gap-4">
                    {capabilities.map((cap, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-amber-500 mt-1.5 flex-shrink-0" />
                            <span className="text-sm text-zinc-300 font-medium">{cap}</span>
                        </div>
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
        { num: '01', title: 'Diagnose', desc: 'We analyze workflows, data, and bottlenecks to identify high-impact opportunities.' },
        { num: '02', title: 'Design', desc: 'We architect the right AI system and define clear success metrics.' },
        { num: '03', title: 'Build', desc: 'We develop, test, and integrate the solution into real workflows.' },
        { num: '04', title: 'Deploy & Improve', desc: 'We launch, monitor performance, and continuously optimize.' },
    ];

    return (
        <section id="process" ref={ref} className="py-24 md:py-32 overflow-hidden border-y border-white/20">
            <div className="mb-20 overflow-hidden">
                <div ref={marqueeRef} className="flex whitespace-nowrap">
                    {Array(6).fill(null).map((_, i) => (
                        <span key={i} className="text-[10rem] md:text-[16rem] font-display uppercase tracking-tight text-white mx-2 select-none leading-none">
                            OUR PROCESS &bull;
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 mb-12">
                <SectionLabel>Our Process</SectionLabel>
            </div>

            <div className="proc-grid max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {steps.map((step, i) => (
                    <div key={i} className="proc-step p-8 md:p-10 bg-[#0A0A0A] border border-white/40 hover:border-amber-500 hover:bg-[#111] transition-colors group">
                        <div className="flex items-start justify-between mb-6">
                            <span className="text-[10px] font-ui font-bold uppercase tracking-[0.25em] text-amber-500">&mdash; {step.num}</span>
                            <span className="text-xs font-ui text-zinc-300 group-hover:text-white transition-colors">Step</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{step.title}</h3>
                        <p className="text-zinc-300 text-sm leading-relaxed max-w-md">{step.desc}</p>
                    </div>
                ))}
            </div>

            <div className="max-w-[1400px] mx-auto px-6 mt-16 text-center">
                <p className="text-zinc-300 text-sm mb-6 max-w-xl mx-auto">See How These Solutions Translate Into Measurable Impact.</p>
                <CornerButton href="#pricing" filled>
                    Start Your AI Journey <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </CornerButton>
            </div>
        </section>
    );
};

// ── Works / Case Studies ──
const Works = () => {
    const scrollRef = useRef(null);
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.works-header', {
                scrollTrigger: { trigger: ref.current, start: 'top 75%' },
                y: 40, opacity: 0, duration: 0.9, ease: 'power3.out'
            });
            gsap.from('.work-card', {
                scrollTrigger: { trigger: ref.current, start: 'top 65%' },
                y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    const projects = [
        { name: 'SYNCOR', year: '2025', tag: 'AI Automation', desc: 'End-to-end workflow automation for a logistics startup — cutting manual processing by 80%.', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=85' },
        { name: 'MEDISYNC', year: '2024', tag: 'Healthcare AI', desc: 'AI-powered patient triage system reducing wait times and improving diagnostic accuracy.', img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=85' },
        { name: 'VERDANT', year: '2024', tag: 'Data Intelligence', desc: 'Built a predictive analytics engine for sustainable agriculture decisions.', img: 'https://images.unsplash.com/photo-1547954575-855750c57bd3?w=800&q=85' },
        { name: 'GRIDCORE', year: '2025', tag: 'Custom Agents', desc: 'Multi-agent system for real-time energy grid optimization and anomaly detection.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85' },
        { name: 'AEROLYTIC', year: '2025', tag: 'Process Automation', desc: 'Automated document processing pipeline handling 10,000+ invoices monthly.', img: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&q=85' },
        { name: 'NOVAPAY', year: '2025', tag: 'Fintech AI', desc: 'AI fraud detection and risk scoring system for a digital payments platform.', img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=85' },
    ];

    const scroll = (dir) => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
    };

    return (
        <section id="works" ref={ref} className="py-24 md:py-32 relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 mb-16 relative z-10">
                <div className="works-header mb-8"><SectionLabel>Case Studies</SectionLabel></div>
                <div className="flex items-end justify-between flex-wrap gap-8">
                    <h2 className="works-header text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-[-0.03em] leading-[0.95]">
                        Work That Speaks<br />in <span className="text-zinc-600">Results, Not Claims</span>
                    </h2>
                    <div className="hidden md:flex gap-2">
                        <button onClick={() => scroll(-1)} className="w-12 h-12 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-colors">&larr;</button>
                        <button onClick={() => scroll(1)} className="w-12 h-12 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-colors">&rarr;</button>
                    </div>
                </div>
                <p className="works-header text-zinc-500 text-sm mt-8 max-w-xl">
                    A curated selection of projects where strategy, engineering, and execution came together to build AI systems that actually moved the needle.
                </p>
            </div>

            <div ref={scrollRef} className="relative z-10 flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                {projects.map((proj, i) => (
                    <div key={i} className="work-card flex-shrink-0 w-[320px] md:w-[400px] snap-start group cursor-pointer">
                        <div className="relative aspect-[3/4] overflow-hidden mb-4">
                            <img src={proj.img} alt={proj.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
                            <div className="absolute top-5 left-5 right-5 flex justify-between text-[10px] font-ui uppercase tracking-[0.2em] text-white/80">
                                <span>{proj.tag}</span>
                                <span>{proj.year}</span>
                            </div>
                            <div className="absolute bottom-5 left-5 right-5">
                                <h3 className="text-white font-black uppercase tracking-tight text-2xl md:text-3xl mb-2">{proj.name}</h3>
                                <p className="text-zinc-300 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-[300px]">{proj.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// ── Case Study Stats ──
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

    const CountUp = ({ target }) => {
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
        return <span>{val}%</span>;
    };

    const stats = [
        { value: 72, label: 'Qualified Conversions' },
        { value: 94, label: 'User Satisfaction' },
        { value: 43, label: 'Bounce Reduction' },
    ];

    return (
        <section ref={ref} className="py-24 md:py-32 bg-[#0A0A0A] border-y border-white/5">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="mb-6"><SectionLabel>Featured Case Study</SectionLabel></div>
                        <h3 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-8 leading-[1.05]">
                            We helped DigiTech Finance rebuild their digital experience and modernize their product storytelling.
                        </h3>
                        <p className="text-zinc-400 text-base leading-relaxed mb-10 italic border-l-2 border-amber-500 pl-6">
                            "Partnering on this redesign changed how people experience our platform. Our engagement numbers skyrocketed, and the product finally feels as premium as it truly is."
                        </p>
                        <p className="text-zinc-600 text-xs font-ui uppercase tracking-[0.2em] mb-10">&mdash; Head of Product, DigiTech Finance</p>
                        <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-10">
                            {stats.map((stat, i) => (
                                <div key={i}>
                                    <div className="text-3xl md:text-5xl font-bold text-white tracking-tight"><CountUp target={stat.value} /></div>
                                    <div className="text-zinc-500 text-[10px] mt-3 font-ui uppercase tracking-[0.2em]">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-square overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=85" alt="" className="absolute inset-0 w-full h-full object-cover grayscale" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="text-[10px] font-ui uppercase tracking-[0.25em] text-amber-500">DIGITECH FINANCE</span>
                            <h4 className="text-white font-black text-3xl md:text-4xl mt-2 tracking-tight">FINANCIAL PRODUCT REDESIGN</h4>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ── Testimonials ──
const Testimonials = () => {
    const [active, setActive] = useState(0);
    const testimonials = [
        { num: '01', title: "They didn't sell hype — they built results.", quote: "We came in with vague ideas and left with a working AI system that cut our support workload in half. The clarity, speed, and execution were outstanding.", name: 'Jason W.', role: 'SaaS Founder' },
        { num: '02', title: "The most practical AI partner we've worked with.", quote: "They helped us design a realistic AI roadmap, built what mattered most, and proved ROI faster than we expected. No buzzwords, just outcomes.", name: 'Maya P.', role: 'Operations Director' },
        { num: '03', title: "They understand both business and engineering.", quote: "Instead of confusing us with technical jargon, they turned AI into a real advantage we use daily. Our team is faster, more focused, and way more efficient now.", name: 'Daniel C.', role: 'Agency Owner' },
    ];

    useEffect(() => {
        const timer = setInterval(() => setActive(prev => (prev + 1) % testimonials.length), 6000);
        return () => clearInterval(timer);
    }, []);

    const t = testimonials[active];

    return (
        <section className="py-24 md:py-40">
            <div className="max-w-5xl mx-auto px-6">
                <div className="mb-10"><SectionLabel>Client Voices</SectionLabel></div>

                <div className="flex gap-2 mb-16">
                    {testimonials.map((_, i) => (
                        <button key={i} onClick={() => setActive(i)}
                            className={`h-[2px] transition-all ${i === active ? 'w-20 bg-amber-500' : 'w-10 bg-zinc-800'}`} />
                    ))}
                </div>

                <div className="min-h-[320px]">
                    <span className="text-amber-500 font-ui text-xs tracking-[0.3em] mb-6 block">{t.num} / 03</span>
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-10 tracking-[-0.02em] leading-[1.1] max-w-4xl">{t.title}</h3>
                    <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-12 max-w-3xl">{t.quote}</p>
                    <div className="flex items-center gap-4 pt-8 border-t border-white/10">
                        <span className="text-white font-bold text-base">{t.name}</span>
                        <span className="text-zinc-600 text-sm">&mdash; {t.role}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ── Pricing ──
const Pricing = () => {
    const [yearly, setYearly] = useState(false);
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

    return (
        <section id="pricing" ref={ref} className="py-24 md:py-40 border-y border-white/5">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="mb-8"><SectionLabel>Pricing</SectionLabel></div>
                <div className="grid md:grid-cols-2 gap-8 mb-16 items-end">
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05]">
                        Flexible Pricing for Different <span className="text-zinc-600">Growth Stages</span>
                    </h2>
                    <p className="text-zinc-500 text-sm md:text-base">Choose a model that fits your team and complexity.</p>
                </div>

                <div className="flex items-center gap-4 mb-12">
                    <span className={`text-xs font-ui uppercase tracking-[0.2em] ${!yearly ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
                    <button onClick={() => setYearly(!yearly)} className="relative w-14 h-7 bg-zinc-900 border border-zinc-700">
                        <div className={`absolute top-0.5 w-6 h-6 bg-amber-500 transition-transform ${yearly ? 'translate-x-7' : 'translate-x-0.5'}`} />
                    </button>
                    <span className={`text-xs font-ui uppercase tracking-[0.2em] ${yearly ? 'text-white' : 'text-zinc-500'}`}>Yearly</span>
                    {yearly && <span className="text-[10px] text-amber-500 font-bold font-ui uppercase tracking-widest">15% off</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                    <div className="price-card p-8 md:p-12 bg-[#0A0A0A]">
                        <h3 className="text-2xl font-bold text-white mb-3">Strategy Sprint</h3>
                        <p className="text-zinc-500 text-sm mb-10 max-w-sm">For teams taking AI seriously &mdash; and ready to implement something real.</p>
                        <div className="flex items-baseline gap-2 mb-10">
                            <span className="text-zinc-500 text-base">$</span>
                            <span className="text-6xl md:text-7xl font-black text-white tracking-tight">{yearly ? '3,612' : '4,249'}</span>
                            <span className="text-zinc-500 text-xs font-ui uppercase tracking-widest">USD/<br />Project</span>
                        </div>
                        <a href="#contact" className="block text-center w-full px-6 py-4 border border-zinc-700 text-white font-bold text-[11px] font-ui uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-colors mb-10">
                            Pay Now
                        </a>
                        <ul className="space-y-4">
                            {['Brand & workflow discovery', 'Strategic AI use-case definition', 'Technical feasibility assessment', 'System architecture planning', 'Risk, compliance & reliability considerations', 'Clear roadmap & execution blueprint', 'Implementation recommendations'].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-zinc-400 text-sm">
                                    <div className="w-1 h-1 bg-amber-500 mt-2.5 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="price-card p-8 md:p-12 bg-white text-black relative">
                        <div className="absolute top-6 right-6 px-3 py-1 bg-amber-500 text-black text-[10px] font-bold font-ui uppercase tracking-[0.2em]">Popular</div>
                        <h3 className="text-2xl font-bold mb-3">Build & Implementation</h3>
                        <p className="text-zinc-600 text-sm mb-10 max-w-sm">For companies moving from strategy to working AI systems.</p>
                        <div className="flex items-baseline gap-2 mb-10">
                            <span className="text-zinc-500 text-base">$</span>
                            <span className="text-6xl md:text-7xl font-black tracking-tight">{yearly ? '15,894' : '18,699'}</span>
                            <span className="text-zinc-500 text-xs font-ui uppercase tracking-widest">USD/<br />Project</span>
                        </div>
                        <a href="#contact" className="block text-center w-full px-6 py-4 bg-black text-white font-bold text-[11px] font-ui uppercase tracking-[0.2em] hover:bg-zinc-900 transition-colors mb-10">
                            Reach Us
                        </a>
                        <ul className="space-y-4">
                            {['Full AI system design', 'Development & engineering', 'Workflow & data integration', 'Testing, deployment & optimization', 'Performance measurement', 'On-ground support & iteration', 'Guaranteed, production-ready delivery'].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-zinc-600 text-sm">
                                    <div className="w-1 h-1 bg-amber-500 mt-2.5 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
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
                        From architecture to deployment, we focus on building AI solutions that are dependable, scalable, and genuinely transformative &mdash; not experimental toys.
                    </p>
                    <div className="why-el flex flex-wrap gap-2">
                        {attributes.map(attr => (
                            <span key={attr} className="px-4 py-2 text-[11px] font-ui uppercase tracking-[0.18em] text-zinc-300 border border-zinc-700 bg-white/[0.02] hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-colors cursor-default">
                                {attr}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="why-img relative">
                    <div className="aspect-[3/4] overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85" alt="" className="w-full h-full object-cover grayscale contrast-125" />
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

// ── Meet The Team ──
const Team = () => {
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.team-card', {
                scrollTrigger: { trigger: ref.current, start: 'top 65%' },
                y: 60, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    const members = [
        { name: 'Hendrik', role: 'Founder & CEO', quote: '"Building AI systems that actually ship and deliver results."', img: '/Hendrik.png' },
        { name: 'Alex Chen', role: 'Lead ML Engineer', quote: '"If it can be automated, it should be automated. Humans deserve better work."', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=85' },
        { name: 'Sarah Kim', role: 'AI Product Designer', quote: '"Great AI feels invisible — it just works."', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=85' },
    ];

    return (
        <section id="team" ref={ref} className="py-24 md:py-32 bg-[#0A0A0A] relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="mb-8"><SectionLabel>Meet The Team</SectionLabel></div>
                <h2 className="text-5xl md:text-8xl lg:text-[10rem] font-display text-white tracking-tight leading-[0.85] uppercase mb-20">
                    Builders,<br />Engineers, and<br />Problem-Solvers First
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {members.map((m, i) => (
                        <div key={i} className="team-card group relative bg-[#0A0A0A] border border-white/10 overflow-hidden">
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img src={m.img} alt={m.name} className="absolute inset-0 w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                                <div className="absolute bottom-5 left-5 right-5">
                                    <p className="text-white font-bold text-lg">{m.name}</p>
                                    <p className="text-zinc-400 text-[10px] font-ui uppercase tracking-[0.2em] mt-1">{m.role}</p>
                                    <p className="text-zinc-300 text-xs mt-2 leading-relaxed italic opacity-0 group-hover:opacity-100 transition-opacity duration-500">{m.quote}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <CornerButton href="#contact">
                        About Us <ArrowUpRight size={14} />
                    </CornerButton>
                </div>
            </div>
        </section>
    );
};

// ── FAQ ──
const FAQ = () => {
    const [open, setOpen] = useState(0);
    const faqs = [
        { q: 'Do you build real AI systems or just proofs of concept?', a: 'We build production-ready systems. Every project is designed to ship, integrate with your workflows, and deliver measurable business outcomes from day one.' },
        { q: 'What types of companies do you typically work with?', a: 'We work with startups, scale-ups, and established businesses across SaaS, fintech, healthcare, and e-commerce that are ready to implement AI strategically.' },
        { q: "What's your usual engagement timeline?", a: 'Strategy sprints take 2-4 weeks. Full build and implementation projects typically run 8-16 weeks depending on complexity.' },
        { q: 'Do you handle everything end-to-end?', a: 'Yes. From initial strategy and system design through development, testing, deployment, and ongoing optimization.' },
        { q: 'Can you work with our internal team?', a: 'Absolutely. We integrate seamlessly with your existing engineering and product teams, providing expertise where you need it most.' },
        { q: "What if we're not sure what to build yet?", a: "That's exactly what our Strategy Sprint is for. We help you identify the highest-impact AI opportunities and build a clear execution roadmap." },
    ];

    return (
        <section className="py-24 md:py-32 bg-[#0A0A0A] border-y border-white/5 relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-2 gap-16 relative z-10">
                <div>
                    <div className="mb-8"><SectionLabel>FAQs</SectionLabel></div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-6 leading-[1.05]">Everything You Need to Know Before We Build</h2>
                    <p className="text-zinc-500 text-sm mb-10 max-w-md">We don't sell AI concepts or recycled demos. We design and deploy production-ready AI systems grounded in your workflows, your data, and measurable business outcomes.</p>
                    <div>
                        <p className="text-white font-bold text-sm mb-4">Got more questions?</p>
                        <CornerButton href="#contact" filled>
                            Reach Us <ArrowUpRight size={14} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        </CornerButton>
                    </div>
                </div>
                <div className="space-y-px bg-white/5">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-[#0A0A0A]">
                            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors">
                                <span className="text-white text-base font-medium pr-4">{faq.q}</span>
                                <ChevronDown size={18} className={`text-zinc-500 flex-shrink-0 transition-transform ${open === i ? 'rotate-180 text-amber-500' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ${open === i ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                                <p className="px-6 text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── Articles ──
const Articles = () => {
    const ref = useRef(null);
    const articles = [
        { title: 'The Foundation of AI: Why Your Knowledge Base is Your Competitive Advantage', desc: 'Learn how to solve the "messy data" problem and build a centralized AI knowledge system.', date: 'JAN 2026', read: '4 MIN READ', img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=85' },
        { title: 'The Ethical AI Roadmap: Building Trust in an Automated World', desc: 'Navigate the ethical landscape of AI — from data privacy to bias mitigation.', date: 'DEC 2025', read: '10 MIN READ', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=85' },
        { title: 'The Crystal Ball: Using AI Simulation to De-Risk Your 2026 Strategy', desc: 'How AI digital twins and predictive simulation help business leaders plan ahead.', date: 'DEC 2025', read: '8 MIN READ', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=85' },
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
        <section ref={ref} className="py-24 md:py-32">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="mb-8"><SectionLabel>Articles</SectionLabel></div>
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-16 leading-[1.05]">
                    Insights & <span className="text-zinc-600">Field Notes</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
                    {articles.map((a, i) => (
                        <a key={i} href="#" className="article-card group block bg-[#0A0A0A] hover:bg-[#111] transition-colors p-4">
                            <div className="relative aspect-[4/5] overflow-hidden mb-5">
                                <img src={a.img} alt="" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
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

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.contact-el', {
                scrollTrigger: { trigger: ref.current, start: 'top 65%' },
                y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section id="contact" ref={ref} className="py-24 md:py-40 bg-[#0A0A0A] border-y border-white/5">
            <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-2 gap-16">
                <div>
                    <div className="contact-el mb-8"><SectionLabel>Talk To Us</SectionLabel></div>
                    <h2 className="contact-el text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-[-0.03em] mb-8 leading-[0.95]">
                        Tell Us<br />What You Want<br /><span className="text-zinc-600">AI to Fix</span>
                    </h2>
                    <p className="contact-el text-zinc-500 text-sm md:text-base max-w-md">Share a bit about your business and we'll come back with a clear, no-fluff plan of attack.</p>
                </div>

                <form className="contact-el space-y-3" onSubmit={e => e.preventDefault()}>
                    <input type="text" placeholder="Name" className="w-full px-5 py-5 bg-[#111] border border-zinc-700 text-white text-sm placeholder-zinc-400 focus:border-zinc-500 focus:outline-none transition-colors" />
                    <input type="email" placeholder="Work Email" className="w-full px-5 py-5 bg-[#111] border border-zinc-700 text-white text-sm placeholder-zinc-400 focus:border-zinc-500 focus:outline-none transition-colors" />
                    <input type="text" placeholder="Company" className="w-full px-5 py-5 bg-[#111] border border-zinc-700 text-white text-sm placeholder-zinc-400 focus:border-zinc-500 focus:outline-none transition-colors" />
                    <textarea placeholder="What do you want to discuss?" rows={5} className="w-full px-5 py-5 bg-[#111] border border-zinc-700 text-white text-sm placeholder-zinc-400 focus:border-zinc-500 focus:outline-none transition-colors resize-none" />
                    <button type="submit" className="w-full px-8 py-6 bg-white text-black font-bold text-[11px] font-ui uppercase tracking-[0.3em] hover:bg-amber-500 transition-colors flex items-center justify-center gap-3 group">
                        Submit <ArrowUpRight size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </section>
    );
};

// ── Footer ──
const Footer = () => (
    <footer className="bg-[#050505] pt-24 pb-10 px-6">
        <div className="max-w-[1400px] mx-auto">
            <div className="mb-20">
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
                    {['Home', 'Services', 'Process', 'Case Studies', 'Pricing'].map(link => (
                        <a key={link} href={`#${link.toLowerCase().replace(' ', '')}`} className="text-zinc-300 text-sm hover:text-amber-500 transition-colors font-ui uppercase tracking-wider">{link}</a>
                    ))}
                </div>
                <div className="flex flex-col gap-3">
                    <span className="text-zinc-500 text-[10px] font-ui uppercase tracking-[0.25em] mb-3">Social</span>
                    {['LinkedIn', 'X / Twitter', 'Instagram'].map(link => (
                        <a key={link} href="#" className="text-zinc-300 text-sm hover:text-amber-500 transition-colors font-ui uppercase tracking-wider">{link}</a>
                    ))}
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

// ── Grid Overlay (hero only) ──
const GridOverlay = () => {
    const lineColor = 'rgba(255,255,255,0.14)';
    const plusColor = 'rgba(255,255,255,0.22)';
    const plusSize = 12;
    const plusStyle = {
        color: plusColor,
        fontSize: plusSize,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 300,
        lineHeight: 1,
        userSelect: 'none',
    };
    const vPositions = ['left-6', 'left-1/3', 'left-2/3', 'right-6'];
    const showPlus = [true, false, false, true];
    const hPositions = ['25%', '50%', '75%'];

    return (
        <div className="absolute inset-0 z-30 pointer-events-none" aria-hidden="true">
            <div className="max-w-[1400px] mx-auto h-full px-6 relative">
                {vPositions.map((pos, i) => (
                    <div key={`v-${i}`} className={`absolute inset-y-0 ${pos} w-[1px]`} style={{ background: lineColor }}>
                        {showPlus[i] && hPositions.map(top => (
                            <span key={top} className="absolute -translate-x-1/2" style={{ ...plusStyle, top }}>+</span>
                        ))}
                    </div>
                ))}
                {hPositions.map((top, i) => (
                    <div key={`h-${i}`} className="absolute left-6 right-6 h-[1px]" style={{ background: lineColor, top }} />
                ))}
            </div>
        </div>
    );
};

// ── Main App ──
function App() {
    return (
        <div className="w-full min-h-screen font-sans bg-[#0A0A0A] text-white selection:bg-amber-500 selection:text-black relative">
            <Navbar />
            <Hero />
            <LogoMarquee />
            <Services />
            <Capabilities />
            <Process />
            <Works />
            <CaseStudy />
            <Testimonials />
            <Pricing />
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
