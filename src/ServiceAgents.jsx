import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ChevronRight, ArrowLeft, Zap, Mail, Users, BarChart3, Globe, Tv, Pen, MessageSquare, Target, Search } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ServiceNavbar, Footer, SectionGrid, BrightGrid, SectionLabel, CornerButton } from './shared';

gsap.registerPlugin(ScrollTrigger);

// ── Hero ──
const AgentsHero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.ah-line', { y: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'power3.out', delay: 0.3 });
            gsap.from('.ah-el', { y: 30, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out', delay: 1 });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="relative min-h-[110vh] flex flex-col justify-end pb-20 md:pb-32 overflow-hidden">
            <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
                <div className="absolute inset-0" style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80&auto=format)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) contrast(1.2) brightness(0.4)',
                    transform: 'scale(1.1)',
                }} />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-transparent to-[#0A0A0A] z-10" />
            <BrightGrid z="z-20" />

            <motion.div className="relative z-30" style={{ opacity }}>
                <div className="max-w-[1400px] mx-auto px-6 w-full">
                    <div className="ah-el mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 text-xs font-ui uppercase tracking-[0.2em] hover:text-white transition-colors group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>
                    </div>

                    <div className="ah-el mb-6"><SectionLabel>Service / 02</SectionLabel></div>

                    <h1 className="font-display leading-[0.88] tracking-[0.01em] uppercase">
                        <span className="block overflow-hidden"><span className="ah-line block text-[13vw] md:text-[9vw] lg:text-[7.5vw] text-white">Custom AI</span></span>
                        <span className="block overflow-hidden"><span className="ah-line block text-[13vw] md:text-[9vw] lg:text-[7.5vw] text-zinc-500">Agents</span></span>
                    </h1>

                    <div className="grid md:grid-cols-2 gap-8 mt-12 md:mt-16 items-end">
                        <p className="ah-el max-w-lg text-zinc-400 text-sm md:text-base leading-relaxed">
                            We find and fix $50K–$500K in operational waste — and build the AI agents that keep it fixed. These aren't concepts. They're running in production right now.
                        </p>
                        <div className="ah-el flex md:justify-end">
                            <CornerButton href="#flagship" filled>
                                See What We've Built <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </CornerButton>
                        </div>
                    </div>
                </div>

                <div className="ah-el absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-[9px] font-ui text-zinc-500 tracking-[0.3em] uppercase">Scroll</span>
                    <motion.div
                        className="w-[1px] h-8 bg-gradient-to-b from-amber-500 to-transparent"
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
            </motion.div>
        </section>
    );
};

// ── The Problem ──
const TheProblem = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.prob-el', {
                scrollTrigger: { trigger: ref.current, start: 'top 70%' },
                y: 50, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="py-24 md:py-40 relative overflow-hidden border-t border-white/10">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="max-w-4xl">
                    <div className="prob-el mb-6"><SectionLabel>The Reality</SectionLabel></div>
                    <h2 className="prob-el text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-8">
                        Mid-market companies don't have a revenue problem. <span className="text-zinc-600">They have a leak problem.</span>
                    </h2>
                    <p className="prob-el text-zinc-400 text-base md:text-lg leading-relaxed max-w-3xl">
                        Manual proposals, slow follow-up, CRM busywork, band-aid hiring. At $5M–$50M in revenue, recovering just 1–2% is $50K minimum. We find it, then we build the automation that closes the gap for good.
                    </p>
                </div>

                <div className="prob-el grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 mt-16">
                    {[
                        { val: '$50K+', label: 'Minimum waste found per audit' },
                        { val: '20 min', label: 'Proposal turnaround vs. 2–3 days' },
                        { val: '$0.004', label: 'Per outbound email sent' },
                        { val: '95%+', label: 'Inbox placement rate' },
                    ].map((s, i) => (
                        <div key={i} className="p-6 md:p-8 bg-[#0A0A0A]">
                            <div className="text-2xl md:text-3xl font-black text-white tracking-tight">{s.val}</div>
                            <div className="text-zinc-500 text-[10px] mt-2 font-ui uppercase tracking-[0.15em]">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── Flagship: Speed-to-Heat ──
const Flagship = () => {
    const ref = useRef(null);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.flag-el', {
                scrollTrigger: { trigger: ref.current, start: 'top 65%' },
                y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setStep(s => (s + 1) % 4), 3000);
        return () => clearInterval(timer);
    }, []);

    const steps = [
        { time: '0:00', label: 'Sales call ends', detail: 'Call recording captured' },
        { time: '0:02', label: 'AI listens & extracts', detail: 'Key details, pain points, scope' },
        { time: '0:08', label: 'Proposal generated', detail: 'Tailored, branded, ready to send' },
        { time: '0:20', label: 'In their inbox', detail: 'While the conversation is still warm' },
    ];

    return (
        <section id="flagship" ref={ref} className="py-24 md:py-40 bg-[#050505] relative overflow-hidden">
            <BrightGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="flag-el flex items-center gap-3 mb-6">
                    <SectionLabel>Flagship Agent</SectionLabel>
                    <span className="px-3 py-1 bg-amber-500 text-black text-[10px] font-bold font-ui uppercase tracking-[0.2em]">Live</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="flag-el text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-4">
                            Speed-to-Heat
                        </h2>
                        <p className="flag-el text-amber-500 font-ui text-sm uppercase tracking-[0.15em] font-bold mb-8">AI Proposal Generator</p>

                        <p className="flag-el text-xl md:text-2xl font-bold text-white leading-snug mb-8">
                            Your sales call ends. The proposal is in their inbox in 20 minutes.
                        </p>

                        <p className="flag-el text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
                            Most teams take 2–3 days to turn a call into a custom proposal. By then the prospect has cooled — or signed with whoever was faster. Speed-to-Heat listens to the call, pulls the details that matter, and generates a tailored proposal in roughly 20 minutes.
                        </p>

                        <p className="flag-el text-zinc-600 text-xs font-ui italic">
                            Best for: high-volume custom proposals where speed decides who wins.
                        </p>

                        <div className="flag-el mt-10">
                            <CornerButton href="#contact" filled>
                                Get Speed-to-Heat <ArrowUpRight size={14} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            </CornerButton>
                        </div>
                    </div>

                    {/* Interactive timeline */}
                    <div className="flag-el">
                        <div className="border border-white/10 bg-[#0A0A0A] p-6 md:p-10">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-2 h-2 bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-ui text-zinc-500 tracking-[0.25em] uppercase">Live Demo Timeline</span>
                            </div>

                            <div className="space-y-0">
                                {steps.map((s, i) => (
                                    <div key={i} className="relative">
                                        <div className={`flex gap-6 p-4 transition-all duration-500 ${i === step ? 'bg-white/[0.03]' : ''}`}>
                                            {/* Timeline dot & line */}
                                            <div className="flex flex-col items-center">
                                                <div className={`w-3 h-3 border-2 flex-shrink-0 transition-all duration-500 ${i <= step ? 'border-amber-500 bg-amber-500' : 'border-zinc-700 bg-transparent'}`} />
                                                {i < steps.length - 1 && (
                                                    <div className={`w-[2px] h-12 transition-all duration-500 ${i < step ? 'bg-amber-500' : 'bg-zinc-800'}`} />
                                                )}
                                            </div>
                                            <div className="flex-1 -mt-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className={`font-ui text-xs font-bold tracking-wider ${i <= step ? 'text-amber-500' : 'text-zinc-700'}`}>{s.time}</span>
                                                    <span className={`font-bold text-sm ${i <= step ? 'text-white' : 'text-zinc-600'}`}>{s.label}</span>
                                                </div>
                                                <span className={`text-xs ${i <= step ? 'text-zinc-400' : 'text-zinc-700'}`}>{s.detail}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Progress bar */}
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <div className="flex justify-between text-[10px] font-ui text-zinc-600 tracking-[0.2em] uppercase mb-2">
                                    <span>Call Ends</span>
                                    <span>Proposal Sent</span>
                                </div>
                                <div className="w-full h-1 bg-zinc-900">
                                    <motion.div
                                        className="h-full bg-amber-500"
                                        animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ── Product Card ──
const ProductCard = ({ product, index, featured }) => (
    <div className={`prod-card group p-6 md:p-8 bg-[#0A0A0A] border transition-all duration-300 hover:bg-[#111] ${featured ? 'border-amber-500/50 hover:border-amber-500' : 'border-white/10 hover:border-white/30'}`}>
        <div className="flex items-start justify-between mb-5">
            <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-amber-500 group-hover:border-amber-500/50 transition-colors">
                {product.icon}
            </div>
            {featured && <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[9px] font-ui font-bold uppercase tracking-[0.2em]">Popular</span>}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-white mb-1">{product.name}</h3>
        {product.subtitle && <p className="text-amber-500 text-[10px] font-ui uppercase tracking-[0.15em] font-bold mb-4">{product.subtitle}</p>}
        <p className="text-white text-sm font-semibold leading-snug mb-4">{product.headline}</p>
        <p className="text-zinc-500 text-sm leading-relaxed mb-6">{product.desc}</p>
        {product.bestFor && (
            <p className="text-zinc-600 text-[10px] font-ui italic border-t border-white/5 pt-4">{product.bestFor}</p>
        )}
        {product.metrics && (
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5">
                {product.metrics.map((m, i) => (
                    <span key={i} className="px-2 py-1 bg-white/[0.03] border border-white/5 text-[10px] font-ui text-zinc-400 tracking-wider">{m}</span>
                ))}
            </div>
        )}
    </div>
);

// ── Sales & Pipeline Section ──
const SalesAgents = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.sales-header', { scrollTrigger: { trigger: ref.current, start: 'top 70%' }, y: 50, opacity: 0, duration: 1, ease: 'power3.out' });
            gsap.from('.prod-card', { scrollTrigger: { trigger: '.sales-grid', start: 'top 75%' }, y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
        }, ref);
        return () => ctx.revert();
    }, []);

    const products = [
        {
            name: 'OpenClaw',
            subtitle: 'Autonomous SDR',
            icon: <Target size={18} />,
            headline: 'An entire SDR team that runs on a $7 server instead of a $15–25K/month payroll line.',
            desc: 'Runs the full top-of-funnel on autopilot: scrape, dedup, enrich, verify, score, personalize, send, then sort every reply and route the hot ones to you. It kills losing copy and scales winners on its own.',
            bestFor: 'Best for: founders and ops leaders who need consistent pipeline without hiring an SDR bench.',
            metrics: ['$0.004/email', '95%+ inbox', '~$15/qualified call', '2 emails max'],
        },
        {
            name: 'LinkedIn Outreach Agent',
            icon: <Users size={18} />,
            headline: "Personalized LinkedIn prospecting that doesn't read like a bot wrote it.",
            desc: "Researches each prospect, writes outreach that proves it, and works the channel where your buyers actually pay attention — without burning your personal brand on spray-and-pray templates.",
        },
        {
            name: 'AI Transcripts → Proposals',
            subtitle: 'Staffing Edition',
            icon: <Zap size={18} />,
            headline: 'For staffing & recruiting firms: turn a recorded call into a ready-to-send proposal.',
            desc: 'A vertical-tuned version of Speed-to-Heat built around how staffing firms actually sell. Drop in the call recording, get back a proposal shaped for the role, the rates, and the client — same day.',
        },
    ];

    return (
        <section ref={ref} className="py-24 md:py-40 relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="sales-header mb-6"><SectionLabel>Sales &amp; Pipeline</SectionLabel></div>
                <h2 className="sales-header text-4xl md:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-6">
                    Fill the Pipeline. <span className="text-zinc-600">Close Faster.</span>
                </h2>
                <p className="sales-header text-zinc-400 text-sm md:text-base max-w-xl mb-16">
                    Agents that prospect, qualify, and prep proposals — so your team only handles conversations that close.
                </p>

                <div className="sales-grid grid grid-cols-1 md:grid-cols-3 gap-4">
                    {products.map((p, i) => <ProductCard key={i} product={p} index={i} featured={i === 0} />)}
                </div>
            </div>
        </section>
    );
};

// ── Operations & Audit Section ──
const OpsAgents = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.ops-header', { scrollTrigger: { trigger: ref.current, start: 'top 70%' }, y: 50, opacity: 0, duration: 1, ease: 'power3.out' });
            gsap.from('.ops-card', { scrollTrigger: { trigger: '.ops-grid', start: 'top 75%' }, y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="py-24 md:py-40 bg-[#050505] border-y border-white/10 relative overflow-hidden">
            <BrightGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="ops-header mb-6"><SectionLabel>Operations &amp; Audit</SectionLabel></div>
                <h2 className="ops-header text-4xl md:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-6">
                    See the Leaks. <span className="text-zinc-600">Seal Them.</span>
                </h2>
                <p className="ops-header text-zinc-400 text-sm md:text-base max-w-xl mb-16">
                    Diagnostic and automation tools that turn "we're probably losing money" into a ranked, dollar-figured hit list.
                </p>

                <div className="ops-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="ops-card group p-8 md:p-10 bg-[#0A0A0A] border border-amber-500/30 hover:border-amber-500 transition-all">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-10 h-10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                                <BarChart3 size={18} />
                            </div>
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[9px] font-ui font-bold uppercase tracking-[0.2em]">Core Tool</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Revenue-Leak Dashboard</h3>
                        <p className="text-white text-sm font-semibold leading-snug mb-4">See exactly where the money is leaking — in one view.</p>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                            The engine behind the CoreFix audit. It surfaces and tracks the manual processes, dropped handoffs, and workflow gaps quietly draining margin, and turns "we're probably losing money somewhere" into a ranked, dollar-figured list you can act on.
                        </p>
                        {/* Dashboard mockup */}
                        <div className="border border-white/5 bg-[#050505] p-4 mt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1.5 h-1.5 bg-red-500" />
                                <span className="text-[9px] font-ui text-zinc-600 tracking-[0.2em] uppercase">Sample Output</span>
                            </div>
                            {[
                                { leak: 'Manual proposal creation', cost: '$127K/yr', priority: 'Critical' },
                                { leak: 'CRM data entry by reps', cost: '$84K/yr', priority: 'High' },
                                { leak: 'Lead follow-up delays (>24h)', cost: '$62K/yr', priority: 'High' },
                                { leak: 'Duplicate outreach to prospects', cost: '$31K/yr', priority: 'Medium' },
                            ].map((row, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                                    <span className="text-zinc-300 text-xs flex-1">{row.leak}</span>
                                    <span className="text-white text-xs font-bold w-24 text-right">{row.cost}</span>
                                    <span className={`text-[9px] font-ui uppercase tracking-wider w-16 text-right ${row.priority === 'Critical' ? 'text-red-400' : row.priority === 'High' ? 'text-amber-500' : 'text-zinc-500'}`}>{row.priority}</span>
                                </div>
                            ))}
                            <div className="flex justify-between mt-4 pt-3 border-t border-white/10">
                                <span className="text-zinc-500 text-[10px] font-ui uppercase tracking-wider">Total identified waste</span>
                                <span className="text-amber-500 text-sm font-black">$304K/yr</span>
                            </div>
                        </div>
                    </div>

                    <div className="ops-card group p-8 md:p-10 bg-[#0A0A0A] border border-white/10 hover:border-white/30 transition-all">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-amber-500 transition-colors">
                                <Globe size={18} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Website Builder</h3>
                        <p className="text-white text-sm font-semibold leading-snug mb-4">Prospect research in, a finished site out — delivered where you can use it.</p>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            An agent that researches a target, builds the site, and hands off the deliverable in the tools your team already lives in (Google Sheets/Slides), so nothing's trapped in a black box.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ── Content Agents Section ──
const ContentAgents = () => {
    const ref = useRef(null);
    const [active, setActive] = useState(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.content-header', { scrollTrigger: { trigger: ref.current, start: 'top 70%' }, y: 50, opacity: 0, duration: 1, ease: 'power3.out' });
            gsap.from('.content-card', { scrollTrigger: { trigger: '.content-grid', start: 'top 75%' }, y: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' });
        }, ref);
        return () => ctx.revert();
    }, []);

    const agents = [
        {
            name: 'Content Studio',
            icon: <Tv size={18} />,
            headline: 'A 7-agent newsroom that hands you a ready-to-record brief every morning.',
            desc: 'Seven specialized agents work overnight — trend scouting, idea ranking, research, scripting, SEO, thumbnails, and reporting — and drop one approve-over-coffee brief into Notion. You wake up, pick the winner, hit record.',
            detail: '7 agents • Notion delivery • Daily briefs',
        },
        {
            name: 'SMYKM',
            subtitle: '"Show Me You Know Me"',
            icon: <Search size={18} />,
            headline: 'Hyper-personalized 1:1 outreach that proves real research.',
            desc: 'Built to clear 40%+ opens and 15–20% replies, against the 1–3% cold-email norm.',
            detail: '40%+ opens • 15-20% replies',
        },
        {
            name: 'Outbound Campaign Writer',
            icon: <Mail size={18} />,
            headline: 'Cold email, LinkedIn, SMS, and Instagram DM sequences built on a tested 4-step framework.',
            desc: 'Personal at scale — across every channel your prospects live on.',
            detail: '4-step framework • Multi-channel',
        },
        {
            name: 'LinkedIn Carousel Builder',
            icon: <Pen size={18} />,
            headline: 'Brand-locked, swipeable LinkedIn carousels — on-brand every time.',
            desc: 'Generated in minutes. No designer needed. Your brand guidelines baked in.',
            detail: 'Brand-locked • Minutes to generate',
        },
        {
            name: 'YouTube Repurposer',
            icon: <Tv size={18} />,
            headline: 'Turn one video into LinkedIn, Instagram, X, and Shorts posts with branded visuals.',
            desc: 'Plus scroll-stopping, upload-ready thumbnails. One video becomes a week of content.',
            detail: '1 video → 5+ pieces',
        },
    ];

    return (
        <section ref={ref} className="py-24 md:py-40 relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="content-header mb-6"><SectionLabel>Content Agents</SectionLabel></div>
                <div className="content-header flex items-end justify-between flex-wrap gap-6 mb-16">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-4">
                            We Run Our Marketing <span className="text-zinc-600">on These.</span>
                        </h2>
                        <p className="text-zinc-400 text-sm md:text-base max-w-xl">
                            Every content agent below powers CoreFix's own marketing. If it works for us, we'll build it for you.
                        </p>
                    </div>
                </div>

                <div className="content-grid space-y-0">
                    {agents.map((agent, i) => (
                        <div key={i} className="content-card border-b border-white/5 last:border-0">
                            <button
                                onClick={() => setActive(active === i ? null : i)}
                                className="w-full flex items-center gap-6 py-6 md:py-8 text-left group"
                            >
                                <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-zinc-600 group-hover:text-amber-500 group-hover:border-amber-500/50 transition-colors flex-shrink-0">
                                    {agent.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-amber-500 transition-colors">{agent.name}</h3>
                                        {agent.subtitle && <span className="text-zinc-600 text-xs font-ui">{agent.subtitle}</span>}
                                    </div>
                                    <p className="text-zinc-500 text-sm mt-1 hidden md:block">{agent.headline}</p>
                                </div>
                                <span className="text-zinc-700 text-xs font-ui tracking-wider hidden md:block">{agent.detail}</span>
                                <span className={`text-lg flex-shrink-0 transition-transform duration-300 ${active === i ? 'text-amber-500 rotate-45' : 'text-zinc-600 group-hover:text-white'}`}>+</span>
                            </button>
                            <AnimatePresence>
                                {active === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-16 pb-8">
                                            <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl md:hidden mb-3">{agent.headline}</p>
                                            <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">{agent.desc}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── Offer Ladder ──
const OfferLadder = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.offer-el', {
                scrollTrigger: { trigger: ref.current, start: 'top 65%' },
                y: 50, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    const offers = [
        {
            step: '01',
            title: 'Free Operational Diagnostic',
            price: 'Free',
            desc: 'A focused audit that maps where you\'re bleeding money through manual work and broken workflows. If we don\'t find at least $50K in identifiable waste, we say so and walk away — no pitch, no cost.',
            cta: 'Book Free Diagnostic',
            highlight: true,
        },
        {
            step: '02',
            title: 'AI-Powered Process Automation',
            price: '$3,000–$10,000',
            desc: 'We fix the leaks the diagnostic finds. You pay on implementation, not on the audit.',
            cta: 'Get Started',
        },
        {
            step: '03',
            title: 'AI Operator Retainer',
            price: '$1,500/month',
            desc: 'Ongoing coaching and maintenance to keep the agents sharp and the savings compounding.',
            cta: 'Learn More',
        },
    ];

    return (
        <section ref={ref} className="py-24 md:py-40 bg-[#050505] relative overflow-hidden border-t border-white/10">
            <BrightGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="offer-el mb-6"><SectionLabel>How We Work Together</SectionLabel></div>
                <h2 className="offer-el text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-[-0.02em] leading-[0.95] mb-6">
                    Start Free. <span className="text-zinc-600">Scale When It Works.</span>
                </h2>
                <p className="offer-el text-zinc-400 text-sm md:text-base max-w-xl mb-20">
                    We prove the value before you spend a dollar. If the diagnostic doesn't surface real savings, we walk.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {offers.map((offer, i) => (
                        <div key={i} className={`offer-el p-8 md:p-10 flex flex-col ${offer.highlight ? 'bg-white text-black' : 'bg-[#0A0A0A] border border-white/10'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <span className={`text-[10px] font-ui font-bold tracking-[0.25em] ${offer.highlight ? 'text-amber-600' : 'text-amber-500'}`}>&mdash; {offer.step}</span>
                                {i === 0 && <span className="px-2 py-0.5 bg-amber-500 text-black text-[9px] font-ui font-bold uppercase tracking-[0.15em]">Start Here</span>}
                            </div>
                            <h3 className={`text-xl md:text-2xl font-bold mb-2 ${offer.highlight ? 'text-black' : 'text-white'}`}>{offer.title}</h3>
                            <div className={`text-3xl md:text-4xl font-black tracking-tight mb-6 ${offer.highlight ? 'text-black' : 'text-white'}`}>{offer.price}</div>
                            <p className={`text-sm leading-relaxed mb-10 flex-1 ${offer.highlight ? 'text-zinc-600' : 'text-zinc-400'}`}>{offer.desc}</p>
                            <a href="/#contact" className={`block text-center w-full px-6 py-4 font-bold text-[11px] font-ui uppercase tracking-[0.2em] transition-colors ${offer.highlight ? 'bg-black text-white hover:bg-zinc-900' : 'border border-zinc-700 text-white hover:bg-amber-500 hover:text-black hover:border-amber-500'}`}>
                                {offer.cta}
                            </a>
                        </div>
                    ))}
                </div>

                {/* Add-on */}
                <div className="offer-el mt-4 p-6 md:p-8 bg-[#0A0A0A] border border-white/10 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 border border-amber-500/30 flex items-center justify-center text-amber-500 flex-shrink-0">
                            <MessageSquare size={18} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-base mb-1">Add-On: Voice AI Inbound Agent</h4>
                            <p className="text-zinc-500 text-sm">A 24/7 agent that qualifies and books inbound leads, so your team only talks to ready-to-buy prospects.</p>
                        </div>
                    </div>
                    <CornerButton href="/#contact" className="whitespace-nowrap flex-shrink-0">
                        Inquire <ArrowUpRight size={14} />
                    </CornerButton>
                </div>
            </div>
        </section>
    );
};

// ── Final CTA ──
const FinalCTA = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.cta-el', {
                scrollTrigger: { trigger: ref.current, start: 'top 70%' },
                y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="py-32 md:py-48 relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 text-center relative z-10">
                <div className="cta-el mb-6 flex justify-center"><SectionLabel>Next Step</SectionLabel></div>
                <h2 className="cta-el text-5xl md:text-7xl lg:text-8xl font-display text-white tracking-tight leading-[0.85] uppercase mb-8">
                    Find the Leak.<br />Fix It. Keep It Fixed.
                </h2>
                <p className="cta-el text-zinc-400 text-sm md:text-base max-w-xl mx-auto mb-12">
                    Book a free operational diagnostic. If we don't find at least $50K in waste, we'll tell you and walk away.
                </p>
                <div className="cta-el flex flex-col sm:flex-row gap-4 justify-center">
                    <CornerButton to="/#contact" filled>
                        Book Free Diagnostic <ArrowUpRight size={14} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    </CornerButton>
                    <CornerButton to="/#services">
                        View All Services <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </CornerButton>
                </div>
            </div>
        </section>
    );
};

// ── Page Component ──
export default function ServiceAgents() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full min-h-screen font-sans bg-[#0A0A0A] text-white selection:bg-amber-500 selection:text-black relative">
            <ServiceNavbar />
            <AgentsHero />
            <TheProblem />
            <Flagship />
            <SalesAgents />
            <OpsAgents />
            <ContentAgents />
            <OfferLadder />
            <FinalCTA />
            <Footer />
        </div>
    );
}
