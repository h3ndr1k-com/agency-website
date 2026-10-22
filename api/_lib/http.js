export async function readJson(req) {
    if (Buffer.isBuffer(req.body)) {
        const raw = req.body.toString('utf8');
        return raw ? JSON.parse(raw) : {};
    }
    if (typeof req.body === 'string') return req.body ? JSON.parse(req.body) : {};
    if (req.body && typeof req.body === 'object') return req.body;

    const chunks = [];
    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const raw = Buffer.concat(chunks).toString('utf8');
    return raw ? JSON.parse(raw) : {};
}

export function send(res, status, body) {
    if (typeof res.setHeader === 'function') res.setHeader('Cache-Control', 'no-store');
    res.status(status).json(body);
}

export function requestSearchParams(req) {
    return new URL(req.url || '/', 'http://localhost').searchParams;
}
