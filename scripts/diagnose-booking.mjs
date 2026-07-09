#!/usr/bin/env node
// Pinpoints why the Vapi voice agent isn't landing Cal.com bookings.
//
// Run locally (values stay on your machine — never paste keys into chat):
//   1. Put the real values in .env.local:
//        TOOL_WEBHOOK_SECRET=...        (the SAME secret you set on Vercel)
//        SITE_URL=https://www.corefix.app
//        VAPI_API_KEY=...               (optional — Vapi dashboard > API Keys > PRIVATE; enables assistant inspection)
//        VITE_VAPI_ASSISTANT_ID=...     (optional — printed by setup-vapi-assistant.mjs)
//   2. node --env-file=.env.local scripts/diagnose-booking.mjs
//
// It probes the LIVE production webhook (which reads Vercel's real env at runtime),
// so it tests the exact path the phone/voice agent hits.

const SITE = (process.env.SITE_URL || 'https://www.corefix.app').replace(/\/$/, '');
const SECRET = process.env.TOOL_WEBHOOK_SECRET || '';
const VAPI_KEY = process.env.VAPI_API_KEY || '';
const ASSISTANT_ID = process.env.VITE_VAPI_ASSISTANT_ID || '';
const WEBHOOK = `${SITE}/api/vapi-tools`;

const ok = (s) => `\x1b[32m${s}\x1b[0m`;
const bad = (s) => `\x1b[31m${s}\x1b[0m`;
const warn = (s) => `\x1b[33m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

console.log(`\nCorefix booking diagnostic → ${WEBHOOK}\n${'─'.repeat(60)}`);

if (!SECRET) {
    console.log(bad('✗ TOOL_WEBHOOK_SECRET not set in your environment.'));
    console.log(dim('  Add it to .env.local (same value as Vercel) and re-run.\n'));
    process.exit(1);
}

// Tomorrow, YYYY-MM-DD (no Date.now sensitivity needed — just a near-future day)
const d = new Date(Date.now() + 24 * 3600 * 1000);
const date = d.toISOString().slice(0, 10);

async function callTool(name, args) {
    const r = await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-vapi-secret': SECRET },
        body: JSON.stringify({
            message: { type: 'tool-calls', toolCallList: [{ id: 'diag', name, arguments: args }] },
        }),
    });
    let body = {};
    try { body = await r.json(); } catch {}
    const result = body?.results?.[0]?.result;
    return { status: r.status, result };
}

let verdict = null;

// ── 1. Auth + Cal read path via get_availability ──
console.log(`\n1. Probing get_availability (${date}, America/Toronto)…`);
const av = await callTool('get_availability', { date, timezone: 'America/Toronto' });

if (av.status === 401) {
    console.log(bad('   ✗ 401 Unauthorized'));
    verdict = `SECRET MISMATCH. The webhook rejected this secret, but your Vapi tools send whatever secret was set when setup ran. They differ.\n   FIX: make TOOL_WEBHOOK_SECRET identical in three places — Vercel env, this .env.local, and the value passed to scripts/setup-vapi-assistant.mjs. Re-run setup so the tools carry the matching secret, then update VITE_VAPI_ASSISTANT_ID on Vercel + redeploy.`;
} else if (av.status !== 200) {
    console.log(bad(`   ✗ HTTP ${av.status}`));
    verdict = `Webhook returned ${av.status}. Check the deployment is live and /api/vapi-tools exists.`;
} else {
    console.log(ok('   ✓ 200 — secret accepted by the live webhook'));
    console.log(dim(`   result: ${String(av.result).slice(0, 140)}`));
    if (/not configured/i.test(av.result || '')) {
        verdict = `CAL.COM ENV MISSING/WRONG on Vercel. The webhook authed fine but CALCOM_API_KEY or CALCOM_EVENT_TYPE_ID is empty/invalid at runtime.\n   FIX: on Vercel, confirm CALCOM_API_KEY (starts cal_live_…) and CALCOM_EVENT_TYPE_ID (the numeric id of the Intro Call event type) are set for Production, then redeploy.`;
    } else if (/nothing open/i.test(av.result || '')) {
        console.log(warn('   (no open slots that day — Cal creds work; try a day with availability)'));
    }
}

// ── 2. Booking write path (dry — only if availability path is healthy) ──
if (!verdict && av.status === 200) {
    console.log(`\n2. Testing book_meeting with a deliberately bad time (expect a graceful 'not available', NOT a config error)…`);
    const bk = await callTool('book_meeting', {
        name: 'Diagnostic Test',
        email: 'diagnostic@corefix.app',
        start: `${date}T02:00:00.000Z`, // 2am — almost certainly outside availability, so no real booking is created
        timezone: 'America/Toronto',
        notes: 'automated diagnostic — ignore',
    });
    console.log(dim(`   result: ${String(bk.result).slice(0, 160)}`));
    if (/not fully configured/i.test(bk.result || '')) {
        verdict = `CALCOM_EVENT_TYPE_ID missing on Vercel (booking path can't see it). FIX: set it for Production + redeploy.`;
    } else if (/booked/i.test(bk.result || '')) {
        console.log(warn('   ⚠ That off-hours time actually booked — Cal has no availability rules blocking it. Real bookings work; check your Cal availability windows.'));
        verdict = verdict || 'CHAIN WORKS end-to-end (a booking was created). If the agent still doesn\'t book on calls, the assistant prompt/tools aren\'t triggering book_meeting — see step 3.';
    } else {
        console.log(ok('   ✓ Cal.com reached and responded (no phantom booking created)'));
        verdict = verdict || 'WEBHOOK + CAL.COM CHAIN IS HEALTHY. If calls still don\'t book, the gap is Vapi-side: the assistant isn\'t calling book_meeting, or the tools aren\'t attached — see step 3.';
    }
}

// ── 3. Optional: inspect the Vapi assistant + its tools ──
if (VAPI_KEY && ASSISTANT_ID) {
    console.log(`\n3. Inspecting Vapi assistant ${ASSISTANT_ID}…`);
    try {
        const a = await fetch(`https://api.vapi.ai/assistant/${ASSISTANT_ID}`, {
            headers: { Authorization: `Bearer ${VAPI_KEY}` },
        }).then((r) => r.json());
        const toolIds = a?.model?.toolIds || [];
        console.log(`   model: ${a?.model?.provider}/${a?.model?.model}  toolIds: ${toolIds.length}`);
        for (const id of toolIds) {
            const t = await fetch(`https://api.vapi.ai/tool/${id}`, {
                headers: { Authorization: `Bearer ${VAPI_KEY}` },
            }).then((r) => r.json());
            const url = t?.server?.url;
            const hasSecret = !!(t?.server?.headers?.['x-corefix-secret'] || t?.server?.secret);
            const urlOk = url === WEBHOOK;
            console.log(`   • ${t?.function?.name || t?.type}  url=${url ? (urlOk ? ok(url) : bad(url)) : bad('(none)')}  secret=${hasSecret ? ok('set') : bad('MISSING')}`);
            if (url && !urlOk) verdict = `Tool server.url (${url}) ≠ live webhook (${WEBHOOK}). Re-run setup with SITE_URL=${SITE}.`;
            if (!hasSecret) verdict = `Tool "${t?.function?.name}" carries no secret header, but the webhook requires one → every call 401s. Re-run setup with TOOL_WEBHOOK_SECRET set.`;
        }
        const names = [];
        for (const id of toolIds) {
            const t = await fetch(`https://api.vapi.ai/tool/${id}`, { headers: { Authorization: `Bearer ${VAPI_KEY}` } }).then((r) => r.json());
            if (t?.function?.name) names.push(t.function.name);
        }
        for (const need of ['get_availability', 'book_meeting']) {
            if (!names.includes(need)) verdict = `Assistant is missing the "${need}" tool. Re-run scripts/setup-vapi-assistant.mjs and attach the printed tool ids.`;
        }
    } catch (e) {
        console.log(warn(`   (couldn't reach Vapi API: ${e.message})`));
    }
} else {
    console.log(dim(`\n3. Skipped Vapi assistant inspection (set VAPI_API_KEY + VITE_VAPI_ASSISTANT_ID in .env.local to enable).`));
}

console.log(`\n${'─'.repeat(60)}`);
console.log(verdict ? `VERDICT: ${verdict}` : ok('VERDICT: no problem detected on the paths tested.'));
console.log('');
