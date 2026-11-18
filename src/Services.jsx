import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import {
    ServiceNavbar,
    Footer,
    SectionGrid,
    BrightGrid,
    SectionLabel,
    CornerButton,
    FIXED_PRICE_POINTS,
} from './shared.jsx';
import SeoHead from './SeoHead.jsx';
import { CAL_URL, SERVICES, BUILDS } from './seo.js';

gsap.registerPlugin(ScrollTrigger);

// Reveal helper: always fromTo with an explicit end state, and never on an element
// that also carries a CSS transition on opacity/transform (see Team fix in App.jsx).
function useReveal(ref, selector, start = 'top 75%') {
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(selector, { y: 40, opacity: 0 }, {
                scrollTrigger: { trigger: ref.current, start },
                y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out',
            });
        }, ref);
        return () => ctx.revert();
    }, [ref, selector, start]);
}

function Hero() {
    return (
        <section className="relative pt-40 md:pt-48 pb-16 md:pb-24 overflow-hidden">
            <BrightGrid />
            <div className="relative z-10 max-w-[1400px] mx-auto px-6">
                <div className="mb-8"><SectionLabel>Services</SectionLabel></div>
                <h1 className="font-display leading-[0.9] tracking-[0.01em] uppercase text-white text-[16vw] md:text-[10vw] lg:text-[8vw]">
                    What we build.
                </h1>
                <p className="mt-8 max-w-xl text-zinc-200 text-sm md:text-base leading-relaxed">
                    Fixed-price AI systems, scoped after a short call. Here&apos;s what&apos;s running in real businesses today.
                </p>
            </div>
        </section>
    );
}

function ServiceLines() {
    const ref = useRef(null);
    useReveal(ref, '.sl-card');
    return (
        <section ref={ref} className="pb-24 md:pb-32">
            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {SERVICES.map((svc) => {
                    const inner = (
                        <div className="flex items-start gap-6 h-full">
                            <span className="text-[10px] font-ui font-bold uppercase tracking-[0.25em] text-amber-500 mt-1.5">{svc.num}</span>
                            <div className="flex-1">
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-3">{svc.title}</h2>
                                <p className="text-zinc-300 text-sm leading-relaxed">{svc.desc}</p>
                            </div>
                            {svc.link && <ArrowUpRight size={20} className="text-zinc-400 group-hover:text-amber-500 transition-colors shrink-0" />}
                        </div>
                    );
                    const cls = 'group block h-full p-8 md:p-10 bg-[#0A0A0A] border border-white/50 hover:border-amber-500 hover:bg-[#111] transition-colors';
                    return (
                        <div key={svc.num} className="sl-card">
                            {svc.link ? <Link to={svc.link} className={cls}>{inner}</Link> : <div className={cls}>{inner}</div>}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function Builds() {
    const ref = useRef(null);
    useReveal(ref, '.build-card', 'top 70%');
    return (
        <section id="built" ref={ref} className="py-24 md:py-32 border-y border-white/15 relative overflow-hidden">
            <SectionGrid />
            <div className="relative z-10 max-w-[1400px] mx-auto px-6">
                <div className="mb-8"><SectionLabel>What We&apos;ve Built</SectionLabel></div>
                <div className="grid md:grid-cols-2 gap-8 mb-12 md:mb-16 items-end">
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05]">
                        Running in production. <span className="text-zinc-400">Not slideware.</span>
                    </h2>
                    <p className="text-zinc-300 text-sm md:text-base max-w-md">
                        Client work runs under NDA, so we name the industry, not the business.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {BUILDS.map((b) => (
                        <div key={b.title} className="build-card">
                            <div className="h-full flex flex-col p-8 bg-[#0A0A0A] border border-white/25 hover:border-amber-500 transition-colors">
                                <span className="text-[10px] font-ui font-bold uppercase tracking-[0.22em] text-amber-500">{b.industry}</span>
                                <h3 className="text-xl font-bold text-white mt-4 mb-3">{b.title}</h3>
                                <p className="text-zinc-300 text-sm leading-relaxed flex-1">{b.desc}</p>
                                {(b.stack.length > 0 || b.link) && (
                                    <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center gap-2">
                                        {b.stack.map((t) => (
                                            <span key={t} className="px-2.5 py-1 border border-white/20 text-zinc-300 text-[10px] font-ui uppercase tracking-[0.15em]">{t}</span>
                                        ))}
                                        {b.link && (
                                            <Link to={b.link} className="ml-auto inline-flex items-center gap-1 min-h-[44px] text-amber-500 hover:text-white text-[10px] font-ui font-bold uppercase tracking-[0.2em] transition-colors">
                                                Try it <ChevronRight size={12} />
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowWePrice() {
    const ref = useRef(null);
    useReveal(ref, '.price-pt');
    return (
        <section ref={ref} className="py-24 md:py-32">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="mb-8"><SectionLabel>How We Price</SectionLabel></div>
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-12 md:mb-16 max-w-3xl">
                    Simple, fixed-price engagements.
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {FIXED_PRICE_POINTS.map((pt, i) => (
                        <div key={pt.title} className="price-pt p-8 bg-[#0A0A0A] border border-white/25">
                            <span className="text-[10px] font-ui font-bold uppercase tracking-[0.25em] text-amber-500">{String(i + 1).padStart(2, '0')}</span>
                            <h3 className="text-xl font-bold text-white mt-4 mb-2">{pt.title}</h3>
                            <p className="text-zinc-300 text-sm leading-relaxed">{pt.desc}</p>
                        </div>
                    ))}
                </div>
                <CornerButton href={CAL_URL} filled>
                    Book a call <ArrowUpRight size={14} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </CornerButton>
            </div>
        </section>
    );
}

export default function ServicesPage() {
    return (
        <div className="w-full min-h-screen font-sans bg-[#0A0A0A] text-white selection:bg-amber-500 selection:text-black relative">
            <SeoHead path="/services" />
            <ServiceNavbar />
            <main>
                <Hero />
                <ServiceLines />
                <Builds />
                <HowWePrice />
            </main>
            <Footer />
        </div>
    );
}
