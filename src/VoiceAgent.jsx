import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowUpRight,
    CalendarCheck,
    ChevronRight,
    MessageSquareText,
    Phone,
    PhoneForwarded,
} from 'lucide-react';
import SeoHead from './SeoHead.jsx';
import VoiceSection from './VoiceSection.jsx';
import { FeatureCard } from './FeatureCard.jsx';
import {
    ServiceNavbar,
    Footer,
    SectionGrid,
    BrightGrid,
    SectionLabel,
    CornerButton,
    FIXED_PRICE_POINTS,
} from './shared.jsx';
import { CAL_URL, VOICE_COMPARE, VOICE_FAQS } from './seo.js';

const FOOTER_LINKS = [
    ['Home', '/'],
    ['Voice Agent', '/services/voice-agent'],
    ['How We Price', '/services/voice-agent#pricing'],
    ['Services', '/services'],
    ['Contact', '/#contact'],
];

const STEPS = [
    {
        num: '01',
        title: 'We wire it to your line and calendar',
        description:
            'Your numbers, your calendar, your company name. The agent picks up as you.',
        icon: PhoneForwarded,
    },
    {
        num: '02',
        title: 'It answers, qualifies, and books',
        description:
            'Every call and web lead gets a live answer, day or night. Jobs land on your calendar.',
        icon: CalendarCheck,
    },
    {
        num: '03',
        title: 'You get the details fast',
        description:
            'A text with the job details follows so your team can move without digging through voicemail.',
        icon: MessageSquareText,
    },
];

function Hero() {
    return (
        <section className="relative min-h-[70vh] flex flex-col justify-end pb-16 md:pb-24 overflow-hidden pt-32">
            <picture className="absolute inset-0 z-0">
                <source
                    type="image/webp"
                    srcSet="/img/voice-agent-hero-800.webp 800w, /img/voice-agent-hero-1200.webp 1200w"
                    sizes="100vw"
                />
                <img
                    src="/img/voice-agent-hero-1200.jpg"
                    srcSet="/img/voice-agent-hero-800.jpg 800w, /img/voice-agent-hero-1200.jpg 1200w"
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
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 min-h-[44px] text-zinc-300 text-xs font-ui uppercase tracking-[0.2em] hover:text-white transition-colors mb-4"
                    >
                        Corefix
                    </Link>
                    <div className="mb-6">
                        <SectionLabel>Voice Agent</SectionLabel>
                    </div>
                </div>
                <h1 className="font-display leading-[0.9] tracking-[0.01em] uppercase text-white text-[12vw] md:text-[6.5rem] lg:text-[7.5rem] max-w-5xl">
                    Every call answered and booked, day or night.
                </h1>
                <div className="grid md:grid-cols-2 gap-8 mt-10 items-end">
                    <p className="max-w-xl text-zinc-200 text-sm md:text-base leading-relaxed">
                        The business that answers first gets the job. An AI voice agent that picks up in your company&apos;s
                        name, books the job on your calendar, and texts you the details fast.
                    </p>
                    <div className="flex justify-end flex-wrap gap-3">
                        <CornerButton href="#voice-demo">
                            Hear it live <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </CornerButton>
                        <CornerButton href={CAL_URL} filled>
                            Book a call{' '}
                            <ArrowUpRight
                                size={14}
                                className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
                            />
                        </CornerButton>
                    </div>
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden border-y border-white/20">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="mb-6">
                    <SectionLabel>How it works</SectionLabel>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-14 max-w-3xl">
                    Live in three steps.
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/20 border border-white/20">
                    {STEPS.map((step, i) => (
                        <FeatureCard key={step.num} feature={step} patternIndex={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function VoiceCompare() {
    return (
        <section
            id="compare"
            aria-labelledby="compare-heading"
            className="py-24 md:py-32 bg-[#0A0A0A] relative overflow-hidden"
        >
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="mb-6">
                    <SectionLabel>Compare</SectionLabel>
                </div>
                <h2
                    id="compare-heading"
                    className="text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-4 max-w-3xl"
                >
                    Corefix voice agent vs a typical answering service
                </h2>
                <p className="text-zinc-300 text-sm md:text-base mb-12 max-w-xl">
                    Same job on paper, based on what we typically see. Pricing, commitment, and whether the
                    lead actually lands on your calendar often differ.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
                    <div className="border border-amber-500/50 bg-amber-500/[0.06] p-5 sm:p-8">
                        <h3 className="text-white text-xs font-ui font-bold uppercase tracking-[0.2em] mb-5">
                            Corefix voice agent
                        </h3>
                        <ul className="space-y-3">
                            {VOICE_COMPARE.corefix.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-3 text-zinc-200 text-sm leading-relaxed"
                                >
                                    <span
                                        className="mt-1.5 w-1.5 h-1.5 bg-amber-500 flex-shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="border border-white/25 bg-[#080808] p-5 sm:p-8">
                        <h3 className="text-zinc-200 text-xs font-ui font-bold uppercase tracking-[0.2em] mb-5">
                            Typical answering service
                        </h3>
                        <ul className="space-y-3">
                            {VOICE_COMPARE.typical.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-3 text-zinc-300 text-sm leading-relaxed"
                                >
                                    <span
                                        className="mt-1.5 w-1.5 h-1.5 bg-zinc-500 flex-shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Pricing() {
    return (
        <section id="pricing" className="py-24 md:py-32 border-y border-white/15">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="mb-8">
                    <SectionLabel>How We Price</SectionLabel>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-12 items-end">
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05]">
                        Simple, fixed-price engagements.
                    </h2>
                    <p className="text-zinc-300 text-sm md:text-base">
                        Talk to the live demo above, then book a call. You get a fixed quote for your setup before anything starts.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {FIXED_PRICE_POINTS.map((pt, i) => (
                        <div key={pt.title} className="p-8 bg-[#0A0A0A] border border-white/25">
                            <span className="text-[10px] font-ui font-bold uppercase tracking-[0.25em] text-amber-500">{String(i + 1).padStart(2, '0')}</span>
                            <h3 className="text-xl font-bold text-white mt-4 mb-2">{pt.title}</h3>
                            <p className="text-zinc-300 text-sm leading-relaxed">{pt.desc}</p>
                        </div>
                    ))}
                </div>
                <a
                    href={CAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center text-center w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-[11px] font-ui uppercase tracking-[0.2em] hover:bg-amber-500 transition-colors mb-4"
                >
                    Book a call
                </a>
                <button
                    type="button"
                    onClick={() =>
                        document.querySelector('#voice-demo')?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="ml-0 sm:ml-3 inline-flex justify-center text-center w-full sm:w-auto px-8 py-4 border border-zinc-500 text-zinc-300 font-bold text-[11px] font-ui uppercase tracking-[0.2em] hover:border-amber-500 hover:text-white transition-colors"
                >
                    Or talk to the demo agent
                </button>
            </div>
        </section>
    );
}

function FAQ() {
    const [open, setOpen] = useState(null);
    const faqs = VOICE_FAQS;

    return (
        <section id="faq" className="py-24 md:py-32 bg-[#0A0A0A] relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 md:gap-10">
                    <div>
                        <div className="mb-6">
                            <SectionLabel>FAQ</SectionLabel>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-6">
                            Voice agent questions
                        </h2>
                        <p className="text-zinc-300 text-sm leading-relaxed max-w-md mb-8">
                            Ready when you are. Same calendar link as the homepage.
                        </p>
                        <CornerButton href={CAL_URL} filled>
                            Book a call{' '}
                            <ArrowUpRight
                                size={14}
                                className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
                            />
                        </CornerButton>
                    </div>
                    <div>
                        {faqs.map((faq, i) => (
                            <div key={faq.q} className="border-b border-white/20 last:border-0">
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
                                    <p className="text-zinc-300 text-sm leading-relaxed pr-8">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function VoiceAgent() {
    return (
        <div className="w-full min-h-screen font-sans bg-[#0A0A0A] text-white selection:bg-amber-500 selection:text-black relative">
            <SeoHead path="/services/voice-agent" />
            <ServiceNavbar />
            <main>
                <Hero />
                <VoiceSection />
                <HowItWorks />
                <VoiceCompare />
                <Pricing />
                <FAQ />
            </main>
            <Footer links={FOOTER_LINKS} />
            <p className="sr-only">
                <Phone size={12} aria-hidden="true" /> Demo number available when configured. No mic?{' '}
                <a href={CAL_URL}>Book on the calendar</a>.
            </p>
        </div>
    );
}
