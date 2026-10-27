import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PhoneOff, Phone } from 'lucide-react';
import { LiquidGlassButton } from './LiquidGlassButton';
import { SectionGrid, SectionLabel } from './shared.jsx';
import SiriWave from './SiriWave.jsx';

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
    const threadRef = useRef(null);
    const vapiRef = useRef(null);
    const timerRef = useRef(null);
    const [status, setStatus] = useState('idle');
    const [seconds, setSeconds] = useState(0);
    const [messages, setMessages] = useState([]);

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
        setMessages([]);
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
                vapi.on('message', (m) => {
                    if (m.type !== 'transcript' || !m.transcript) return;
                    const next = {
                        role: m.role === 'assistant' ? 'assistant' : 'user',
                        text: m.transcript,
                        final: m.transcriptType === 'final',
                    };
                    setMessages((prev) => {
                        const last = prev[prev.length - 1];
                        if (last && last.role === next.role && !last.final) {
                            return [...prev.slice(0, -1), next];
                        }
                        if (last && last.role === next.role && last.text === next.text) return prev;
                        return [...prev, next].slice(-8);
                    });
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

    useEffect(() => {
        const thread = threadRef.current;
        if (thread) thread.scrollTop = thread.scrollHeight;
    }, [messages, status]);

    const canDial = status !== 'connecting' && !live;
    const canHangUp = live || status === 'connecting';

    const mmss = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

    return (
        <section id="voice-demo" ref={ref} className="py-24 md:py-40 bg-[#080808] border-y border-white/30 relative overflow-hidden">
            <SectionGrid />
            <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                <div className="voice-el mb-8"><SectionLabel>Live Demo</SectionLabel></div>
                <h2 className="voice-el text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-[-0.03em] mb-6 leading-[0.95] max-w-4xl text-balance">
                    Don&apos;t take our word for it.<br /><span className="text-zinc-300">Talk to our AI.</span>
                </h2>
                <p className="voice-el text-zinc-300 text-sm md:text-base max-w-lg mb-6">
                    This is a live agent, not a recording. Ask it what we build. It answers, checks Hendrik&apos;s real calendar, and books your intro call mid-conversation.
                </p>
                <div className="voice-el mb-12 flex flex-wrap items-center justify-center gap-4 text-sm">
                    {PHONE ? (
                        <a
                            href={`tel:${PHONE.replace(/[^+\d]/g, '')}`}
                            className="inline-flex items-center gap-2 px-5 py-3 border border-amber-500/60 text-amber-500 font-ui text-xs uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-black transition-colors"
                        >
                            <Phone size={14} /> Demo line {PHONE}
                        </a>
                    ) : null}
                    <a
                        href="https://cal.com/corefix.ai/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 border border-white/50 text-zinc-300 font-ui text-xs uppercase tracking-[0.2em] hover:border-amber-500 hover:text-white transition-colors"
                    >
                        No mic? Book on the calendar
                    </a>
                </div>

                {/* Orb console */}
                <div className="voice-el relative w-full min-w-0 max-w-xl p-6 sm:p-10 md:p-14 border border-white/30 bg-[#0A0A0A]">
                    <span className="absolute -top-[2px] -left-[2px] w-4 h-4 border-t-2 border-l-2 border-amber-500" />
                    <span className="absolute -top-[2px] -right-[2px] w-4 h-4 border-t-2 border-r-2 border-amber-500" />
                    <span className="absolute -bottom-[2px] -left-[2px] w-4 h-4 border-b-2 border-l-2 border-amber-500" />
                    <span className="absolute -bottom-[2px] -right-[2px] w-4 h-4 border-b-2 border-r-2 border-amber-500" />

                    <div className="flex flex-wrap justify-center sm:justify-between text-[8px] md:text-[9px] font-ui uppercase tracking-[0.25em] text-zinc-400 mb-4 gap-x-6 gap-y-2">
                        <span>Agent: Corefix-01</span>
                        <span>Channel: WebRTC</span>
                        <span className={live ? 'text-amber-500' : ''}>{live ? `Live ${mmss}` : 'Secure'}</span>
                    </div>

                    <div className="mx-auto w-full min-w-0 max-w-[420px]">
                        <SiriWave variant="wave" size={420} renderScale={1.5} aria-hidden="true" />
                    </div>

                    <div className="relative mx-auto mt-1 w-full min-w-0 max-w-md text-left">
                        <div
                            className={`border border-white/25 border-t-2 bg-[#121212] px-4 py-4 sm:px-5 ${canDial ? 'cursor-pointer' : ''} ${live ? 'border-t-amber-500' : status === 'error' ? 'border-t-red-400' : 'border-t-amber-500/70'}`}
                            onClick={canDial ? startCall : undefined}
                            onKeyDown={canDial ? (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    startCall();
                                }
                            } : undefined}
                            role={canDial ? 'button' : 'log'}
                            tabIndex={canDial ? 0 : undefined}
                            aria-live="polite"
                            aria-label={canDial ? 'Start a voice call with the Corefix AI agent' : 'Voice conversation'}
                        >
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <span className="text-[9px] font-ui uppercase tracking-[0.25em] text-amber-500">Corefix</span>
                                <span className={`text-[9px] font-ui uppercase tracking-[0.25em] ${live ? 'text-amber-500' : status === 'error' ? 'text-red-400' : 'text-zinc-400'}`}>
                                    {STATUS_COPY[status]}
                                </span>
                            </div>
                            <div ref={threadRef} className="max-h-36 space-y-3 overflow-y-auto">
                                {messages.length === 0 && (
                                    <p className="text-sm leading-relaxed text-zinc-400">
                                        {status === 'connecting' && 'Connecting…'}
                                        {status === 'error' && (
                                            <>Mic blocked or network hiccup.{' '}
                                                <a href="https://cal.com/corefix.ai/30min" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-amber-500 hover:underline">Book on the calendar</a>
                                                {PHONE && <> or call {PHONE}</>}.</>
                                        )}
                                        {status === 'ended' && 'Call ended. Dial again if you want another pass.'}
                                        {status === 'idle' && !CONFIGURED && (
                                            <>Voice line warming up. <a href="https://cal.com/corefix.ai/30min" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-amber-500 hover:underline">Book a call</a>{PHONE ? ` or dial ${PHONE}` : ''}.</>
                                        )}
                                        {status === 'idle' && CONFIGURED && 'Standing by. Dial in and ask what we build. It can book the intro on Hendrik’s calendar.'}
                                        {(status === 'listening' || status === 'speaking') && STATUS_COPY[status]}
                                    </p>
                                )}
                                {messages.map((msg, i) => (
                                    <div key={`${msg.role}-${i}`} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                                        <span className="font-ui text-[9px] uppercase tracking-[0.2em] text-zinc-400">
                                            {msg.role === 'assistant' ? 'Corefix' : 'You'}
                                        </span>
                                        <p className={`mt-1 text-sm leading-relaxed ${msg.final === false ? 'text-zinc-400' : 'text-zinc-200'}`}>{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <span aria-hidden="true" className="absolute left-8 -bottom-2 h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-[#121212]" />
                    </div>

                    <div className="mt-8 flex items-start justify-center gap-8">
                        <div className="flex flex-col items-center gap-2">
                            <LiquidGlassButton
                                tone="amber"
                                filterId="voice-dial-glass"
                                onClick={startCall}
                                disabled={!canDial}
                                aria-label="Start a voice call with the Corefix AI agent"
                            >
                                <Phone size={32} strokeWidth={1.75} className="shrink-0 overflow-visible" aria-hidden="true" />
                            </LiquidGlassButton>
                            <span className="font-ui text-[9px] uppercase tracking-[0.2em] text-zinc-400">Dial</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <LiquidGlassButton
                                tone="mute"
                                filterId="voice-hangup-glass"
                                onClick={endCall}
                                disabled={!canHangUp}
                                aria-label="End the voice call"
                            >
                                <PhoneOff size={32} strokeWidth={1.75} className="shrink-0 overflow-visible" aria-hidden="true" />
                            </LiquidGlassButton>
                            <span className="font-ui text-[9px] uppercase tracking-[0.2em] text-zinc-400">Hang up</span>
                        </div>
                    </div>
                </div>

                <p className="voice-el text-zinc-400 text-[10px] font-ui uppercase tracking-[0.2em] mt-8 flex items-center gap-3 flex-wrap justify-center">
                    <span>Voice · ~2 min · books straight to the calendar</span>
                    {PHONE && (
                        <>
                            <span className="w-1 h-1 bg-zinc-600" />
                            <a href={`tel:${PHONE.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-2 text-amber-500 hover:text-white transition-colors">
                                <Phone size={11} /> {PHONE}
                            </a>
                        </>
                    )}
                </p>
                <p className="voice-el text-zinc-400 text-xs max-w-md mt-6 leading-relaxed">
                    Privacy: the demo uses your microphone for a live WebRTC call processed by our voice provider (Vapi) so the agent can talk, check the calendar, and book. See our{' '}
                    <a href="/privacy" className="text-amber-500 hover:underline">Privacy Policy</a>
                    {' '}(draft). Prefer not to use a mic?{' '}
                    <a href="https://cal.com/corefix.ai/30min" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Book here</a>
                    {PHONE ? <> or call {PHONE}</> : null}.
                </p>
                <noscript>
                    <p className="mt-6 text-zinc-300 text-sm">
                        JavaScript is required for the in-browser voice demo.
                        {PHONE ? <> Call {PHONE} or </> : ' '}
                        <a href="https://cal.com/corefix.ai/30min">book on the calendar</a>.
                    </p>
                </noscript>
            </div>
        </section>
    );
}
