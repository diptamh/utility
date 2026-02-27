import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { toggleTheme, getTheme } from '../utils/theme';
import { trackPageView } from '../utils/tracker';
import './Layout.css';

const tools = [
    { path: '/', label: 'Home', icon: '🏠', section: '' },
    { path: '/markdown', label: 'Markdown Editor', icon: '📝', section: 'Core Tools' },
    { path: '/diff', label: 'Diff Checker', icon: '🔀', section: 'Core Tools' },
    { path: '/convert', label: 'Conversions', icon: '🔄', section: 'Core Tools' },
    { path: '/mermaid', label: 'Mermaid Helper', icon: '🧜', section: 'Core Tools' },
    { path: '/json', label: 'JSON Formatter', icon: '📋', section: 'Utilities' },
    { path: '/uuid', label: 'UUID Generator', icon: '🔑', section: 'Utilities' },
    { path: '/regex', label: 'Regex Tester', icon: '🔍', section: 'Utilities' },
    { path: '/qrcode', label: 'QR Generator', icon: '📱', section: 'Utilities' },
    { path: '/lorem', label: 'Lorem Ipsum', icon: '📄', section: 'Utilities' },
    { path: '/hash', label: 'Hash Generator', icon: '🔐', section: 'Utilities' },
    { path: '/stats', label: 'Analytics', icon: '📊', section: 'Admin' },
];

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setThemeState] = useState(getTheme());
    const location = useLocation();

    useEffect(() => {
        setSidebarOpen(false);
        trackPageView(location.pathname);
    }, [location.pathname]);

    const handleThemeToggle = () => {
        const next = toggleTheme();
        setThemeState(next);
    };

    let lastSection = '';

    return (
        <div className="layout">
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">U</div>
                    <div>
                        <div className="sidebar-title">Utility</div>
                        <div className="sidebar-subtitle">Developer Tools</div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    {tools.map((tool) => {
                        const showSection = tool.section && tool.section !== lastSection;
                        if (tool.section) lastSection = tool.section;
                        return (
                            <div key={tool.path}>
                                {showSection && (
                                    <div className="sidebar-section-title">{tool.section}</div>
                                )}
                                <NavLink
                                    to={tool.path}
                                    end={tool.path === '/'}
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'active' : ''}`
                                    }
                                >
                                    <span className="link-icon">{tool.icon}</span>
                                    {tool.label}
                                </NavLink>
                            </div>
                        );
                    })}
                </nav>
                <div className="sidebar-footer">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        utility.diptam.xyz
                    </span>
                </div>
            </aside>

            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-left">
                        <button
                            className="menu-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Toggle menu"
                        >
                            ☰
                        </button>
                    </div>
                    <div className="topbar-right">
                        <button
                            className="btn-icon"
                            onClick={handleThemeToggle}
                            aria-label="Toggle theme"
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                    </div>
                </header>
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
