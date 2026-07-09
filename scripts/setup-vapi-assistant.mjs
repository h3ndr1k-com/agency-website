#!/usr/bin/env node
// Provisions the Corefix voice assistant on Vapi: two Cal.com tools + one assistant.
// Usage:
//   VAPI_API_KEY=... TOOL_WEBHOOK_SECRET=... SITE_URL=https://www.corefix.app node scripts/setup-vapi-assistant.mjs
//
// Prints the assistant id → set it as VITE_VAPI_ASSISTANT_ID (plus VITE_VAPI_PUBLIC_KEY
// from the Vapi dashboard) in Vercel env. To take real phone calls, buy/import a number
// in the Vapi dashboard and attach this assistant to it.

const API = 'https://api.vapi.ai';
const KEY = process.env.VAPI_API_KEY;
const SECRET = process.env.TOOL_WEBHOOK_SECRET || '';
const SITE = (process.env.SITE_URL || 'https://www.corefix.app').replace(/\/$/, '');

if (!KEY) {
    console.error('Missing VAPI_API_KEY (dashboard → Vapi API Keys → private key).');
    process.exit(1);
}

const headers = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
// Vapi's /tool API silently drops server.secret — send the shared secret as a custom header instead.
const server = { url: `${SITE}/api/vapi-tools`, ...(SECRET ? { headers: { 'x-corefix-secret': SECRET } } : {}) };

async function post(path, body) {
    const r = await fetch(`${API}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
        console.error(`POST ${path} failed (${r.status}):`, JSON.stringify(data, null, 2));
        process.exit(1);
    }
    return data;
}

const availabilityTool = await post('/tool', {
    type: 'function',
    function: {
        name: 'get_availability',
        description: 'Look up open intro-call slots on Hendrik\'s calendar for a specific day.',
        parameters: {
            type: 'object',
            properties: {
                date: { type: 'string', description: 'Day to check, format YYYY-MM-DD' },
                timezone: { type: 'string', description: 'Caller\'s IANA timezone, e.g. America/Toronto' },
            },
            required: ['date', 'timezone'],
        },
    },
    server,
});
console.log('✓ get_availability tool:', availabilityTool.id);

const bookingTool = await post('/tool', {
    type: 'function',
    function: {
        name: 'book_meeting',
        description: 'Book a confirmed intro call on Hendrik\'s calendar. Only call once you have name, email, exact start time, and timezone.',
        parameters: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Caller\'s full name' },
                email: { type: 'string', description: 'Caller\'s email, read back to confirm spelling' },
                start: { type: 'string', description: 'Exact slot start time in ISO 8601, taken from get_availability' },
                timezone: { type: 'string', description: 'Caller\'s IANA timezone' },
                notes: { type: 'string', description: 'One-line summary of what the caller wants help with' },
            },
            required: ['name', 'email', 'start', 'timezone'],
        },
    },
    server,
});
console.log('✓ book_meeting tool:', bookingTool.id);

const assistant = await post('/assistant', {
    name: 'Corefix Front Desk',
    firstMessage:
        'Hey, this is the Corefix AI assistant — and yes, I\'m the demo. Ask me anything about what we build, or I can book you straight into Hendrik\'s calendar. What brings you here?',
    model: {
        provider: 'openai',
        model: 'gpt-4o',
        toolIds: [availabilityTool.id, bookingTool.id],
        messages: [
            {
                role: 'system',
                content: `Today is {{"now" | date: "%A, %B %d, %Y", "America/Toronto"}}.

You are the voice assistant for Corefix, an AI consulting studio run by Hendrik (based in Toronto, works with clients across North America and Europe). You ARE the product demo: callers are judging whether Corefix can build voice agents by talking to you. Be sharp, warm, and brief — this is a voice call, so keep answers to one or two sentences unless asked to go deeper.

What Corefix does:
- Flagship: the Spec Reviewer — an AI pre-production spec reviewer for print, packaging and display manufacturers. It grades incoming spec files (Pass / Needs Revision / Reject), flags what's missing or non-conformant across 8 categories, and cites the exact company standard behind every flag. It never invents a spec. A single uncaught spec error typically costs a manufacturer around $500, worst case $2,000 — the reviewer catches those before production.
- Bolt-ons: voice agents like you (that take live calls and book meetings), email triage and workflow automation, document intelligence, and AI strategy work.
- The offer: a free AI audit — limited to 3 slots per month — where Hendrik maps out where AI actually saves a business money. Everything beyond that is custom-scoped with fixed-price proposals. Never quote specific project prices.

Booking flow (your main job):
1. If a caller shows interest, offer to book a free intro call with Hendrik.
2. Ask for their timezone (or infer from their city), then a day that suits them.
3. Use get_availability with that date and timezone. Offer at most 3 of the returned times, spoken naturally.
4. Collect their full name and email. Read the email back letter-group by letter-group to confirm.
5. Use book_meeting with the exact ISO start time from get_availability. Confirm the booking out loud.

Rules:
- Never claim to be human. If asked, say you're the Corefix demo agent.
- If a tool fails twice, apologize once and point them to hendrik@corefix.app.
- Don't discuss competitors, politics, or anything off-topic — steer back to how Corefix can help.
- If the caller is clearly just testing you, have fun with it, then invite them to book the free audit.`,
            },
        ],
    },
    voice: { provider: 'vapi', voiceId: 'Elliot' },
    transcriber: { provider: 'deepgram', model: 'nova-2', language: 'en' },
    clientMessages: ['transcript', 'speech-update', 'status-update'],
    endCallPhrases: ['goodbye', 'talk soon', 'have a great day'],
    maxDurationSeconds: 600,
});

console.log('✓ assistant:', assistant.id);
console.log('\nNext steps:');
console.log(`  1. Vercel env (Production + Preview): VITE_VAPI_ASSISTANT_ID=${assistant.id}`);
console.log('  2. Vercel env: VITE_VAPI_PUBLIC_KEY=<Vapi dashboard → API Keys → PUBLIC key>');
console.log('  3. Vercel env: CALCOM_API_KEY, CALCOM_EVENT_TYPE_ID, TOOL_WEBHOOK_SECRET (same secret used above)');
console.log('  4. Optional live phone line: Vapi dashboard → Phone Numbers → attach this assistant,');
console.log('     then set VITE_VOICE_PHONE_NUMBER="+1 ..." to display it on the site.');
