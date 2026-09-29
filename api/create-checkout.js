// Stripe Checkout for the AI Ops Setup Session — $97 CAD.
// No Stripe keys are stored in the repo. If STRIPE_SECRET_KEY is missing the route returns 503.

import { oneLine, validateIntake } from './_lib/ai-ops-intake.js';
import { readJson, requestSearchParams, send } from './_lib/http.js';

export const STRIPE_BLOCKER =
    'Stripe is not configured. Set STRIPE_SECRET_KEY on Vercel. Optional: STRIPE_PRICE_ID_AI_OPS must be a one-time price of 9700 CAD; otherwise Checkout is created at unit_amount 9700 currency cad.';

const SESSION_ID = /^cs_[A-Za-z0-9_]+$/;

export function siteOrigin(req) {
    const hostHeader = req.headers['x-forwarded-host'] || req.headers.host || '';
    const host = String(hostHeader).split(',')[0].trim();
    if (!host) return 'https://corefix.app';
    const forwarded = req.headers['x-forwarded-proto'];
    const proto = forwarded
        ? String(forwarded).split(',')[0].trim()
        : (/localhost|127\.0\.0\.1/.test(host) ? 'http' : 'https');
    return `${proto}://${host}`;
}

export function encodeStripeForm(entries) {
    return entries.map(([key, value]) => {
        const encodedKey = encodeURIComponent(key).replace(/%5B/g, '[').replace(/%5D/g, ']');
        const encodedValue = encodeURIComponent(String(value)).replace(/%7BCHECKOUT_SESSION_ID%7D/g, '{CHECKOUT_SESSION_ID}');
        return `${encodedKey}=${encodedValue}`;
    }).join('&');
}

export function checkoutFormFields({ intake, origin, priceId }) {
    const fields = [
        ['mode', 'payment'],
        ['success_url', `${origin}/ai-ops-setup/book?session_id={CHECKOUT_SESSION_ID}`],
        ['cancel_url', `${origin}/ai-ops-setup?checkout=cancelled`],
        ['customer_email', intake.email],
        ['client_reference_id', intake.email.slice(0, 200)],
        ['metadata[offer]', 'ai-ops-setup'],
        ['metadata[name]', oneLine(intake.name, 120)],
        ['metadata[email]', intake.email],
        ['metadata[company]', oneLine(intake.company, 160)],
        ['metadata[stack]', intake.stack],
        ['metadata[timeSink]', oneLine(intake.timeSink, 450)],
        ['line_items[0][quantity]', '1'],
    ];

    if (priceId) {
        fields.push(['line_items[0][price]', priceId]);
    } else {
        fields.push(
            ['line_items[0][price_data][currency]', 'cad'],
            ['line_items[0][price_data][unit_amount]', '9700'],
            ['line_items[0][price_data][product_data][name]', 'AI Ops Setup Session'],
            ['line_items[0][price_data][product_data][description]', '60-minute 1:1 screen-share. $97 CAD credited toward a fixed-scope build.'],
        );
    }

    return fields;
}

async function stripeFetch(path, { method = 'GET', body } = {}) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        const err = new Error('missing stripe key');
        err.code = 'stripe_unconfigured';
        throw err;
    }
    const res = await fetch(`https://api.stripe.com${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${key}`,
            ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
        },
        body,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(data.error?.message || 'Stripe error');
        err.code = 'stripe_error';
        throw err;
    }
    return data;
}

async function assertAiOpsPrice(priceId) {
    const price = await stripeFetch(`/v1/prices/${encodeURIComponent(priceId)}`);
    if (price.currency !== 'cad' || price.unit_amount !== 9700) {
        const err = new Error('STRIPE_PRICE_ID_AI_OPS must be a one-time price of 9700 CAD');
        err.code = 'stripe_price';
        throw err;
    }
}

function stripeError(res, err) {
    console.error('create-checkout', err);
    if (err.code === 'stripe_unconfigured') {
        return send(res, 503, { ok: false, code: 'stripe_unconfigured', blocker: STRIPE_BLOCKER });
    }
    if (err.code === 'stripe_price') {
        return send(res, 503, { ok: false, code: 'stripe_price', blocker: err.message });
    }
    return send(res, 502, { ok: false, code: 'stripe_error', error: 'Stripe could not start checkout' });
}

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const sessionId = requestSearchParams(req).get('session_id') || '';
            if (!SESSION_ID.test(sessionId)) {
                return send(res, 400, { ok: false, code: 'invalid', error: 'Missing checkout session' });
            }
            const session = await stripeFetch(`/v1/checkout/sessions/${sessionId}`);
            if (session.payment_status !== 'paid') {
                return send(res, 402, { ok: false, code: 'unpaid' });
            }
            const meta = session.metadata || {};
            return send(res, 200, {
                ok: true,
                paid: true,
                intake: {
                    name: meta.name || session.customer_details?.name || '',
                    email: session.customer_details?.email || session.customer_email || meta.email || '',
                    company: meta.company || '',
                    stack: meta.stack || '',
                    timeSink: meta.timeSink || '',
                },
            });
        }

        if (req.method === 'POST') {
            let body;
            try {
                body = await readJson(req);
            } catch {
                return send(res, 400, { ok: false, code: 'invalid', error: 'Expected JSON' });
            }
            const parsed = validateIntake(body);
            if (parsed.error) return send(res, 400, { ok: false, code: 'invalid', error: parsed.error });

            const priceId = (process.env.STRIPE_PRICE_ID_AI_OPS || '').trim();
            if (priceId) await assertAiOpsPrice(priceId);

            const form = encodeStripeForm(checkoutFormFields({
                intake: parsed.intake,
                origin: siteOrigin(req),
                priceId,
            }));
            const session = await stripeFetch('/v1/checkout/sessions', { method: 'POST', body: form });
            return send(res, 200, { ok: true, url: session.url });
        }

        return send(res, 405, { error: 'Method not allowed' });
    } catch (err) {
        return stripeError(res, err);
    }
}
