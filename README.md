# DevSpace - Elite Engineering Social Platform

> **The Premium Engineering Network for Building & Growing Together**

A production-level social platform combining LinkedIn, GitHub, Discord, Threads, Linear, Vercel, and LeetCode into one unified, premium experience for developers worldwide.

![DevSpace](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black) ![Tailwind](https://img.shields.io/badge/Tailwind-4-blue) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## 🎯 What is DevSpace?

DevSpace is an elite engineering social platform where developers can:
- 📝 Share engineering insights and projects
- 🏆 Solve challenges and earn certificates
- ⭐ Build reputation through Aura points
- 🌍 Connect with world-class engineers
- 🎓 Learn and grow together

## ✨ Key Features

### Social Networking
- 📰 Real-time social feed with posts
- ❤️ Like, comment, and repost interactions
- 👥 Engineer discovery and follow system
- 👤 Customizable engineer profiles
- 🔔 Activity tracking

### Challenge System
- 🎯 Weekly engineering challenges
- 🏅 Difficulty levels (Easy → Expert)
- 📊 Challenge leaderboard
- 🎁 Aura rewards (100-250 points)
- 📈 Progress tracking

### Aura Reputation System
- ⭐ Earn points for contributions
- 🏆 Global leaderboard ranking
- 🎖️ Achievement badges
- 📈 Streak tracking
- 🎁 Bonus rewards

### Certificates
- 📜 Auto-generated certificates
- 🎓 Challenge-based certification
- 📥 PDF download and sharing
- ✨ Premium design with DevSpace branding
- 🔐 Verified credentials

### Discovery & Community
- 🔥 Trending topics and hashtags
- 👨‍💼 Rising stars showcase
- 🎯 Smart recommendations
- 🔍 Advanced search and filtering
- 📊 Global insights

## 🏗️ Architecture

### Tech Stack
```
Frontend:     Next.js 16 (App Router) + TypeScript
Styling:      Tailwind CSS 4 + Custom Animations
Animations:   Framer Motion
Backend:      Supabase (PostgreSQL)
Icons:        Lucide React
Auth:         Google OAuth 2.0
```

### Pages (8 Main)
1. **Landing** (/) - Hero, features, CTA
2. **Feed** (/feed) - Social posts & engagement
3. **Challenges** (/challenges) - Challenge listings
4. **Certificates** (/certificates) - Achievement showcase
5. **Community** (/community) - Engineer discovery
6. **Leaderboard** (/leaderboard) - Global rankings
7. **Profile** (/profile) - User profile & settings
8. **Discover** (/discover) - Trending content

## 🎨 Design System

### Premium Aesthetic
- 🌑 Dark theme with pure black backgrounds
- ✨ Glassmorphism with backdrop blur
- 💫 Smooth animations & micro-interactions
- 🎯 Gold (#f5c140) + Cyan (#00bfff) accents
- 📱 Fully responsive (mobile/tablet/desktop)

### Key Components
- Premium cards with hover effects
- Animated badges and counters
- Floating action buttons
- Progress indicators
- Loading skeletons
- Toast notifications (ready)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Google OAuth credentials

### Installation
```bash
# Clone repository
git clone <repo-url>
cd devspace-web

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup guide.

## 📁 Project Structure

```
app/
├── components/           # Reusable components
│   ├── Navbar.tsx       # Navigation
│   ├── LayoutUI.tsx     # Layout components
│   └── PremiumComponents.tsx  # Premium UI
├── feed/                # Social feed page
├── profile/             # User profile
├── challenges/          # Challenges page
├── certificates/        # Certificates page
├── community/           # Community discovery
├── leaderboard/         # Global rankings
├── discover/            # Trending content
└── lib/                 # Utilities
    └── supabase.ts      # Supabase client

public/                  # Static assets
```

## 🎯 Aura System

### How to Earn Aura
- 💬 **Posts**: +5 points per post
- ❤️ **Likes**: +1 point per like received
- 🎯 **Challenges**: +100-250 points
- 🎓 **Certificates**: +250 points
- 🔥 **Streak**: Bonus multiplier

### Features
- Global leaderboard ranking
- Weekly/monthly/all-time views
- Personal rank tracking
- Achievement badges
- Streak counter

## 🔐 Authentication

- Google OAuth 2.0 integration
- Persistent sessions
- Protected routes
- Automatic profile creation
- Role-based access control

## 📱 Responsive Design

| Device | Support | Status |
|--------|---------|--------|
| Mobile | < 768px | ✅ Full |
| Tablet | 768-1024px | ✅ Full |
| Desktop | > 1024px | ✅ Full |
| Large | > 1536px | ✅ Full |

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

## 📚 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Get started in 5 minutes
- [DEVSPACE_ARCHITECTURE.md](./DEVSPACE_ARCHITECTURE.md) - Full technical docs
- [TRANSFORMATION_COMPLETE.md](./TRANSFORMATION_COMPLETE.md) - Implementation checklist

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Clear cache, restart dev server |
| Auth fails | Check Supabase credentials |
| DB errors | Verify tables exist |

See [QUICKSTART.md](./QUICKSTART.md#-troubleshooting) for more.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## 📝 License

Proprietary - DevSpace 2025

---

**Built for Engineers, by Engineers** 🚀

**[View Full Documentation](./DEVSPACE_ARCHITECTURE.md) | [Quick Start](./QUICKSTART.md)**

