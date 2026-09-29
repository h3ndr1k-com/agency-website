import { createHash, randomUUID } from 'node:crypto';
import { del, get, list, put } from '@vercel/blob';

export const STORAGE_BLOCKER =
    'Free claims are paused until a durable counter is connected (Vercel Blob or KV). The number on this page is the AI_OPS_FREE_CLAIMED snapshot and will not go down when someone books.';

const COUNTER_KEY = 'ai-ops-setup:claimed';
const SLOT_PREFIX = 'ai-ops-setup/slots/';

const CLAIM_LUA = `
local existing = redis.call('GET', KEYS[1])
if existing then
  return {'exists', existing}
end
local n = redis.call('INCR', KEYS[2])
local cap = tonumber(ARGV[1])
if n > cap then
  redis.call('DECR', KEYS[2])
  return {'full', tostring(cap)}
end
redis.call('SET', KEYS[1], ARGV[2])
redis.call('SET', KEYS[3], ARGV[2])
return {'ok', tostring(n)}
`;

export function freeCap() {
    const n = Number(process.env.AI_OPS_FREE_CAP ?? 3);
    if (!Number.isFinite(n) || n < 0 || n > 100) return 3;
    return Math.floor(n);
}

function envClaimed() {
    const n = Number(process.env.AI_OPS_FREE_CLAIMED ?? 0);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.floor(n);
}

function kvConfig() {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;
    return { url: url.replace(/\/$/, ''), token };
}

export function storageMode() {
    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) return 'blob';
    if (kvConfig()) return 'kv';
    return 'env';
}

function summary(cap, claimed) {
    return { cap, claimed, remaining: Math.max(0, cap - claimed) };
}

function newRecord(intake) {
    return {
        claimId: randomUUID(),
        name: intake.name,
        email: intake.email,
        company: intake.company,
        stack: intake.stack,
        timeSink: intake.timeSink,
        claimedAt: new Date().toISOString(),
    };
}

export function publicClaim(claim) {
    return {
        claimId: claim.claimId,
        name: claim.name,
        email: claim.email,
        company: claim.company,
        stack: claim.stack,
        timeSink: claim.timeSink,
    };
}

function emailHash(email) {
    return createHash('sha256').update(email).digest('hex');
}

function blobAccess() {
    return process.env.AI_OPS_BLOB_ACCESS === 'public' ? 'public' : 'private';
}

function blobOptions(extra = {}) {
    const options = { ...extra };
    if (process.env.BLOB_READ_WRITE_TOKEN) options.token = process.env.BLOB_READ_WRITE_TOKEN;
    return options;
}

function isAlreadyExists(err) {
    const msg = String(err?.message || '').toLowerCase();
    return msg.includes('already exists') || msg.includes('precondition') || err?.name === 'BlobPreconditionFailedError';
}

function isNotFound(err) {
    const msg = String(err?.message || '').toLowerCase();
    return err?.name === 'BlobNotFoundError' || msg.includes('does not exist') || msg.includes('not found');
}

async function readBlobJson(pathname) {
    try {
        const result = await get(pathname, blobOptions({ access: blobAccess(), useCache: false }));
        if (!result || result.statusCode === 404 || !result.stream) return null;
        const text = await new Response(result.stream).text();
        return text ? JSON.parse(text) : null;
    } catch (err) {
        if (isNotFound(err)) return null;
        throw err;
    }
}

async function listSlotBlobs() {
    const blobs = [];
    let cursor;
    do {
        const page = await list(blobOptions({ prefix: SLOT_PREFIX, cursor, limit: 100 }));
        blobs.push(...(page.blobs || []));
        cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return blobs;
}

function slotNumber(pathname) {
    const match = String(pathname || '').match(/\/(\d+)\.json$/);
    return match ? Number(match[1]) : null;
}

async function takenSlotNumbers() {
    const blobs = await listSlotBlobs();
    return new Set(blobs.map((blob) => slotNumber(blob.pathname)).filter((n) => n != null));
}

async function blobSummary(cap) {
    const taken = await takenSlotNumbers();
    return summary(cap, taken.size);
}

async function findBlobClaim(claimId) {
    const blobs = await listSlotBlobs();
    for (const blob of blobs) {
        const data = await readBlobJson(blob.pathname);
        if (data?.claimId === claimId) return data;
    }
    return null;
}

async function claimBlob(intake, cap) {
    const emailPath = `ai-ops-setup/emails/${emailHash(intake.email)}.json`;
    const existing = await readBlobJson(emailPath);
    if (existing?.claimId) {
        return {
            status: 200,
            body: { ok: true, alreadyClaimed: true, claimId: existing.claimId, ...(await blobSummary(cap)), durable: true, storage: 'blob' },
        };
    }

    const record = newRecord(intake);
    const putOptions = blobOptions({
        access: blobAccess(),
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: 'application/json',
    });

    for (let attempt = 0; attempt < cap + 2; attempt++) {
        const taken = await takenSlotNumbers();
        if (taken.size >= cap) {
            return { status: 409, body: { ok: false, code: 'full', ...(await blobSummary(cap)), durable: true, storage: 'blob' } };
        }
        let slot = null;
        for (let n = 1; n <= cap; n++) {
            if (!taken.has(n)) {
                slot = n;
                break;
            }
        }
        if (slot == null) continue;

        const slotPath = `${SLOT_PREFIX}${slot}.json`;
        try {
            await put(slotPath, JSON.stringify(record), putOptions);
        } catch (err) {
            if (isAlreadyExists(err)) continue;
            throw err;
        }

        try {
            await put(emailPath, JSON.stringify(record), putOptions);
        } catch (err) {
            await del(slotPath, blobOptions()).catch(() => {});
            if (isAlreadyExists(err)) {
                const winner = await readBlobJson(emailPath);
                if (winner?.claimId) {
                    return {
                        status: 200,
                        body: { ok: true, alreadyClaimed: true, claimId: winner.claimId, ...(await blobSummary(cap)), durable: true, storage: 'blob' },
                    };
                }
            }
            throw err;
        }

        return {
            status: 200,
            body: { ok: true, claimId: record.claimId, ...(await blobSummary(cap)), durable: true, storage: 'blob' },
        };
    }

    return { status: 409, body: { ok: false, code: 'full', ...(await blobSummary(cap)), durable: true, storage: 'blob' } };
}

async function redis(args) {
    const { url, token } = kvConfig();
    const res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) {
        const message = typeof data.error === 'string' ? data.error : 'KV request failed';
        throw new Error(message);
    }
    return data.result;
}

async function kvSummary(cap) {
    const raw = await redis(['GET', COUNTER_KEY]);
    const claimed = Number(raw || 0);
    return summary(cap, Number.isFinite(claimed) ? claimed : 0);
}

async function findKvClaim(claimId) {
    const raw = await redis(['GET', `ai-ops-setup:claim:${claimId}`]);
    return raw ? JSON.parse(raw) : null;
}

async function claimKv(intake, cap) {
    const record = newRecord(intake);
    const result = await redis([
        'EVAL',
        CLAIM_LUA,
        '3',
        `ai-ops-setup:email:${emailHash(intake.email)}`,
        COUNTER_KEY,
        `ai-ops-setup:claim:${record.claimId}`,
        String(cap),
        JSON.stringify(record),
    ]);
    const state = Array.isArray(result) ? result[0] : null;
    const payload = Array.isArray(result) ? result[1] : null;
    const counts = await kvSummary(cap);

    if (state === 'exists') {
        const existing = JSON.parse(payload);
        return { status: 200, body: { ok: true, alreadyClaimed: true, claimId: existing.claimId, ...counts, durable: true, storage: 'kv' } };
    }
    if (state === 'full') {
        return { status: 409, body: { ok: false, code: 'full', ...counts, durable: true, storage: 'kv' } };
    }
    if (state !== 'ok') throw new Error('KV claim returned an unexpected result');
    return { status: 200, body: { ok: true, claimId: record.claimId, ...counts, durable: true, storage: 'kv' } };
}

function storageFailure(err) {
    console.error('ai-ops store', err);
    return {
        status: 503,
        body: {
            ok: false,
            code: 'storage_error',
            error: 'Free-slot store failed',
            blocker: 'The free-slot counter could not be reached. Try again, or email hendrik@corefix.app.',
        },
    };
}

export async function getSlots() {
    const cap = freeCap();
    const mode = storageMode();
    if (mode === 'blob') return { ...(await blobSummary(cap)), durable: true, storage: 'blob' };
    if (mode === 'kv') return { ...(await kvSummary(cap)), durable: true, storage: 'kv' };
    const claimed = envClaimed();
    return { ...summary(cap, claimed), durable: false, storage: 'env', blocker: STORAGE_BLOCKER };
}

export async function getClaim(claimId) {
    if (!claimId || typeof claimId !== 'string' || !/^[0-9a-f-]{36}$/i.test(claimId)) return null;
    const mode = storageMode();
    if (mode === 'blob') return findBlobClaim(claimId);
    if (mode === 'kv') return findKvClaim(claimId);
    return null;
}

export async function claimSlot(intake) {
    const cap = freeCap();
    const mode = storageMode();
    try {
        if (mode === 'blob') return await claimBlob(intake, cap);
        if (mode === 'kv') return await claimKv(intake, cap);
        const slots = summary(cap, envClaimed());
        if (slots.remaining <= 0) {
            return { status: 409, body: { ok: false, code: 'full', ...slots, durable: false, storage: 'env' } };
        }
        return {
            status: 503,
            body: {
                ok: false,
                code: 'storage_unconfigured',
                ...slots,
                durable: false,
                storage: 'env',
                blocker: STORAGE_BLOCKER,
            },
        };
    } catch (err) {
        return storageFailure(err);
    }
}
