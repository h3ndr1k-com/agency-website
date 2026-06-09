import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ServiceNavbar, Footer, SectionGrid, BrightGrid, SectionLabel, CornerButton } from './shared';

gsap.registerPlugin(ScrollTrigger);

// ── Hero ──
const ServiceHero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.sh-line', { y: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'power3.out', delay: 0.3 });
            gsap.from('.sh-el', { y: 30, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out', delay: 1 });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="relative min-h-[110vh] flex flex-col justify-end pb-20 md:pb-32 overflow-hidden">
            <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
                <div className="absolute inset-0" style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80&auto=format)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) contrast(1.2) brightness(0.5)',
                    transform: 'scale(1.1)',
                }} />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-transparent to-[#0A0A0A] z-10" />
            <BrightGrid z="z-20" />

            <motion.div className="relative z-30" style={{ opacity }}>
                <div className="max-w-[1400px] mx-auto px-6 w-full">
                    <div className="sh-el mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 text-xs font-ui uppercase tracking-[0.2em] hover:text-white transition-colors group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>
                    </div>

                    <div className="sh-el mb-6"><SectionLabel>Service / 01</SectionLabel></div>

                    <h1 className="font-display leading-[0.88] tracking-[0.01em] uppercase">
                        <span className="block overflow-hidden"><span className="sh-line block text-[14vw] md:text-[10vw] lg:text-[8vw] text-white">AI Strategy</span></span>
                        <span className="block overflow-hidden"><span className="sh-line block text-[14vw] md:text-[10vw] lg:text-[8vw] text-zinc-500">&amp; Advisory</span></span>
                    </h1>

                    <div className="grid md:grid-cols-2 gap-8 mt-12 md:mt-16 items-end">
                        <p className="sh-el max-w-lg text-zinc-400 text-sm md:text-base leading-relaxed">
                            Clear, execution-ready AI plans aligned with business goals. We cut through the noise and help you identify exactly where AI creates leverage — then map the path to get there.
                        </p>
                        <div className="sh-el flex md:justify-end">
                            <CornerButton href="#framework" filled>
                                Explore Framework <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </CornerButton>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="sh-el absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
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

// ── The Problem Section ──
const Problem = () => {
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

    const painPoints = [
        { stat: '73%', label: 'of AI projects fail to make it past pilot stage' },
        { stat: '68%', label: 'of executives say their AI strategy is unclear' },
        { stat: '$4.6M', label: 'average cost of failed AI implementation' },
    ];

    return (
        <section ref={ref} className="py-24 md:py-40 relative overflow-hidden border-t border-white/10">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="prob-el mb-6"><SectionLabel>The Reality</SectionLabel></div>
                        <h2 className="prob-el text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-8">
                            Most AI initiatives <span className="text-zinc-600">fail before they start.</span>
                        </h2>
                        <p className="prob-el text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg">
                            Companies rush into AI without a clear strategy — choosing tools before defining problems, building features nobody needs, and burning budgets on proof-of-concepts that never ship. The issue isn't the technology. It's the thinking.
                        </p>
                    </div>
                    <div className="space-y-6">
                        {painPoints.map((p, i) => (
                            <div key={i} className="prob-el p-6 md:p-8 border border-white/10 bg-white/[0.02] hover:border-amber-500/50 transition-colors group">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl md:text-5xl font-black text-white tracking-tight group-hover:text-amber-500 transition-colors">{p.stat}</span>
                                    <span className="text-zinc-400 text-sm leading-snug">{p.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ── Framework Section (Interactive) ──
const Framework = () => {
    const ref = useRef(null);
    const [activePhase, setActivePhase] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.fw-header', {
                scrollTrigger: { trigger: ref.current, start: 'top 70%' },
                y: 50, opacity: 0, duration: 1, ease: 'power3.out'
            });
            gsap.from('.fw-phase', {
                scrollTrigger: { trigger: '.fw-phases', start: 'top 75%' },
                y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    const phases = [
        {
            num: '01',
            title: 'Discover & Audit',
            duration: 'Week 1',
            desc: 'We embed with your team to understand your workflows, data landscape, tools, and pain points. No surface-level discovery — we go deep.',
            details: [
                'Stakeholder interviews & workflow mapping',
                'Data infrastructure assessment',
                'Current tech stack & integration review',
                'Competitive AI landscape analysis',
            ],
            visual: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        },
        {
            num: '02',
            title: 'Identify & Prioritize',
            duration: 'Week 2',
            desc: 'We map every AI opportunity against impact, feasibility, and ROI — then rank them ruthlessly so you invest in what matters.',
            details: [
                'AI opportunity scoring matrix',
                'ROI projections for top use cases',
                'Technical feasibility assessment',
                'Risk & compliance evaluation',
            ],
            visual: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        },
        {
            num: '03',
            title: 'Architect & Design',
            duration: 'Week 3',
            desc: 'We design the system architecture, data flows, and integration points — creating a blueprint your engineering team can execute.',
            details: [
                'System architecture diagrams',
                'Data pipeline & flow design',
                'API & integration specifications',
                'Security & governance framework',
            ],
            visual: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80',
        },
        {
            num: '04',
            title: 'Roadmap & Deliver',
            duration: 'Week 4',
            desc: 'You walk away with a complete execution blueprint — milestones, resource needs, vendor recommendations, and a phased timeline.',
            details: [
                'Phased implementation roadmap',
                'Resource & budget planning',
                'Vendor & tool recommendations',
                'Success metrics & KPI framework',
            ],
            visual: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
        },
    ];

    const active = phases[activePhase];

    return (
        <section id="framework" ref={ref} className="py-24 md:py-40 bg-[#050505] relative overflow-hidden">
            <BrightGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="fw-header mb-6"><SectionLabel>Our Framework</SectionLabel></div>
                <h2 className="fw-header text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-[-0.02em] leading-[0.95] mb-6">
                    The Strategy Sprint
                </h2>
                <p className="fw-header text-zinc-400 text-sm md:text-base max-w-xl mb-20">
                    A focused 4-week engagement designed to move you from uncertainty to a clear, actionable AI roadmap.
                </p>

                {/* Phase timeline nav */}
                <div className="fw-phases grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 mb-16">
                    {phases.map((phase, i) => (
                        <button
                            key={i}
                            onClick={() => setActivePhase(i)}
                            className={`fw-phase p-5 md:p-6 text-left transition-all duration-500 ${i === activePhase ? 'bg-amber-500/10 border-t-2 border-amber-500' : 'bg-[#0A0A0A] border-t-2 border-transparent hover:bg-white/[0.03]'}`}
                        >
                            <span className={`text-[10px] font-ui font-bold tracking-[0.25em] ${i === activePhase ? 'text-amber-500' : 'text-zinc-600'}`}>{phase.num}</span>
                            <h4 className={`text-sm md:text-base font-bold mt-2 ${i === activePhase ? 'text-white' : 'text-zinc-400'}`}>{phase.title}</h4>
                            <span className="text-[10px] font-ui text-zinc-600 tracking-[0.15em] uppercase mt-1 block">{phase.duration}</span>
                        </button>
                    ))}
                </div>

                {/* Active phase detail */}
                <motion.div
                    key={activePhase}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid lg:grid-cols-2 gap-12 items-center"
                >
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-amber-500 font-ui text-xs tracking-[0.3em]">{active.num}</span>
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-zinc-500 font-ui text-[10px] tracking-[0.2em] uppercase">{active.duration}</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">{active.title}</h3>
                        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-10">{active.desc}</p>
                        <ul className="space-y-4">
                            {active.details.map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                    className="flex items-start gap-4 text-zinc-300 text-sm"
                                >
                                    <div className="w-1.5 h-1.5 bg-amber-500 mt-2 flex-shrink-0" />
                                    {item}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <motion.img
                            key={active.visual}
                            src={active.visual}
                            alt=""
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 brightness-75"
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                        <div className="absolute top-5 left-5 px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-white/20 text-[10px] font-ui uppercase tracking-[0.2em] text-white/80">
                            Phase {active.num}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// ── Deliverables ──
const Deliverables = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.del-card', {
                scrollTrigger: { trigger: ref.current, start: 'top 65%' },
                y: 60, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    const items = [
        { title: 'AI Opportunity Map', desc: 'Ranked list of use cases with impact scores, feasibility ratings, and ROI estimates.', icon: '◎' },
        { title: 'System Architecture', desc: 'Technical blueprints showing data flows, integration points, and infrastructure requirements.', icon: '⬡' },
        { title: 'Implementation Roadmap', desc: 'Phased timeline with milestones, resource allocation, and clear go/no-go decision points.', icon: '◇' },
        { title: 'Risk Assessment', desc: 'Comprehensive analysis of technical, compliance, and organizational risks with mitigation strategies.', icon: '△' },
        { title: 'Vendor Evaluation', desc: 'Independent assessment of AI platforms, tools, and partners suited to your specific needs.', icon: '▣' },
        { title: 'Executive Summary', desc: 'Board-ready presentation distilling findings, recommendations, and expected business outcomes.', icon: '⬢' },
    ];

    return (
        <section ref={ref} className="py-24 md:py-40 relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="mb-6"><SectionLabel>What You Get</SectionLabel></div>
                <div className="grid md:grid-cols-2 gap-8 mb-16 items-end">
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05]">
                        Tangible Outputs, <span className="text-zinc-600">Not Slide Decks</span>
                    </h2>
                    <p className="text-zinc-500 text-sm md:text-base">Every engagement ends with artifacts your team can act on immediately — no shelf-ware.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
                    {items.map((item, i) => (
                        <div key={i} className="del-card p-8 md:p-10 bg-[#0A0A0A] hover:bg-[#111] transition-colors group border-b border-white/5 last:border-0 md:[&:nth-last-child(-n+2)]:border-0 lg:[&:nth-last-child(-n+3)]:border-0">
                            <div className="flex items-start justify-between mb-6">
                                <span className="text-2xl text-zinc-600 group-hover:text-amber-500 transition-colors">{item.icon}</span>
                                <span className="text-[10px] font-ui text-zinc-700 tracking-[0.25em]">0{i + 1}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-500 transition-colors">{item.title}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── Who It's For ──
const Audience = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.aud-el', {
                scrollTrigger: { trigger: ref.current, start: 'top 70%' },
                y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    const profiles = [
        { title: 'Startup Founders', desc: 'Validating whether AI is the right bet — and where to invest limited resources for maximum impact.', tag: 'Seed – Series B' },
        { title: 'Product Leaders', desc: 'Building an AI roadmap for your product without getting locked into the wrong tools or architecture.', tag: 'SaaS / Platform' },
        { title: 'Operations Directors', desc: 'Identifying which workflows to automate first — and building a business case your board approves.', tag: 'Enterprise' },
        { title: 'CTOs & Engineering Leads', desc: 'Getting an independent technical assessment before committing engineering time and budget.', tag: 'Cross-Industry' },
    ];

    return (
        <section ref={ref} className="py-24 md:py-40 bg-[#050505] border-y border-white/10 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="aud-el mb-6"><SectionLabel>Who This Is For</SectionLabel></div>
                <h2 className="aud-el text-4xl md:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-20 max-w-4xl">
                    Built for leaders who want <span className="text-zinc-600">clarity before commitment.</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profiles.map((p, i) => (
                        <div key={i} className="aud-el group p-8 md:p-10 bg-[#0A0A0A] border border-white/10 hover:border-amber-500/50 transition-all">
                            <div className="flex items-start justify-between mb-6">
                                <h3 className="text-xl md:text-2xl font-bold text-white">{p.title}</h3>
                                <span className="text-[10px] font-ui text-zinc-600 tracking-[0.15em] uppercase border border-zinc-800 px-3 py-1">{p.tag}</span>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── Engagement Details (Pricing-like) ──
const Engagement = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.eng-el', {
                scrollTrigger: { trigger: ref.current, start: 'top 65%' },
                y: 50, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="py-24 md:py-40 relative overflow-hidden">
            <BrightGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="eng-el mb-6"><SectionLabel>Engagement</SectionLabel></div>
                <h2 className="eng-el text-4xl md:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-20">
                    Transparent. <span className="text-zinc-600">Fixed-scope.</span>
                </h2>

                <div className="eng-el grid lg:grid-cols-3 gap-px bg-white/5">
                    <div className="p-8 md:p-12 bg-[#0A0A0A]">
                        <span className="text-[10px] font-ui text-amber-500 tracking-[0.25em] font-bold">TIMELINE</span>
                        <div className="text-5xl md:text-6xl font-black text-white tracking-tight mt-4">4</div>
                        <span className="text-zinc-500 text-sm font-ui uppercase tracking-widest">Weeks</span>
                        <p className="text-zinc-400 text-sm mt-6 leading-relaxed">Focused sprint — not a 6-month consulting engagement. You get answers fast.</p>
                    </div>
                    <div className="p-8 md:p-12 bg-[#0A0A0A]">
                        <span className="text-[10px] font-ui text-amber-500 tracking-[0.25em] font-bold">INVESTMENT</span>
                        <div className="flex items-baseline gap-1 mt-4">
                            <span className="text-zinc-500 text-base">$</span>
                            <span className="text-5xl md:text-6xl font-black text-white tracking-tight">4,249</span>
                        </div>
                        <span className="text-zinc-500 text-sm font-ui uppercase tracking-widest">Fixed Price</span>
                        <p className="text-zinc-400 text-sm mt-6 leading-relaxed">No hourly billing, no scope creep. One price covers the entire sprint.</p>
                    </div>
                    <div className="p-8 md:p-12 bg-[#0A0A0A]">
                        <span className="text-[10px] font-ui text-amber-500 tracking-[0.25em] font-bold">TEAM</span>
                        <div className="text-5xl md:text-6xl font-black text-white tracking-tight mt-4">3</div>
                        <span className="text-zinc-500 text-sm font-ui uppercase tracking-widest">Specialists</span>
                        <p className="text-zinc-400 text-sm mt-6 leading-relaxed">AI strategist, ML engineer, and product designer — dedicated to your sprint.</p>
                    </div>
                </div>

                <div className="eng-el mt-16 p-8 md:p-12 bg-[#111] border border-white/10 flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Ready to get clarity on your AI strategy?</h3>
                        <p className="text-zinc-500 text-sm">Share your challenge. We'll come back with a plan — no obligations.</p>
                    </div>
                    <CornerButton to="/#contact" filled className="whitespace-nowrap flex-shrink-0">
                        Start Strategy Sprint <ArrowUpRight size={14} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    </CornerButton>
                </div>
            </div>
        </section>
    );
};

// ── Trust / Testimonial ──
const Trust = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.trust-el', {
                scrollTrigger: { trigger: ref.current, start: 'top 65%' },
                y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="py-24 md:py-40 bg-[#050505] border-y border-white/5 relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="trust-el mb-6"><SectionLabel>Client Story</SectionLabel></div>
                <div className="trust-el mb-12">
                    <span className="text-amber-500 font-ui text-xs tracking-[0.3em]">STRATEGY SPRINT / FINTECH</span>
                </div>
                <blockquote className="trust-el text-2xl md:text-4xl font-bold text-white leading-[1.2] tracking-[-0.01em] mb-12 max-w-4xl">
                    "We spent 6 months going back and forth on our AI roadmap. Corefix gave us a clear, prioritized plan in 4 weeks — and the first system was live within 3 months."
                </blockquote>
                <div className="trust-el flex items-center gap-4 pt-8 border-t border-white/10">
                    <div>
                        <span className="text-white font-bold text-base">Jason W.</span>
                        <span className="text-zinc-600 text-sm ml-3">&mdash; SaaS Founder, Series A</span>
                    </div>
                </div>

                <div className="trust-el grid grid-cols-3 gap-6 mt-16 pt-12 border-t border-white/10">
                    {[
                        { val: '4 weeks', label: 'Strategy to roadmap' },
                        { val: '3 months', label: 'First system live' },
                        { val: '47%', label: 'Cost reduction achieved' },
                    ].map((s, i) => (
                        <div key={i}>
                            <div className="text-2xl md:text-3xl font-black text-white tracking-tight">{s.val}</div>
                            <div className="text-zinc-500 text-[10px] mt-2 font-ui uppercase tracking-[0.2em]">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── Service FAQ ──
const ServiceFAQ = () => {
    const [open, setOpen] = useState(null);
    const faqs = [
        { q: 'What exactly do I get at the end of the sprint?', a: 'A complete strategy package: AI opportunity map, system architecture, implementation roadmap, risk assessment, vendor evaluation, and an executive summary. All actionable — no filler.' },
        { q: 'Do I need technical knowledge to participate?', a: 'Not at all. We translate complex AI concepts into business language. You bring the domain expertise; we handle the technical analysis.' },
        { q: 'What if we decide to build after the strategy sprint?', a: 'Your strategy sprint investment is credited toward any Build & Implementation engagement. The roadmap we create is designed to be executed — by us or your internal team.' },
        { q: 'How is this different from a consulting firm?', a: 'We build AI systems. Our strategies are grounded in engineering reality, not theoretical frameworks. Every recommendation comes with a technical feasibility score and implementation path.' },
        { q: 'Can we start sooner than 4 weeks?', a: 'We typically kick off within 1-2 weeks of agreement. The 4-week timeline is for the sprint itself. Limited spots available each quarter.' },
    ];

    return (
        <section className="py-24 md:py-32 relative overflow-hidden">
            <div className="max-w-[900px] mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="mb-6 flex justify-center"><SectionLabel>Questions</SectionLabel></div>
                    <h2 className="text-3xl md:text-5xl font-display text-white tracking-tight uppercase">Common Questions</h2>
                </div>

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
        <section ref={ref} className="py-32 md:py-48 bg-[#050505] relative overflow-hidden border-t border-white/10">
            <BrightGrid />
            <div className="max-w-[1400px] mx-auto px-6 text-center relative z-10">
                <div className="cta-el mb-6 flex justify-center"><SectionLabel>Next Step</SectionLabel></div>
                <h2 className="cta-el text-5xl md:text-7xl lg:text-8xl font-display text-white tracking-tight leading-[0.85] uppercase mb-8">
                    Stop Guessing.<br />Start Building.
                </h2>
                <p className="cta-el text-zinc-400 text-sm md:text-base max-w-xl mx-auto mb-12">
                    Book a 30-minute call. We'll assess whether a Strategy Sprint is the right fit — and if it's not, we'll tell you.
                </p>
                <div className="cta-el flex flex-col sm:flex-row gap-4 justify-center">
                    <CornerButton to="/#contact" filled>
                        Book Strategy Call <ArrowUpRight size={14} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
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
export default function ServiceStrategy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full min-h-screen font-sans bg-[#0A0A0A] text-white selection:bg-amber-500 selection:text-black relative">
            <ServiceNavbar />
            <ServiceHero />
            <Problem />
            <Framework />
            <Deliverables />
            <Audience />
            <Trust />
            <Engagement />
            <ServiceFAQ />
            <FinalCTA />
            <Footer />
        </div>
    );
}
