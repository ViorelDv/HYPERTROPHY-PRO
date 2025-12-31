# 💪 Hypertrophy Training App

A progressive web application (PWA) for tracking hypertrophy training with smart volume management, progressive overload tracking, and comprehensive exercise library.

![Version](https://img.shields.io/badge/version-1.0.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)
![PWA](https://img.shields.io/badge/PWA-enabled-green)

## ✨ Features

### Core Features
- 📊 **Progressive Overload Tracking** - Auto-suggested weights based on previous performance
- 📈 **Volume Management** - MEV/MAV/MRV landmarks for optimal muscle growth
- 🏋️ **900+ Exercises** - Comprehensive library across 12 muscle groups
- 📅 **Mesocycle Planning** - 4-6 week training blocks with deload weeks
- ⏱️ **Smart Rest Timer** - Customizable rest periods with audio notifications
- 📱 **Offline Support** - Works without internet connection
- 🎯 **Custom Templates** - Create your own training splits
- 💾 **Data Export/Import** - Full backup and sync capabilities

### Exercise Database
- **12 Muscle Groups**: Chest, Back, Shoulders, Biceps, Triceps, Quads, Hamstrings, Glutes, Calves, Abs, Traps, Forearms
- **Equipment Types**: Barbell, Dumbbell, Cable, Machine, Bodyweight, Other
- **Custom Exercises**: Add your own exercises to the library

### Training Templates
- Push Pull Legs (6 days)
- Upper Lower (4 days)
- Full Body (3 days)
- Bro Split (5 days)
- Arnold Split (6 days)
- Torso/Limbs (4 days)
- **Custom Templates**: Build your own splits

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/hypertrophy-app.git
cd hypertrophy-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 📱 Install on Mobile Devices

### iPhone (iOS)
1. Open the deployed app URL in **Safari**
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add**
5. The app icon will appear on your home screen

### Android
1. Open the deployed app URL in **Chrome**
2. Tap the **⋮ menu** (three dots)
3. Tap **"Install App"** or **"Add to Home Screen"**
4. Follow the prompts
5. The app will be added to your app drawer

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Or use Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy to GitHub Pages

1. Update `vite.config.js` with base path:
```js
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

2. Build and deploy:
```bash
npm run build
npx gh-pages -d dist
```

## 📖 Usage Guide

### Starting a New Mesocycle

1. **Choose a Template**: Select from 6 built-in templates or create custom
2. **Set Duration**: 4-6 weeks (last week is deload)
3. **Select Volume Target**:
   - **MEV** (Minimum Effective Volume) - Maintenance
   - **MAV** (Maximum Adaptive Volume) - Recommended for most
   - **MRV** (Maximum Recoverable Volume) - Advanced lifters only

### During Workout

1. **Start Workout**: Tap "Start Workout" on your scheduled day
2. **Log Sets**: Enter weight, reps, and RIR (Reps in Reserve)
3. **Use Suggestions**: App suggests weights based on previous performance
4. **Rest Timer**: Auto-starts after completing a set
5. **Modify On-The-Fly**: Add/remove sets or exercises as needed
6. **Finish**: Complete workout feedback for optimization

### Tracking Progress

- **Personal Records**: View best lifts per exercise
- **Volume Charts**: Track weekly volume by muscle group
- **Progression Graphs**: Visualize strength gains over time
- **E1RM Tracking**: Estimated 1-rep max calculations

### Data Management

- **Export**: Save your data as JSON file
- **Import**: Restore from backup
- **Share**: Share backup via email/cloud
- **Copy**: Copy data to clipboard for easy backup

## 🏗️ Project Structure

```
training_app/
├── public/              # Static assets
│   ├── icon.svg        # App icon
│   ├── pwa-192x192.svg # PWA icon 192x192
│   ├── pwa-512x512.svg # PWA icon 512x512
│   └── apple-touch-icon.svg # iOS home screen icon
├── src/
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles with Tailwind
├── index.html          # HTML template with PWA meta tags
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite and PWA configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── postcss.config.js   # PostCSS configuration
```

## 🛠️ Technology Stack

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Charts**: Recharts
- **Icons**: Lucide React
- **PWA**: vite-plugin-pwa (Workbox)
- **Storage**: LocalStorage (automatic persistence)

## 📊 Volume Landmarks (Sets per Week)

| Muscle Group | MEV | MAV | MRV |
|-------------|-----|-----|-----|
| Chest       | 8   | 12  | 20  |
| Back        | 10  | 14  | 22  |
| Shoulders   | 8   | 12  | 18  |
| Biceps      | 6   | 10  | 16  |
| Triceps     | 6   | 10  | 16  |
| Quads       | 8   | 12  | 18  |
| Hamstrings  | 6   | 10  | 16  |
| Glutes      | 4   | 8   | 14  |
| Calves      | 6   | 10  | 16  |
| Abs         | 4   | 8   | 14  |
| Traps       | 4   | 8   | 12  |
| Forearms    | 4   | 6   | 10  |

## 🔧 Configuration

### Custom Rest Timer
Settings → Default Rest Timer → Adjust (30-300 seconds)

### Weight Increment
Settings → Weight Increment → Adjust (0.5-10 kg)

### Custom Exercises
Settings → Manage Custom Exercises → Add Exercise

### Custom Templates
Settings → Manage Custom Templates → Create Template

## 💾 Data Storage

All data is stored locally in your browser using LocalStorage:
- Workout history
- Exercise performance data
- Personal records
- Custom exercises and templates
- User settings

**Important**: Export your data regularly to avoid loss when clearing browser data!

## 🔄 Syncing Across Devices

Since data is stored locally, sync manually:

1. **Export** data on Device A
2. Save to cloud storage (Google Drive, Dropbox, iCloud)
3. **Import** data on Device B
4. Repeat when needed

## 🐛 Troubleshooting

### App Won't Install on iPhone
- Must use Safari browser (Chrome/Firefox won't work for iOS PWA)
- Ensure you're using HTTPS (required for PWA)

### Data Not Saving
- Check browser storage isn't full
- Ensure cookies/storage isn't disabled
- Try exporting and re-importing data

### Icons Not Showing
- Clear browser cache
- Rebuild: `npm run build`
- Re-deploy

### Charts Not Displaying
- Need at least 2 data points for charts
- Complete more workouts to populate graphs

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Volume landmarks based on [Renaissance Periodization](https://renaissanceperiodization.com/) research
- Exercise database compiled from various evidence-based sources
- Progressive overload principles from Mike Israetel's work

## 📬 Support

Having issues? Please:
1. Check the Troubleshooting section
2. Open an issue on GitHub
3. Include your browser/device info and steps to reproduce

## 🗺️ Roadmap

- [ ] Exercise video tutorials
- [ ] Social features (share workouts)
- [ ] Apple Health / Google Fit integration
- [ ] Advanced analytics and insights
- [ ] Nutrition tracking
- [ ] Exercise form tips and cues
- [ ] Cloud backup with account system
- [ ] Dark mode improvements

---

**Built with 💪 for serious lifters**

Last Updated: December 2025
