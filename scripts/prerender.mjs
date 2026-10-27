#!/usr/bin/env node
/**
 * Post-build prerender: renderToString real route components so hydrateRoot matches.
 * Also writes unique head tags, www canonicals, and JSON-LD.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createServer } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');

const seoMod = await import(pathToFileURL(join(root, 'src/seo.js')).href);
const {
    ROUTES,
    SITE,
    OG_IMAGE,
    canonicalFor,
    ogImageFor,
    jsonLdForPath,
} = seoMod;

const template = readFileSync(join(dist, 'index.html'), 'utf8');

const vite = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
});

let render;
try {
    const mod = await vite.ssrLoadModule('/src/entry-server.jsx');
    render = mod.render;
} catch (err) {
    await vite.close();
    console.error('SSR load failed:', err);
    process.exit(1);
}

function applyHead(html, path, body) {
    const meta = ROUTES[path] || ROUTES['/404'];
    const is404 = path === '/404' || meta.path === '/404';
    const jsonLd = is404 ? [] : jsonLdForPath(path);
    const ogImage = is404 ? OG_IMAGE : ogImageFor(path);
    const robots = meta.noindex ? '\n  <meta name="robots" content="noindex, nofollow" />' : '';

    const jsonLdTags = (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
        .filter(Boolean)
        .map(
            (block) =>
                `  <script type="application/ld+json" data-corefix-jsonld="1">${JSON.stringify(block)}</script>`
        )
        .join('\n');

    let out = html;
    out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
    out = out.replace(
        /<meta name="description" content="[^"]*"\s*\/?>/,
        `<meta name="description" content="${escapeAttr(meta.description)}" />`
    );

    if (is404) {
        out = out.replace(/<link rel="canonical" href="[^"]*"\s*\/?>\s*/g, '');
        out = out.replace(/\s*<meta property="og:url" content="[^"]*"\s*\/?>/g, '');
    } else {
        const canonical = canonicalFor(meta.path);
        out = out.replace(
            /<link rel="canonical" href="[^"]*"\s*\/?>/,
            `<link rel="canonical" href="${canonical}" />`
        );
        out = out.replace(/property="og:url" content="[^"]*"/, `property="og:url" content="${canonical}"`);
    }

    out = out.replace(/property="og:title" content="[^"]*"/, `property="og:title" content="${escapeAttr(meta.title)}"`);
    out = out.replace(
        /property="og:description" content="[^"]*"/,
        `property="og:description" content="${escapeAttr(meta.description)}"`
    );
    out = out.replace(/property="og:image" content="[^"]*"/, `property="og:image" content="${ogImage}"`);
    out = out.replace(/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${escapeAttr(meta.title)}"`);
    out = out.replace(
        /name="twitter:description" content="[^"]*"/,
        `name="twitter:description" content="${escapeAttr(meta.description)}"`
    );
    out = out.replace(/name="twitter:image" content="[^"]*"/, `name="twitter:image" content="${ogImage}"`);

    let preload = '';
    if (path === '/spec-studio') {
        preload = `
  <link rel="preload" as="image" href="/img/spec-studio-hero-800.webp" type="image/webp" imagesrcset="/img/spec-studio-hero-800.webp 800w, /img/spec-studio-hero-1200.webp 1200w" imagesizes="100vw" fetchpriority="high" />`;
    } else if (path === '/services/voice-agent') {
        preload = `
  <link rel="preload" as="image" href="/img/voice-agent-hero-800.webp" type="image/webp" imagesrcset="/img/voice-agent-hero-800.webp 800w, /img/voice-agent-hero-1200.webp 1200w" imagesizes="100vw" fetchpriority="high" />`;
    }

    out = out.replace('</head>', `${robots}\n${jsonLdTags}${preload}\n</head>`);
    out = out.replace(/<div id="root"><\/div>/, `<div id="root">${body}</div>`);
    return out;
}

function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, '&quot;');
}

function writeRoute(path, fileRel) {
    const body = render(path === '/404' ? '/404' : path);
    const html = applyHead(template, path, body);
    const outPath = join(dist, fileRel);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
    console.log('prerender', path, '→', fileRel, `(${body.length} chars)`);
}

const pages = [
    ['/', 'index.html'],
    ['/spec-studio', 'spec-studio/index.html'],
    ['/services/ai-strategy', 'services/ai-strategy/index.html'],
    ['/services/voice-agent', 'services/voice-agent/index.html'],
    ['/ai-ops-setup', 'ai-ops-setup/index.html'],
    ['/ai-ops-setup/book', 'ai-ops-setup/book/index.html'],
    ['/privacy', 'privacy/index.html'],
    ['/terms', 'terms/index.html'],
];

try {
    for (const [path, file] of pages) writeRoute(path, file);
    writeRoute('/404', '404.html');
} finally {
    await vite.close();
}

for (const f of ['robots.txt', 'sitemap.xml']) {
    const src = join(root, 'public', f);
    if (existsSync(src)) copyFileSync(src, join(dist, f));
}

console.log('Prerender complete. Site:', SITE);
