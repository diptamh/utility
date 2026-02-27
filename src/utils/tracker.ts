let lastPath = '';

export function trackPageView(path: string) {
    if (path === lastPath) return;
    lastPath = path;

    const data = {
        path,
        referrer: document.referrer,
        screenWidth: window.innerWidth,
        timestamp: Date.now(),
    };

    try {
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/track', JSON.stringify(data));
        } else {
            fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                keepalive: true,
            });
        }
    } catch {
        // silently fail — analytics should never break the app
    }
}
