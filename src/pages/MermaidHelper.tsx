import { useState, useEffect, useRef, useCallback } from 'react';

const templates: Record<string, { label: string; code: string }> = {
    flowchart: {
        label: 'Flowchart',
        code: `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`,
    },
    sequence: {
        label: 'Sequence Diagram',
        code: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob!
    Bob-->>Alice: Hi Alice!
    Alice->>Bob: How are you?
    Bob-->>Alice: I'm good, thanks!`,
    },
    gantt: {
        label: 'Gantt Chart',
        code: `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Research       :a1, 2024-01-01, 7d
    Design         :a2, after a1, 5d
    section Development
    Frontend       :b1, after a2, 14d
    Backend        :b2, after a2, 14d
    section Testing
    QA             :c1, after b1, 7d`,
    },
    classDiagram: {
        label: 'Class Diagram',
        code: `classDiagram
    class Animal {
      +String name
      +int age
      +makeSound()
    }
    class Dog {
      +fetch()
    }
    class Cat {
      +purr()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
    },
    pie: {
        label: 'Pie Chart',
        code: `pie title Languages Used
    "JavaScript" : 40
    "TypeScript" : 30
    "Python" : 20
    "Other" : 10`,
    },
    er: {
        label: 'ER Diagram',
        code: `erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "is in"
    USER {
      int id
      string name
      string email
    }
    ORDER {
      int id
      date created
    }`,
    },
};

export default function MermaidHelper() {
    const [code, setCode] = useState(templates.flowchart.code);
    const [error, setError] = useState('');
    const previewRef = useRef<HTMLDivElement>(null);
    const [mermaidLoaded, setMermaidLoaded] = useState(false);

    // Load Mermaid from CDN on demand
    useEffect(() => {
        if ((window as any).mermaid) {
            setMermaidLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
        script.onload = () => {
            (window as any).mermaid.initialize({
                startOnLoad: false,
                theme: document.documentElement.getAttribute('data-theme') === 'light' ? 'default' : 'dark',
                securityLevel: 'loose',
            });
            setMermaidLoaded(true);
        };
        document.head.appendChild(script);
    }, []);

    const renderDiagram = useCallback(async () => {
        if (!mermaidLoaded || !previewRef.current) return;
        const mermaid = (window as any).mermaid;
        try {
            // Re-initialize with current theme
            mermaid.initialize({
                startOnLoad: false,
                theme: document.documentElement.getAttribute('data-theme') === 'light' ? 'default' : 'dark',
                securityLevel: 'loose',
            });
            const { svg } = await mermaid.render('mermaid-preview-' + Date.now(), code);
            previewRef.current.innerHTML = svg;
            setError('');
        } catch (e: any) {
            setError(e.message || 'Invalid Mermaid syntax');
            if (previewRef.current) previewRef.current.innerHTML = '';
        }
    }, [code, mermaidLoaded]);

    useEffect(() => {
        const timer = setTimeout(renderDiagram, 500);
        return () => clearTimeout(timer);
    }, [renderDiagram]);

    const handleExportSvg = () => {
        if (!previewRef.current) return;
        const svg = previewRef.current.querySelector('svg');
        if (!svg) return;
        const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.svg';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportPng = () => {
        if (!previewRef.current) return;
        const svg = previewRef.current.querySelector('svg');
        if (!svg) return;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const data = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            ctx.scale(2, 2);
            ctx.drawImage(img, 0, 0);
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = 'diagram.png';
            a.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(data)));
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1>Mermaid Helper</h1>
                    <p>Create diagrams with Mermaid.js — live preview</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button className="btn btn-sm" onClick={handleCopy}>📋 Copy Code</button>
                    <button className="btn btn-sm" onClick={handleExportSvg}>📥 SVG</button>
                    <button className="btn btn-sm" onClick={handleExportPng}>📥 PNG</button>
                </div>
            </div>

            <div className="tabs" style={{ marginBottom: '16px' }}>
                {Object.entries(templates).map(([key, t]) => (
                    <button
                        key={key}
                        className="tab"
                        onClick={() => setCode(t.code)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', minHeight: '500px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Mermaid Code</label>
                    <textarea
                        className="textarea"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        style={{ flex: 1, minHeight: '400px', resize: 'none' }}
                        spellCheck={false}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Preview</label>
                    <div
                        className="card"
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'auto',
                            minHeight: '400px',
                        }}
                    >
                        {!mermaidLoaded ? (
                            <span style={{ color: 'var(--text-muted)' }}>Loading Mermaid.js…</span>
                        ) : error ? (
                            <div style={{ color: 'var(--error)', fontSize: '0.85rem', padding: '20px', textAlign: 'center' }}>
                                ⚠️ {error}
                            </div>
                        ) : (
                            <div ref={previewRef} style={{ width: '100%', textAlign: 'center' }} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
