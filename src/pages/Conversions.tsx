import { useState } from 'react';

type Tab = 'base64' | 'url' | 'timestamp' | 'number' | 'color' | 'json-yaml';

export default function Conversions() {
    const [tab, setTab] = useState<Tab>('base64');

    return (
        <div>
            <div className="page-header">
                <h1>Quick Conversions</h1>
                <p>Encode, decode, and convert between common formats</p>
            </div>

            <div className="tabs" style={{ marginBottom: '20px' }}>
                {([
                    ['base64', 'Base64'],
                    ['url', 'URL Encode'],
                    ['timestamp', 'Timestamp'],
                    ['number', 'Number Base'],
                    ['color', 'Colors'],
                    ['json-yaml', 'JSON ↔ Text'],
                ] as [Tab, string][]).map(([key, label]) => (
                    <button key={key} className={`tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
                        {label}
                    </button>
                ))}
            </div>

            {tab === 'base64' && <Base64Tool />}
            {tab === 'url' && <UrlTool />}
            {tab === 'timestamp' && <TimestampTool />}
            {tab === 'number' && <NumberTool />}
            {tab === 'color' && <ColorTool />}
            {tab === 'json-yaml' && <JsonTextTool />}
        </div>
    );
}

function Base64Tool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const encode = () => { try { setOutput(btoa(input)); } catch { setOutput('Error: Invalid input'); } };
    const decode = () => { try { setOutput(atob(input)); } catch { setOutput('Error: Invalid Base64'); } };

    return (
        <ConverterLayout
            input={input} output={output} setInput={setInput}
            inputLabel="Input" outputLabel="Result"
            actions={[
                { label: 'Encode →', onClick: encode },
                { label: '← Decode', onClick: decode },
            ]}
        />
    );
}

function UrlTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    return (
        <ConverterLayout
            input={input} output={output} setInput={setInput}
            inputLabel="Input" outputLabel="Result"
            actions={[
                { label: 'Encode →', onClick: () => setOutput(encodeURIComponent(input)) },
                { label: '← Decode', onClick: () => { try { setOutput(decodeURIComponent(input)); } catch { setOutput('Error'); } } },
                { label: 'Encode URI', onClick: () => setOutput(encodeURI(input)) },
            ]}
        />
    );
}

function TimestampTool() {
    const [ts, setTs] = useState(Math.floor(Date.now() / 1000).toString());
    const [date, setDate] = useState('');

    const tsToDate = () => {
        const n = Number(ts);
        if (isNaN(n)) { setDate('Invalid timestamp'); return; }
        const ms = ts.length > 10 ? n : n * 1000;
        const d = new Date(ms);
        setDate([
            `UTC: ${d.toUTCString()}`,
            `Local: ${d.toLocaleString()}`,
            `ISO: ${d.toISOString()}`,
            `Unix (s): ${Math.floor(d.getTime() / 1000)}`,
            `Unix (ms): ${d.getTime()}`,
        ].join('\n'));
    };

    const setNow = () => setTs(Math.floor(Date.now() / 1000).toString());

    return (
        <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'start' }}>
                <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Unix Timestamp</label>
                    <input className="input" value={ts} onChange={(e) => setTs(e.target.value)} placeholder="e.g. 1700000000" />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                    <button className="btn btn-primary btn-sm" onClick={tsToDate}>Convert</button>
                    <button className="btn btn-sm" onClick={setNow}>Now</button>
                </div>
            </div>
            {date && (
                <pre style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.8, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                    {date}
                </pre>
            )}
        </div>
    );
}

function NumberTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const convert = () => {
        const trimmed = input.trim();
        let num: number;
        if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) num = parseInt(trimmed, 16);
        else if (trimmed.startsWith('0b') || trimmed.startsWith('0B')) num = parseInt(trimmed.slice(2), 2);
        else if (trimmed.startsWith('0o') || trimmed.startsWith('0O')) num = parseInt(trimmed.slice(2), 8);
        else num = parseInt(trimmed, 10);

        if (isNaN(num)) { setOutput('Invalid number'); return; }

        setOutput([
            `Decimal:     ${num}`,
            `Hexadecimal: 0x${num.toString(16).toUpperCase()}`,
            `Binary:      0b${num.toString(2)}`,
            `Octal:       0o${num.toString(8)}`,
        ].join('\n'));
    };

    return (
        <div className="card">
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Enter a number (decimal, 0x hex, 0b binary, 0o octal)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 255, 0xFF, 0b11111111" />
                <button className="btn btn-primary btn-sm" onClick={convert}>Convert</button>
            </div>
            {output && (
                <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{output}</pre>
            )}
        </div>
    );
}

function ColorTool() {
    const [hex, setHex] = useState('#6366f1');

    const hexToRgb = (h: string) => {
        const r = parseInt(h.slice(1, 3), 16);
        const g = parseInt(h.slice(3, 5), 16);
        const b = parseInt(h.slice(5, 7), 16);
        return { r, g, b };
    };

    const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0;
        const l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    };

    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    return (
        <div className="card">
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} style={{ width: '60px', height: '60px', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }} />
                <div>
                    <input className="input" value={hex} onChange={(e) => setHex(e.target.value)} style={{ width: '120px', fontFamily: 'var(--font-mono)' }} />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                <CopyBlock label="HEX" value={hex.toUpperCase()} />
                <CopyBlock label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
                <CopyBlock label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
                <CopyBlock label="CSS Custom Property" value={`--color: ${hex};`} />
            </div>
        </div>
    );
}

function JsonTextTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const prettify = () => {
        try { setOutput(JSON.stringify(JSON.parse(input), null, 2)); }
        catch { setOutput('Invalid JSON'); }
    };
    const minify = () => {
        try { setOutput(JSON.stringify(JSON.parse(input))); }
        catch { setOutput('Invalid JSON'); }
    };
    const escape = () => setOutput(JSON.stringify(input));
    const unescape = () => {
        try { setOutput(JSON.parse(input)); }
        catch { setOutput('Invalid escaped string'); }
    };

    return (
        <ConverterLayout
            input={input} output={output} setInput={setInput}
            inputLabel="Input" outputLabel="Result"
            actions={[
                { label: 'Prettify JSON', onClick: prettify },
                { label: 'Minify JSON', onClick: minify },
                { label: 'Escape String', onClick: escape },
                { label: 'Unescape String', onClick: unescape },
            ]}
        />
    );
}

// Shared Components
function CopyBlock({ label, value }: { label: string; value: string }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    return (
        <div
            onClick={copy}
            style={{
                padding: '12px',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                border: '1px solid var(--border)',
                transition: 'border-color var(--transition-fast)',
            }}
        >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                {copied ? '✓ Copied!' : value}
            </div>
        </div>
    );
}

function ConverterLayout({
    input, output, setInput, inputLabel, outputLabel, actions,
}: {
    input: string; output: string; setInput: (v: string) => void;
    inputLabel: string; outputLabel: string;
    actions: { label: string; onClick: () => void }[];
}) {
    return (
        <div className="card">
            <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>{inputLabel}</label>
                <textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text..." />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {actions.map((a) => (
                    <button key={a.label} className="btn btn-primary btn-sm" onClick={a.onClick}>{a.label}</button>
                ))}
            </div>
            {output && (
                <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>{outputLabel}</label>
                    <textarea className="textarea" readOnly value={output} style={{ background: 'var(--bg-secondary)' }} />
                </div>
            )}
        </div>
    );
}
