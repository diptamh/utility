# Utility Tools — utility.diptam.xyz

A lightweight, modern developer utility toolkit for everyday tasks. Built with **Vite + React 19 + TypeScript**.

![Home Page](https://img.shields.io/badge/Status-Live-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![React](https://img.shields.io/badge/React-19-61DAFB)

---

## 🛠 Features

### Core Tools

| Tool | Description |
|------|-------------|
| **📝 Markdown Editor** | Live split-pane editor & preview. Import/export `.md` files, copy as HTML. Word & character count. |
| **🔀 Diff Checker** | Compare text side-by-side or inline. Line, word, and character-level diffs with stats. |
| **🔄 Quick Conversions** | Base64, URL encode/decode, Unix timestamps, number base conversion, color formats (HEX/RGB/HSL), JSON string escape. |
| **🧜 Mermaid Helper** | Live diagram editor with 6 templates (flowchart, sequence, gantt, class, pie, ER). Export as SVG or PNG. |

### Utility Tools

| Tool | Description |
|------|-------------|
| **📋 JSON Formatter** | Pretty-print, minify, and validate JSON with configurable indentation. |
| **🔑 UUID Generator** | Bulk UUID v4 generation with click-to-copy and uppercase toggle. |
| **🔍 Regex Tester** | Live regex testing with match highlighting, capture group extraction, and flag support. |
| **📱 QR Code Generator** | Generate QR codes with custom colors and sizes. Download as PNG. |
| **📄 Lorem Ipsum** | Generate placeholder text by paragraphs, sentences, or words. |
| **🔐 Hash Generator** | SHA-1, SHA-256, SHA-384, SHA-512 hashes using Web Crypto API. |

### Analytics (Backend)

| Feature | Description |
|---------|-------------|
| **📊 Dashboard** | Password-protected analytics at `/stats`. Page views, unique visitors, daily chart, top pages. |
| **Tracking** | Lightweight beacon-based tracking via `navigator.sendBeacon`. Privacy-first (hashed IPs, no cookies). |
| **Storage** | SQLite via `better-sqlite3` — no external DB needed. |

---

## 🎨 Design

- **Dark mode** by default with light mode toggle
- **CSS custom properties** for theming — no CSS framework
- **Inter** font for UI, **JetBrains Mono** for code
- **Responsive** sidebar navigation with mobile overlay
- **Lazy-loaded** pages — only loads what you use

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (20 recommended)
- npm

### Install & Run

```bash
# Clone
git clone <repo-url>
cd utility

# Install dependencies
npm install

# Start dev server (frontend + backend)
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3000](http://localhost:3000) (proxied from Vite)

### Build for Production

```bash
npm run build
npm start
```

This builds the Vite frontend to `dist/client/` and compiles the server to `dist/server/`, then serves everything on port 3000.

---

## 📁 Project Structure

```
utility/
├── src/                    # Frontend (Vite + React)
│   ├── App.tsx             # Root with lazy-loaded routes
│   ├── main.tsx            # Entry point
│   ├── index.css           # Design system (dark/light themes)
│   ├── components/
│   │   ├── Layout.tsx      # Sidebar + topbar layout
│   │   └── Layout.css
│   ├── pages/
│   │   ├── Home.tsx        # Dashboard with tool cards
│   │   ├── MarkdownEditor.tsx
│   │   ├── DiffChecker.tsx
│   │   ├── Conversions.tsx
│   │   ├── MermaidHelper.tsx
│   │   ├── JsonFormatter.tsx
│   │   ├── UuidGenerator.tsx
│   │   ├── RegexTester.tsx
│   │   ├── QrCodeGenerator.tsx
│   │   ├── LoremIpsum.tsx
│   │   ├── HashGenerator.tsx
│   │   └── Stats.tsx       # Analytics dashboard
│   └── utils/
│       ├── theme.ts        # Dark/light toggle
│       └── tracker.ts      # Analytics beacon
├── server/                 # Backend (Express + SQLite)
│   ├── index.ts            # Express server
│   ├── db.ts               # SQLite setup & queries
│   ├── routes/
│   │   └── stats.ts        # POST /api/track, GET /api/stats
│   └── tsconfig.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Procfile                # Dokku process definition
└── .env.example
```

---

## 🌐 Deploy to Dokku

### 1. Create the app on your VPS

```bash
dokku apps:create utility
dokku domains:set utility utility.diptam.xyz
```

### 2. Set environment variables

```bash
dokku config:set utility STATS_PASSWORD=<your-secret-password> NODE_ENV=production
```

### 3. Persist analytics data

> **Important:** SQLite data lives inside the container. Mount persistent storage so it survives redeploys.

```bash
dokku storage:ensure-directory utility
dokku storage:mount utility /var/lib/dokku/data/storage/utility:/app/data
```

### 4. Enable SSL

```bash
dokku letsencrypt:enable utility
```

### 5. Deploy

```bash
# From your local machine
git remote add dokku dokku@<your-vps-ip>:utility
git push dokku main
```

Dokku will auto-detect Node.js, run `npm install` → `npm run build`, then start via the `Procfile`.

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port (Dokku sets this automatically) |
| `STATS_PASSWORD` | `admin` | Password for the `/stats` analytics dashboard |
| `DB_PATH` | `./data/analytics.db` | Path to SQLite database file |
| `NODE_ENV` | — | Set to `production` for optimized serving |

---

## 📦 Key Dependencies

| Package | Purpose | Size Impact |
|---------|---------|-------------|
| `@uiw/react-md-editor` | Markdown editor with preview | ~578KB gz (lazy-loaded) |
| `diff` | Text diffing engine | ~10KB |
| `qrcode` | QR code generation | ~30KB |
| `mermaid` | Diagram rendering | CDN-loaded (0 bundle) |
| `better-sqlite3` | Analytics storage | Server-side only |
| `express` | API server | Server-side only |

---

## License

MIT
