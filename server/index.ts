import express from 'express';
import compression from 'compression';
import path from 'path';
import statsRouter from './routes/stats';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Middleware
app.use(compression());
app.use(express.json({ limit: '1kb' })); // tiny limit — analytics payloads are small

// API routes
app.use('/api', statsRouter);

// In production, serve the built Vite frontend
if (isProd) {
    const clientDir = path.join(__dirname, '..', 'client');
    app.use(express.static(clientDir, {
        maxAge: '1y',
        immutable: true,
    }));

    // SPA fallback — serve index.html for all non-API routes
    app.get('*', (_req, res) => {
        res.sendFile(path.join(clientDir, 'index.html'));
    });
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Utility server running on http://localhost:${PORT}`);
    if (isProd) {
        console.log(`   Serving static files from dist/client`);
    } else {
        console.log(`   API-only mode — use Vite dev server for frontend`);
    }
});
