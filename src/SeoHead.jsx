import { useEffect, useRef } from 'react';
import { SITE, OG_IMAGE, canonicalFor, ogImageFor, jsonLdForPath, ROUTES } from './seo.js';

function upsertMeta(attr, key, content) {
    if (!content) return;
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function removeMeta(attr, key) {
    document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function upsertLink(rel, href) {
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

function clearJsonLd() {
    document.head
        .querySelectorAll('script[type="application/ld+json"]')
        .forEach((n) => n.remove());
}

function upsertJsonLd(blocks) {
    clearJsonLd();
    (Array.isArray(blocks) ? blocks : [blocks]).filter(Boolean).forEach((block) => {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.setAttribute('data-corefix-jsonld', '1');
        s.textContent = JSON.stringify(block);
        document.head.appendChild(s);
    });
}

/**
 * Client head sync for SPA navigations.
 * JSON-LD: prefer prerendered scripts on first paint (no duplicate inject).
 * Replace only when the route changes client-side.
 */
export default function SeoHead({ path }) {
    const prevPath = useRef(null);

    useEffect(() => {
        const meta = ROUTES[path] || ROUTES['/'];
        const is404 = path === '/404';
        const image = is404 ? OG_IMAGE : ogImageFor(path);

        document.title = meta.title;
        upsertMeta('name', 'description', meta.description);

        if (meta.noindex) upsertMeta('name', 'robots', 'noindex, nofollow');
        else document.head.querySelector('meta[name="robots"]')?.remove();

        if (is404) {
            document.head.querySelector('link[rel="canonical"]')?.remove();
            removeMeta('property', 'og:url');
            upsertMeta('property', 'og:type', meta.ogType || 'website');
            upsertMeta('property', 'og:title', meta.title);
            upsertMeta('property', 'og:description', meta.description);
            upsertMeta('property', 'og:image', image);
            upsertMeta('property', 'og:site_name', 'Corefix');
            upsertMeta('name', 'twitter:card', 'summary_large_image');
            upsertMeta('name', 'twitter:title', meta.title);
            upsertMeta('name', 'twitter:description', meta.description);
            upsertMeta('name', 'twitter:image', image);
            clearJsonLd();
            prevPath.current = path;
            return;
        }

        const canonical = canonicalFor(meta.path);
        upsertLink('canonical', canonical);
        upsertMeta('property', 'og:type', meta.ogType || 'website');
        upsertMeta('property', 'og:url', canonical);
        upsertMeta('property', 'og:title', meta.title);
        upsertMeta('property', 'og:description', meta.description);
        upsertMeta('property', 'og:image', image);
        upsertMeta('property', 'og:site_name', 'Corefix');
        upsertMeta('name', 'twitter:card', 'summary_large_image');
        upsertMeta('name', 'twitter:title', meta.title);
        upsertMeta('name', 'twitter:description', meta.description);
        upsertMeta('name', 'twitter:image', image);

        const existingLd = document.head.querySelectorAll('script[type="application/ld+json"]');
        const firstPaint = prevPath.current === null;

        if (firstPaint && existingLd.length > 0) {
            // Keep prerendered JSON-LD; tag for later SPA swaps.
            existingLd.forEach((s) => s.setAttribute('data-corefix-jsonld', '1'));
        } else if (!firstPaint && prevPath.current !== path) {
            upsertJsonLd(jsonLdForPath(path));
        } else if (firstPaint && existingLd.length === 0) {
            // Dev / createRoot without prerender
            upsertJsonLd(jsonLdForPath(path));
        }

        prevPath.current = path;
    }, [path]);

    return null;
}

export { SITE, OG_IMAGE, canonicalFor };
