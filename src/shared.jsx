import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

// ── Grid config ──
export const gridLineColor = 'rgba(255,255,255,0.05)';
export const gridPlusStyle = {
    color: 'rgba(255,255,255,0.15)',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 300,
    lineHeight: '0',
    userSelect: 'none',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
};
export const gridVPositions = ['left-6', 'left-1/3', 'left-2/3', 'right-6'];
export const gridHPositions = ['25%', '50%', '75%'];

export const SectionGrid = () => (
    <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        {gridHPositions.map((top, i) => (
            <div key={`h-${i}`} className="absolute left-0 right-0 h-[1px]" style={{ background: gridLineColor, top }} />
        ))}
        <div className="max-w-[1400px] mx-auto h-full px-6 relative">
            {gridVPositions.map((pos, i) => (
                <div key={`v-${i}`} className={`absolute inset-y-0 ${pos} w-[1px]`} style={{ background: gridLineColor }}>
                    {gridHPositions.map(top => (
                        <span key={top} style={{ ...gridPlusStyle, top }}>+</span>
                    ))}
                </div>
            ))}
        </div>
    </div>
);

const heroLineColor = 'rgba(255,255,255,0.14)';
const heroPlusStyle = { ...gridPlusStyle, color: 'rgba(255,255,255,0.30)' };

export const BrightGrid = ({ z = 'z-0' }) => (
    <div className={`absolute inset-0 ${z} pointer-events-none`} aria-hidden="true">
        {gridHPositions.map((top, i) => (
            <div key={`h-${i}`} className="absolute left-0 right-0 h-[1px]" style={{ background: heroLineColor, top }} />
        ))}
        <div className="max-w-[1400px] mx-auto h-full px-6 relative">
            {gridVPositions.map((pos, i) => (
                <div key={`v-${i}`} className={`absolute inset-y-0 ${pos} w-[1px]`} style={{ background: heroLineColor }}>
                    {gridHPositions.map(top => (
                        <span key={top} style={{ ...heroPlusStyle, top }}>+</span>
                    ))}
                </div>
            ))}
        </div>
    </div>
);

// ── Corner-accent button (supports both <a> and <Link>) ──
export const CornerButton = ({ href, to, children, filled, className = '', onClick }) => {
    const base = filled
        ? 'bg-white text-black hover:bg-amber-500'
        : 'bg-transparent text-white border border-white/60 hover:bg-white hover:text-black';
    const classes = `relative inline-flex items-center gap-3 px-7 py-4 font-bold text-[11px] font-ui uppercase tracking-[0.2em] transition-all duration-200 group ${base} ${className}`;
    const corners = (
        <>
            <span className="absolute -top-[3px] -left-[3px] w-3 h-3 border-t-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute -bottom-[3px] -right-[3px] w-3 h-3 border-b-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
    );
    if (to) {
        return <Link to={to} className={classes} onClick={onClick}>{corners}{children}</Link>;
    }
    return <a href={href} className={classes} onClick={onClick}>{corners}{children}</a>;
};

// ── Section label pill ──
export const SectionLabel = ({ children }) => (
    <span className="inline-flex items-center gap-2.5 px-5 py-2.5 border border-white/40 text-white text-xs font-ui uppercase tracking-[0.25em]">
        <span className="w-1.5 h-1.5 bg-amber-500" />
        {children}
    </span>
);

// ── Shared Footer ──
export const Footer = () => (
    <footer className="bg-[#050505] pt-24 pb-10 px-6">
        <div className="max-w-[1400px] mx-auto">
            <div className="mb-20 overflow-hidden">
                <h2 className="text-[18vw] md:text-[15vw] font-black uppercase tracking-tighter text-white/[0.15] leading-none select-none">
                    COREFIX&reg;
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 pb-12 border-b border-white/10">
                <div className="md:col-span-2 max-w-md">
                    <h4 className="font-ui font-black tracking-[0.18em] text-white text-base flex items-center gap-2 mb-6">
                        <svg viewBox="0 0 32 32" className="w-5 h-5"><path d="M16 4 L27.3 10.5 L27.3 21.5 L16 28 L4.7 21.5 L4.7 10.5 Z" fill="none" stroke="#F59E0B" strokeWidth="2"/></svg> COREFIX&reg;
                    </h4>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-sm">
                        We design, build, and deploy reliable AI systems and automation workflows.
                    </p>
                    <a href="mailto:hendrik@corefix.app" className="block text-white font-bold text-base hover:text-amber-500 transition-colors">
                        HENDRIK@COREFIX.APP
                    </a>
                </div>

                <div className="flex flex-col gap-3">
                    <span className="text-zinc-500 text-[10px] font-ui uppercase tracking-[0.25em] mb-3">Navigation</span>
                    {[['Home', '/'], ['Services', '/#services'], ['Process', '/#process'], ['Case Studies', '/#works'], ['Pricing', '/#pricing']].map(([link, href]) => (
                        <a key={link} href={href} className="text-zinc-300 text-sm hover:text-amber-500 transition-colors font-ui uppercase tracking-wider py-2">{link}</a>
                    ))}
                </div>
                <div className="flex flex-col gap-3">
                    <span className="text-zinc-500 text-[10px] font-ui uppercase tracking-[0.25em] mb-3">Social</span>
                    <a href="https://www.linkedin.com/in/hendrikcorefix/" target="_blank" rel="noopener noreferrer" className="text-zinc-300 text-sm hover:text-amber-500 transition-colors font-ui uppercase tracking-wider py-2">LinkedIn</a>
                    <a href="https://www.instagram.com/hendrikunfiltered/" target="_blank" rel="noopener noreferrer" className="text-zinc-300 text-sm hover:text-amber-500 transition-colors font-ui uppercase tracking-wider py-2">Instagram</a>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 animate-pulse" />
                    <span className="font-ui text-[10px] text-zinc-500 tracking-[0.25em] uppercase">System Operational &mdash; {new Date().getFullYear()}</span>
                </div>
                <p className="text-zinc-600 text-[10px] font-ui uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} Corefix. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="text-zinc-500 text-[10px] font-ui uppercase tracking-[0.2em] hover:text-amber-500 transition-colors">Terms</a>
                    <a href="#" className="text-zinc-500 text-[10px] font-ui uppercase tracking-[0.2em] hover:text-amber-500 transition-colors">Privacy</a>
                </div>
            </div>
        </div>
    </footer>
);

// ── Shared Navbar (used on service pages) ──
export const ServiceNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-white/30 ${scrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-xl' : 'bg-[#0A0A0A]/40 backdrop-blur-md'}`}>
            <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="font-ui font-black tracking-[0.18em] text-white text-lg flex items-center gap-3">
                    <svg viewBox="0 0 32 32" className="w-7 h-7"><path d="M16 4 L27.3 10.5 L27.3 21.5 L16 28 L4.7 21.5 L4.7 10.5 Z" fill="none" stroke="#F59E0B" strokeWidth="2"/></svg>
                    COREFIX&reg;
                </Link>
                <div className="hidden md:flex items-center gap-8 text-xs font-ui font-medium text-zinc-400 uppercase tracking-[0.18em]">
                    <Link to="/#services" className="hover:text-white transition-colors">Services</Link>
                    <Link to="/#process" className="hover:text-white transition-colors">Process</Link>
                    <Link to="/#works" className="hover:text-white transition-colors">Case Studies</Link>
                    <Link to="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link to="/#contact" className="hover:text-white transition-colors">Contact</Link>
                </div>
                <Link to="/#contact" className="hidden md:inline-flex relative items-center px-6 py-3 bg-white text-black font-semibold text-xs font-ui uppercase tracking-[0.15em] hover:bg-amber-500 transition-all duration-200 group">
                    <span className="absolute -top-[2px] -left-[2px] w-2.5 h-2.5 border-t-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute -bottom-[2px] -right-[2px] w-2.5 h-2.5 border-b-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    Talk To Us
                </Link>
            </div>
        </nav>
    );
};
