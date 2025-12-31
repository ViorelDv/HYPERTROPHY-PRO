# 🚀 Deployment Guide

Complete guide for deploying the Hypertrophy Training App to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] Test app locally (`npm run dev`)
- [ ] Build successfully (`npm run build`)
- [ ] Test production build (`npm run preview`)
- [ ] All PWA assets (icons) are in `public/` folder
- [ ] Update base URL if deploying to subdirectory

## 1️⃣ Vercel (Recommended)

**Easiest and fastest deployment with automatic HTTPS**

### Method A: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Method B: Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite settings
6. Click "Deploy"

**Configuration:**
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## 2️⃣ Netlify

**Great option with drag-and-drop deployment**

### Method A: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Method B: Netlify Drop

1. Build your project: `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder
4. Done! You'll get a URL instantly

### Method C: Netlify Dashboard (GitHub)

1. Push to GitHub
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" → "Import from Git"
4. Connect GitHub and select repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

**netlify.toml** (optional):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 3️⃣ GitHub Pages

**Free hosting directly from your GitHub repository**

### Setup

1. Update `vite.config.js`:

```js
export default defineConfig({
  base: '/your-repo-name/', // Add your repository name
  plugins: [
    // ... existing plugins
  ]
})
```

2. Install gh-pages:

```bash
npm install --save-dev gh-pages
```

3. Add to `package.json` scripts:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. Deploy:

```bash
npm run deploy
```

5. Enable GitHub Pages:
   - Go to repo Settings → Pages
   - Source: `gh-pages` branch
   - Your site: `https://username.github.io/repo-name/`

## 4️⃣ Firebase Hosting

**Google's hosting with CDN and HTTPS**

### Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firebase in your project
firebase init hosting
```

Configuration:
- Public directory: `dist`
- Configure as single-page app: `Yes`
- Set up automatic builds with GitHub: `No` (optional)

```bash
# Build and deploy
npm run build
firebase deploy
```

**firebase.json:**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 5️⃣ Cloudflare Pages

**Fast global CDN with unlimited bandwidth**

### Via Dashboard

1. Push to GitHub
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
3. Pages → Create a project
4. Connect GitHub repository
5. Configure:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output: `dist`
6. Save and Deploy

### Via Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Build
npm run build

# Deploy
wrangler pages publish dist --project-name=hypertrophy-app
```

## 6️⃣ Static Web Server (Self-Hosted)

**Deploy to your own server**

### Build

```bash
npm run build
```

### Upload dist/ folder to server

```bash
# Using SCP
scp -r dist/* user@your-server:/var/www/html/

# Or using SFTP
sftp user@your-server
put -r dist/* /var/www/html/
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # PWA Service Worker
    location = /sw.js {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
    }
}
```

## 📱 PWA Requirements

For PWA to work properly on mobile devices:

### ✅ Requirements
- **HTTPS** - Required (most platforms provide this automatically)
- **Service Worker** - Generated automatically by vite-plugin-pwa
- **manifest.json** - Generated automatically
- **Icons** - Included in `public/` folder

### Testing PWA

1. **Desktop (Chrome)**:
   - Open DevTools → Application → Manifest
   - Check "Service Workers"
   - Look for install prompt

2. **Mobile (Chrome)**:
   - Deploy to HTTPS URL
   - Open in mobile Chrome
   - Look for "Install App" banner

3. **iPhone (Safari)**:
   - Deploy to HTTPS URL
   - Open in Safari
   - Share button → "Add to Home Screen"

## 🔒 Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as shown

### Netlify
1. Go to Site Settings → Domain management
2. Add custom domain
3. Configure DNS or Netlify DNS

### Cloudflare Pages
1. Pages → Custom domains
2. Add domain (instant if using Cloudflare DNS)

## 🎯 Performance Tips

1. **Optimize Images**: Use SVG for icons (already done)
2. **Enable Compression**: Most platforms do this automatically
3. **CDN**: Vercel, Netlify, Cloudflare all use global CDNs
4. **Caching**: PWA handles this automatically

## 📊 Analytics (Optional)

Add Google Analytics or similar:

```html
<!-- In index.html <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🐛 Common Issues

### "Failed to load resource" errors
- Check console for missing files
- Verify all paths are relative
- Ensure base URL is correct for subdirectories

### PWA not installable
- Must be served over HTTPS
- Check manifest.json is accessible
- Verify service worker is registered

### Blank page after deployment
- Check browser console
- Verify base path in vite.config.js
- Ensure all assets are in dist/

## 🆘 Support

If deployment fails:
1. Check build logs for errors
2. Test `npm run build` locally
3. Verify `npm run preview` works
4. Check platform-specific documentation

---

**Ready to deploy? Choose your platform and follow the steps above!**
