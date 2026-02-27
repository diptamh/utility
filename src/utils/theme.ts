export function getTheme(): 'dark' | 'light' {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
}

export function setTheme(theme: 'dark' | 'light') {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

export function toggleTheme(): 'dark' | 'light' {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next;
}

export function initTheme() {
    setTheme(getTheme());
}
