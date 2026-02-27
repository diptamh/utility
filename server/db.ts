import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'analytics.db');

let db: Database.Database;

export function getDb(): Database.Database {
    if (!db) {
        // Ensure data directory exists
        const dir = path.dirname(DB_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.pragma('busy_timeout = 5000');

        // Create tables
        db.exec(`
      CREATE TABLE IF NOT EXISTS page_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL,
        visitor_hash TEXT,
        referrer TEXT,
        screen_width INTEGER,
        user_agent TEXT,
        ip_hash TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_views_created ON page_views(created_at);
      CREATE INDEX IF NOT EXISTS idx_views_path ON page_views(path);
    `);
    }
    return db;
}

export function recordView(data: {
    path: string;
    referrer?: string;
    screenWidth?: number;
    userAgent?: string;
    ipHash?: string;
}) {
    const db = getDb();
    const stmt = db.prepare(
        `INSERT INTO page_views (path, referrer, screen_width, user_agent, ip_hash)
     VALUES (?, ?, ?, ?, ?)`
    );
    stmt.run(data.path, data.referrer || '', data.screenWidth || 0, data.userAgent || '', data.ipHash || '');
}

export function getStats(days: number) {
    const db = getDb();
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString();

    const totalViews = (db.prepare(
        `SELECT COUNT(*) as count FROM page_views WHERE created_at >= ?`
    ).get(sinceStr) as any)?.count || 0;

    const uniqueVisitors = (db.prepare(
        `SELECT COUNT(DISTINCT ip_hash) as count FROM page_views WHERE created_at >= ? AND ip_hash != ''`
    ).get(sinceStr) as any)?.count || 0;

    const todayStr = new Date().toISOString().slice(0, 10);
    const today = (db.prepare(
        `SELECT COUNT(*) as count FROM page_views WHERE date(created_at) = ?`
    ).get(todayStr) as any)?.count || 0;

    const pages = db.prepare(
        `SELECT path, COUNT(*) as views FROM page_views WHERE created_at >= ? GROUP BY path ORDER BY views DESC`
    ).all(sinceStr) as { path: string; views: number }[];

    const recent = db.prepare(
        `SELECT path, created_at as timestamp, screen_width as screenWidth FROM page_views ORDER BY created_at DESC LIMIT 50`
    ).all() as { path: string; timestamp: string; screenWidth: number }[];

    const daily = db.prepare(
        `SELECT date(created_at) as date, COUNT(*) as views FROM page_views WHERE created_at >= ? GROUP BY date(created_at) ORDER BY date ASC`
    ).all(sinceStr) as { date: string; views: number }[];

    return { totalViews, uniqueVisitors, today, pages, recent, daily };
}
