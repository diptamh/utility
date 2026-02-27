import { useState, useMemo } from 'react';

const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function generateWords(count: number): string {
    const words: string[] = [];
    for (let i = 0; i < count; i++) {
        words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
    }
    // Capitalize first word
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ') + '.';
}

function generateSentences(count: number): string {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) {
        const wordCount = 8 + Math.floor(Math.random() * 12);
        const startIdx = Math.floor(Math.random() * LOREM_WORDS.length);
        const words: string[] = [];
        for (let j = 0; j < wordCount; j++) {
            words.push(LOREM_WORDS[(startIdx + j) % LOREM_WORDS.length]);
        }
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        sentences.push(words.join(' ') + '.');
    }
    return sentences.join(' ');
}

function generateParagraphs(count: number): string {
    const paragraphs: string[] = [];
    for (let i = 0; i < count; i++) {
        const sentenceCount = 3 + Math.floor(Math.random() * 4);
        paragraphs.push(generateSentences(sentenceCount));
    }
    return paragraphs.join('\n\n');
}

type Mode = 'paragraphs' | 'sentences' | 'words';

export default function LoremIpsum() {
    const [mode, setMode] = useState<Mode>('paragraphs');
    const [count, setCount] = useState(3);
    const [copied, setCopied] = useState(false);

    const text = useMemo(() => {
        switch (mode) {
            case 'words': return generateWords(count);
            case 'sentences': return generateSentences(count);
            case 'paragraphs': return generateParagraphs(count);
        }
    }, [mode, count]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div>
            <div className="page-header">
                <h1>Lorem Ipsum Generator</h1>
                <p>Generate placeholder text for your designs and projects</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="tabs">
                    {(['paragraphs', 'sentences', 'words'] as Mode[]).map((m) => (
                        <button key={m} className={`tab ${mode === m ? 'active' : ''}`} onClick={() => setMode(m)}>
                            {m.charAt(0).toUpperCase() + m.slice(1)}
                        </button>
                    ))}
                </div>
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
                <button className="btn btn-primary btn-sm" onClick={handleCopy}>
                    {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
            </div>

            <div className="card">
                <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                    color: 'var(--text-primary)',
                    whiteSpace: 'pre-wrap',
                }}>
                    {text}
                </div>
            </div>

            <div style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {text.split(/\s+/).length} words · {text.length} characters
            </div>
        </div>
    );
}
