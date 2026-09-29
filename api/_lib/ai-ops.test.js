import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { validateIntake } from './ai-ops-intake.js';
import { claimSlot, freeCap, getSlots, storageMode } from './ai-ops-store.js';
import { checkoutFormFields, encodeStripeForm, siteOrigin } from '../create-checkout.js';

const intake = {
    name: 'Ada Lovelace',
    email: 'Ada@Example.com',
    company: 'Analytical Engines',
    stack: 'n8n',
    timeSink: 'Rewriting the same client update every morning',
};

const ENV_KEYS = [
    'BLOB_READ_WRITE_TOKEN',
    'BLOB_STORE_ID',
    'KV_REST_API_URL',
    'KV_REST_API_TOKEN',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'AI_OPS_FREE_CAP',
    'AI_OPS_FREE_CLAIMED',
];

async function withEnv(vars, fn) {
    const prev = {};
    for (const key of ENV_KEYS) prev[key] = process.env[key];
    for (const key of ENV_KEYS) delete process.env[key];
    Object.assign(process.env, vars);
    try {
        await fn();
    } finally {
        for (const key of ENV_KEYS) {
            if (prev[key] === undefined) delete process.env[key];
            else process.env[key] = prev[key];
        }
    }
}

test('intake normalizes email and rejects a missing stack', () => {
    const ok = validateIntake(intake);
    assert.equal(ok.intake.email, 'ada@example.com');
    assert.equal(validateIntake({ ...intake, stack: 'pop' }).error, 'Pick a stack');
    assert.equal(validateIntake({ ...intake, email: 'nope' }).error, 'A valid email is required');
});

test('env snapshot shows remaining seats and refuses to claim them', async () => {
    await withEnv({ AI_OPS_FREE_CAP: '3', AI_OPS_FREE_CLAIMED: '1' }, async () => {
        assert.equal(storageMode(), 'env');
        assert.equal(freeCap(), 3);
        const slots = await getSlots();
        assert.equal(slots.durable, false);
        assert.equal(slots.remaining, 2);
        assert.match(slots.blocker, /AI_OPS_FREE_CLAIMED/);
        const claim = await claimSlot(validateIntake(intake).intake);
        assert.equal(claim.status, 503);
        assert.equal(claim.body.code, 'storage_unconfigured');
    });
});

test('a full env snapshot sends the caller to the paid path', async () => {
    await withEnv({ AI_OPS_FREE_CAP: '3', AI_OPS_FREE_CLAIMED: '3' }, async () => {
        const claim = await claimSlot(validateIntake(intake).intake);
        assert.equal(claim.status, 409);
        assert.equal(claim.body.code, 'full');
        assert.equal(claim.body.remaining, 0);
    });
});

test('checkout is $97 CAD and keeps the Stripe session placeholder', () => {
    const fields = checkoutFormFields({
        intake: validateIntake(intake).intake,
        origin: 'https://corefix.app',
        priceId: '',
    });
    const body = encodeStripeForm(fields);
    assert.match(body, /\[currency\]=cad/);
    assert.match(body, /\[unit_amount\]=9700/);
    assert.match(body, /session_id%3D\{CHECKOUT_SESSION_ID\}/);
    assert.equal(body.includes('%7BCHECKOUT_SESSION_ID%7D'), false);
    const priced = checkoutFormFields({
        intake: validateIntake(intake).intake,
        origin: 'https://preview.example',
        priceId: 'price_123',
    });
    assert.equal(priced.some(([key, value]) => key === 'line_items[0][price]' && value === 'price_123'), true);
    assert.equal(siteOrigin({ headers: { host: 'localhost:5173' } }), 'http://localhost:5173');
});

test('this page does not mention Spec Reviewer or POP and keeps the locked copy', () => {
    const src = readFileSync(new URL('../../src/AiOpsSetup.jsx', import.meta.url), 'utf8');
    assert.equal(/spec reviewer/i.test(src), false);
    assert.equal(/\bPOP\b/.test(src), false);
    assert.equal(src.includes("href: '#flagship'") || src.includes('"/#flagship"'), false);
    for (const line of [
        'Get AI working in your business in 60 minutes',
        'A live screen-share session — not a sales call. You leave with a plan and a working starter.',
        "Solo operators and small teams (under ~20) who've tried ChatGPT but nothing stuck in the real workflow.",
        'Map top 3 time sinks',
        'Pick #1 that pays off first',
        'Leave with one-page priority list + one working starter (Grok Bot kit / n8n sketch / voice-agent outline)',
        '$97 · 60 min · 1:1',
        'Book your AI Ops Setup Session',
        '$97 credited toward fixed-scope build of #1.',
    ]) {
        assert.equal(src.includes(line), true, line);
    }
});
