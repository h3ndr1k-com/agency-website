import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, ChevronDown, ArrowUpRight, Mail, Phone, MapPin, Hexagon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <a href="#" className="font-ui font-bold tracking-widest text-white text-lg flex items-center gap-2">
                    <Hexagon className="text-amber-500" size={22} strokeWidth={2.5} />
                    COREFIX
                </a>
                <div className="hidden md:flex items-center gap-10 text-[13px] font-ui text-zinc-400 uppercase tracking-[0.15em]">
                    <a href="#services" className="hover:text-white transition-colors">Services</a>
                    <a href="#process" className="hover:text-white transition-colors">Process</a>
                    <a href="#works" className="hover:text-white transition-colors">Work</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    <a href="#contact" className="hover:text-white transition-colors">Contact</a>
                </div>
                <a href="#contact" className="hidden md:inline-flex px-6 py-2.5 bg-white text-black font-semibold text-sm rounded hover:bg-zinc-200 transition-colors">
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
                    {['Services', 'Process', 'Work', 'Pricing', 'Contact'].map(item => (
                        <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-zinc-300 text-lg font-ui uppercase tracking-widest hover:text-white">{item}</a>
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
            gsap.from('.hero-el', { y: 50, opacity: 0, duration: 1, stagger: 0.12, ease: 'power2.out', delay: 0.3 });
        }, ref);
        return () => ctx.revert();
    }, []);

    const tags = ['AI Strategy', 'Process Automation', 'Custom Agents', 'Data Intelligence'];

    return (
        <section ref={ref} className="relative min-h-screen flex flex-col justify-end pb-20 md:pb-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/30 z-10" />
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
                <h1 className="hero-el text-5xl sm:text-7xl md:text-[6rem] lg:text-[7.5rem] font-bold leading-[0.9] tracking-tighter text-white uppercase">
                    We Build<br />AI Systems<br />
                    <span className="text-zinc-500">For Businesses</span>
                </h1>
                <p className="hero-el mt-8 max-w-xl text-zinc-400 text-base md:text-lg leading-relaxed">
                    Build real, production-ready AI systems that automate work, improve performance, and deliver measurable business results.
                </p>
                <div className="hero-el mt-8 flex flex-wrap gap-3">
                    {tags.map(tag => (
                        <span key={tag} className="px-4 py-2 text-xs font-ui uppercase tracking-widest text-zinc-300 border border-zinc-700 rounded-full bg-white/5">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="hero-el mt-10 flex items-center gap-4">
                    <a href="#process" className="inline-flex items-center gap-2 px-7 py-4 bg-white text-black font-semibold text-sm rounded hover:bg-zinc-200 transition-colors">
                        How It Works <ChevronRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    );
};

// ── Logo Marquee ──
const LogoMarquee = () => {
    const partners = ['Acme Corp', 'TechFlow', 'Nexus AI', 'DataSync', 'CloudWave'];
    return (
        <section className="py-12 border-y border-white/5 overflow-hidden">
            <p className="text-center text-xs font-ui uppercase tracking-[0.2em] text-zinc-600 mb-8">Our Trusted Partners</p>
            <div className="relative">
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...partners, ...partners, ...partners].map((name, i) => (
                        <div key={i} className="mx-12 flex-shrink-0 text-zinc-600 font-ui font-bold text-xl tracking-widest uppercase opacity-40 hover:opacity-70 transition-opacity">
                            {name}
                        </div>
                    ))}
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
                y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    const services = [
        { title: 'AI Strategy & Advisory', desc: 'Clear, execution-ready AI plans aligned with business goals.' },
        { title: 'Custom AI Agents', desc: 'Tailored agents designed to handle real operational tasks.' },
        { title: 'Workflow Automation', desc: 'Automations that connect tools, data, and teams seamlessly.' },
        { title: 'AI Product Development', desc: 'Scalable AI-powered features, tools, and internal systems.' },
    ];

    return (
        <section id="services" ref={ref} className="py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-xs font-ui uppercase tracking-[0.2em] text-zinc-500 mb-4">Our Services</p>
                <h2 className="svc-card text-2xl md:text-4xl font-bold text-white tracking-tight max-w-3xl leading-snug mb-6">
                    End-to-end partnership from strategy to deployment — so AI actually ships, works, and delivers.
                </h2>
                <p className="svc-card text-zinc-500 mb-16 max-w-xl">End-to-end services covering strategy, build, and deployment.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((svc, i) => (
                        <div key={i} className="svc-card group p-8 bg-[#111] border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors">
                            <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-amber-500 transition-colors">{svc.title}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{svc.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-8 bg-[#111] border border-zinc-800 rounded-xl">
                    <p className="text-zinc-400 text-sm mb-6">Start with a conversation. Tell us about your business, your goals, and the problems you want solved.</p>
                    <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold text-sm rounded hover:bg-zinc-200 transition-colors">
                        Talk To Us <ArrowUpRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    );
};

// ── Capabilities ──
const Capabilities = () => {
    const ref = useRef(null);
    const capabilities = [
        'Conversational AI & Chatbots', 'Customer Support Automation', 'Voice & Call Agents',
        'Internal Ops & Admin Automation', 'Document & Data Intelligence', 'API & Tool Integrations',
        'Sales & Lead Qualification Agents', 'Fine-tuned LLM Systems'
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.cap-item', {
                scrollTrigger: { trigger: ref.current, start: 'top 70%' },
                x: -30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#0A0A0A]" />
            <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <p className="text-xs font-ui uppercase tracking-[0.2em] text-zinc-500 mb-4">AI Capabilities</p>
                    <div className="space-y-4">
                        {capabilities.map((cap, i) => (
                            <div key={i} className="cap-item flex items-center gap-4 group cursor-default">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-150 transition-transform" />
                                <span className="text-zinc-300 text-sm md:text-base group-hover:text-white transition-colors">{cap}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
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
                scrollTrigger: { trigger: ref.current, start: 'top 60%' },
                y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out'
            });
            gsap.to(marqueeRef.current, {
                xPercent: -50,
                duration: 20,
                repeat: -1,
                ease: 'none'
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
        <section id="process" ref={ref} className="py-24 md:py-32 overflow-hidden">
            <div className="mb-16 overflow-hidden">
                <div ref={marqueeRef} className="flex whitespace-nowrap">
                    {Array(6).fill(null).map((_, i) => (
                        <span key={i} className="text-[8rem] md:text-[12rem] font-bold uppercase tracking-tighter text-white/[0.03] mx-4 select-none">
                            OUR PROCESS
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {steps.map((step, i) => (
                    <div key={i} className="proc-step p-8 bg-[#111] border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors group">
                        <span className="text-xs font-ui uppercase tracking-[0.2em] text-amber-500 mb-4 block">{step.num}</span>
                        <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 text-center">
                <a href="#pricing" className="inline-flex items-center gap-2 px-7 py-4 bg-white text-black font-semibold text-sm rounded hover:bg-zinc-200 transition-colors">
                    Start Your AI Journey <ChevronRight size={16} />
                </a>
            </div>
        </section>
    );
};

// ── Works / Case Studies ──
const Works = () => {
    const scrollRef = useRef(null);
    const projects = [
        { name: 'SyncOr', year: '2025', tag: 'AI Automation', desc: 'End-to-end workflow automation for a logistics startup — cutting manual processing by 80%.', color: 'from-blue-900/40', img: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&q=80' },
        { name: 'MediSync', year: '2024', tag: 'Healthcare AI', desc: 'AI-powered patient triage system reducing wait times and improving diagnostic accuracy.', color: 'from-green-900/40', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80' },
        { name: 'Verdant', year: '2024', tag: 'Data Intelligence', desc: 'Built a predictive analytics engine for sustainable agriculture decisions.', color: 'from-emerald-900/40', img: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&q=80' },
        { name: 'GridCore', year: '2025', tag: 'Custom Agents', desc: 'Multi-agent system for real-time energy grid optimization and anomaly detection.', color: 'from-purple-900/40', img: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&q=80' },
        { name: 'AeroLytic', year: '2025', tag: 'Process Automation', desc: 'Automated document processing pipeline handling 10,000+ invoices monthly.', color: 'from-teal-900/40', img: 'https://images.unsplash.com/photo-1604076913837-52ab5f7c1ac4?w=600&q=80' },
        { name: 'NovaPay', year: '2025', tag: 'Fintech AI', desc: 'AI fraud detection and risk scoring system for a digital payments platform.', color: 'from-orange-900/40', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80' },
    ];

    const scroll = (dir) => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 380, behavior: 'smooth' });
    };

    return (
        <section id="works" className="py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
                <div>
                    <p className="text-xs font-ui uppercase tracking-[0.2em] text-zinc-500 mb-4">Case Studies</p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        Work That Speaks<br />in Results, Not Claims
                    </h2>
                </div>
                <div className="hidden md:flex gap-3">
                    <button onClick={() => scroll(-1)} className="w-12 h-12 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">&larr;</button>
                    <button onClick={() => scroll(1)} className="w-12 h-12 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">&rarr;</button>
                </div>
            </div>

            <div ref={scrollRef} className="flex gap-6 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                {projects.map((proj, i) => (
                    <div key={i} className="flex-shrink-0 w-[320px] md:w-[360px] snap-start group cursor-pointer">
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                            <img src={proj.img} alt={proj.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className={`absolute inset-0 bg-gradient-to-t ${proj.color} to-transparent`} />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 text-[10px] font-ui uppercase tracking-widest bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/10">
                                    {proj.tag}
                                </span>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <p className="text-zinc-300 text-xs leading-relaxed">{proj.desc}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-semibold uppercase tracking-wider text-sm">{proj.name}</h3>
                            <span className="text-zinc-600 text-xs">{proj.year}</span>
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
        <section ref={ref} className="py-24 md:py-32 bg-[#111] border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-xs font-ui uppercase tracking-[0.2em] text-amber-500 mb-4">Case Study</p>
                        <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
                            We helped a fintech startup rebuild their digital experience and modernize their product storytelling.
                        </h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-8 italic border-l-2 border-amber-500 pl-4">
                            "Partnering on this redesign changed how people experience our platform. Our engagement numbers skyrocketed."
                        </p>
                        <div className="flex gap-8 md:gap-12">
                            {stats.map((stat, i) => (
                                <div key={i}>
                                    <div className="text-3xl md:text-4xl font-bold text-white"><CountUp target={stat.value} /></div>
                                    <div className="text-zinc-500 text-xs mt-1 font-ui uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
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
        const timer = setInterval(() => setActive(prev => (prev + 1) % testimonials.length), 5000);
        return () => clearInterval(timer);
    }, []);

    const t = testimonials[active];

    return (
        <section className="py-24 md:py-32">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex gap-4 mb-12">
                    {testimonials.map((_, i) => (
                        <button key={i} onClick={() => setActive(i)}
                            className={`w-12 h-1 rounded-full transition-colors ${i === active ? 'bg-amber-500' : 'bg-zinc-800'}`} />
                    ))}
                </div>

                <div className="min-h-[280px]">
                    <span className="text-amber-500 font-ui text-sm tracking-widest mb-4 block">{t.num}</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">{t.title}</h3>
                    <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-2xl">{t.quote}</p>
                    <div>
                        <span className="text-white font-semibold">{t.name}</span>
                        <span className="text-zinc-600 ml-2">— {t.role}</span>
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
                y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section id="pricing" ref={ref} className="py-24 md:py-32">
            <div className="max-w-5xl mx-auto px-6">
                <p className="text-xs font-ui uppercase tracking-[0.2em] text-zinc-500 mb-4">Pricing</p>
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">Flexible Pricing for Different Growth Stages</h2>
                <p className="text-zinc-500 mb-10">Choose a model that fits your team and complexity.</p>

                <div className="flex items-center gap-4 mb-12">
                    <span className={`text-sm ${!yearly ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
                    <button onClick={() => setYearly(!yearly)} className="relative w-14 h-7 bg-zinc-800 rounded-full border border-zinc-700">
                        <div className={`absolute top-0.5 w-6 h-6 bg-amber-500 rounded-full transition-transform ${yearly ? 'translate-x-7' : 'translate-x-0.5'}`} />
                    </button>
                    <span className={`text-sm ${yearly ? 'text-white' : 'text-zinc-500'}`}>Yearly</span>
                    {yearly && <span className="text-xs text-amber-500 font-semibold">15% off</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="price-card p-8 bg-[#111] border border-zinc-800 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-2">Strategy Sprint</h3>
                        <p className="text-zinc-500 text-sm mb-6">For teams taking AI seriously — and ready to implement something real.</p>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-zinc-500 text-sm">$</span>
                            <span className="text-4xl font-bold text-white">{yearly ? '3,612' : '4,249'}</span>
                            <span className="text-zinc-500 text-sm">USD / Project</span>
                        </div>
                        <a href="#contact" className="block text-center px-6 py-3 border border-zinc-700 text-white font-semibold text-sm rounded hover:bg-white/5 transition-colors mb-8">
                            Get Started
                        </a>
                        <ul className="space-y-3">
                            {['Brand & workflow discovery', 'Strategic AI use-case definition', 'Technical feasibility assessment', 'System architecture planning', 'Clear roadmap & execution blueprint'].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm">
                                    <div className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="price-card p-8 bg-white text-black rounded-xl relative overflow-hidden">
                        <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full uppercase">Popular</div>
                        <h3 className="text-lg font-semibold mb-2">Build & Implementation</h3>
                        <p className="text-zinc-600 text-sm mb-6">For companies moving from strategy to working AI systems.</p>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-zinc-500 text-sm">$</span>
                            <span className="text-4xl font-bold">{yearly ? '15,894' : '18,699'}</span>
                            <span className="text-zinc-500 text-sm">USD / Project</span>
                        </div>
                        <a href="#contact" className="block text-center px-6 py-3 bg-black text-white font-semibold text-sm rounded hover:bg-zinc-800 transition-colors mb-8">
                            Reach Us
                        </a>
                        <ul className="space-y-3">
                            {['Full AI system design', 'Development & engineering', 'Workflow & data integration', 'Testing, deployment & optimization', 'Performance measurement', 'Guaranteed, production-ready delivery'].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-600 text-sm">
                                    <div className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
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
                y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="py-24 md:py-40 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <p className="why-el text-xs font-ui uppercase tracking-[0.2em] text-zinc-500 mb-4">Why Us</p>
                    <h2 className="why-el text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-[0.95]">
                        We build systems that are dependable, scalable, and built to ship.
                    </h2>
                    <p className="why-el text-zinc-400 text-sm leading-relaxed mb-10 max-w-lg">
                        From architecture to deployment, we focus on building AI solutions that are dependable, scalable, and genuinely transformative — not experimental toys.
                    </p>
                    <div className="why-el flex flex-wrap gap-3">
                        {attributes.map(attr => (
                            <span key={attr} className="px-5 py-2 text-xs font-ui uppercase tracking-widest text-zinc-300 border border-zinc-700 rounded-full">
                                {attr}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="relative">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1532236204992-f5e85c024202?w=800&q=80" alt="" className="w-full h-full object-cover opacity-70" />
                    </div>
                    <div className="absolute -bottom-8 -left-8 text-[8rem] md:text-[10rem] font-bold text-white/[0.03] leading-none tracking-tighter select-none uppercase">
                        Why<br />Us?
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
                y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    const members = [
        { name: 'Your Name', role: 'Founder & CEO', quote: '"Building AI systems that actually ship and deliver results."', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
        { name: 'Alex Chen', role: 'Lead ML Engineer', quote: '"If it can be automated, it should be automated."', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' },
        { name: 'Sarah Kim', role: 'AI Product Designer', quote: '"Great AI feels invisible — it just works."', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
        { name: 'Marcus Webb', role: 'Solutions Architect', quote: '"The best system is one the team actually adopts."', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
    ];

    return (
        <section id="team" ref={ref} className="py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-xs font-ui uppercase tracking-[0.2em] text-zinc-500 mb-4">Meet The Team</p>
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-16 max-w-3xl leading-snug">
                    Builders, Engineers, and Problem-Solvers First
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {members.map((m, i) => (
                        <div key={i} className="team-card group">
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                                <img src={m.img} alt={m.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-zinc-400 text-xs italic leading-relaxed">{m.quote}</p>
                                </div>
                            </div>
                            <h3 className="text-white font-semibold text-sm">{m.name}</h3>
                            <p className="text-zinc-500 text-xs font-ui uppercase tracking-wider mt-1">{m.role}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 text-white font-semibold text-sm rounded hover:bg-white/5 transition-colors">
                        About Us <ArrowUpRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    );
};

// ── Articles ──
const Articles = () => {
    const ref = useRef(null);
    const articles = [
        { title: 'Why Your Knowledge Base is Your Competitive Advantage', desc: 'Learn how to solve the "messy data" problem and build a centralized AI knowledge system.', date: 'Jan 2026', read: '4 min', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80' },
        { title: 'Building Trust in an Automated World', desc: 'Navigate the ethical landscape of AI — from data privacy to bias mitigation.', date: 'Dec 2025', read: '10 min', img: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&q=80' },
        { title: 'Using AI Simulation to De-Risk Your Strategy', desc: 'How AI digital twins and predictive simulation help business leaders plan ahead.', date: 'Dec 2025', read: '8 min', img: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&q=80' },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.article-card', {
                scrollTrigger: { trigger: ref.current, start: 'top 70%' },
                y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-xs font-ui uppercase tracking-[0.2em] text-zinc-500 mb-4">Articles</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {articles.map((a, i) => (
                        <a key={i} href="#" className="article-card group block">
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                                <img src={a.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-white font-semibold text-sm leading-snug mb-2">{a.title}</h3>
                                    <p className="text-zinc-400 text-xs leading-relaxed">{a.desc}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-600 text-xs font-ui">
                                <span>{a.date}</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                <span>{a.read} read</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── FAQ ──
const FAQ = () => {
    const [open, setOpen] = useState(null);
    const faqs = [
        { q: 'Do you build real AI systems or just proofs of concept?', a: 'We build production-ready systems. Every project is designed to ship, integrate with your workflows, and deliver measurable business outcomes from day one.' },
        { q: 'What types of companies do you typically work with?', a: 'We work with startups, scale-ups, and established businesses across SaaS, fintech, healthcare, and e-commerce that are ready to implement AI strategically.' },
        { q: "What's your usual engagement timeline?", a: 'Strategy sprints take 2-4 weeks. Full build and implementation projects typically run 8-16 weeks depending on complexity.' },
        { q: 'Do you handle everything end-to-end?', a: 'Yes. From initial strategy and system design through development, testing, deployment, and ongoing optimization.' },
        { q: 'Can you work with our internal team?', a: 'Absolutely. We integrate seamlessly with your existing engineering and product teams, providing expertise where you need it most.' },
        { q: "What if we're not sure what to build yet?", a: "That's exactly what our Strategy Sprint is for. We help you identify the highest-impact AI opportunities and build a clear execution roadmap." },
    ];

    return (
        <section className="py-24 md:py-32 bg-[#111] border-y border-white/5">
            <div className="max-w-3xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">Everything You Need to Know Before We Build</h2>
                <p className="text-zinc-500 text-sm mb-12">We don't sell AI concepts or recycled demos. We design and deploy production-ready AI systems grounded in your workflows, your data, and measurable business outcomes.</p>

                <div className="space-y-2">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border border-zinc-800 rounded-xl overflow-hidden">
                            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors">
                                <span className="text-white text-sm font-medium pr-4">{faq.q}</span>
                                <ChevronDown size={18} className={`text-zinc-500 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                                <p className="px-6 text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        </div>
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
                y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out'
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section id="contact" ref={ref} className="py-24 md:py-32">
            <div className="max-w-3xl mx-auto px-6">
                <p className="contact-el text-xs font-ui uppercase tracking-[0.2em] text-zinc-500 mb-4">Talk To Us</p>
                <h2 className="contact-el text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Tell Us What You Want AI to Fix</h2>
                <p className="contact-el text-zinc-500 text-sm mb-12">Share a bit about your business and we'll come back with a clear, no-fluff plan of attack.</p>

                <form className="contact-el space-y-6" onSubmit={e => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" placeholder="Name" className="w-full px-4 py-3 bg-[#111] border border-zinc-800 rounded-lg text-white text-sm placeholder-zinc-600 focus:border-zinc-600 focus:outline-none transition-colors" />
                        <input type="email" placeholder="Work Email" className="w-full px-4 py-3 bg-[#111] border border-zinc-800 rounded-lg text-white text-sm placeholder-zinc-600 focus:border-zinc-600 focus:outline-none transition-colors" />
                    </div>
                    <input type="text" placeholder="Company" className="w-full px-4 py-3 bg-[#111] border border-zinc-800 rounded-lg text-white text-sm placeholder-zinc-600 focus:border-zinc-600 focus:outline-none transition-colors" />
                    <textarea placeholder="What do you want to discuss?" rows={5} className="w-full px-4 py-3 bg-[#111] border border-zinc-800 rounded-lg text-white text-sm placeholder-zinc-600 focus:border-zinc-600 focus:outline-none transition-colors resize-none" />
                    <button type="submit" className="px-8 py-4 bg-white text-black font-semibold text-sm rounded hover:bg-zinc-200 transition-colors">
                        Submit
                    </button>
                </form>
            </div>
        </section>
    );
};

// ── Footer ──
const Footer = () => (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10 px-6 rounded-t-[2rem] md:rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
                <div className="max-w-sm">
                    <h4 className="font-ui font-bold tracking-widest text-white text-lg flex items-center gap-2 mb-4">
                        <Hexagon className="text-amber-500" size={20} strokeWidth={2.5} /> COREFIX
                    </h4>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                        We design, build, and deploy reliable AI systems and automation workflows.
                    </p>
                    <div className="space-y-2">
                        <a href="mailto:hello@corefix.ai" className="flex items-center gap-2 text-zinc-400 text-sm hover:text-white transition-colors">
                            <Mail size={14} /> hello@corefix.ai
                        </a>
                    </div>
                </div>

                <div className="flex gap-16 md:gap-24">
                    <div className="flex flex-col gap-3">
                        <span className="text-zinc-500 text-xs font-ui uppercase tracking-widest mb-2">Navigation</span>
                        {['Home', 'Services', 'Process', 'Work', 'Pricing'].map(link => (
                            <a key={link} href={`#${link.toLowerCase()}`} className="text-zinc-400 text-sm hover:text-white transition-colors">{link}</a>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="text-zinc-500 text-xs font-ui uppercase tracking-widest mb-2">Social</span>
                        {['LinkedIn', 'X / Twitter', 'Instagram'].map(link => (
                            <a key={link} href="#" className="text-zinc-400 text-sm hover:text-white transition-colors">{link}</a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-ui text-xs text-zinc-600 tracking-widest uppercase">System Operational</span>
                </div>
                <p className="text-zinc-600 text-xs">&copy; {new Date().getFullYear()} Corefix AI. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="text-zinc-600 text-xs hover:text-zinc-400 transition-colors">Terms</a>
                    <a href="#" className="text-zinc-600 text-xs hover:text-zinc-400 transition-colors">Privacy</a>
                </div>
            </div>
        </div>
    </footer>
);

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
