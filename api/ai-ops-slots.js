// Counted free seats for /ai-ops-setup. Not a promo code.
// Durable when BLOB_READ_WRITE_TOKEN / BLOB_STORE_ID or KV REST credentials are set.
// Otherwise AI_OPS_FREE_CLAIMED is a read-only snapshot and claims return 503.

import { readJson, requestSearchParams, send } from './_lib/http.js';
import { validateIntake } from './_lib/ai-ops-intake.js';
import { claimSlot, getClaim, getSlots, publicClaim } from './_lib/ai-ops-store.js';

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const claimId = requestSearchParams(req).get('claimId');
            if (claimId) {
                const claim = await getClaim(claimId);
                if (!claim) return send(res, 404, { ok: false, code: 'not_found', error: 'That free seat was not found.' });
                return send(res, 200, { ok: true, claim: publicClaim(claim) });
            }
            return send(res, 200, await getSlots());
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
            const result = await claimSlot(parsed.intake);
            return send(res, result.status, result.body);
        }

        return send(res, 405, { error: 'Method not allowed' });
    } catch (err) {
        console.error('ai-ops-slots', err);
        return send(res, 503, {
            ok: false,
            code: 'storage_error',
            blocker: 'The free-slot counter could not be reached. Try again, or email hendrik@corefix.app.',
        });
    }
}
