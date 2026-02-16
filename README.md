# 🎵 MusicFlow - YouTube Music Player

A beautiful, modern music player web application that searches YouTube and plays audio with a sleek dark-themed interface. Built with Next.js 15, React, and Zustand.

![MusicFlow](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **🔍 YouTube Search** - Search for any song, artist, or album
- **🎧 Audio Playback** - Stream music directly from YouTube
- **📋 Queue System** - Add songs to your playlist and manage your queue
- **💾 Persistence** - Your queue and settings are saved in localStorage
- **🎚️ Player Controls** - Play/Pause, Next/Previous, Volume control, Progress bar
- **🎨 Beautiful UI** - Spotify-inspired dark theme with purple/pink gradients
- **📱 Responsive** - Works on desktop and mobile devices

## 🛠️ Tech Stack

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management
- **[shadcn/ui](https://ui.shadcn.com/)** - UI components
- **[Lucide Icons](https://lucide.dev/)** - Icon library
- **[YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)** - Audio playback

## 📦 Installation & Local Deployment

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Bun** (recommended) or **npm**

### Step 1: Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/YOUR_USERNAME/musicflow.git

# Navigate to project folder
cd musicflow
```

### Step 2: Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

### Step 3: Run Development Server

Using Bun:
```bash
bun run dev
```

Or using npm:
```bash
npm run dev
```

### Step 4: Open in Browser

Navigate to: **http://localhost:3000**

That's it! The app is now running locally. 🎉

---

## 🏠 Local Development

### Development Mode (with hot reload)

```bash
bun run dev
```

- Runs on `http://localhost:3000`
- Automatically reloads when you make changes
- Shows errors in the browser

### Build for Production

```bash
# Create optimized production build
bun run build

# Start production server locally
bun run start
```

This creates an optimized build in the `.next` folder.

### Check for Code Issues

```bash
bun run lint
```

---

## 🔧 Troubleshooting

### Port 3000 already in use

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill

# Or use a different port
bun run dev -- -p 3001
```

### Dependencies issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules bun.lockb
bun install
```

### YouTube player not loading

- Check your internet connection
- Disable ad blockers for localhost
- Try a different browser

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

**Vercel Free Tier includes:**
- 100 GB bandwidth/month
- Unlimited API requests
- Free `.vercel.app` subdomain

### Other Platforms

| Platform | Support |
|----------|---------|
| Vercel | ✅ Perfect |
| Netlify | ✅ Yes (with Next.js adapter) |
| Railway | ✅ Yes |
| GitHub Pages | ❌ No (requires server-side API) |

## 📁 Project Structure

```
musicflow/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── search/
│   │   │       └── route.ts      # YouTube search API
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Main page
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── MusicPlayer.tsx       # Bottom player bar
│   │   ├── SearchBar.tsx         # Search input
│   │   ├── SongCard.tsx          # Song result card
│   │   └── YouTubePlayer.tsx     # YouTube embed
│   ├── store/
│   │   └── playerStore.ts        # Zustand state
│   ├── lib/
│   │   └── utils.ts              # Utility functions
│   └── types/
│       └── youtube.d.ts          # TypeScript types
├── public/
├── package.json
└── README.md
```

## 💾 Data Persistence

The following data is automatically saved to `localStorage`:

| Data | Key | Description |
|------|-----|-------------|
| Queue | `musicflow-player-storage` | Your saved songs |
| Current Song | `musicflow-player-storage` | Last playing song |
| Volume | `musicflow-player-storage` | Volume preference |

## 🎮 Usage

1. **Search** - Type any song or artist name in the search bar
2. **Quick Search** - Click on popular artist buttons for instant results
3. **Play** - Click on any song card to start playing
4. **Queue** - Add songs to your queue using the + button
5. **Controls** - Use the bottom player bar for playback controls

## 🔧 Available Scripts

```bash
# Development
bun run dev          # Start dev server

# Linting
bun run lint         # Run ESLint

# Build
bun run build        # Build for production
bun run start        # Start production server
```

## 🙏 Acknowledgments

- [YouTube](https://youtube.com) - Music source
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Lucide](https://lucide.dev) - Icons

---

Made with ❤️ by unai-a
