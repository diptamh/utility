import { useState, useMemo } from 'react';
import { diffLines, diffWords, diffChars } from 'diff';

type DiffMode = 'lines' | 'words' | 'chars';

export default function DiffChecker() {
    const [left, setLeft] = useState('');
    const [right, setRight] = useState('');
    const [mode, setMode] = useState<DiffMode>('lines');
    const [view, setView] = useState<'inline' | 'side'>('inline');

    const diff = useMemo(() => {
        if (!left && !right) return [];
        switch (mode) {
            case 'words': return diffWords(left, right);
            case 'chars': return diffChars(left, right);
            default: return diffLines(left, right);
        }
    }, [left, right, mode]);

    const stats = useMemo(() => {
        let added = 0, removed = 0, unchanged = 0;
        diff.forEach(d => {
            const count = d.count || 0;
            if (d.added) added += count;
            else if (d.removed) removed += count;
            else unchanged += count;
        });
        return { added, removed, unchanged };
    }, [diff]);

    const handleSwap = () => {
        setLeft(right);
        setRight(left);
    };

    const handleClear = () => {
        setLeft('');
        setRight('');
    };

    const handleSample = () => {
        setLeft(`function greet(name) {\n  console.log("Hello, " + name);\n  return true;\n}\n\nconst result = greet("World");`);
        setRight(`function greet(name, greeting = "Hello") {\n  console.log(greeting + ", " + name + "!");\n  return { success: true };\n}\n\nconst result = greet("World", "Hi");`);
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1>Diff Checker</h1>
                    <p>Compare text and code to find differences</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button className="btn btn-sm" onClick={handleSample}>📝 Sample</button>
                    <button className="btn btn-sm" onClick={handleSwap}>⇄ Swap</button>
                    <button className="btn btn-sm" onClick={handleClear}>✕ Clear</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Original</label>
                    <textarea
                        className="textarea"
                        value={left}
                        onChange={(e) => setLeft(e.target.value)}
                        placeholder="Paste original text here..."
                        style={{ minHeight: '200px' }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Modified</label>
                    <textarea
                        className="textarea"
                        value={right}
                        onChange={(e) => setRight(e.target.value)}
                        placeholder="Paste modified text here..."
                        style={{ minHeight: '200px' }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div className="tabs">
                    {(['lines', 'words', 'chars'] as DiffMode[]).map((m) => (
                        <button key={m} className={`tab ${mode === m ? 'active' : ''}`} onClick={() => setMode(m)}>
                            {m.charAt(0).toUpperCase() + m.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="tabs">
                    <button className={`tab ${view === 'inline' ? 'active' : ''}`} onClick={() => setView('inline')}>Inline</button>
                    <button className={`tab ${view === 'side' ? 'active' : ''}`} onClick={() => setView('side')}>Side by Side</button>
                </div>
                {(left || right) && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        <span style={{ color: 'var(--success)' }}>+{stats.added}</span>
                        {' / '}
                        <span style={{ color: 'var(--error)' }}>-{stats.removed}</span>
                        {' / '}
                        <span>{stats.unchanged} unchanged</span>
                    </div>
                )}
            </div>

            {diff.length > 0 && (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {view === 'inline' ? (
                        <pre style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.85rem',
                            lineHeight: 1.6,
                            padding: '20px',
                            margin: 0,
                            overflow: 'auto',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}>
                            {diff.map((part, i) => (
                                <span
                                    key={i}
                                    style={{
                                        background: part.added
                                            ? 'rgba(52, 211, 153, 0.15)'
                                            : part.removed
                                                ? 'rgba(248, 113, 113, 0.15)'
                                                : 'transparent',
                                        color: part.added
                                            ? 'var(--success)'
                                            : part.removed
                                                ? 'var(--error)'
                                                : 'var(--text-primary)',
                                        textDecoration: part.removed ? 'line-through' : 'none',
                                    }}
                                >
                                    {part.value}
                                </span>
                            ))}
                        </pre>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                            <pre style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem',
                                lineHeight: 1.6,
                                padding: '20px',
                                margin: 0,
                                overflow: 'auto',
                                borderRight: '1px solid var(--border)',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                            }}>
                                {diff.map((part, i) =>
                                    !part.added ? (
                                        <span
                                            key={i}
                                            style={{
                                                background: part.removed ? 'rgba(248, 113, 113, 0.15)' : 'transparent',
                                                color: part.removed ? 'var(--error)' : 'var(--text-primary)',
                                            }}
                                        >
                                            {part.value}
                                        </span>
                                    ) : null
                                )}
                            </pre>
                            <pre style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem',
                                lineHeight: 1.6,
                                padding: '20px',
                                margin: 0,
                                overflow: 'auto',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                            }}>
                                {diff.map((part, i) =>
                                    !part.removed ? (
                                        <span
                                            key={i}
                                            style={{
                                                background: part.added ? 'rgba(52, 211, 153, 0.15)' : 'transparent',
                                                color: part.added ? 'var(--success)' : 'var(--text-primary)',
                                            }}
                                        >
                                            {part.value}
                                        </span>
                                    ) : null
                                )}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
