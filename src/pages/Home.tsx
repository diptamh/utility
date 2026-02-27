import { Link } from 'react-router-dom';

const tools = [
    { path: '/markdown', label: 'Markdown Editor', icon: '📝', desc: 'Read, write, and preview Markdown with live rendering' },
    { path: '/diff', label: 'Diff Checker', icon: '🔀', desc: 'Compare text and code side-by-side or inline' },
    { path: '/convert', label: 'Conversions', icon: '🔄', desc: 'Base64, URL encoding, timestamps, colors, and more' },
    { path: '/mermaid', label: 'Mermaid Helper', icon: '🧜', desc: 'Create flowcharts, sequence diagrams with live preview' },
    { path: '/json', label: 'JSON Formatter', icon: '📋', desc: 'Pretty-print, minify, and validate JSON data' },
    { path: '/uuid', label: 'UUID Generator', icon: '🔑', desc: 'Generate UUIDs in bulk with one-click copy' },
    { path: '/regex', label: 'Regex Tester', icon: '🔍', desc: 'Test regular expressions with live match highlighting' },
    { path: '/qrcode', label: 'QR Generator', icon: '📱', desc: 'Generate QR codes from text or URLs' },
    { path: '/lorem', label: 'Lorem Ipsum', icon: '📄', desc: 'Generate placeholder text for your designs' },
    { path: '/hash', label: 'Hash Generator', icon: '🔐', desc: 'Generate MD5, SHA-1, SHA-256 hashes from text' },
];

export default function Home() {
    return (
        <div>
            <div className="page-header">
                <h1>Developer Utility Tools</h1>
                <p>A lightweight toolkit for everyday development tasks</p>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
            }}>
                {tools.map((tool) => (
                    <Link
                        key={tool.path}
                        to={tool.path}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div className="card" style={{ cursor: 'pointer', height: '100%' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '10px',
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>{tool.icon}</span>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{tool.label}</h3>
                            </div>
                            <p style={{
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.5,
                            }}>
                                {tool.desc}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
