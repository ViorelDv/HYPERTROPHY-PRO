# 📂 Project Structure

This document explains the folder structure and organization of the Hypertrophy Training App.

## 🗂️ Root Directory

```
training_app/
├── public/              # Static assets (served as-is)
├── src/                 # Source code
├── node_modules/        # Dependencies (auto-generated)
├── dist/                # Production build (auto-generated)
├── .git/                # Git repository
├── .vscode/             # VS Code settings
├── index.html           # HTML entry point
├── package.json         # Project dependencies & scripts
├── package-lock.json    # Locked dependency versions
├── vite.config.js       # Vite & PWA configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── .gitignore           # Git ignore rules
├── README.md            # Main documentation
├── DEPLOYMENT.md        # Deployment guide
├── LICENSE              # MIT License
└── STRUCTURE.md         # This file
```

## 📁 Detailed Structure

### `/public` - Static Assets

All files in this folder are served directly without processing.

```
public/
├── icon.svg               # Main app icon (512x512 SVG)
├── pwa-192x192.svg        # PWA icon for Android/Chrome
├── pwa-512x512.svg        # PWA icon for all platforms
└── apple-touch-icon.svg   # iOS home screen icon (180x180)
```

**Purpose:**
- PWA icons for installation on mobile devices
- Must be in `public/` to be accessible at root URL
- SVG format for scalability and small file size

### `/src` - Source Code

Contains all application source code.

```
src/
├── App.jsx       # Main React component (entire app logic)
├── main.jsx      # Application entry point
└── index.css     # Global styles + Tailwind directives
```

#### `App.jsx` - Main Application Component

**Contains:**
- All React components and logic (2000+ lines)
- Exercise database (900+ exercises)
- Training templates (6 built-in splits)
- State management (mesocycle, workout, settings)
- LocalStorage persistence
- Progressive overload calculations
- Volume landmark management
- UI rendering logic

**Key Components:**
- Home screen
- Mesocycle creation
- Workout view
- Active workout tracking
- Progress charts
- Settings management
- Exercise/Template modals

#### `main.jsx` - Entry Point

**Purpose:**
- React application initialization
- Root component mounting
- StrictMode wrapper

#### `index.css` - Global Styles

**Contains:**
- Tailwind CSS imports
- Global CSS resets
- Mobile optimizations
- Safe area insets (iPhone notch)
- Custom utility classes

### Configuration Files

#### `index.html` - HTML Template

**Contains:**
- PWA meta tags
- iOS-specific meta tags
- Theme color configuration
- Viewport settings
- App mounting point (`<div id="root">`)

#### `vite.config.js` - Build Configuration

**Configures:**
- React plugin
- PWA plugin (vite-plugin-pwa)
- Manifest generation
- Service worker settings
- Workbox caching strategies

#### `tailwind.config.js` - Tailwind CSS

**Configures:**
- Content scanning paths
- Theme extensions
- Plugins

#### `postcss.config.js` - PostCSS

**Configures:**
- Tailwind CSS processing
- Autoprefixer for browser compatibility

#### `package.json` - Project Metadata

**Contains:**
- Project name and version
- Dependencies (React, Recharts, etc.)
- Dev dependencies (Vite, Tailwind, etc.)
- Scripts (dev, build, preview)

## 🔨 Build Process

### Development (`npm run dev`)

```
src/           →  Vite Dev Server  →  http://localhost:5173
public/        →  Static Serving   →  /icon.svg, etc.
```

- Hot Module Replacement (HMR)
- Source maps for debugging
- Fast refresh on code changes

### Production Build (`npm run build`)

```
src/           →  Vite Build  →  dist/assets/*.js
index.html     →  Processing  →  dist/index.html
public/        →  Copy        →  dist/icon.svg, etc.
Tailwind CSS   →  Purging     →  Minimal CSS bundle
PWA Plugin     →  Generate    →  dist/manifest.json, sw.js
```

**Output (`dist/`):**

```
dist/
├── assets/
│   ├── index-[hash].js      # Bundled & minified JS
│   ├── index-[hash].css     # Purged & minified CSS
│   └── ...                  # Other assets
├── icon.svg                 # Static assets (copied)
├── pwa-192x192.svg
├── pwa-512x512.svg
├── apple-touch-icon.svg
├── index.html               # Entry HTML
├── manifest.webmanifest     # PWA manifest
└── sw.js                    # Service worker
```

## 📊 Data Flow

### State Management

```
LocalStorage
    ↕
  State
    ↕
React Components
    ↕
  UI Updates
```

**Stored Data:**
- `hypertrophy_state_v3` (all app data)
  - Profile
  - Mesocycle (current training program)
  - History (completed workouts)
  - Exercise history (performance tracking)
  - Custom exercises
  - Custom templates
  - Settings

### Component Hierarchy

```
App.jsx
├── renderHome()
├── renderNewMeso()
├── renderWorkout()
├── renderActiveWorkout()
├── renderProgress()
├── renderSettings()
├── renderExerciseModal()
├── renderTemplateModal()
└── Navigation (Bottom Bar)
```

## 🎨 Styling Approach

### Tailwind CSS (Utility-First)

**Why:**
- Fast development
- Small production bundle (unused styles purged)
- Consistent design system
- Responsive out of the box

**Example:**
```jsx
<div className="bg-orange-500 text-white p-4 rounded-xl">
  // Orange background, white text, padding, rounded corners
</div>
```

### Mobile-First Design

- Responsive layouts with Tailwind breakpoints
- Touch-friendly buttons (min 44px)
- Safe area insets for iPhone notch
- Prevents pull-to-refresh interference

## 🗄️ Data Storage

### LocalStorage Keys

```javascript
'hypertrophy_state_v3'  // Main application state
```

### State Structure

```javascript
{
  profile: { name, experience, gender },
  mesocycle: { /* current training program */ },
  history: [ /* completed workouts */ ],
  activeWorkout: { /* in-progress workout */ },
  settings: { restTimer, autoProgress, weightIncrement },
  customExercises: { /* user-added exercises */ },
  customTemplates: { /* user-created splits */ },
  exerciseHistory: { /* performance per exercise */ }
}
```

## 📦 Dependencies

### Production Dependencies

- `react` & `react-dom` - UI framework
- `recharts` - Data visualization
- `lucide-react` - Icon library

### Development Dependencies

- `vite` - Build tool & dev server
- `@vitejs/plugin-react` - React support
- `vite-plugin-pwa` - PWA functionality
- `tailwindcss` - CSS framework
- `postcss` & `autoprefixer` - CSS processing

## 🚀 Workflow

### Development Workflow

```bash
1. npm install        # Install dependencies
2. npm run dev        # Start dev server
3. Edit src/App.jsx   # Make changes
4. Browser auto-refreshes
5. Test in browser
```

### Deployment Workflow

```bash
1. npm run build      # Create production build
2. npm run preview    # Test production build locally
3. Deploy dist/       # Upload to hosting
4. Test PWA install   # Verify mobile installation
```

## 📱 PWA Features

### Offline Support

- **Service Worker**: Caches app shell and assets
- **Cache Strategy**: Network-first for API, cache-first for assets
- **Storage**: LocalStorage persists across sessions

### Installability

- **Manifest**: Defines app name, icons, theme color
- **Icons**: Multiple sizes for different devices
- **Standalone Mode**: Full-screen without browser UI

## 🔄 Update Strategy

### When App Updates

1. User visits app
2. Service worker checks for updates
3. New version downloaded in background
4. User prompted to reload (or auto-reload)
5. New features available immediately

### Data Migration

- Version key in LocalStorage (`_v3`)
- Backward compatible structure
- Manual export/import for safety

## 🎯 Performance Optimizations

1. **Code Splitting**: Single bundle (small app size)
2. **CSS Purging**: Tailwind removes unused styles
3. **Image Optimization**: SVG for icons (vector, small)
4. **Lazy Loading**: Charts only render when visible
5. **Memoization**: React optimizations where needed

## 🔐 Security Considerations

- **No Backend**: All data stays on device
- **HTTPS Required**: For PWA functionality
- **No Tracking**: Complete privacy
- **Data Ownership**: User controls all data

---

**Questions?** Check README.md for usage guide or open an issue!
