import { useState, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';

// Dynamically load html2pdf.js from CDN (avoids bundling ~180KB)
let html2pdfPromise: Promise<any> | null = null;
function loadHtml2Pdf(): Promise<any> {
    if (html2pdfPromise) return html2pdfPromise;
    html2pdfPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js';
        script.onload = () => resolve((window as any).html2pdf);
        script.onerror = () => {
            html2pdfPromise = null;
            reject(new Error('Failed to load html2pdf.js'));
        };
        document.head.appendChild(script);
    });
    return html2pdfPromise;
}

export default function MarkdownEditor() {
    const [value, setValue] = useState<string>(defaultMd);
    const [pdfLoading, setPdfLoading] = useState(false);
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

    const handleExportPdf = async () => {
        const previewEl = document.querySelector('.w-md-editor-preview .wmde-markdown');
        if (!previewEl) return;

        setPdfLoading(true);
        try {
            const html2pdf = await loadHtml2Pdf();

            // Clone the preview content and apply print-friendly styles
            const clone = previewEl.cloneNode(true) as HTMLElement;
            clone.style.padding = '0';
            clone.style.background = '#ffffff';
            clone.style.color = '#1a1a2e';
            clone.style.fontSize = '14px';
            clone.style.lineHeight = '1.7';
            clone.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

            // Style code blocks for print
            clone.querySelectorAll('pre').forEach((pre: HTMLElement) => {
                pre.style.background = '#f4f4f8';
                pre.style.color = '#1a1a2e';
                pre.style.padding = '12px';
                pre.style.borderRadius = '6px';
                pre.style.fontSize = '12px';
                pre.style.overflow = 'visible';
                pre.style.whiteSpace = 'pre-wrap';
                pre.style.wordBreak = 'break-word';
            });

            // Style tables for print
            clone.querySelectorAll('table').forEach((table: HTMLElement) => {
                table.style.borderCollapse = 'collapse';
                table.style.width = '100%';
            });
            clone.querySelectorAll<HTMLElement>('th, td').forEach((cell) => {
                cell.style.border = '1px solid #ddd';
                cell.style.padding = '8px';
                cell.style.color = '#1a1a2e';
            });

            const opt = {
                margin: [10, 12, 10, 12],
                filename: 'document.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            };

            await html2pdf().set(opt).from(clone).save();
        } catch (err) {
            console.error('PDF export failed:', err);
        } finally {
            setPdfLoading(false);
        }
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
                    <button className="btn btn-sm" onClick={handleExportPdf} disabled={pdfLoading}>
                        {pdfLoading ? '⏳ Generating…' : '📄 Export PDF'}
                    </button>
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
- 📄 Export as PDF
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
| PDF     | ✅     |

> **Tip:** Use the toolbar above for formatting shortcuts.
`;
