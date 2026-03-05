import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Target, Cpu, CheckCircle2, ChevronRight, Sun, Moon, Hexagon, Box } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Theme Context and Background
const BackgroundGeometry = () => {
    const geoRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.geo-shape', {
                y: 'random(-50, 50)',
                x: 'random(-50, 50)',
                rotation: 'random(-30, 30)',
                duration: 'random(10, 20)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: 0.2
            });
        }, geoRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={geoRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Base Grid Pattern */}
            <div className="absolute inset-0 geometric-grid opacity-100 mix-blend-multiply dark:mix-blend-screen"></div>
            {/* Edge Fade Mask */}
            <div className="absolute inset-0 bg-background" style={{ maskImage: 'radial-gradient(circle at center, transparent 30%, black 100%)', WebkitMaskImage: 'radial-gradient(circle at center, transparent 30%, black 100%)' }}></div>

            {/* Floating Geometric Wireframes */}
            <div className="geo-shape absolute top-[15%] left-[8%] opacity-30 dark:opacity-40">
                <Box size={140} className="text-secondary absolute rotate-12" strokeWidth={0.2} />
            </div>
            <div className="geo-shape absolute top-[65%] right-[10%] opacity-20 dark:opacity-30">
                <Hexagon size={180} className="text-accent absolute -rotate-12" strokeWidth={0.3} />
            </div>
            <div className="geo-shape absolute top-[75%] left-[25%] opacity-15 dark:opacity-20 scale-150">
                <Box size={240} className="text-primary absolute rotate-45" strokeWidth={0.1} />
            </div>
            <div className="geo-shape absolute top-[30%] right-[30%] opacity-10 dark:opacity-15">
                <Hexagon size={90} className="text-secondary absolute rotate-90" strokeWidth={0.5} />
            </div>
        </div>
    );
};

// Navbar Component
const Navbar = ({ darkMode, setDarkMode }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-md bg-background/70 border-b border-border' : 'bg-transparent border-b border-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="font-ui font-semibold tracking-wide text-xl text-primary flex items-center gap-2">
                    <Hexagon className="text-accent" size={24} strokeWidth={2.5} /> COREFIX
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-ui text-secondary uppercase tracking-widest">
                    <a href="#features" className="hover:text-primary transition-colors">Services</a>
                    <a href="#philosophy" className="hover:text-primary transition-colors">Philosophy</a>
                    <a href="#protocol" className="hover:text-primary transition-colors">Protocol</a>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 text-secondary hover:text-primary border border-border rounded-full hover:bg-surface transition-all"
                        aria-label="Toggle theme"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button className="px-5 py-2.5 bg-accent text-white dark:text-black font-semibold text-sm rounded hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all">
                        Book a Call
                    </button>
                </div>
            </div>
        </nav>
    );
};

// Hero Component
const Hero = () => {
    const heroRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hero-text', {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'power2.out',
                delay: 0.2
            });
            gsap.to('.hero-orb', {
                rotation: 360,
                duration: 80,
                repeat: -1,
                ease: 'none'
            });
        }, heroRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={heroRef} className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden">
            {/* Background abstract shape */}
            <div className="hero-orb absolute w-[800px] h-[800px] rounded-full border border-primary/10 opacity-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-multiply dark:mix-blend-screen scale-150">
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-accent/10 to-transparent blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] flex flex-col items-center gap-2">
                    <span className="hero-text text-primary">Automate the</span>
                    <span className="hero-text text-secondary font-medium italic">Workflow.</span>
                </h1>
                <p className="hero-text mt-8 max-w-2xl mx-auto text-secondary text-lg md:text-xl text-balance">
                    We build systems that are dependable, scalable, and built to ship. No theatrics. No experiments. Just practical strategy.
                </p>
                <div className="hero-text mt-12 flex items-center justify-center gap-4">
                    <button className="px-8 py-4 bg-primary text-background font-semibold rounded hover:bg-primary/90 hover:scale-[1.02] transition-all">
                        Book a Call
                    </button>
                    <button className="px-8 py-4 border border-border text-primary font-medium rounded hover:bg-surface hover:border-border/80 transition-all flex items-center gap-2 bg-background/50 backdrop-blur-sm">
                        Explore Protocol <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
};

// Features Component
const Features = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.feature-card', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="features" ref={sectionRef} className="py-32 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16">
                    <h2 className="text-sm font-ui uppercase tracking-widest text-secondary mb-4">Core Capabilities</h2>
                    <p className="text-3xl md:text-5xl font-bold text-primary tracking-tight">The Grid.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "AI Strategy", desc: "Aligning artificial intelligence with genuine business objectives.", icon: Target },
                        { title: "Workflow Automation", desc: "Replacing manual repetition with deterministic, scalable pipelines.", icon: Zap },
                        { title: "Custom Agents", desc: "Deploying intelligent autonomous nodes tailored to your data.", icon: Cpu }
                    ].map((item, i) => (
                        <div key={i} className="feature-card group relative p-8 bg-surface rounded-2xl border border-border hover:border-accent transition-colors duration-500 overflow-hidden shadow-sm dark:shadow-none">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[100px] transition-all duration-500 group-hover:bg-accent/10"></div>
                            <div className="mb-8">
                                <item.icon className="w-8 h-8 text-secondary group-hover:text-accent transition-colors duration-300 stroke-[1.5]" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                            <p className="text-secondary text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Philosophy Component
const Philosophy = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.phi-text-1', {
                scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
                opacity: 0, y: 20, duration: 1, ease: 'power2.out'
            });
            gsap.from('.phi-text-2', {
                scrollTrigger: { trigger: sectionRef.current, start: 'top 50%' },
                opacity: 0, y: 30, duration: 1, delay: 0.2, ease: 'power2.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="philosophy" ref={sectionRef} className="py-40 relative border-y border-border backdrop-blur-sm bg-background/50">
            <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
                <p className="phi-text-1 text-secondary text-xl md:text-2xl font-medium tracking-tight mb-6">
                    Most consultants sell tools.
                </p>
                <p className="phi-text-2 text-primary text-4xl md:text-7xl font-bold tracking-tighter">
                    We build <span className="text-accent italic font-medium">systems.</span>
                </p>
            </div>
        </section>
    );
};

// Protocol Component
const Protocol = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.protocol-card');

            cards.forEach((card, i) => {
                if (i === cards.length - 1) return;

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top top',
                    pin: true,
                    pinSpacing: false,
                    end: `max`,
                    animation: gsap.to(card, {
                        scale: 0.9,
                        opacity: 0.3,
                        filter: 'blur(10px)',
                        ease: 'none'
                    }),
                    scrub: true
                });
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const steps = [
        { num: '01', title: 'Diagnose', desc: 'We audit your current architecture to identify points of friction and revenue leakage.' },
        { num: '02', title: 'Engineer', desc: 'We systematically build the automation stack, deploying deterministic algorithms alongside LLMs.' },
        { num: '03', title: 'Scale', desc: 'Post-deployment telemetry ensures the system adapts continuously as your throughput increases.' }
    ];

    return (
        <section id="protocol" ref={sectionRef} className="relative bg-background">
            <div className="h-screen w-full flex items-center justify-center pointer-events-none sticky top-0 z-0">
                <div className="text-center opacity-[0.03] dark:opacity-10 font-bold text-[10vw] tracking-tighter text-primary">PROTOCOL</div>
            </div>

            <div className="relative z-10">
                {steps.map((step, i) => (
                    <div key={i} className="protocol-card h-screen w-full flex items-center justify-center relative bg-background border-t border-border">
                        <div className="max-w-4xl mx-auto px-6 w-full flex flex-col md:flex-row items-start md:items-center gap-12">
                            <div className="font-ui font-light text-9xl text-border dark:text-border tracking-tighter select-none drop-shadow-sm">
                                {step.num}
                            </div>
                            <div>
                                <h3 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">{step.title}</h3>
                                <p className="text-secondary text-lg md:text-xl max-w-lg leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                        {/* Ambient indicator */}
                        <div className="absolute top-1/2 -translate-y-1/2 right-12 w-1 h-32 bg-border rounded-full hidden md:block overflow-hidden">
                            <div className="w-full h-1/2 bg-accent absolute top-0 rounded-full animate-[pulse_3s_ease-in-out_infinite]" style={{ animationDelay: `${i}s` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// CTA / Get Started
const CTA = () => {
    return (
        <section className="py-40 bg-surface relative overflow-hidden flex flex-col justify-center items-center text-center backdrop-blur-md border-t border-border">
            <div className="absolute inset-0 max-w-4xl mx-auto bg-accent/5 blur-[120px] rounded-full"></div>
            <div className="relative z-10 px-6 max-w-3xl">
                <h2 className="text-4xl md:text-6xl font-bold text-primary mb-8 tracking-tighter">Ready to Deploy?</h2>
                <p className="text-secondary text-lg mb-12 text-balance leading-relaxed">
                    From architecture to deployment, we focus on genuine transformation. Gain unprecedented operational leverage today.
                </p>
                <button className="px-10 py-5 bg-accent text-white dark:text-black font-semibold text-lg rounded-xl hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] dark:hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-300">
                    Book a Call
                </button>
            </div>
        </section>
    );
};

// Footer Component
const Footer = () => {
    return (
        <footer className="bg-footer relative z-10 pt-24 pb-12 px-6 border-t border-border rounded-t-2xl md:rounded-t-[3rem]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
                <div>
                    <h4 className="font-ui font-semibold tracking-widest text-primary text-xl flex items-center gap-2 mb-4">
                        <Hexagon className="text-accent" size={20} strokeWidth={2.5} /> COREFIX
                    </h4>
                    <p className="text-secondary max-w-xs text-sm">Industrial grade automation for ambitious organizations.</p>
                </div>
                <div className="flex gap-16 md:gap-32">
                    <div className="flex flex-col gap-4">
                        <span className="text-primary text-sm font-semibold mb-2 uppercase tracking-widest">Navigation</span>
                        <a href="#features" className="text-secondary text-sm hover:text-primary transition-colors">Services</a>
                        <a href="#philosophy" className="text-secondary text-sm hover:text-primary transition-colors">Philosophy</a>
                        <a href="#protocol" className="text-secondary text-sm hover:text-primary transition-colors">Protocol</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-primary text-sm font-semibold mb-2 uppercase tracking-widest">Legal</span>
                        <a href="#" className="text-secondary text-sm hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="text-secondary text-sm hover:text-primary transition-colors">Terms</a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite]"></div>
                    <span className="font-ui text-xs text-secondary tracking-widest uppercase">System Operational</span>
                </div>
                <p className="text-secondary text-xs">© {new Date().getFullYear()} Corefix AI. All parameters nominal.</p>
            </div>
        </footer>
    );
};

// Main App Container
function App() {
    const [darkMode, setDarkMode] = useState(true); // Default to true for the dark aesthetic

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className="w-full min-h-screen font-sans selection:bg-accent selection:text-white dark:selection:text-black transition-colors duration-500 relative">
            <BackgroundGeometry />
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <Hero />
            <Features />
            <Philosophy />
            <Protocol />
            <CTA />
            <Footer />
        </div>
    );
}

export default App;
