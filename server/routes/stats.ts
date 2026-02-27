import { Router, Request, Response } from 'express';
import { createHash } from 'crypto';
import { recordView, getStats } from '../db.js';

const router = Router();

// POST /api/track — record a page view
router.post('/track', (req: Request, res: Response) => {
    try {
        const { path, referrer, screenWidth } = req.body || {};
        if (!path || typeof path !== 'string') {
            res.status(400).json({ error: 'path required' });
            return;
        }

        // Hash the IP for privacy
        const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket.remoteAddress || '';
        const ipHash = createHash('sha256').update(ip + new Date().toISOString().slice(0, 10)).digest('hex').slice(0, 16);

        recordView({
            path: path.slice(0, 500),
            referrer: (referrer || '').slice(0, 500),
            screenWidth: Number(screenWidth) || 0,
            userAgent: (req.headers['user-agent'] || '').slice(0, 500),
            ipHash,
        });

        res.status(204).end();
    } catch (e) {
        console.error('Track error:', e);
        res.status(500).json({ error: 'Internal error' });
    }
});

// GET /api/stats — get analytics data (password protected)
router.get('/stats', (req: Request, res: Response) => {
    const password = process.env.STATS_PASSWORD || 'admin';
    const auth = req.headers.authorization;

    if (!auth || auth !== `Bearer ${password}`) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const days = Math.min(365, Math.max(1, Number(req.query.days) || 30));
        const stats = getStats(days);
        res.json(stats);
    } catch (e) {
        console.error('Stats error:', e);
        res.status(500).json({ error: 'Internal error' });
    }
});

export default router;
