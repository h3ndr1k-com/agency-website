import { useEffect } from 'react';
import { SITE, OG_IMAGE, canonicalFor, jsonLdForPath, ROUTES } from './seo.js';

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

function upsertLink(rel, href) {
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

function upsertJsonLd(blocks) {
    document.head.querySelectorAll('script[data-corefix-jsonld]').forEach((n) => n.remove());
    (Array.isArray(blocks) ? blocks : [blocks]).forEach((block) => {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.setAttribute('data-corefix-jsonld', '1');
        s.textContent = JSON.stringify(block);
        document.head.appendChild(s);
    });
}

/** Client-side head sync for SPA navigations. Prerender writes the same tags into static HTML. */
export default function SeoHead({ path }) {
    useEffect(() => {
        const meta = ROUTES[path] || ROUTES['/'];
        const canonical = canonicalFor(meta.path);
        document.title = meta.title;
        upsertMeta('name', 'description', meta.description);
        if (meta.noindex) upsertMeta('name', 'robots', 'noindex, nofollow');
        else {
            const robots = document.head.querySelector('meta[name="robots"]');
            if (robots) robots.remove();
        }
        upsertLink('canonical', canonical);
        upsertMeta('property', 'og:type', meta.ogType || 'website');
        upsertMeta('property', 'og:url', canonical);
        upsertMeta('property', 'og:title', meta.title);
        upsertMeta('property', 'og:description', meta.description);
        upsertMeta('property', 'og:image', OG_IMAGE);
        upsertMeta('property', 'og:site_name', 'Corefix');
        upsertMeta('name', 'twitter:card', 'summary_large_image');
        upsertMeta('name', 'twitter:title', meta.title);
        upsertMeta('name', 'twitter:description', meta.description);
        upsertMeta('name', 'twitter:image', OG_IMAGE);
        upsertJsonLd(jsonLdForPath(path));
    }, [path]);
    return null;
}

export { SITE, OG_IMAGE, canonicalFor };
