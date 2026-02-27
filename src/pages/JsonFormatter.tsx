import { useState } from 'react';

export default function JsonFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [indent, setIndent] = useState(2);

    const format = () => {
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, indent));
            setError('');
        } catch (e: any) {
            setError(e.message);
            setOutput('');
        }
    };

    const minify = () => {
        try {
            setOutput(JSON.stringify(JSON.parse(input)));
            setError('');
        } catch (e: any) {
            setError(e.message);
            setOutput('');
        }
    };

    const validate = () => {
        try {
            JSON.parse(input);
            setError('');
            setOutput('✅ Valid JSON');
        } catch (e: any) {
            setError(`❌ Invalid JSON: ${e.message}`);
            setOutput('');
        }
    };

    const handleCopy = async () => {
        if (output) await navigator.clipboard.writeText(output);
    };

    return (
        <div>
            <div className="page-header">
                <h1>JSON Formatter</h1>
                <p>Pretty-print, minify, and validate JSON data</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button className="btn btn-primary btn-sm" onClick={format}>🔧 Format</button>
                <button className="btn btn-sm" onClick={minify}>📦 Minify</button>
                <button className="btn btn-sm" onClick={validate}>✓ Validate</button>
                <button className="btn btn-sm" onClick={handleCopy}>📋 Copy</button>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Indent:</label>
                    <select
                        className="input"
                        value={indent}
                        onChange={(e) => setIndent(Number(e.target.value))}
                        style={{ width: '70px', padding: '5px 8px' }}
                    >
                        <option value={2}>2</option>
                        <option value={4}>4</option>
                        <option value={8}>8</option>
                    </select>
                </div>
            </div>

            {error && (
                <div style={{
                    padding: '10px 14px',
                    background: 'rgba(248, 113, 113, 0.1)',
                    border: '1px solid rgba(248, 113, 113, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--error)',
                    fontSize: '0.85rem',
                    marginBottom: '12px',
                    fontFamily: 'var(--font-mono)',
                }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Input</label>
                    <textarea
                        className="textarea"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='Paste your JSON here...'
                        style={{ minHeight: '450px' }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Output</label>
                    <textarea
                        className="textarea"
                        readOnly
                        value={output}
                        style={{ minHeight: '450px', background: 'var(--bg-secondary)' }}
                    />
                </div>
            </div>
        </div>
    );
}
