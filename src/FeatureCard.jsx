import { useId, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * FeatureCard + GridPattern — JSX port of internal/grid-feature-cards.tsx.
 * Corefix dark/amber styling; subtle hover + in-view motion (respects reduced motion).
 */
export function FeatureCard({ feature, className = '', patternIndex = 0, ...props }) {
    const reduceMotion = useReducedMotion();
    const squares = useMemo(() => stablePattern(patternIndex), [patternIndex]);
    const Icon = feature.icon;

    return (
        <motion.div
            className={`group relative overflow-hidden bg-[#0A0A0A] p-8 md:p-10 transition-colors hover:bg-[#111111] ${className}`}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: patternIndex * 0.08 }}
            whileHover={reduceMotion ? undefined : { y: -4 }}
            {...props}
        >
            <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-white/[0.03] [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100 transition-opacity duration-300 group-hover:opacity-100">
                    <GridPattern
                        width={20}
                        height={20}
                        x="-12"
                        y="4"
                        squares={squares}
                        className="absolute inset-0 h-full w-full fill-amber-500/10 stroke-white/30 mix-blend-overlay"
                    />
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-3">
                <Icon className="size-6 text-amber-500/90 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.25} aria-hidden="true" />
                <span className="text-amber-500 text-[10px] font-ui font-bold uppercase tracking-[0.25em]">
                    {feature.num}
                </span>
            </div>
            <h3 className="relative z-10 mt-8 text-white text-xl font-bold tracking-tight">{feature.title}</h3>
            <p className="relative z-20 mt-3 text-zinc-300 text-sm leading-relaxed">{feature.description}</p>
        </motion.div>
    );
}

function GridPattern({ width, height, x, y, squares, className = '', ...props }) {
    const patternId = useId().replace(/:/g, '');

    return (
        <svg aria-hidden="true" className={className} {...props}>
            <defs>
                <pattern
                    id={patternId}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path d={`M.5 ${height}V.5H${width}`} fill="none" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
            {squares && (
                <svg x={x} y={y} className="overflow-visible">
                    {squares.map(([sx, sy], index) => (
                        <rect
                            key={`${sx}-${sy}-${index}`}
                            strokeWidth="0"
                            width={width + 1}
                            height={height + 1}
                            x={sx * width}
                            y={sy * height}
                        />
                    ))}
                </svg>
            )}
        </svg>
    );
}

/** Deterministic highlight squares so SSR/hydration stay stable. */
function stablePattern(seed, length = 5) {
    const out = [];
    let n = (seed + 1) * 1103515245 + 12345;
    for (let i = 0; i < length; i += 1) {
        n = (n * 1664525 + 1013904223) >>> 0;
        out.push([(n % 4) + 7, ((n >>> 8) % 6) + 1]);
    }
    return out;
}
