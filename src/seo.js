/** Per-route SEO + JSON-LD. Canonicals always use www (apex redirects permanently). */
export const SITE = 'https://www.corefix.app';
export const OG_IMAGE = `${SITE}/og-image.png`;
export const OG_SPEC_STUDIO = `${SITE}/og-spec-studio.jpg`;
export const CAL_URL = 'https://cal.com/corefix.ai/30min';

export const HOME_FAQS = [
    {
        q: 'What does the voice agent cost?',
        a: 'One price: $297/mo (USD). If it doesn\'t catch a single lead in your first month, you get your money back. No lock-in contract. Cancel anytime with a month\'s notice.',
    },
    {
        q: 'Why is Spec Studio not priced here?',
        a: 'Spec Studio and deeper custom work are scoped after we see your workflows, so we do not publish a menu price for those. The voice agent is the listed offer at $297/mo.',
    },
    {
        q: 'Is the voice agent on this page real?',
        a: 'Yes. It is a live agent, not a recording. It checks the real calendar and books real meetings. It is also exactly what we would build for your business.',
    },
    {
        q: 'Do you work under NDA?',
        a: 'Yes. Client engagements run under NDA by default, which is also why we describe some work in general terms.',
    },
    {
        q: 'Who actually does the work?',
        a: 'Hendrik, the founder, scopes, builds, and ships every engagement personally, with an orchestrated fleet of AI agents doing the heavy lifting. No hand-offs to a junior team.',
    },
];

export const SPEC_FAQS = [
    {
        q: 'Is Spec Studio only for display manufacturers?',
        a: 'It was built for print, packaging, and display production, but the pattern (grade incoming documents against your own standards, cite every flag) transfers to any industry that bleeds money on non-conformant paperwork.',
    },
    {
        q: 'Does Spec Studio invent specs?',
        a: 'No. It is grounded in your own knowledge base (standards, press specs, dieline rules). It flags what is missing or non-conformant. It never invents a spec.',
    },
    {
        q: 'How do we get started?',
        a: 'Book a demo. We walk through a real sample against your standards and scope a fixed-price deployment if it fits.',
    },
];

export const STRATEGY_FAQS = [
    {
        q: 'What exactly do I get at the end of the sprint?',
        a: 'A complete strategy package: AI opportunity map, system architecture, implementation roadmap, risk assessment, vendor evaluation, and an executive summary. All actionable, no filler.',
    },
    {
        q: 'Do I need technical knowledge to participate?',
        a: 'Not at all. We translate complex AI concepts into business language. You bring the domain expertise; we handle the technical analysis.',
    },
    {
        q: 'What if we decide to build after the strategy sprint?',
        a: 'Your strategy sprint investment is credited toward any Build & Implementation engagement. The roadmap we create is designed to be executed by us or your internal team.',
    },
    {
        q: 'How is this different from a consulting firm?',
        a: 'We build AI systems. Our strategies are grounded in engineering reality, not theoretical frameworks. Every recommendation comes with a technical feasibility score and implementation path.',
    },
    {
        q: 'Can we start sooner than 4 weeks?',
        a: 'We typically kick off within 1-2 weeks of agreement. The 4-week timeline is for the sprint itself. Limited spots available each quarter.',
    },
];

/** Comparison points for voice agent vs a typical answering service (no named competitors). */
export const VOICE_COMPARE = {
    corefix: [
        'Flat $297/mo USD',
        'Money back if it does not catch a single lead in the first month',
        'No lock-in contract. Cancel anytime with a month\'s notice',
        'Answers 24/7 in the company\'s name',
        'Books jobs straight onto your calendar',
        'Texts the job details fast',
    ],
    typical: [
        'Custom quotes instead of a flat price',
        'Often billed per minute or per call',
        'Usually a contract',
        'Often takes a message instead of booking the job',
    ],
};

export const ROUTES = {
    '/': {
        path: '/',
        title: 'Speed to lead is what we do | AI Voice Agents | Corefix',
        description:
            'AI voice agents that answer every call and web lead in seconds, day or night, and book it on your calendar. Flat $297/mo.',
        h1: 'Speed to lead is what we do.',
        ogType: 'website',
        ogImage: OG_IMAGE,
    },
    '/spec-studio': {
        path: '/spec-studio',
        title: 'Spec Studio | AI Pre-Production Review | Corefix',
        description:
            'Spec Studio grades print, packaging, and display specs against your standards before production. Catch costly errors early. Book a demo.',
        h1: 'Spec Studio',
        ogType: 'website',
        ogImage: OG_SPEC_STUDIO,
    },
    '/services/ai-strategy': {
        path: '/services/ai-strategy',
        title: 'AI Strategy & Advisory | Corefix',
        description:
            'An execution-ready AI plan for where automation actually saves money. No slideware. Book a call with Corefix.',
        h1: 'AI Strategy & Advisory',
        ogType: 'website',
        ogImage: OG_IMAGE,
    },
    '/services/custom-agents': {
        path: '/services/custom-agents',
        title: 'Custom AI Agents & Voice | Corefix',
        description:
            'Live voice agents that answer, qualify, and book into your calendar. Custom agents built for your workflows by Corefix.',
        h1: 'Custom AI Agents',
        ogType: 'website',
        ogImage: OG_IMAGE,
    },
    '/ai-ops-setup': {
        path: '/ai-ops-setup',
        title: 'AI Ops Setup Session | Get AI Working in 60 Minutes | Corefix',
        description:
            'A focused 60-minute session to map time sinks and leave with a priority list plus a working starter. Book your AI Ops Setup.',
        h1: 'Get AI working in your business in 60 minutes',
        ogType: 'website',
        ogImage: OG_IMAGE,
    },
    '/ai-ops-setup/book': {
        path: '/ai-ops-setup/book',
        title: 'Book your AI Ops Setup Session | Corefix',
        description:
            'Confirm your AI Ops Setup Session booking with Corefix. Pick a time after checkout or free-seat claim.',
        h1: 'Book your AI Ops Setup Session',
        ogType: 'website',
        ogImage: OG_IMAGE,
    },
    '/privacy': {
        path: '/privacy',
        title: 'Privacy Policy (DRAFT) | Corefix',
        description:
            'Draft privacy policy for Corefix: how we handle contact forms, calendar bookings, and voice demo calls.',
        h1: 'Privacy Policy',
        ogType: 'website',
        ogImage: OG_IMAGE,
    },
    '/terms': {
        path: '/terms',
        title: 'Terms of Use (DRAFT) | Corefix',
        description:
            'Draft terms of use for the Corefix website, demos, and booked consultations.',
        h1: 'Terms of Use',
        ogType: 'website',
        ogImage: OG_IMAGE,
    },
    '/404': {
        path: '/404',
        title: 'Page not found | Corefix',
        description: 'That page does not exist on Corefix.',
        h1: 'Page not found',
        ogType: 'website',
        ogImage: OG_IMAGE,
        noindex: true,
        // 404 must not claim home as self-canonical / og:url
        canonicalPath: '/404',
    },
};

export function canonicalFor(path) {
    if (path === '/' || path === '') return `${SITE}/`;
    const clean = path.endsWith('/') ? path.slice(0, -1) : path;
    return `${SITE}${clean}`;
}

export function ogImageFor(path) {
    const meta = ROUTES[path] || ROUTES['/'];
    return meta.ogImage || OG_IMAGE;
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

export function faqPageJsonLd(faqs) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
            },
        })),
    };
}

export function specStudioJsonLd() {
    const page = canonicalFor('/spec-studio');
    // No SoftwareApplication: rich results need offers.price + aggregateRating/review,
    // and we will not invent ratings. Keep Service + VideoObject + FAQ + breadcrumbs.
    return [
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
            uploadDate: '2026-09-01T12:00:00-04:00',
            // Real file length from ffprobe (205.005s)
            duration: 'PT3M25S',
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
        faqPageJsonLd(SPEC_FAQS),
    ];
}

export function jsonLdForPath(path) {
    if (path === '/404') return [];
    if (path === '/') {
        return [organizationJsonLd(), websiteJsonLd(), homeServiceJsonLd(), faqPageJsonLd(HOME_FAQS)];
    }
    if (path === '/spec-studio') {
        return [organizationJsonLd(), ...specStudioJsonLd()];
    }
    if (path === '/services/ai-strategy') {
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
            faqPageJsonLd(STRATEGY_FAQS),
        ];
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

function navFooterLinks() {
    return `
  <nav aria-label="Primary">
    <a href="/">Corefix</a> ·
    <a href="/#voice-demo">Voice demo</a> ·
    <a href="/spec-studio">Spec Studio</a> ·
    <a href="/services/ai-strategy">AI Strategy</a> ·
    <a href="/services/custom-agents">Custom Agents</a> ·
    <a href="/#contact">Contact</a> ·
    <a href="${CAL_URL}">Book a call</a> ·
    <a href="/privacy">Privacy</a> ·
    <a href="/terms">Terms</a>
  </nav>`;
}

function footerBlock() {
    return `
  <footer>
    <p><a href="/">Corefix</a></p>
    <p><a href="/">Home</a> · <a href="/spec-studio">Spec Studio</a> · <a href="/#voice-demo">Voice Demo</a> · <a href="/#audit">Pricing</a> · <a href="/#contact">Contact</a></p>
    <p><a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href="mailto:hendrik@corefix.app">hendrik@corefix.app</a></p>
  </footer>`;
}

function compareTableHtml() {
    const left = VOICE_COMPARE.corefix.map((item) => `<li>${item}</li>`).join('');
    const right = VOICE_COMPARE.typical.map((item) => `<li>${item}</li>`).join('');
    return `
  <section aria-labelledby="compare-heading">
    <h2 id="compare-heading">Corefix voice agent vs a typical answering service</h2>
    <div>
      <h3>Corefix voice agent</h3>
      <ul>${left}</ul>
    </div>
    <div>
      <h3>Typical answering service</h3>
      <ul>${right}</ul>
    </div>
  </section>`;
}

function faqListHtml(faqs, heading = 'FAQ') {
    const items = faqs
        .map(
            (f) => `
    <details>
      <summary>${f.q}</summary>
      <p>${f.a}</p>
    </details>`
        )
        .join('');
    return `
  <section aria-label="${heading}">
    <h2>${heading}</h2>${items}
  </section>`;
}

/** Semantic crawler HTML injected into #root before React hydrates. */
export function crawlerHtml(path) {
    const meta = ROUTES[path] || ROUTES['/404'];

    if (path === '/') {
        return `
<main>
${navFooterLinks()}
  <h1>${meta.h1}</h1>
  <p>The business that answers first gets the job. Our AI voice agent picks up every call and web lead in seconds, day or night, and books it on your calendar.</p>
  <p><a href="/#voice-demo">Try the live voice demo</a> · <a href="${CAL_URL}">Book a demo</a></p>
  <p>No mic? Book on the calendar: <a href="${CAL_URL}">${CAL_URL}</a></p>
  <p><a href="/spec-studio">Display or packaging manufacturer? See Spec Studio.</a></p>
  <h2>Speed-to-lead voice agent pricing</h2>
  <p>$297/mo USD. If it does not catch a single lead in your first month, you get your money back. No lock-in contract. Cancel anytime with a month's notice.</p>
${compareTableHtml()}
${faqListHtml(HOME_FAQS, 'Everything you need to know before we build')}
${footerBlock()}
</main>`;
    }

    if (path === '/spec-studio') {
        return `
<main>
${navFooterLinks()}
  <nav aria-label="Breadcrumb"><a href="/">Home</a> / Spec Studio</nav>
  <h1>${meta.h1}</h1>
  <p>AI pre-production review for print, packaging, and display manufacturers. Every incoming spec gets graded before it reaches the floor: Pass, Needs Revision, or Reject, with every flag citing the company standard it violates.</p>
  <p><a href="${CAL_URL}">Book a demo</a></p>
  <h2>Point 1 Displays case study</h2>
  <p>Montreal display manufacturer. Spec Studio replaced the pre-production review step after they lost their designer. Spec errors that reach production burn roughly $500, worst case $2,000.</p>
  <h2>Walkthrough</h2>
  <p>See Spec Studio catch a real production issue. <a href="/assets/spec-reviewer-vsl.mp4">Watch the walkthrough video</a>.</p>
${faqListHtml(SPEC_FAQS, 'Spec Studio questions')}
${footerBlock()}
</main>`;
    }

    if (path === '/services/ai-strategy') {
        return `
<main>
${navFooterLinks()}
  <h1>${meta.h1}</h1>
  <p>${meta.description}</p>
  <p>We map where AI actually saves money in your operation, then hand you an execution-ready plan: opportunity map, architecture, roadmap, and risk assessment. No slideware.</p>
  <p><a href="${CAL_URL}">Book a call</a> · <a href="/">Home</a> · <a href="/services/custom-agents">Custom Agents</a></p>
${faqListHtml(STRATEGY_FAQS, 'Common questions')}
${footerBlock()}
</main>`;
    }

    if (path === '/services/custom-agents') {
        return `
<main>
${navFooterLinks()}
  <h1>${meta.h1}</h1>
  <p>${meta.description}</p>
  <p>Custom voice and workflow agents that answer, qualify, and book into your calendar. Built for your stack and measured in leads caught, not demos shipped.</p>
  <p><a href="${CAL_URL}">Book a call</a> · <a href="/">Home</a> · <a href="/#voice-demo">Try the live voice demo</a> · <a href="/services/ai-strategy">AI Strategy</a></p>
${footerBlock()}
</main>`;
    }

    if (path === '/ai-ops-setup') {
        return `
<main>
${navFooterLinks()}
  <h1>${meta.h1}</h1>
  <p>A live screen-share session, not a sales call. You leave with a plan and a working starter. $97 for 60 minutes, one-to-one.</p>
  <p>For solo operators and small teams (under about 20) who have tried ChatGPT but nothing stuck in the real workflow.</p>
  <p><a href="/ai-ops-setup/book">Book your session</a> · <a href="${CAL_URL}">General intro call</a> · <a href="/">Home</a></p>
${footerBlock()}
</main>`;
    }

    if (path === '/ai-ops-setup/book') {
        return `
<main>
${navFooterLinks()}
  <h1>${meta.h1}</h1>
  <p>Confirm your AI Ops Setup Session. Pick a time after checkout or free-seat claim. A live screen-share session: you leave with a plan and a working starter.</p>
  <p><a href="/ai-ops-setup">Back to the setup page</a> · <a href="/">Home</a></p>
${footerBlock()}
</main>`;
    }

    if (path === '/privacy' || path === '/terms') {
        return `
<main>
${navFooterLinks()}
  <h1>${meta.h1}</h1>
  <p>${meta.description}</p>
  <p>Draft for Hendrik review. Not final legal advice. Questions: <a href="mailto:hendrik@corefix.app">hendrik@corefix.app</a>.</p>
  <p><a href="/">Home</a></p>
${footerBlock()}
</main>`;
    }

    if (path === '/404') {
        return `
<main>
${navFooterLinks()}
  <h1>${meta.h1}</h1>
  <p>That URL is not part of Corefix. Head home or book a call.</p>
  <p><a href="/">Home</a> · <a href="${CAL_URL}">Book a call</a></p>
  <footer>
    <p><a href="/">Corefix</a></p>
    <p><a href="/">Home</a> · <a href="/spec-studio">Spec Studio</a> · <a href="/#contact">Contact</a></p>
  </footer>
</main>`;
    }

    return `
<main>
${navFooterLinks()}
  <h1>${meta.h1}</h1>
  <p>${meta.description}</p>
  <p><a href="${CAL_URL}">Book a call</a> · <a href="/">Home</a></p>
${footerBlock()}
</main>`;
}
