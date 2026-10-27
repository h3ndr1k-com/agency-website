import { useId } from 'react';

/** Corefix liquid-glass control — JSX port of LiquidButton + GlassFilter (no Slot/cva). */
export function LiquidGlassButton({
    className = '',
    tone = 'amber',
    filterId,
    children,
    ...props
}) {
    const reactId = useId().replace(/:/g, '');
    const id = filterId || `liquid-glass-${reactId}`;

    const toneClass =
        tone === 'amber'
            ? 'bg-amber-500 text-black hover:bg-amber-400 disabled:bg-transparent disabled:text-zinc-600 disabled:border disabled:border-white/25'
            : 'bg-white/10 text-white hover:bg-white/15 hover:text-amber-500 disabled:bg-transparent disabled:text-zinc-500 disabled:border disabled:border-white/20';

    return (
        <button
            type="button"
            className={`allow-round relative inline-flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center overflow-visible transition duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 ${toneClass} ${className}`}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 allow-round shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)] transition-all"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 isolate -z-10 overflow-hidden allow-round"
                style={{ backdropFilter: `url("#${id}")` }}
            />
            <span className="pointer-events-none relative z-10 flex items-center justify-center [&_svg]:shrink-0">
                {children}
            </span>
            <GlassFilter id={id} />
        </button>
    );
}

function GlassFilter({ id }) {
    return (
        <svg className="pointer-events-none absolute h-0 w-0 overflow-hidden" aria-hidden="true">
            <defs>
                <filter
                    id={id}
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    colorInterpolationFilters="sRGB"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.05 0.05"
                        numOctaves="1"
                        seed="1"
                        result="turbulence"
                    />
                    <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="blurredNoise"
                        scale="70"
                        xChannelSelector="R"
                        yChannelSelector="B"
                        result="displaced"
                    />
                    <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
                    <feComposite in="finalBlur" in2="finalBlur" operator="over" />
                </filter>
            </defs>
        </svg>
    );
}
