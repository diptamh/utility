import { useState, useMemo } from 'react';

interface MatchInfo {
    index: number;
    match: string;
    groups: string[];
}

export default function RegexTester() {
    const [pattern, setPattern] = useState('(\\w+)@(\\w+\\.\\w+)');
    const [flags, setFlags] = useState('gi');
    const [testString, setTestString] = useState('Contact us at hello@example.com or support@domain.org for assistance.');
    const [error, setError] = useState('');

    const matches = useMemo<MatchInfo[]>(() => {
        if (!pattern) return [];
        try {
            const regex = new RegExp(pattern, flags);
            setError('');
            const results: MatchInfo[] = [];
            let m: RegExpExecArray | null;

            if (flags.includes('g')) {
                while ((m = regex.exec(testString)) !== null) {
                    results.push({
                        index: m.index,
                        match: m[0],
                        groups: m.slice(1),
                    });
                    if (!m[0]) break; // Prevent infinite loop on zero-width matches
                }
            } else {
                m = regex.exec(testString);
                if (m) {
                    results.push({ index: m.index, match: m[0], groups: m.slice(1) });
                }
            }
            return results;
        } catch (e: any) {
            setError(e.message);
            return [];
        }
    }, [pattern, flags, testString]);

    const highlightedText = useMemo(() => {
        if (!pattern || matches.length === 0) return testString;
        try {
            const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
            const parts: { text: string; isMatch: boolean }[] = [];
            let lastIdx = 0;
            let m: RegExpExecArray | null;
            while ((m = regex.exec(testString)) !== null) {
                if (m.index > lastIdx) parts.push({ text: testString.slice(lastIdx, m.index), isMatch: false });
                parts.push({ text: m[0], isMatch: true });
                lastIdx = m.index + m[0].length;
                if (!m[0]) break;
            }
            if (lastIdx < testString.length) parts.push({ text: testString.slice(lastIdx), isMatch: false });
            return parts;
        } catch {
            return testString;
        }
    }, [pattern, flags, testString, matches]);

    return (
        <div>
            <div className="page-header">
                <h1>Regex Tester</h1>
                <p>Test regular expressions with live match highlighting</p>
            </div>

            <div className="card" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Pattern</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>/</span>
                            <input
                                className="input"
                                value={pattern}
                                onChange={(e) => setPattern(e.target.value)}
                                placeholder="Enter regex pattern..."
                                style={{ fontFamily: 'var(--font-mono)' }}
                            />
                            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>/</span>
                        </div>
                    </div>
                    <div style={{ width: '80px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Flags</label>
                        <input
                            className="input"
                            value={flags}
                            onChange={(e) => setFlags(e.target.value)}
                            placeholder="gi"
                            style={{ fontFamily: 'var(--font-mono)' }}
                        />
                    </div>
                </div>

                {error && (
                    <div style={{ padding: '8px 12px', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--error)', fontSize: '0.85rem', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                        {error}
                    </div>
                )}

                <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Test String</label>
                    <textarea
                        className="textarea"
                        value={testString}
                        onChange={(e) => setTestString(e.target.value)}
                        placeholder="Enter text to test against..."
                        style={{ minHeight: '100px' }}
                    />
                </div>
            </div>

            {/* Highlighted output */}
            {typeof highlightedText !== 'string' && highlightedText.length > 0 && (
                <div className="card" style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Highlighted Matches</label>
                    <pre style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        margin: 0,
                    }}>
                        {(highlightedText as { text: string; isMatch: boolean }[]).map((part, i) => (
                            <span
                                key={i}
                                style={part.isMatch ? {
                                    background: 'rgba(99, 102, 241, 0.2)',
                                    border: '1px solid rgba(99, 102, 241, 0.4)',
                                    borderRadius: '3px',
                                    padding: '1px 3px',
                                    color: 'var(--accent-hover)',
                                } : undefined}
                            >
                                {part.text}
                            </span>
                        ))}
                    </pre>
                </div>
            )}

            {/* Match details */}
            {matches.length > 0 && (
                <div className="card">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                        {matches.length} match{matches.length !== 1 ? 'es' : ''} found
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {matches.map((m, i) => (
                            <div key={i} style={{
                                padding: '10px 14px',
                                background: 'var(--bg-input)',
                                borderRadius: 'var(--radius-sm)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem',
                            }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Match {i + 1} at index {m.index}: </span>
                                    <span style={{ color: 'var(--accent)' }}>"{m.match}"</span>
                                </div>
                                {m.groups.length > 0 && (
                                    <div style={{ marginTop: '4px', paddingLeft: '16px' }}>
                                        {m.groups.map((g, gi) => (
                                            <div key={gi} style={{ color: 'var(--text-secondary)' }}>
                                                Group {gi + 1}: <span style={{ color: 'var(--success)' }}>"{g}"</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
