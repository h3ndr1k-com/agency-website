import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, ChevronRight } from 'lucide-react';
import { SectionGrid, SectionLabel, CornerButton } from './shared.jsx';

gsap.registerPlugin(ScrollTrigger);

const DielineScene = lazy(() => import('./DielineScene.jsx'));

const FLAGS = [
    { severity: 'BLOCKING', category: 'DIE & TOOLING', issue: 'Title block calls NEW BLOCK DIE 55036167-001A — "New Die" checkbox left unchecked' },
    { severity: 'BLOCKING', category: 'DIMENSIONS', issue: 'No per-panel dimensions or stated tolerance — only overall sheet size dimensioned' },
    { severity: 'NEEDED', category: 'LEGEND', issue: 'Yellow highlighted lines undefined in the CAD legend' },
    { severity: 'NEEDED', category: 'GRAPHICS', issue: 'Artwork unverified — bleed, resolution, lead-edge gripper margin unchecked' },
];

const CATEGORIES = [
    { name: 'Dimensions & Tolerances', score: 5 },
    { name: 'Die, Creasing & Glue', score: 4 },
    { name: 'Graphics & Print', score: 5 },
    { name: 'Legend Conformity', score: 6 },
];

const STATS = [
    { value: '~$500', label: 'Cost of one uncaught spec error — worst case $2,000' },
    { value: '8', label: 'Inspection categories scored on every review' },
    { value: 'MIN', label: 'Verdict in minutes — not a designer\'s afternoon' },
];

const ANNOTATIONS = [
    { text: 'FEFCO 0201', pos: 'top-4 left-4' },
    { text: 'BLEED 1/4"', pos: 'top-4 right-4' },
    { text: 'LEAD EDGE — BOTTOM', pos: 'bottom-4 left-4' },
    { text: 'KONGSBERG READY', pos: 'bottom-4 right-4' },
];

export default function Flagship() {
    const ref = useRef(null);
    const canvasWrapRef = useRef(null);
    const foldProgress = useRef({ current: 0 });
    const [mounted3d, setMounted3d] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setMounted3d(true); observer.disconnect(); } },
            { rootMargin: '500px' }
        );
        if (canvasWrapRef.current) observer.observe(canvasWrapRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.flag-head', {
                scrollTrigger: { trigger: ref.current, start: 'top 75%' },
                y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
            });

            ScrollTrigger.create({
                trigger: canvasWrapRef.current,
                start: 'top 85%',
                end: 'center 35%',
                scrub: 0.6,
                onUpdate: (self) => { foldProgress.current.current = self.progress; },
            });

            const tl = gsap.timeline({
                scrollTrigger: { trigger: '.flag-report', start: 'top 70%' },
                defaults: { ease: 'power2.out' },
            });
            tl.from('.flag-report-header', { y: 20, opacity: 0, duration: 0.5 })
                .to('.flag-scanbar', { width: '100%', duration: 1.1, ease: 'power1.inOut' })
                .from('.flag-item', { x: -24, opacity: 0, duration: 0.45, stagger: 0.22 }, '-=0.3')
                .from('.flag-cat', { opacity: 0, duration: 0.3, stagger: 0.12 }, '-=0.1')
                .to('.flag-cat-bar', { width: (i, el) => el.dataset.w, duration: 0.7, stagger: 0.12, ease: 'power2.inOut' }, '<')
                .from('.flag-verdict', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'back.out(2.2)' }, '-=0.2');

            gsap.from('.flag-stat', {
                scrollTrigger: { trigger: '.flag-stats', start: 'top 85%' },
                y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section id="flagship" ref={ref} className="relative py-24 md:py-36 bg-[#080808] border-y border-white/20 overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="flag-head mb-8"><SectionLabel>Flagship Product</SectionLabel></div>
                <h2 className="flag-head font-display uppercase text-white leading-[0.9] tracking-[0.01em] text-[16vw] md:text-[9rem] lg:text-[11rem] select-none">
                    Spec<span className="text-amber-500">_</span>Reviewer
                </h2>
                <div className="flag-head grid md:grid-cols-2 gap-8 mt-8 mb-20">
                    <p className="text-zinc-300 text-base md:text-lg leading-relaxed max-w-xl">
                        AI pre-production review for print, packaging &amp; display manufacturers.
                        Every incoming spec gets graded before it ever reaches the floor &mdash;
                        <span className="text-white font-semibold"> Pass, Needs Revision, or Reject</span> &mdash; with every flag citing the exact company standard it violates.
                    </p>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-md md:justify-self-end md:text-right">
                        Grounded in the manufacturer's own knowledge base &mdash; FEFCO codes, press specs, dieline standards, tooling rules. It flags what's missing or non-conformant. It never invents a spec.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                    {/* 3D fold simulation */}
                    <div ref={canvasWrapRef} className="relative min-h-[420px] md:min-h-[540px] border border-white/20 bg-[#0A0A0A]/60">
                        {mounted3d && (
                            <Suspense fallback={null}>
                                <div className="absolute inset-0">
                                    <DielineScene progress={foldProgress.current} />
                                </div>
                            </Suspense>
                        )}
                        {ANNOTATIONS.map((a) => (
                            <span key={a.text} className={`hidden md:block absolute ${a.pos} text-[10px] font-ui uppercase tracking-[0.25em] text-white/40 pointer-events-none`}>
                                {a.text}
                            </span>
                        ))}
                        <span className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[9px] md:text-[10px] font-ui uppercase tracking-[0.25em] text-amber-500/80 pointer-events-none whitespace-nowrap">
                            <span className="w-1.5 h-1.5 bg-amber-500 animate-pulse" />
                            Fold Simulation — Scroll to Assemble
                        </span>
                    </div>

                    {/* Live review replay — real output from a real spec */}
                    <div className="flag-report border border-white/20 bg-[#0A0A0A]/80 p-6 md:p-8 flex flex-col">
                        <div className="flag-report-header flex items-center justify-between gap-4 pb-5 border-b border-white/10">
                            <div className="flex items-center gap-3 min-w-0">
                                <FileText size={16} className="text-amber-500 flex-shrink-0" />
                                <span className="text-white text-sm font-bold truncate">Q-36167_Guillotine.pdf</span>
                            </div>
                            <span className="text-[9px] font-ui uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">KB: 17 source docs</span>
                        </div>

                        <div className="py-4">
                            <div className="flex justify-between text-[9px] font-ui uppercase tracking-[0.2em] text-zinc-500 mb-2">
                                <span>Scanning against company standards</span>
                            </div>
                            <div className="h-[2px] bg-white/10 w-full">
                                <div className="flag-scanbar h-full bg-amber-500 w-0" />
                            </div>
                        </div>

                        <div className="space-y-3 py-2 flex-1">
                            {FLAGS.map((f, i) => (
                                <div key={i} className="flag-item flex items-start gap-3 p-3 bg-white/[0.03] border-l-2 border-white/10" style={{ borderLeftColor: f.severity === 'BLOCKING' ? '#d13438' : '#F59E0B' }}>
                                    <span className={`px-1.5 py-0.5 text-[8px] font-ui font-bold uppercase tracking-[0.15em] flex-shrink-0 ${f.severity === 'BLOCKING' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-500'}`}>
                                        {f.severity}
                                    </span>
                                    <div className="min-w-0">
                                        <span className="block text-[9px] font-ui uppercase tracking-[0.2em] text-zinc-500 mb-1">{f.category}</span>
                                        <p className="text-zinc-300 text-xs leading-relaxed">{f.issue}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 py-5 border-t border-white/10">
                            {CATEGORIES.map((c, i) => (
                                <div key={i} className="flag-cat">
                                    <div className="flex justify-between text-[9px] font-ui uppercase tracking-[0.15em] text-zinc-500 mb-1.5">
                                        <span className="truncate pr-2">{c.name}</span>
                                        <span className="text-zinc-300 tabular-nums">{c.score}/10</span>
                                    </div>
                                    <div className="h-[3px] bg-white/10">
                                        <div className="flag-cat-bar h-full bg-amber-500 w-0" data-w={`${c.score * 10}%`} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flag-verdict flex items-center justify-between gap-4 p-4 bg-amber-500/[0.08] border border-amber-500/40">
                            <div>
                                <span className="block text-[9px] font-ui uppercase tracking-[0.25em] text-zinc-400 mb-1">Verdict</span>
                                <span className="text-amber-500 font-black text-xl md:text-2xl tracking-tight uppercase">Needs Revision</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-4xl md:text-5xl font-black text-white tabular-nums tracking-tight">4.1<span className="text-zinc-600 text-xl">/10</span></span>
                            </div>
                        </div>
                        <p className="text-zinc-600 text-[9px] font-ui uppercase tracking-[0.15em] mt-4">
                            Real output — reviewed before this spec reached production
                        </p>
                    </div>
                </div>

                {/* stats + CTA */}
                <div className="flag-stats grid md:grid-cols-3 gap-px bg-white/10 mt-6 border border-white/20">
                    {STATS.map((s, i) => (
                        <div key={i} className="flag-stat bg-[#0A0A0A] p-8">
                            <div className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">{s.value}</div>
                            <p className="text-zinc-500 text-xs leading-relaxed font-ui uppercase tracking-[0.1em]">{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <p className="text-zinc-400 text-sm max-w-lg">
                        Built for a production floor, not a demo day. Want it reading <span className="text-white">your</span> incoming specs?
                    </p>
                    <CornerButton href="#audit" filled>
                        Get a Free Audit <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </CornerButton>
                </div>
            </div>
        </section>
    );
}
