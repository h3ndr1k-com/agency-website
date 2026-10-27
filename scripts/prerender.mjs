#!/usr/bin/env node
/**
 * Post-build prerender: write per-route HTML with unique head tags,
 * www canonicals, JSON-LD, and crawler-visible H1/copy/links inside #root.
 * React replaces #root on hydrate; crawlers that skip JS still see content.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');

const seoMod = await import(pathToFileURL(join(root, 'src/seo.js')).href);
const {
    ROUTES,
    SITE,
    OG_IMAGE,
    canonicalFor,
    jsonLdForPath,
    crawlerHtml,
} = seoMod;

const template = readFileSync(join(dist, 'index.html'), 'utf8');

function applyHead(html, path) {
    const meta = ROUTES[path] || ROUTES['/404'];
    const canonical = canonicalFor(meta.path === '/404' ? '/' : meta.path);
    const jsonLd = jsonLdForPath(path === '/404' ? '/' : path);
    const robots = meta.noindex ? '\n  <meta name="robots" content="noindex, nofollow" />' : '';

    const jsonLdTags = (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
        .map((block) => `  <script type="application/ld+json">${JSON.stringify(block)}</script>`)
        .join('\n');

    let out = html;
    out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
    out = out.replace(
        /<meta name="description" content="[^"]*"\s*\/?>/,
        `<meta name="description" content="${escapeAttr(meta.description)}" />`
    );
    out = out.replace(
        /<link rel="canonical" href="[^"]*"\s*\/?>/,
        `<link rel="canonical" href="${canonical}" />`
    );
    out = out.replace(/property="og:url" content="[^"]*"/, `property="og:url" content="${canonical}"`);
    out = out.replace(/property="og:title" content="[^"]*"/, `property="og:title" content="${escapeAttr(meta.title)}"`);
    out = out.replace(
        /property="og:description" content="[^"]*"/,
        `property="og:description" content="${escapeAttr(meta.description)}"`
    );
    out = out.replace(/property="og:image" content="[^"]*"/, `property="og:image" content="${OG_IMAGE}"`);
    out = out.replace(/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${escapeAttr(meta.title)}"`);
    out = out.replace(
        /name="twitter:description" content="[^"]*"/,
        `name="twitter:description" content="${escapeAttr(meta.description)}"`
    );
    out = out.replace(/name="twitter:image" content="[^"]*"/, `name="twitter:image" content="${OG_IMAGE}"`);

    // Inject robots + JSON-LD before </head>
    out = out.replace('</head>', `${robots}\n${jsonLdTags}\n</head>`);

    const body = crawlerHtml(path === '/404' ? '/404' : path);
    out = out.replace(
        /<div id="root"><\/div>/,
        `<div id="root">${body}</div>`
    );
    return out;
}

function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, '&quot;');
}

function writeRoute(path, fileRel) {
    const html = applyHead(template, path);
    const outPath = join(dist, fileRel);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
    console.log('prerender', path, '→', fileRel);
}

const pages = [
    ['/', 'index.html'],
    ['/spec-studio', 'spec-studio/index.html'],
    ['/services/ai-strategy', 'services/ai-strategy/index.html'],
    ['/services/custom-agents', 'services/custom-agents/index.html'],
    ['/ai-ops-setup', 'ai-ops-setup/index.html'],
    ['/ai-ops-setup/book', 'ai-ops-setup/book/index.html'],
    ['/privacy', 'privacy/index.html'],
    ['/terms', 'terms/index.html'],
];

for (const [path, file] of pages) writeRoute(path, file);

// Real 404 document (Vercel serves /404.html with 404 status when present)
writeRoute('/404', '404.html');

// Ensure robots + sitemap copied (Vite copies public/ already; belt-and-suspenders)
for (const f of ['robots.txt', 'sitemap.xml']) {
    const src = join(root, 'public', f);
    if (existsSync(src)) copyFileSync(src, join(dist, f));
}

console.log('Prerender complete. Site:', SITE);
