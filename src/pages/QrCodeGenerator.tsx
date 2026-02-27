import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

export default function QrCodeGenerator() {
    const [text, setText] = useState('https://utility.diptam.xyz');
    const [size, setSize] = useState(256);
    const [darkColor, setDarkColor] = useState('#000000');
    const [lightColor, setLightColor] = useState('#ffffff');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!text || !canvasRef.current) return;
        QRCode.toCanvas(canvasRef.current, text, {
            width: size,
            color: { dark: darkColor, light: lightColor },
            margin: 2,
        }).catch(() => { });
    }, [text, size, darkColor, lightColor]);

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const a = document.createElement('a');
        a.href = canvasRef.current.toDataURL('image/png');
        a.download = 'qrcode.png';
        a.click();
    };

    return (
        <div>
            <div className="page-header">
                <h1>QR Code Generator</h1>
                <p>Generate QR codes from text or URLs</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'start' }}>
                <div className="card">
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Content</label>
                        <textarea
                            className="textarea"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter text or URL..."
                            style={{ minHeight: '100px' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Size</label>
                            <select className="input" value={size} onChange={(e) => setSize(Number(e.target.value))}>
                                <option value={128}>128px</option>
                                <option value={256}>256px</option>
                                <option value={512}>512px</option>
                                <option value={1024}>1024px</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Foreground</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input type="color" value={darkColor} onChange={(e) => setDarkColor(e.target.value)} style={{ width: '36px', height: '36px', border: 'none', cursor: 'pointer', borderRadius: '4px' }} />
                                <input className="input" value={darkColor} onChange={(e) => setDarkColor(e.target.value)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Background</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} style={{ width: '36px', height: '36px', border: 'none', cursor: 'pointer', borderRadius: '4px' }} />
                                <input className="input" value={lightColor} onChange={(e) => setLightColor(e.target.value)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <canvas ref={canvasRef} style={{ borderRadius: 'var(--radius-sm)' }} />
                    <button className="btn btn-primary btn-sm" onClick={handleDownload}>📥 Download PNG</button>
                </div>
            </div>
        </div>
    );
}
