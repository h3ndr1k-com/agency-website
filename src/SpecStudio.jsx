import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import Flagship from './Flagship.jsx';
import SeoHead from './SeoHead.jsx';
import {
    ServiceNavbar,
    Footer,
    BrightGrid,
    SectionGrid,
    SectionLabel,
    CornerButton,
} from './shared.jsx';
import { CAL_URL, SPEC_FAQS } from './seo.js';

gsap.registerPlugin(ScrollTrigger);

const FOOTER_LINKS = [
    ['Home', '/'],
    ['Spec Studio', '/spec-studio'],
    ['Voice Demo', '/#voice-demo'],
    ['Pricing', '/#audit'],
    ['Contact', '/#contact'],
];

function SpecHero() {
    return (
        <section className="relative min-h-[70vh] flex flex-col justify-end pb-16 md:pb-24 overflow-hidden pt-32">
            <picture className="absolute inset-0 z-0">
                <source
                    type="image/webp"
                    srcSet="/img/spec-studio-hero-800.webp 800w, /img/spec-studio-hero-1200.webp 1200w"
                    sizes="100vw"
                />
                <img
                    src="/img/spec-studio-hero-1200.jpg"
                    srcSet="/img/spec-studio-hero-800.jpg 800w, /img/spec-studio-hero-1200.jpg 1200w"
                    sizes="100vw"
                    width={1200}
                    height={800}
                    alt=""
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover grayscale contrast-110"
                />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] z-10 pointer-events-none" />
            <BrightGrid z="z-20" />
            <div className="relative z-40 max-w-[1400px] mx-auto px-6 w-full">
                <div className="mb-6">
                    <SectionLabel>Product</SectionLabel>
                </div>
                <h1 className="font-display leading-[0.9] tracking-[0.01em] uppercase text-white text-[16vw] md:text-[9rem] lg:text-[11rem]">
                    <span className="sr-only">Spec Studio</span>
                    <span aria-hidden="true">
                        Spec<span className="text-amber-500">_</span>Studio
                    </span>
                </h1>
                <div className="grid md:grid-cols-2 gap-8 mt-10 items-end">
                    <p className="max-w-xl text-zinc-300 text-sm md:text-base leading-relaxed">
                        AI pre-production review for print, packaging, and display manufacturers.
                        Every incoming spec gets graded before it reaches the floor: Pass, Needs
                        Revision, or Reject, with every flag citing the company standard it violates.
                    </p>
                    <div className="flex justify-end">
                        <CornerButton href={CAL_URL} filled className="text-[13px] px-9 py-5">
                            Book a demo{' '}
                            <ArrowUpRight
                                size={15}
                                className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
                            />
                        </CornerButton>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CountUp({ target, visible, prefix = '' }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!visible) return;
        let start = 0;
        const step = () => {
            start += Math.ceil(target / 40);
            if (start >= target) {
                setVal(target);
                return;
            }
            setVal(start);
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [visible, target]);
    return (
        <span>
            {prefix}
            {val}
        </span>
    );
}

function CaseStudy() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.3 }
        );
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
                        <div className="mb-6">
                            <SectionLabel>Featured Case Study</SectionLabel>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-8 leading-[1.05]">
                            Point 1 Displays lost their pre-production designer. We replaced the
                            review step with AI.
                        </h2>
                        <p className="text-zinc-400 text-base leading-relaxed mb-6 max-w-xl">
                            The Montreal display manufacturer had a costly gap: every spec error that
                            slipped into production burned roughly $500, worst case $2,000. We
                            ingested 17 of their real production standards (FEFCO codes, digital
                            print guidelines, press specs, Kongsberg tooling rules) and built a
                            reviewer that grades every incoming spec before the floor ever sees it.
                        </p>
                        <p className="text-zinc-400 text-base leading-relaxed mb-10 italic border-l-2 border-amber-500 pl-6">
                            No mailbox access. No workflow disruption. A spec goes in; a cited,
                            client-presentable verdict comes out.
                        </p>
                        <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-10">
                            {stats.map((stat, i) => (
                                <div key={i}>
                                    <div className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                        <CountUp
                                            target={stat.value}
                                            visible={visible}
                                            prefix={stat.prefix || ''}
                                        />
                                    </div>
                                    <div className="text-zinc-400 text-[10px] mt-3 font-ui uppercase tracking-[0.2em]">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-square overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=900&q=60&auto=format&fit=crop"
                            srcSet="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&q=60&auto=format&fit=crop 600w, https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=900&q=60&auto=format&fit=crop 900w"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            width={900}
                            height={900}
                            alt="Corrugated packaging production"
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover grayscale"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
                        <div className="absolute top-6 left-6 right-6 flex justify-between text-[10px] font-ui uppercase tracking-[0.25em] text-white/60">
                            <span>// FLAGSHIP DEPLOYMENT</span>
                            <span>2026</span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="text-[10px] font-ui uppercase tracking-[0.25em] text-amber-500">
                                POINT 1 DISPLAYS - MONTREAL
                            </span>
                            <h3 className="text-white font-black text-3xl md:text-4xl mt-2 tracking-tight uppercase">
                                Spec Studio in Production
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Walkthrough() {
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.vsl-reveal', {
                scrollTrigger: { trigger: ref.current, start: 'top 72%' },
                y: 36,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out',
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section id="walkthrough" ref={ref} className="py-24 md:py-32 border-b border-white/5">
            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.7fr)] gap-8 lg:gap-16 items-center">
                <div className="vsl-reveal relative aspect-video bg-[#111] border border-white/10 overflow-hidden">
                    <video
                        controls
                        playsInline
                        preload="none"
                        poster="/assets/spec-reviewer-vsl-poster.jpg"
                        className="w-full h-full object-cover"
                        aria-label="Spec Studio walkthrough video"
                    >
                        <source src="/assets/spec-reviewer-vsl.mp4" type="video/mp4" />
                        Your browser does not support embedded video.
                    </video>
                </div>
                <div className="vsl-reveal">
                    <div className="mb-6">
                        <SectionLabel>Before the Call</SectionLabel>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-6">
                        See Spec Studio catch a real production issue.
                    </h2>
                    <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-md">
                        A short walkthrough of the system, the standard it checks against, and the
                        cited verdict your team receives before a job reaches production.
                    </p>
                    <a
                        href={CAL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-6 py-4 bg-white text-black font-bold text-[11px] font-ui uppercase tracking-[0.2em] hover:bg-amber-500 active:translate-y-px transition-all"
                    >
                        Book a demo <ChevronRight size={15} aria-hidden="true" />
                    </a>
                </div>
            </div>
        </section>
    );
}

function SpecFAQ() {
    const [open, setOpen] = useState(null);
    const faqs = SPEC_FAQS;

    return (
        <section className="py-24 md:py-32 bg-[#0A0A0A] relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="mb-10">
                    <SectionLabel>FAQ</SectionLabel>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-12 max-w-3xl">
                    Spec Studio questions
                </h2>
                <div className="max-w-3xl">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border-b border-white/10 last:border-0">
                            <button
                                type="button"
                                onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex items-center justify-between py-5 md:py-6 text-left group"
                            >
                                <span className="text-white text-[11px] md:text-xs font-ui font-semibold uppercase tracking-[0.12em] pr-6 leading-snug">
                                    {faq.q}
                                </span>
                                <span
                                    className={`text-lg flex-shrink-0 transition-transform duration-300 ${open === i ? 'text-amber-500 rotate-45' : 'text-zinc-400 group-hover:text-white'}`}
                                >
                                    +
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-500 ${open === i ? 'max-h-48 pb-5' : 'max-h-0'}`}
                            >
                                <p className="text-zinc-400 text-sm leading-relaxed pr-8">{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ClosingCTA() {
    return (
        <section className="py-24 md:py-32 border-t border-white/10">
            <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-4">
                        Want Spec Studio reading your incoming specs?
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base max-w-xl">
                        Book a demo on the calendar. We will walk a real sample and tell you if it
                        fits.
                    </p>
                </div>
                <CornerButton href={CAL_URL} filled className="whitespace-nowrap">
                    Book a demo{' '}
                    <ArrowUpRight
                        size={14}
                        className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
                    />
                </CornerButton>
            </div>
        </section>
    );
}

export default function SpecStudio() {
    return (
        <div className="w-full min-h-screen font-sans bg-[#0A0A0A] text-white selection:bg-amber-500 selection:text-black relative">
            <SeoHead path="/spec-studio" />
            <ServiceNavbar />
            <main>
                <SpecHero />
                <Flagship embed />
                <CaseStudy />
                <Walkthrough />
                <SpecFAQ />
                <ClosingCTA />
            </main>
            <Footer links={FOOTER_LINKS} />
            <p className="sr-only">
                <Link to="/">Back to Corefix home</Link>
            </p>
        </div>
    );
}
