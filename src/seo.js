/** Per-route SEO + JSON-LD. Canonicals always use www (apex 307s). */
export const SITE = 'https://www.corefix.app';
export const OG_IMAGE = `${SITE}/og-image.png`;
export const CAL_URL = 'https://cal.com/corefix.ai/30min';

export const ROUTES = {
    '/': {
        path: '/',
        title: 'Speed to lead is what we do',
        description:
            'AI voice agents that answer every call and web lead in seconds, day or night, and book it on your calendar. Pilot from $297.',
        h1: 'Speed to lead is what we do.',
        ogType: 'website',
    },
    '/spec-studio': {
        path: '/spec-studio',
        title: 'Spec Studio — AI Pre-Production Review | Corefix',
        description:
            'Spec Studio grades print, packaging, and display specs against your standards before production. Catch costly errors early. Book a demo.',
        h1: 'Spec Studio',
        ogType: 'website',
    },
    '/services/ai-strategy': {
        path: '/services/ai-strategy',
        title: 'AI Strategy & Advisory | Corefix',
        description:
            'An execution-ready AI plan for where automation actually saves money. No slideware. Book a call with Corefix.',
        h1: 'AI Strategy & Advisory',
        ogType: 'website',
    },
    '/services/custom-agents': {
        path: '/services/custom-agents',
        title: 'Custom AI Agents & Voice | Corefix',
        description:
            'Live voice agents that answer, qualify, and book into your calendar. Custom agents built for your workflows by Corefix.',
        h1: 'Custom AI Agents',
        ogType: 'website',
    },
    '/ai-ops-setup': {
        path: '/ai-ops-setup',
        title: 'AI Ops Setup Session — Get AI Working in 60 Minutes | Corefix',
        description:
            'A focused 60-minute session to map time sinks and leave with a priority list plus a working starter. Book your AI Ops Setup.',
        h1: 'Get AI working in your business in 60 minutes',
        ogType: 'website',
        // Ad landing; keep indexable but distinct. Audit suggested noindex option — left indexable with unique canonical.
    },
    '/ai-ops-setup/book': {
        path: '/ai-ops-setup/book',
        title: 'Book your AI Ops Setup Session | Corefix',
        description:
            'Confirm your AI Ops Setup Session booking with Corefix. Pick a time after checkout or free-seat claim.',
        h1: 'Book your AI Ops Setup Session',
        ogType: 'website',
    },
    '/privacy': {
        path: '/privacy',
        title: 'Privacy Policy (DRAFT) | Corefix',
        description:
            'Draft privacy policy for Corefix: how we handle contact forms, calendar bookings, and voice demo calls.',
        h1: 'Privacy Policy',
        ogType: 'website',
    },
    '/terms': {
        path: '/terms',
        title: 'Terms of Use (DRAFT) | Corefix',
        description:
            'Draft terms of use for the Corefix website, demos, and booked consultations.',
        h1: 'Terms of Use',
        ogType: 'website',
    },
    '/404': {
        path: '/404',
        title: 'Page not found | Corefix',
        description: 'That page does not exist on Corefix.',
        h1: 'Page not found',
        ogType: 'website',
        noindex: true,
    },
};

export function canonicalFor(path) {
    if (path === '/' || path === '') return `${SITE}/`;
    return `${SITE}${path.endsWith('/') ? path.slice(0, -1) : path}`;
}

export function organizationJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Corefix',
        url: SITE,
        logo: `${SITE}/logo.svg`,
        email: 'hendrik@corefix.app',
        sameAs: ['https://www.linkedin.com/in/hendrikcorefix/'],
        founder: {
            '@type': 'Person',
            name: 'Hendrik',
            jobTitle: 'Founder',
        },
    };
}

export function websiteJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Corefix',
        url: SITE,
    };
}

export function homeServiceJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Speed-to-lead AI voice agents',
        serviceType: 'AI voice agent',
        description:
            'AI voice agents that pick up every call and web lead in seconds, day or night, and book it on your calendar.',
        provider: { '@type': 'Organization', name: 'Corefix', url: SITE },
        areaServed: 'North America',
        url: SITE,
    };
}

export function specStudioJsonLd() {
    const page = canonicalFor('/spec-studio');
    return [
        {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Spec Studio',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description:
                'AI pre-production review for print, packaging, and display manufacturers. Grades incoming specs against company standards.',
            provider: { '@type': 'Organization', name: 'Corefix', url: SITE },
            url: page,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Spec Studio',
            serviceType: 'AI pre-production spec review',
            description:
                'Grades print, packaging, and display specs against your standards before they reach the floor.',
            provider: { '@type': 'Organization', name: 'Corefix', url: SITE },
            url: page,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: 'Spec Studio walkthrough',
            description: 'See Spec Studio catch a real production issue in a short walkthrough.',
            thumbnailUrl: `${SITE}/assets/spec-reviewer-vsl-poster.jpg`,
            contentUrl: `${SITE}/assets/spec-reviewer-vsl.mp4`,
            uploadDate: '2026-09-01',
            publisher: { '@type': 'Organization', name: 'Corefix', url: SITE },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
                { '@type': 'ListItem', position: 2, name: 'Spec Studio', item: page },
            ],
        },
    ];
}

export function jsonLdForPath(path) {
    if (path === '/') {
        return [organizationJsonLd(), websiteJsonLd(), homeServiceJsonLd()];
    }
    if (path === '/spec-studio') {
        return [organizationJsonLd(), ...specStudioJsonLd()];
    }
    if (path.startsWith('/services/')) {
        const meta = ROUTES[path];
        return [
            organizationJsonLd(),
            {
                '@context': 'https://schema.org',
                '@type': 'Service',
                name: meta?.h1 || 'Corefix service',
                description: meta?.description,
                provider: { '@type': 'Organization', name: 'Corefix', url: SITE },
                url: canonicalFor(path),
            },
        ];
    }
    return [organizationJsonLd()];
}

/** Semantic crawler HTML injected into #root before React mounts. */
export function crawlerHtml(path) {
    const meta = ROUTES[path] || ROUTES['/404'];
    const canon = canonicalFor(meta.path === '/404' ? '/404' : path);
    if (path === '/') {
        return `
<main>
  <nav aria-label="Primary"><a href="/">Corefix</a> · <a href="/#voice-demo">Voice demo</a> · <a href="/spec-studio">Spec Studio</a> · <a href="/#contact">Contact</a> · <a href="${CAL_URL}">Book a call</a></nav>
  <h1>${meta.h1}</h1>
  <p>The business that answers first gets the job. Our AI voice agent picks up every call and web lead in seconds, day or night, and books it on your calendar.</p>
  <p><a href="/#voice-demo">Try the live voice demo</a> · <a href="${CAL_URL}">Book a demo</a></p>
  <p><a href="/spec-studio">Display or packaging manufacturer? See Spec Studio.</a></p>
  <p>Free missed-call check: we call your line after hours and show you what happens.</p>
  <p>Pilot from $297, then $397/mo, month to month.</p>
</main>`;
    }
    if (path === '/spec-studio') {
        return `
<main>
  <nav aria-label="Breadcrumb"><a href="/">Home</a> / Spec Studio</nav>
  <h1>${meta.h1}</h1>
  <p>AI pre-production review for print, packaging, and display manufacturers. Every incoming spec gets graded before it reaches the floor.</p>
  <p><a href="${CAL_URL}">Book a demo</a></p>
  <h2>Point 1 Displays case study</h2>
  <p>Montreal display manufacturer. Spec Studio replaced the pre-production review step after they lost their designer.</p>
  <h2>Walkthrough</h2>
  <p>See Spec Studio catch a real production issue. <a href="/assets/spec-reviewer-vsl.mp4">Watch the walkthrough video</a>.</p>
</main>`;
    }
    return `
<main>
  <nav><a href="/">Corefix</a></nav>
  <h1>${meta.h1}</h1>
  <p>${meta.description}</p>
  <p><a href="${CAL_URL}">Book a call</a> · <a href="/">Home</a></p>
</main>`;
}
