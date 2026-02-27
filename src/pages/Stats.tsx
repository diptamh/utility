import { useState, useEffect } from 'react';

interface StatsData {
    totalViews: number;
    uniqueVisitors: number;
    today: number;
    pages: { path: string; views: number }[];
    recent: { path: string; timestamp: string; screenWidth: number }[];
    daily: { date: string; views: number }[];
}

export default function Stats() {
    const [password, setPassword] = useState('');
    const [authed, setAuthed] = useState(false);
    const [data, setData] = useState<StatsData | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [range, setRange] = useState('30');

    const fetchStats = async (pw?: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/stats?days=${range}`, {
                headers: { Authorization: `Bearer ${pw || password}` },
            });
            if (res.status === 401) {
                setError('Invalid password');
                setAuthed(false);
                setLoading(false);
                return;
            }
            const json = await res.json();
            setData(json);
            setAuthed(true);
        } catch {
            setError('Failed to fetch stats');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (authed) fetchStats();
    }, [range]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        fetchStats();
    };

    if (!authed) {
        return (
            <div>
                <div className="page-header">
                    <h1>Analytics</h1>
                    <p>View site traffic and usage statistics</p>
                </div>
                <div className="card" style={{ maxWidth: '400px' }}>
                    <form onSubmit={handleLogin}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Password</label>
                        <input
                            className="input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter stats password..."
                            style={{ marginBottom: '12px' }}
                        />
                        {error && <div style={{ color: 'var(--error)', fontSize: '0.85rem', marginBottom: '8px' }}>{error}</div>}
                        <button className="btn btn-primary" type="submit" disabled={loading}>
                            {loading ? 'Loading…' : '🔓 View Stats'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1>Analytics Dashboard</h1>
                    <p>Site traffic and usage statistics</p>
                </div>
                <div className="tabs">
                    {[['7', '7 days'], ['30', '30 days'], ['90', '90 days']].map(([val, label]) => (
                        <button key={val} className={`tab ${range === val ? 'active' : ''}`} onClick={() => setRange(val)}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {data && (
                <>
                    {/* Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        <StatCard label="Total Page Views" value={data.totalViews} />
                        <StatCard label="Unique Visitors" value={data.uniqueVisitors} />
                        <StatCard label="Views Today" value={data.today} />
                        <StatCard label="Pages Tracked" value={data.pages.length} />
                    </div>

                    {/* Daily Chart */}
                    {data.daily.length > 0 && (
                        <div className="card" style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px' }}>Daily Views</h3>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '120px' }}>
                                {data.daily.map((d, i) => {
                                    const max = Math.max(...data.daily.map((x) => x.views), 1);
                                    const h = (d.views / max) * 100;
                                    return (
                                        <div
                                            key={i}
                                            title={`${d.date}: ${d.views} views`}
                                            style={{
                                                flex: 1,
                                                height: `${Math.max(h, 2)}%`,
                                                background: 'var(--accent)',
                                                borderRadius: '3px 3px 0 0',
                                                opacity: 0.7 + (h / 100) * 0.3,
                                                transition: 'height var(--transition-normal)',
                                            }}
                                        />
                                    );
                                })}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{data.daily[0]?.date}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{data.daily[data.daily.length - 1]?.date}</span>
                            </div>
                        </div>
                    )}

                    {/* Top Pages */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="card">
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>Top Pages</h3>
                            {data.pages.slice(0, 15).map((p, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '8px 0',
                                    borderBottom: i < data.pages.length - 1 ? '1px solid var(--border)' : 'none',
                                    fontSize: '0.85rem',
                                }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{p.path}</span>
                                    <span style={{ fontWeight: 500, color: 'var(--accent)' }}>{p.views}</span>
                                </div>
                            ))}
                        </div>

                        <div className="card">
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>Recent Visits</h3>
                            {data.recent.slice(0, 15).map((r, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '8px 0',
                                    borderBottom: i < data.recent.length - 1 ? '1px solid var(--border)' : 'none',
                                    fontSize: '0.85rem',
                                }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{r.path}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        {new Date(r.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', lineHeight: 1.2 }}>{value.toLocaleString()}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
        </div>
    );
}
