# ⚡ Quick Start Guide

Get your Hypertrophy Training App up and running in 5 minutes!

## 🎯 For Users (Install the App)

### On iPhone
1. Open **[your-deployed-url.com]** in **Safari**
2. Tap **Share** button (box with arrow pointing up)
3. Scroll down, tap **"Add to Home Screen"**
4. Tap **"Add"**
5. Open the app from your home screen! 🎉

### On Android
1. Open **[your-deployed-url.com]** in **Chrome**
2. Tap **⋮** menu (three dots)
3. Tap **"Install app"** or **"Add to Home Screen"**
4. Tap **"Install"**
5. Find the app in your app drawer! 🎉

## 💻 For Developers (Run Locally)

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))

### Setup (3 commands)

```bash
# 1. Clone and navigate
git clone <your-repo-url>
cd training_app

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

**That's it!** Open http://localhost:5173 in your browser.

## 🚀 Deploy (Choose One)

### Option 1: Vercel (Easiest)
```bash
npm install -g vercel
vercel
```
Follow prompts → Done in 60 seconds!

### Option 2: Netlify (Drag & Drop)
```bash
npm run build
```
Drag `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

### Option 3: GitHub Pages
```bash
# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Then run:
npm install -D gh-pages
npm run build
npm run deploy
```

## 📱 Using the App

### First Time Setup
1. Open app
2. Tap **"Create Program"**
3. Choose a training split (e.g., Push Pull Legs)
4. Select mesocycle length (4-6 weeks)
5. Pick volume target (MAV recommended)
6. Tap **"Start Mesocycle"**

### Starting a Workout
1. Go to **Workout** tab
2. Tap **"Start Workout"**
3. Enter weight and reps for each set
4. Tap ✓ to complete a set
5. Use rest timer between sets
6. Tap **"Finish"** when done

### Tracking Progress
1. Go to **Progress** tab
2. View your PRs (personal records)
3. Check volume charts
4. Select exercises to see progression

## 💾 Backing Up Your Data

### Quick Backup
1. **Settings** → **Export**
2. Save file to Google Drive/Dropbox/iCloud
3. To restore: **Settings** → **Import**

### Auto-Sync Method
1. Export data regularly
2. Save to cloud storage with auto-sync
3. Import on other devices

## 🔧 Common Tasks

### Add Custom Exercise
Settings → Manage Custom Exercises → Add Exercise

### Create Custom Template
Settings → Manage Custom Templates → Create Template

### Change Rest Timer
Settings → Default Rest Timer → Adjust

### Reset All Data
Settings → Reset All Data (⚠️ Can't undo!)

## ❓ Troubleshooting

### App won't install on iPhone?
- Must use **Safari** (not Chrome)
- URL must use HTTPS

### Data disappeared?
- Check if browser data was cleared
- Import from backup if you have one

### Charts not showing?
- Need at least 2 workouts completed
- Complete more sessions to see trends

## 📚 Learn More

- **Full Documentation**: See [README.md](README.md)
- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Code Structure**: See [STRUCTURE.md](STRUCTURE.md)

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Read the full README.md
3. Open an issue on GitHub

---

**Ready to build muscle? Let's get started! 💪**
