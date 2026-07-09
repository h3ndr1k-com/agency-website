// Vapi server-tool webhook → Cal.com availability + booking on Hendrik's calendar.
// Vapi POSTs { message: { type: 'tool-calls', toolCallList: [{ id, name, arguments }] } }
// and expects { results: [{ toolCallId, result }] }.

const CAL_SLOTS = 'https://api.cal.com/v2/slots';
const CAL_BOOKINGS = 'https://api.cal.com/v2/bookings';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const secret = process.env.TOOL_WEBHOOK_SECRET;
    if (secret && req.headers['x-vapi-secret'] !== secret) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
    const message = body.message || {};
    if (message.type !== 'tool-calls' || !Array.isArray(message.toolCallList)) {
        res.status(400).json({ error: 'Expected tool-calls message' });
        return;
    }

    const results = await Promise.all(
        message.toolCallList.map(async (call) => {
            const name = call.name || call.function?.name;
            const args = call.arguments || call.function?.arguments || {};
            const parsed = typeof args === 'string' ? safeParse(args) : args;
            return {
                toolCallId: call.id,
                result: await runTool(name, parsed),
            };
        })
    );

    res.status(200).json({ results });
}

async function runTool(name, p) {
    try {
        if (name === 'get_availability') return await getAvailability(p);
        if (name === 'book_meeting') return await bookMeeting(p);
        return `Unknown tool: ${name}.`;
    } catch {
        return 'Something went wrong on my end. Ask the caller for a preferred time and try booking it directly, or point them to hendrik@corefix.app.';
    }
}

async function getAvailability({ date, timezone = 'UTC' }) {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return 'Which day should I check? I need a date like 2026-07-10.';
    }

    const apiKey = process.env.CALCOM_API_KEY;
    const eventTypeId = process.env.CALCOM_EVENT_TYPE_ID;
    if (!apiKey || !eventTypeId) {
        return 'Availability lookup is not configured yet — ask the caller for a time that works and try booking it.';
    }

    const url = new URL(CAL_SLOTS);
    url.searchParams.set('eventTypeId', eventTypeId);
    url.searchParams.set('start', `${date}T00:00:00.000Z`);
    url.searchParams.set('end', `${date}T23:59:59.999Z`);
    url.searchParams.set('timeZone', timezone);

    const r = await fetch(url, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'cal-api-version': process.env.CALCOM_SLOTS_VERSION || '2024-09-04',
        },
    });
    const data = await r.json().catch(() => ({}));

    const raw = data?.data || {};
    const slots = Array.isArray(raw[date]) ? raw[date] : Array.isArray(raw) ? raw : [];

    if (!slots.length) return `Nothing open on ${date}. Offer to check another day.`;

    const times = slots
        .slice(0, 6)
        .map((s) => (typeof s === 'string' ? s : s.start))
        .filter(Boolean)
        .join(', ');

    return `Open times on ${date} (${timezone}): ${times}. Ask which one works — you need the exact start time to book.`;
}

async function bookMeeting({ name, email, start, timezone, notes }) {
    if (!name || !email || !start || !timezone) {
        return 'Missing details — you still need the caller\'s name, email, exact start time, and timezone before booking.';
    }

    const apiKey = process.env.CALCOM_API_KEY;
    const eventTypeId = Number(process.env.CALCOM_EVENT_TYPE_ID);
    if (!apiKey || !eventTypeId) {
        return 'Booking is not fully configured yet. Tell the caller to email hendrik@corefix.app to set up a time.';
    }

    const r = await fetch(CAL_BOOKINGS, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'cal-api-version': process.env.CALCOM_API_VERSION || '2024-08-13',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            start,
            eventTypeId,
            attendee: { name, email, timeZone: timezone, language: 'en' },
            metadata: { source: 'corefix-voice-agent', ...(notes ? { notes: String(notes).slice(0, 500) } : {}) },
        }),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok || data.status === 'error') {
        const msg = data?.error?.message || data?.message || '';
        if (/no_available|not available|already|slot|booked|conflict|busy/i.test(msg)) {
            return 'That time just isn\'t available. Ask for another time and check again.';
        }
        return 'Booking hit a snag. Try a different time, or point the caller to hendrik@corefix.app.';
    }

    const booking = data.data || data;
    const when = booking.start || start;
    return `Booked. A calendar invite is on its way to ${email} for ${when}. Confirm it out loud and wrap up warmly.`;
}

function safeParse(s) {
    try {
        return JSON.parse(s);
    } catch {
        return {};
    }
}
