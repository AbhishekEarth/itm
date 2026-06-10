# Changelog — `abhishek` Branch

All changes made to the `abhishek` branch of the ITM Gwalior frontend.

---

## [2026-06-10] — Performance & Production Readiness Sprint

### 🔀 Merge & Integration
- **Resolved 16 merge conflicts** between `abhishek` and `origin/main`
  - Files resolved: `AdmissionCTA`, `CampusLife`, `ClubsCells`, `Departments`, `DirectorVision`, `Distinctiveness`, `FloatingSidebar`, `Header`, `Hero`, `HomeExtras`, `Placements`, `RecruiterMarquee`, `Stats`, `Testimonials`, `WhyITM`, `PACPage`
- **Installed `@tanstack/react-query`** — new dependency added by `main`

---

### ⚡ Performance — Bundle Size

- **Route-level code splitting** (`App.jsx`)
  - Converted all 60+ static page imports to `React.lazy()` dynamic imports
  - Main bundle: **1,833 kB → 967 kB (−47%)**

- **Vite manual chunk splitting** (`vite.config.js`)
  - `vendor-react`, `vendor-motion`, `vendor-icons`, `vendor-query` — vendor libs cached independently
  - `chunk-admin` — Admin pages (only downloaded on admin login)
  - `chunk-departments`, `chunk-research`, `chunk-about`, `chunk-gallery`, `chunk-admissions` — domain chunks

---

### ⚡ Performance — Network Requests

- **React Query global config** (`main.jsx`)
  - `retry: 0` — stops hammering offline backend
  - `staleTime: 5 min` — shared cache across components
  - `gcTime: 10 min`, `refetchOnWindowFocus: false`, `refetchOnReconnect: false`
  - **Result: 620 requests → ~20 on initial load**

---

### ⚡ Performance — Images

- **Batch WebP conversion** (`scripts/convert-images.mjs`) — new script using `sharp`
  - 196 images converted — **9.3 MB → 3.3 MB (−64%)**
- **Hero slider re-compression** — slider6–10: **avg 900 kB → 200 kB each**
- **ITMGOILogo.png → WebP** — **350 kB → 32 kB (−91%)**
- **Hero component** — `fetchpriority="high"` on slide 0, all 10 slides as WebP, `width`/`height` attrs
- **Local image paths** — Bulk replaced `.jpg`/`.png` refs in `SeekAdmission`, `Login`, `QSiGauge`, `Onboarding`, `index.html`

---

### ⚡ Performance — HTML & Loading

- **`index.html`** — Preload hero image, non-blocking fonts, deferred GA, preconnect + dns-prefetch

---

### ⚡ Performance — Animations

- **`whileInView` on below-fold sections** — `Stats`, `WhyITM`, `Distinctiveness`, `Placements`, `Testimonials`, `DirectorVision`, `RecruiterMarquee`, `CampusLife`, `AdmissionCTA`, `ClubsCells`
  - Animations fire only when section enters viewport — reduces initial paint cost

---

### 🛡️ Reliability

- **`ErrorBoundary` component** (`components/ErrorBoundary.jsx`) — new
  - Catches render errors, logs to console with section name + stack trace
  - Wrapped around all 18 home sections in `App.jsx`
  - Fixes silent failure / empty console problem

---

### 🏭 Production Readiness

- **Environment variables**
  - `.env.development` — dev mode (Vite proxy handles `/api/*`)
  - `.env.production` — `VITE_API_URL=https://api.itmgoi.in`

- **Removed hardcoded `localhost:8000`** (7 occurrences → 0)
  - `PACPage.jsx` — relative `/api/` paths
  - `PlacementData.jsx` — `import.meta.env.VITE_API_URL`
  - `TapPage.jsx` — `import.meta.env.VITE_API_URL`

- **`.gitignore`** — `node_modules/` untracked, `.env.local` ignored

---

### 📦 Dependencies Added

| Package | Type | Reason |
|---|---|---|
| `@tanstack/react-query` | dep | CMS data fetching |
| `sharp` | devDep | Image conversion script |

---

### 📁 New Files

| File | Purpose |
|---|---|
| `frontend/scripts/convert-images.mjs` | Batch WebP conversion |
| `frontend/src/components/ErrorBoundary.jsx` | Section-level error isolation |
| `frontend/.env.development` | Dev environment config |
| `frontend/.env.production` | Production environment template |
| `frontend/public/images/ITMGOILogo.webp` | Optimized logo |
| `frontend/src/assets/slider1.webp` | Optimized fallback slider |
| `frontend/src/assets/slider2.webp` | Optimized fallback slider |
| `frontend/public/images/hero/slider*.webp` | All 10 hero slides as WebP |

---

## Summary

| Metric | Before | After |
|---|---|---|
| Main JS bundle | 1,833 kB | 967 kB (−47%) |
| API requests on load | 620 | ~20 (−97%) |
| Image weight (converted) | 9.3 MB | 3.3 MB (−64%) |
| ITM logo | 350 kB | 32 kB (−91%) |
| Scripting time (dev) | 4,247 ms | 2,390 ms (−44%) |
| Total page time (dev) | 10.84 s | 8.58 s (−21%) |
| Hardcoded `localhost:8000` | 7 | 0 |
| Console errors | Silent | Visible with section name |
