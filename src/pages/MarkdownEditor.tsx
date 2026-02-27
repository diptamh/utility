import { useState, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';

export default function MarkdownEditor() {
    const [value, setValue] = useState<string>(defaultMd);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleImport = () => fileRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setValue(ev.target?.result as string || '');
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleExport = () => {
        const blob = new Blob([value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleCopyHtml = async () => {
        // Use the rendered HTML from the preview pane
        const previewEl = document.querySelector('.w-md-editor-preview .wmde-markdown');
        if (previewEl) {
            await navigator.clipboard.writeText(previewEl.innerHTML);
        }
    };

    const handleCopyMd = async () => {
        await navigator.clipboard.writeText(value);
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1>Markdown Editor</h1>
                    <p>Write and preview Markdown with live rendering</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".md,.markdown,.txt"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <button className="btn btn-sm" onClick={handleImport}>📂 Import</button>
                    <button className="btn btn-sm" onClick={handleExport}>💾 Export .md</button>
                    <button className="btn btn-sm" onClick={handleCopyMd}>📋 Copy MD</button>
                    <button className="btn btn-sm" onClick={handleCopyHtml}>🔗 Copy HTML</button>
                </div>
            </div>
            <div data-color-mode={document.documentElement.getAttribute('data-theme') || 'dark'}>
                <MDEditor
                    value={value}
                    onChange={(v) => setValue(v || '')}
                    height={600}
                    preview="live"
                    style={{
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                    }}
                />
            </div>
            <div style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {value.length} characters · {value.split(/\s+/).filter(Boolean).length} words · {value.split('\n').length} lines
            </div>
        </div>
    );
}

const defaultMd = `# Welcome to Markdown Editor

Start typing your **Markdown** here and see it rendered _live_.

## Features
- 📝 Live preview
- 📂 Import \`.md\` files
- 💾 Export as Markdown
- 📋 Copy as HTML

## Code

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## Table

| Feature | Status |
|---------|--------|
| Editor  | ✅     |
| Preview | ✅     |
| Export  | ✅     |

> **Tip:** Use the toolbar above for formatting shortcuts.
`;
