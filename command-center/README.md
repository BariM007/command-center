# Command Center

A personal productivity app for BD + Operations leaders.

## Features
- **Command Dashboard** — daily at-a-glance: stats, alerts, next actions
- **Rocks** — quarterly priorities tracker with progress
- **BD Pipeline** — pursuit tracker with stages, values, and advancement
- **Operations** — project health dashboard (green/yellow/red)
- **Actions** — next steps with due dates, categories, and overdue alerts

All data persists in `localStorage` — no backend required.

---

## Run locally

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## Deploy to Vercel (recommended, free)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework: **Vite** (auto-detected)
4. Click Deploy

Done. You'll get a URL like `https://command-center-xyz.vercel.app`

---

## Deploy to Netlify (free)

```bash
npm run build
```

Drag the `dist/` folder to [netlify.com/drop](https://netlify.com/drop)

Or connect your GitHub repo for auto-deploys on push.

---

## Deploy to GitHub Pages

In `vite.config.js`, add your repo base:
```js
export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react()],
})
```

Then:
```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

---

## Customize

- Edit seed data in `src/App.jsx` (the `SEED_*` constants)
- Change your name/branding in `src/components/Sidebar.jsx`
- Add new action categories in `src/components/Actions.jsx` (`CATS` array)
- Colors and fonts in `src/index.css` (CSS variables at the top)
