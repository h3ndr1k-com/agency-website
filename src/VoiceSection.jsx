import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mic, PhoneOff, Phone } from 'lucide-react';
import { SectionGrid, SectionLabel } from './shared.jsx';

gsap.registerPlugin(ScrollTrigger);

const PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;
const PHONE = import.meta.env.VITE_VOICE_PHONE_NUMBER;
const CONFIGURED = Boolean(PUBLIC_KEY && ASSISTANT_ID);

const STATUS_COPY = {
    idle: 'Standing by',
    connecting: 'Connecting…',
    listening: 'Listening',
    speaking: 'Corefix speaking',
    ended: 'Call ended',
    error: 'Connection failed',
};

export default function VoiceSection() {
    const ref = useRef(null);
    const orbRef = useRef(null);
    const vapiRef = useRef(null);
    const timerRef = useRef(null);
    const [status, setStatus] = useState('idle');
    const [seconds, setSeconds] = useState(0);
    const [line, setLine] = useState(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.voice-el', {
                scrollTrigger: { trigger: ref.current, start: 'top 70%' },
                y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    useEffect(() => () => {
        clearInterval(timerRef.current);
        vapiRef.current?.stop();
    }, []);

    const live = status === 'listening' || status === 'speaking';

    const startCall = useCallback(async () => {
        if (!CONFIGURED) {
            document.querySelector('#audit')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        setStatus('connecting');
        setLine(null);
        setSeconds(0);

        try {
            if (!vapiRef.current) {
                const { default: Vapi } = await import('@vapi-ai/web');
                const vapi = new Vapi(PUBLIC_KEY);
                vapiRef.current = vapi;

                vapi.on('call-start', () => {
                    setStatus('listening');
                    clearInterval(timerRef.current);
                    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
                });
                vapi.on('call-end', () => {
                    clearInterval(timerRef.current);
                    setStatus('ended');
                    setTimeout(() => setStatus((s) => (s === 'ended' ? 'idle' : s)), 5000);
                });
                vapi.on('speech-start', () => setStatus('speaking'));
                vapi.on('speech-end', () => setStatus('listening'));
                vapi.on('volume-level', (v) => {
                    orbRef.current?.style.setProperty('--vol', String(Math.min(1, v * 1.6)));
                });
                vapi.on('message', (m) => {
                    if (m.type === 'transcript' && m.transcript) {
                        setLine({ role: m.role, text: m.transcript });
                    }
                });
                vapi.on('error', () => {
                    clearInterval(timerRef.current);
                    setStatus('error');
                });
            }
            await vapiRef.current.start(ASSISTANT_ID);
        } catch {
            setStatus('error');
        }
    }, []);

    const endCall = useCallback(() => {
        vapiRef.current?.stop();
    }, []);

    const mmss = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

    return (
        <section id="voice-demo" ref={ref} className="py-24 md:py-40 bg-[#080808] border-y border-white/20 relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                <div className="voice-el mb-8"><SectionLabel>Live Demo</SectionLabel></div>
                <h2 className="voice-el text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-[-0.03em] mb-6 leading-[0.95] max-w-4xl text-balance">
                    Don't take our word for it.<br /><span className="text-zinc-600">Talk to our AI.</span>
                </h2>
                <p className="voice-el text-zinc-500 text-sm md:text-base max-w-lg mb-16">
                    This is a live agent, not a recording. Ask it what we build &mdash; it answers, checks Hendrik's real calendar, and books your intro call mid-conversation.
                </p>

                {/* Orb console */}
                <div className="voice-el relative p-10 md:p-14 border border-white/20 bg-[#0A0A0A]/70">
                    <span className="absolute -top-[2px] -left-[2px] w-4 h-4 border-t-2 border-l-2 border-amber-500" />
                    <span className="absolute -top-[2px] -right-[2px] w-4 h-4 border-t-2 border-r-2 border-amber-500" />
                    <span className="absolute -bottom-[2px] -left-[2px] w-4 h-4 border-b-2 border-l-2 border-amber-500" />
                    <span className="absolute -bottom-[2px] -right-[2px] w-4 h-4 border-b-2 border-r-2 border-amber-500" />

                    <div className="flex justify-between text-[8px] md:text-[9px] font-ui uppercase tracking-[0.25em] text-zinc-600 mb-8 gap-6">
                        <span>Agent: Corefix-01</span>
                        <span>Channel: WebRTC</span>
                        <span className={live ? 'text-amber-500' : ''}>{live ? `Live ${mmss}` : 'Secure'}</span>
                    </div>

                    <button
                        ref={orbRef}
                        onClick={live || status === 'connecting' ? endCall : startCall}
                        aria-label={live ? 'End the voice call' : 'Start a voice call with the Corefix AI agent'}
                        className="allow-round relative w-44 h-44 md:w-52 md:h-52 mx-auto block group focus:outline-none"
                        style={{ '--vol': 0 }}
                    >
                        {/* volume-reactive rings */}
                        <span className={`absolute inset-0 rounded-full border transition-colors duration-300 ${live ? 'border-amber-500/50' : 'border-white/15 group-hover:border-white/30'}`}
                            style={{ transform: 'scale(calc(1 + var(--vol) * 0.22))', transition: 'transform 90ms linear, border-color 300ms' }} />
                        <span className={`absolute inset-3 rounded-full border transition-colors duration-300 ${live ? 'border-amber-500/30' : 'border-white/10'}`}
                            style={{ transform: 'scale(calc(1 + var(--vol) * 0.14))', transition: 'transform 120ms linear, border-color 300ms' }} />
                        <span className={`absolute inset-0 rounded-full bg-amber-500 blur-2xl transition-opacity duration-500 ${live ? 'opacity-25' : status === 'connecting' ? 'opacity-15 animate-pulse' : 'opacity-0 group-hover:opacity-10'}`}
                            style={live ? { opacity: 'calc(0.15 + var(--vol) * 0.35)' } : undefined} />

                        {/* core */}
                        <span className={`absolute inset-8 rounded-full flex items-center justify-center transition-colors duration-300 ${live ? 'bg-amber-500 text-black' : 'bg-white text-black group-hover:bg-amber-500'}`}>
                            {status === 'connecting' ? (
                                <span className="flex gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-black animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                    ))}
                                </span>
                            ) : live ? (
                                <PhoneOff size={26} strokeWidth={2.2} />
                            ) : (
                                <Mic size={28} strokeWidth={2.2} />
                            )}
                        </span>
                    </button>

                    <div className="mt-8 h-10 flex flex-col items-center justify-center">
                        <span className={`text-[10px] font-ui uppercase tracking-[0.3em] ${live ? 'text-amber-500' : status === 'error' ? 'text-red-400' : 'text-zinc-500'}`}>
                            {STATUS_COPY[status]}
                        </span>
                        {line && live && (
                            <p className="text-zinc-400 text-xs mt-2 max-w-md truncate">
                                <span className="text-zinc-600 font-ui uppercase text-[9px] tracking-widest mr-2">{line.role === 'assistant' ? 'Corefix' : 'You'}</span>
                                {line.text}
                            </p>
                        )}
                        {status === 'error' && (
                            <p className="text-zinc-500 text-xs mt-2">Mic blocked or network hiccup &mdash; <a href="#audit" className="text-amber-500 hover:underline">book the old-fashioned way</a>.</p>
                        )}
                        {status === 'idle' && !CONFIGURED && (
                            <p className="text-zinc-600 text-xs mt-2">Voice line warming up &mdash; grab an audit slot below.</p>
                        )}
                    </div>
                </div>

                <p className="voice-el text-zinc-600 text-[10px] font-ui uppercase tracking-[0.2em] mt-8 flex items-center gap-3 flex-wrap justify-center">
                    <span>Voice &middot; ~2 min &middot; books straight to the calendar</span>
                    {PHONE && (
                        <>
                            <span className="w-1 h-1 bg-zinc-700" />
                            <a href={`tel:${PHONE.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-2 text-amber-500 hover:text-white transition-colors">
                                <Phone size={11} /> or call {PHONE}
                            </a>
                        </>
                    )}
                </p>
            </div>
        </section>
    );
}
