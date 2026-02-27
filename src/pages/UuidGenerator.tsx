import { useState } from 'react';

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export default function UuidGenerator() {
    const [count, setCount] = useState(5);
    const [uuids, setUuids] = useState<string[]>(() =>
        Array.from({ length: 5 }, generateUUID)
    );
    const [uppercase, setUppercase] = useState(false);
    const [copied, setCopied] = useState<number | null>(null);

    const generate = () => {
        setUuids(Array.from({ length: count }, generateUUID));
    };

    const copyOne = async (uuid: string, index: number) => {
        await navigator.clipboard.writeText(uppercase ? uuid.toUpperCase() : uuid);
        setCopied(index);
        setTimeout(() => setCopied(null), 1500);
    };

    const copyAll = async () => {
        const text = uuids.map((u) => (uppercase ? u.toUpperCase() : u)).join('\n');
        await navigator.clipboard.writeText(text);
        setCopied(-1);
        setTimeout(() => setCopied(null), 1500);
    };

    return (
        <div>
            <div className="page-header">
                <h1>UUID Generator</h1>
                <p>Generate UUID v4 identifiers</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Count:</label>
                    <input
                        className="input"
                        type="number"
                        min={1}
                        max={100}
                        value={count}
                        onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
                        style={{ width: '80px' }}
                    />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
                    Uppercase
                </label>
                <button className="btn btn-primary btn-sm" onClick={generate}>🔄 Generate</button>
                <button className="btn btn-sm" onClick={copyAll}>
                    {copied === -1 ? '✓ Copied!' : '📋 Copy All'}
                </button>
            </div>

            <div className="card" style={{ padding: '8px' }}>
                {uuids.map((uuid, i) => (
                    <div
                        key={i}
                        onClick={() => copyOne(uuid, i)}
                        style={{
                            padding: '10px 14px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'background var(--transition-fast)',
                            color: copied === i ? 'var(--success)' : 'var(--text-primary)',
                            background: copied === i ? 'rgba(52, 211, 153, 0.08)' : 'transparent',
                        }}
                        onMouseEnter={(e) => { if (copied !== i) (e.target as HTMLElement).style.background = 'var(--bg-card-hover)'; }}
                        onMouseLeave={(e) => { if (copied !== i) (e.target as HTMLElement).style.background = 'transparent'; }}
                    >
                        {copied === i ? '✓ Copied!' : (uppercase ? uuid.toUpperCase() : uuid)}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Click any UUID to copy it
            </div>
        </div>
    );
}
