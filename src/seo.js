/** Per-route SEO + JSON-LD. Canonicals always use www (apex redirects permanently). */
export const SITE = 'https://www.corefix.app';
export const OG_IMAGE = `${SITE}/og-image.png`;
export const OG_VOICE_AGENT = `${SITE}/og-voice-agent.jpg`;
export const CAL_URL = 'https://cal.com/corefix.ai/30min';
/** YouTube channel for the footer. Leave empty to hide the link. */
export const YOUTUBE_URL = '';
export const PROCESS_STEPS = ['Diagnose', 'Design', 'Build', 'Proof'];
export const HOME_DESCRIPTION =
    'AI consulting for service businesses. Fixed-price engagements: we diagnose, design, build and prove AI systems that pay for themselves.';

export const HOME_FAQS = [
    {
        q: 'How do you price?',
        a: 'Every engagement is fixed-price. No hourly billing, no scope creep. You know the price before we start, and we quote it after a short intro call.',
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

/** Comparison points for voice agent vs a typical answering service (no named competitors, hedged). */
export const VOICE_COMPARE = {
    corefix: [
        'Fixed price, agreed before we start',
        'No hourly billing, no per-minute surprises',
        'Answers 24/7 in the company\'s name',
        'Books jobs straight onto your calendar',
        'Texts the job details fast',
    ],
    typical: [
        'Pricing is often custom rather than a single flat rate',
        'Some services bill per minute or per call',
        'Contracts are common',
        'Many services take a message instead of booking the job',
    ],
};

export const VOICE_FAQS = [
    {
        q: 'What does the voice agent cost?',
        a: 'Every engagement is fixed-price. No hourly billing, no scope creep. You know the price before we start, and we quote it after a short intro call.',
    },
    {
        q: 'Is the demo on this page real?',
        a: 'Yes. It is a live agent, not a recording. It checks the real calendar and books real meetings. It is also exactly what we would build for your business.',
    },
    {
        q: 'Does it answer in our company name?',
        a: 'Yes. It answers 24/7 in your company\'s name, books jobs on your calendar, and texts the job details fast.',
    },
    {
        q: 'What if we do not have a mic?',
        a: 'Book on the calendar. Same intro call, no microphone required.',
    },
];

export const ROUTES = {
    '/': {
        path: '/',
        title: 'AI That Pays for Itself | Fixed-Price AI Consulting | Corefix',
        description: HOME_DESCRIPTION,
        h1: 'AI that pays for itself.',
        ogType: 'website',
        ogImage: OG_IMAGE,
    },
    '/services/ai-strategy': {
        path: '/services/ai-strategy',
        title: 'AI Strategy & Advisory | Corefix',
        description:
            'An execution-ready AI plan for where automation actually saves money in your operation. No slideware. Book a strategy call with Corefix.',
        h1: 'AI Strategy & Advisory',
        ogType: 'website',
        ogImage: OG_IMAGE,
    },
    '/services/voice-agent': {
        path: '/services/voice-agent',
        title: 'AI Voice Agent | Every Call Answered and Booked | Corefix',
        description:
            'AI voice agent that answers every call and web lead day or night, books on your calendar, and texts job details fast. Fixed-price setup.',
        h1: 'Every call answered and booked, day or night.',
        ogType: 'website',
        ogImage: OG_VOICE_AGENT,
    },
    '/ai-ops-setup': {
        path: '/ai-ops-setup',
        title: 'AI Ops Setup Session | Get AI Working in 60 Minutes | Corefix',
        description:
            'A focused 60-minute session to map time sinks and leave with a priority list plus a working starter. Book your AI Ops Setup with Corefix.',
        h1: 'Get AI working in your business in 60 minutes',
        ogType: 'website',
        ogImage: OG_IMAGE,
    },
    '/ai-ops-setup/book': {
        path: '/ai-ops-setup/book',
        title: 'Book your AI Ops Setup Session | Corefix',
        description:
            'Confirm your AI Ops Setup Session booking with Corefix. Pick a time after checkout or free-seat claim on the calendar.',
        h1: 'Book your AI Ops Setup Session',
        ogType: 'website',
        ogImage: OG_IMAGE,
    },
    '/privacy': {
        path: '/privacy',
        title: 'Privacy Policy (DRAFT) | Corefix',
        description:
            'Draft privacy policy for Corefix covering how we handle contact forms, calendar bookings, and live voice demo calls.',
        h1: 'Privacy Policy',
        ogType: 'website',
        ogImage: OG_IMAGE,
    },
    '/terms': {
        path: '/terms',
        title: 'Terms of Use (DRAFT) | Corefix',
        description:
            'Draft terms of use for the Corefix website, product demos, voice agents, and booked consultations with our team.',
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
        name: 'Fixed-price AI consulting and implementation',
        serviceType: 'AI consulting',
        description: HOME_DESCRIPTION,
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

export function jsonLdForPath(path) {
    if (path === '/404') return [];
    if (path === '/') {
        return [organizationJsonLd(), websiteJsonLd(), homeServiceJsonLd(), faqPageJsonLd(HOME_FAQS)];
    }
    if (path === '/services/voice-agent') {
        const meta = ROUTES[path];
        const page = canonicalFor(path);
        return [
            organizationJsonLd(),
            {
                '@context': 'https://schema.org',
                '@type': 'Service',
                name: 'Corefix voice agent',
                serviceType: 'AI voice agent',
                description: meta?.description,
                provider: { '@type': 'Organization', name: 'Corefix', url: SITE },
                url: page,
            },
            {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
                    { '@type': 'ListItem', position: 2, name: 'Voice Agent', item: page },
                ],
            },
            faqPageJsonLd(VOICE_FAQS),
        ];
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
    <a href="/services/ai-strategy">AI Strategy</a> ·
    <a href="/services/voice-agent">Voice Agent</a> ·
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
    <p><a href="/">Home</a> · <a href="/services/voice-agent">Voice Agent</a> · <a href="/#voice-demo">Voice Demo</a> · <a href="/#services">Services</a> · <a href="/#team">About</a> · <a href="/#contact">Contact</a></p>
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
  <p>Fixed-price AI systems for service businesses. Diagnosed, designed, built and proven by the person you talk to.</p>
  <p><a href="${CAL_URL}">Book a call</a> · <a href="/#voice-demo">Hear the live voice demo</a></p>
  <h2>Services</h2>
  <ul>
    <li><a href="/services/voice-agent">Speed-to-Lead Systems</a></li>
    <li>Email Triage &amp; Workflow Automation</li>
    <li>AI Spec Review for print, packaging and display manufacturers</li>
    <li><a href="/services/ai-strategy">AI Strategy &amp; Advisory</a></li>
  </ul>
  <h2>Our process</h2>
  <p>Diagnose · Design · Build · Proof</p>
  <h2>Simple, fixed-price engagements</h2>
  <p>No hourly billing. No scope creep. You know the price before we start.</p>
${faqListHtml(HOME_FAQS, 'Everything you need to know before we build')}
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
  <p><a href="${CAL_URL}">Book a call</a> · <a href="/">Home</a> · <a href="/services/voice-agent">Voice Agent</a></p>
${faqListHtml(STRATEGY_FAQS, 'Common questions')}
${footerBlock()}
</main>`;
    }

    if (path === '/services/voice-agent') {
        return `
<main>
${navFooterLinks()}
  <h1>${meta.h1}</h1>
  <p>${meta.description}</p>
  <p>An AI voice agent that picks up in your company's name, books the job on your calendar, and texts you the details fast.</p>
  <p><a href="/services/voice-agent#voice-demo">Try the live voice demo</a> · <a href="${CAL_URL}">Book a call</a></p>
  <p>No mic? Book on the calendar: <a href="${CAL_URL}">${CAL_URL}</a></p>
  <h2>How it works</h2>
  <ol>
    <li>We wire it to your line and calendar</li>
    <li>It answers, qualifies, and books</li>
    <li>You get the details fast</li>
  </ol>
${compareTableHtml()}
  <h2>How we price</h2>
  <p>Fixed-price engagement. No hourly billing, no scope creep. You know the price before we start.</p>
${faqListHtml(VOICE_FAQS, 'Voice agent questions')}
  <p><a href="${CAL_URL}">Book a call</a></p>
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
    <p><a href="/">Home</a> · <a href="/#contact">Contact</a></p>
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
