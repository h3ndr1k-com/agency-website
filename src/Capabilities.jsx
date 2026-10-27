import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowUpRight, RotateCw } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

const SectionLabel = ({ children }) => (
    <span className="inline-flex items-center gap-2.5 px-5 py-2.5 border border-white/40 text-white text-xs font-ui uppercase tracking-[0.25em]">
        <span className="w-1.5 h-1.5 bg-amber-500" />
        {children}
    </span>
);

const KnobTick = ({ currentRotation, angle }) => {
    const opacity = useTransform(currentRotation, (r) => (r >= angle ? 1 : 0.2));
    const color = useTransform(currentRotation, (r) => (r >= angle ? '#f97316' : '#404040'));
    const shadow = useTransform(currentRotation, (r) =>
        r >= angle ? '0 0 8px rgba(249,115,22,0.6)' : 'none'
    );
    return (
        <motion.div
            style={{ backgroundColor: color, opacity, boxShadow: shadow }}
            className="w-1 h-2.5"
        />
    );
};

const KnobDisplay = ({ value }) => {
    const [display, setDisplay] = useState(0);
    useMotionValueEvent(value, 'change', (v) => setDisplay(Math.round(v)));
    return (
        <div className="relative">
            <span className="absolute inset-0 blur-sm text-orange-500/50 font-ui text-2xl font-black tabular-nums tracking-widest">
                {display.toString().padStart(3, '0')}
            </span>
            <span className="relative font-ui text-2xl text-orange-500 font-black tabular-nums tracking-widest">
                {display.toString().padStart(3, '0')}
                <span className="text-sm text-zinc-400 ml-1">%</span>
            </span>
        </div>
    );
};

export default function Capabilities() {
    const capabilities = [
        { label: 'Conversational AI & Chatbots', href: '#voice-demo' },
        { label: 'Customer Support Automation', href: '#services' },
        { label: 'Voice & Call Agents', href: '#voice-demo' },
        { label: 'Internal Ops & Admin Automation', href: '#services' },
        { label: 'Document & Data Intelligence', href: '/spec-studio' },
        { label: 'API & Tool Integrations', href: '#services' },
        { label: 'Sales & Lead Qualification Agents', href: '#voice-demo' },
        { label: 'Fine-tuned LLM Systems', href: '#services' },
    ];

    const MIN_DEG = -135;
    const MAX_DEG = 135;
    const MID_DEG = 0;
    const TOTAL_TICKS = 40;
    const DEGREES_PER_TICK = (MAX_DEG - MIN_DEG) / TOTAL_TICKS;
    const AXIS_THRESHOLD = 10;

    const [isDragging, setIsDragging] = useState(false);
    const rawRotation = useMotionValue(MID_DEG);
    const snappedRotation = useMotionValue(MID_DEG);
    const smoothRotation = useSpring(snappedRotation, { stiffness: 400, damping: 35, mass: 0.8 });
    const displayValue = useTransform(smoothRotation, [MIN_DEG, MAX_DEG], [0, 100]);
    const lightOpacity = useTransform(rawRotation, [MIN_DEG, MAX_DEG], [0.02, 0.35]);
    const indicatorShadow = useTransform(
        rawRotation,
        (r) => `0 0 ${Math.max(5, (r + 135) / 10)}px orange`
    );
    const knobRef = useRef(null);
    const dragModeRef = useRef(null);
    const startPtrRef = useRef({ x: 0, y: 0, id: null });

    const applyRotationFromPoint = useCallback(
        (clientX, clientY) => {
            if (!knobRef.current) return;
            const rect = knobRef.current.getBoundingClientRect();
            const x = clientX - (rect.left + rect.width / 2);
            const y = clientY - (rect.top + rect.height / 2);
            let degs = Math.atan2(y, x) * (180 / Math.PI) + 90;
            if (degs > 180) degs -= 360;
            if (degs < MIN_DEG && degs > -180) degs = MIN_DEG;
            if (degs > MAX_DEG) degs = MAX_DEG;
            rawRotation.set(degs);
            snappedRotation.set(Math.round(degs / DEGREES_PER_TICK) * DEGREES_PER_TICK);
        },
        [rawRotation, snappedRotation, DEGREES_PER_TICK]
    );

    const endDrag = useCallback((target, pointerId) => {
        dragModeRef.current = null;
        setIsDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.body.style.touchAction = '';
        try {
            if (target && pointerId != null && target.hasPointerCapture?.(pointerId)) {
                target.releasePointerCapture(pointerId);
            }
        } catch {
            /* already released */
        }
    }, []);

    const handlePointerDown = useCallback((e) => {
        if (e.button != null && e.button !== 0) return;
        dragModeRef.current = null;
        startPtrRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
        setIsDragging(true);
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            /* older browsers */
        }
    }, []);

    useEffect(() => {
        if (!isDragging) return undefined;

        const handlePointerMove = (e) => {
            const start = startPtrRef.current;
            if (start.id != null && e.pointerId !== start.id) return;

            const dx = e.clientX - start.x;
            const dy = e.clientY - start.y;
            const dist = Math.hypot(dx, dy);

            if (dragModeRef.current == null) {
                if (dist < AXIS_THRESHOLD) return;
                if (Math.abs(dy) > Math.abs(dx) * 1.15) {
                    dragModeRef.current = 'scroll';
                    endDrag(knobRef.current, start.id);
                    return;
                }
                dragModeRef.current = 'spin';
                document.body.style.touchAction = 'none';
            }

            if (dragModeRef.current !== 'spin') return;
            if (e.cancelable) e.preventDefault();
            applyRotationFromPoint(e.clientX, e.clientY);
        };

        const handlePointerUp = (e) => {
            const start = startPtrRef.current;
            if (start.id != null && e.pointerId !== start.id) return;
            endDrag(knobRef.current || e.target, e.pointerId);
        };

        window.addEventListener('pointermove', handlePointerMove, { passive: false });
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
        };
    }, [isDragging, applyRotationFromPoint, endDrag]);

    const ticks = Array.from({ length: TOTAL_TICKS + 1 });
    const [revealCount, setRevealCount] = useState(Math.floor(capabilities.length / 2));
    useMotionValueEvent(displayValue, 'change', (v) => {
        setRevealCount(Math.round((v / 100) * capabilities.length));
    });

    useEffect(() => {
        if (isDragging) return;
        const t = setTimeout(() => {
            const nudge = MID_DEG + DEGREES_PER_TICK * 2;
            snappedRotation.set(nudge);
            setTimeout(() => snappedRotation.set(MID_DEG), 420);
        }, 1400);
        return () => clearTimeout(t);
        // one-shot on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const capPositions = [
        { top: '8%', left: '3%' },
        { top: '8%', right: '3%' },
        { top: '28%', left: '2%' },
        { top: '28%', right: '2%' },
        { top: '52%', left: '3%' },
        { top: '52%', right: '3%' },
        { top: '74%', left: '6%' },
        { top: '74%', right: '6%' },
    ];

    return (
        <section className="relative overflow-hidden bg-[#0A0A0A]">
            <div
                className="relative w-full"
                style={{ aspectRatio: '16/9', minHeight: '420px', maxHeight: '85vh' }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'url(https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=60&auto=format&fit=crop)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'grayscale(100%) contrast(1.2) brightness(0.7)',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

                <div className="absolute top-6 md:top-12 left-1/2 -translate-x-1/2 z-20">
                    <SectionLabel>AI Capabilities</SectionLabel>
                </div>

                {capabilities.map((cap, i) => {
                    const shown = i < revealCount;
                    return (
                        <div
                            key={cap.label}
                            className="absolute z-20 transition-all duration-700 ease-out max-w-[42%] sm:max-w-none"
                            style={{
                                ...capPositions[i],
                                opacity: shown ? 1 : 0,
                                transform: shown ? 'scale(1)' : 'scale(0.8)',
                                pointerEvents: shown ? 'auto' : 'none',
                            }}
                        >
                            <a
                                href={cap.href}
                                className="group/cap inline-flex items-center gap-2 px-2.5 py-1.5 md:px-3 bg-black/60 backdrop-blur-sm border border-white/20 hover:border-amber-500 text-white text-[9px] md:text-xs font-ui uppercase tracking-[0.12em] md:tracking-[0.15em] transition-colors"
                            >
                                <span className="w-1.5 h-1.5 bg-amber-500 flex-shrink-0" />
                                <span className="leading-snug">{cap.label}</span>
                                <ArrowUpRight
                                    size={11}
                                    className="opacity-0 group-hover/cap:opacity-100 transition-opacity hidden sm:inline"
                                />
                            </a>
                        </div>
                    );
                })}

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="relative w-52 h-52 md:w-64 md:h-64 select-none allow-round">
                        <motion.div
                            className="absolute inset-0 bg-orange-500 rounded-full blur-3xl"
                            style={{ opacity: lightOpacity }}
                        />

                        <div className="absolute inset-0 pointer-events-none">
                            {ticks.map((_, i) => {
                                const angle = (i / TOTAL_TICKS) * (MAX_DEG - MIN_DEG) + MIN_DEG;
                                return (
                                    <div
                                        key={i}
                                        className="absolute top-0 left-1/2 w-1 h-full -translate-x-1/2"
                                        style={{ transform: `rotate(${angle}deg)` }}
                                    >
                                        <KnobTick currentRotation={smoothRotation} angle={angle} />
                                    </div>
                                );
                            })}
                        </div>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40">
                            <motion.div
                                ref={knobRef}
                                className={`relative w-full h-full rounded-full z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                                style={{ rotate: smoothRotation, touchAction: 'none' }}
                                onPointerDown={handlePointerDown}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                role="slider"
                                aria-label="Drag to reveal AI capabilities"
                                aria-valuemin={0}
                                aria-valuemax={capabilities.length}
                                aria-valuenow={revealCount}
                            >
                                <div className="w-full h-full rounded-full bg-neutral-900 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-neutral-800 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%),conic-gradient(from_0deg,transparent_0deg,#000_360deg)]" />
                                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-neutral-950 shadow-[inset_0_2px_5px_rgba(0,0,0,1)] border border-neutral-800/50 flex items-center justify-center">
                                        <motion.div
                                            className="absolute top-3 w-1.5 h-5 bg-orange-500 rounded-full"
                                            style={{ boxShadow: indicatorShadow }}
                                        />
                                        <span className="font-ui text-[9px] text-zinc-400 tracking-[0.25em] mt-4">
                                            LEVEL
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                            <span className="inline-flex items-center gap-1.5 text-[10px] text-amber-500 font-ui tracking-[0.25em] mb-2">
                                <RotateCw size={12} className="animate-spin" style={{ animationDuration: '3.5s' }} />
                                DRAG TO SPIN
                            </span>
                            <span className="text-[9px] text-zinc-400 font-ui tracking-[0.25em] mb-1">
                                OUTPUT
                            </span>
                            <KnobDisplay value={displayValue} />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10">
                    <span className="text-zinc-400 text-sm font-ui font-bold tracking-[0.2em]">
                        COREFIX&reg;
                    </span>
                </div>
            </div>
        </section>
    );
}
