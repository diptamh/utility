import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { initTheme } from './utils/theme';

const Home = lazy(() => import('./pages/Home'));
const MarkdownEditor = lazy(() => import('./pages/MarkdownEditor'));
const DiffChecker = lazy(() => import('./pages/DiffChecker'));
const Conversions = lazy(() => import('./pages/Conversions'));
const MermaidHelper = lazy(() => import('./pages/MermaidHelper'));
const JsonFormatter = lazy(() => import('./pages/JsonFormatter'));
const UuidGenerator = lazy(() => import('./pages/UuidGenerator'));
const RegexTester = lazy(() => import('./pages/RegexTester'));
const QrCodeGenerator = lazy(() => import('./pages/QrCodeGenerator'));
const LoremIpsum = lazy(() => import('./pages/LoremIpsum'));
const HashGenerator = lazy(() => import('./pages/HashGenerator'));
const Stats = lazy(() => import('./pages/Stats'));

function Loading() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
        }}>
            Loading…
        </div>
    );
}

export default function App() {
    useEffect(() => {
        initTheme();
    }, []);

    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/markdown" element={<MarkdownEditor />} />
                    <Route path="/diff" element={<DiffChecker />} />
                    <Route path="/convert" element={<Conversions />} />
                    <Route path="/mermaid" element={<MermaidHelper />} />
                    <Route path="/json" element={<JsonFormatter />} />
                    <Route path="/uuid" element={<UuidGenerator />} />
                    <Route path="/regex" element={<RegexTester />} />
                    <Route path="/qrcode" element={<QrCodeGenerator />} />
                    <Route path="/lorem" element={<LoremIpsum />} />
                    <Route path="/hash" element={<HashGenerator />} />
                    <Route path="/stats" element={<Stats />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
