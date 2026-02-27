import { useState } from 'react';

async function computeHash(algorithm: string, text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGenerator() {
    const [input, setInput] = useState('');
    const [hashes, setHashes] = useState<Record<string, string>>({});
    const [copied, setCopied] = useState('');

    const generate = async () => {
        if (!input) return;
        const [sha1, sha256, sha384, sha512] = await Promise.all([
            computeHash('SHA-1', input),
            computeHash('SHA-256', input),
            computeHash('SHA-384', input),
            computeHash('SHA-512', input),
        ]);
        setHashes({ 'SHA-1': sha1, 'SHA-256': sha256, 'SHA-384': sha384, 'SHA-512': sha512 });
    };

    const copyHash = async (name: string, value: string) => {
        await navigator.clipboard.writeText(value);
        setCopied(name);
        setTimeout(() => setCopied(''), 1500);
    };

    return (
        <div>
            <div className="page-header">
                <h1>Hash Generator</h1>
                <p>Generate cryptographic hashes from text using Web Crypto API</p>
            </div>

            <div className="card" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Input Text</label>
                <textarea
                    className="textarea"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to hash..."
                    style={{ minHeight: '100px' }}
                />
                <div style={{ marginTop: '12px' }}>
                    <button className="btn btn-primary btn-sm" onClick={generate}>🔐 Generate Hashes</button>
                </div>
            </div>

            {Object.keys(hashes).length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.entries(hashes).map(([name, value]) => (
                        <div
                            key={name}
                            className="card"
                            onClick={() => copyHash(name, value)}
                            style={{ cursor: 'pointer', padding: '14px 18px' }}
                        >
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {name}
                            </div>
                            <div style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.8rem',
                                wordBreak: 'break-all',
                                lineHeight: 1.6,
                                color: copied === name ? 'var(--success)' : 'var(--text-primary)',
                            }}>
                                {copied === name ? '✓ Copied!' : value}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
