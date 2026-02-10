# Hypertrophy Pro — Training App

A science-based hypertrophy training app built with **React**, **Vite**, **Tailwind CSS v4**, and **Capacitor** for cross-platform deployment (Web, Android, iOS).

**Live Demo:** [https://hypertrophy-training-app.web.app](https://hypertrophy-training-app.web.app)

---

## Features

- **Mesocycle Planning** — Create periodised training blocks with progressive overload, choosing from 6 built-in templates (PPL, Upper/Lower, Full Body, etc.) or creating custom splits.
- **400+ Exercise Database** — 12 muscle groups, multiple equipment types (barbell, dumbbell, cable, machine, bodyweight). Add custom exercises too.
- **Active Workout Tracking** — Real-time set logging with rest timer, RIR (Reps In Reserve) tracking, and auto-suggested weights based on history.
- **Progress Analytics** — Interactive charts (e1RM progression, volume over time) powered by Recharts.
- **Volume Landmarks** — Science-based volume recommendations (MEV, MRV, MAV) per muscle group.
- **Data Portability** — JSON export/import for full backup and restore.
- **PWA Support** — Installable on mobile devices via manifest and meta tags.
- **Mobile-First UI** — Tailwind CSS with smooth animations, skeleton loaders, toast notifications, and confirmation modals.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) |
| Charts | Recharts 2.10 |
| Icons | Lucide React |
| Mobile | Capacitor 5 (Android + iOS) |
| Hosting | Firebase Hosting |
| Testing | Vitest + React Testing Library |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- (Optional) **Android Studio** for Android builds
- (Optional) **Xcode** for iOS builds

### Install

```bash
git clone <repo-url>
cd training_app_capacitor
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173) with hot-module replacement.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm test` | Run all unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run sync` | Build + sync Capacitor native projects |
| `npm run deploy` | Build + deploy to Firebase Hosting |
| `npm run deploy:preview` | Build + deploy to Firebase preview channel |

---

## Project Structure

```
├── index.html                    # Entry HTML with PWA meta tags
├── index.css                     # Tailwind import + custom animations
├── main.jsx                      # React entry point with ErrorBoundary
├── hypertrophy-app-expanded.jsx  # Main app component (~2000 lines)
├── vite.config.js                # Vite + Tailwind + Vitest config
├── capacitor.config.json         # Capacitor native config
├── firebase.json                 # Firebase Hosting config
├── package.json
├── public/
│   ├── manifest.json             # PWA manifest
│   └── icons/                    # App icons (192px, 512px)
├── src/
│   ├── components/
│   │   ├── Toast.jsx             # Toast notification system
│   │   ├── ConfirmModal.jsx      # Mobile-friendly confirm dialog
│   │   ├── ErrorBoundary.jsx     # React error boundary
│   │   └── LoadingSkeleton.jsx   # Skeleton loader placeholders
│   ├── utils/
│   │   └── helpers.js            # Extracted utility functions
│   └── test/
│       ├── setup.js              # Test setup (jest-dom)
│       ├── helpers.test.js       # 63 utility tests
│       ├── Toast.test.jsx        # 8 toast tests
│       ├── ConfirmModal.test.jsx # 10 modal tests
│       ├── ErrorBoundary.test.jsx# 5 error boundary tests
│       └── LoadingSkeleton.test.jsx # 8 skeleton tests
├── android/                      # Capacitor Android project
└── ios/                          # Capacitor iOS project
```

---

## Testing

The project uses **Vitest** with **React Testing Library** and **jsdom**.

```bash
# Run all 94 tests
npm test

# Watch mode during development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test coverage areas:**
- Utility functions: state creation, weight calculation, E1RM, duration formatting, data validation, progression data, debounce, ID generation
- UI components: Toast notifications, ConfirmModal variants, ErrorBoundary recovery, LoadingSkeleton rendering

---

## Deployment

### Firebase Hosting (Web)

The app is deployed to Firebase Hosting with optimised caching headers.

```bash
# One-command build + deploy
npm run deploy
```

Firebase config features:
- SPA rewrite rules (all routes → `index.html`)
- Immutable cache for hashed JS/CSS assets
- No-cache for `index.html` to ensure fresh deploys

### Android

```bash
npm run sync        # Build web + sync to native
npm run android     # Open in Android Studio
```

Then build/run from Android Studio.

### iOS

```bash
npm run sync        # Build web + sync to native
npm run ios         # Open in Xcode
```

Then build/run from Xcode. Requires macOS.

---

## Key Design Decisions

- **Single-component architecture** — The main app is a single large component (`hypertrophy-app-expanded.jsx`) using a flat state object stored in `localStorage`. This keeps the app simple with zero external state management dependencies.
- **Debounced persistence** — State changes are debounced (500ms) before writing to `localStorage` to avoid performance issues on rapid updates.
- **Extracted utilities** — Pure functions are extracted to `src/utils/helpers.js` for testability and reuse.
- **No `alert()`/`confirm()`** — Native dialogs are replaced with custom `Toast` and `ConfirmModal` components for consistent mobile UX.
- **`useMemo`/`useCallback`** — Expensive computations (exercise database merging, template lists) are memoised.
- **Keyboard accessibility** — Escape key closes modals in priority order.
- **Error boundary** — Catches render errors and offers recovery (retry or full reset).

---

## License

MIT
