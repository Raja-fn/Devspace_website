# DevSpace - Premium Engineering Social Platform

## 🚀 Project Overview

DevSpace is a production-level engineering social platform built with Next.js, Tailwind CSS, and Supabase. It combines features from LinkedIn, GitHub, Discord, Threads, Linear, Vercel, and LeetCode to create a unified premium experience for developers and engineers worldwide.

## 📋 Technology Stack

- **Frontend Framework**: Next.js 16.2.6 (App Router)
- **Styling**: Tailwind CSS 4 with custom animations
- **Animations**: Framer Motion 12.38.0
- **Backend**: Supabase (PostgreSQL + Auth)
- **Icons**: Lucide React 1.16.0
- **Typography**: Next.js Image optimization
- **Type Safety**: TypeScript 5

## 🎨 Design System

### Color Palette
- **Primary Gold**: `#f5c140` (Aura & Accents)
- **Primary Cyan**: `#00bfff` (Secondary Accents)
- **Background**: `#000000` (Pure Black)
- **Text Primary**: `rgba(255,255,255,0.92)`
- **Text Secondary**: `rgba(255,255,255,0.45)`
- **Surface**: Glassmorphism with `rgba(255,255,255,0.03-0.08)`

### Key Features
- Dark theme with black backgrounds
- Glassmorphism effects with backdrop blur
- Subtle gradients and glows
- Smooth micro-interactions
- Animated grid backgrounds
- Premium typography

## 📂 Project Structure

```
app/
├── components/
│   ├── Navbar.tsx                 # Premium navigation with auth
│   ├── LayoutUI.tsx              # Reusable layout components
│   ├── PremiumComponents.tsx      # Premium UI components
│   ├── HeroSection.tsx            # Landing hero
│   ├── FeaturesSection.tsx        # Features showcase
│   ├── CommunitySection.tsx       # Community showcase
│   ├── ChallengeSection.tsx       # Challenges showcase
│   ├── CTASection.tsx             # Call-to-action
│   ├── Footer.tsx                 # Footer
│   └── CursorGlow.tsx             # Cursor glow effect
├── feed/
│   └── page.tsx                   # Social feed with posts
├── profile/
│   └── page.tsx                   # User profile & settings
├── challenges/
│   └── page.tsx                   # Challenges & leaderboard
├── certificates/
│   └── page.tsx                   # Certificates showcase
├── community/
│   └── page.tsx                   # Engineer discovery
├── leaderboard/
│   └── page.tsx                   # Global Aura rankings
├── discover/
│   └── page.tsx                   # Trending content
├── auth/
│   └── callback/
│       └── route.ts               # OAuth callback
├── lib/
│   ├── supabase.ts                # Supabase client
│   └── challengeUtils.ts          # Utility functions
├── globals.css                    # Global styles & animations
├── layout.tsx                     # Root layout
└── page.tsx                       # Landing page

public/
└── logo.png                       # DevSpace logo
```

## 🔑 Key Pages

### 1. Landing Page (`/`)
- Hero section with animated background
- Feature showcase
- Community & challenges preview
- Call-to-action buttons
- Social proof

### 2. Feed (`/feed`)
- Real-time posts from Supabase
- Compose box with image upload
- Like, comment, repost interactions
- Daily mission system
- Aura earning mechanism

### 3. Profile (`/profile`)
- User profile customization
- Avatar & cover image
- Bio, skills, university, role
- Posts, projects, certificates tabs
- Activity feed
- Followers/following count

### 4. Challenges (`/challenges`)
- Challenge listings with filtering
- Difficulty & category filters
- User stats dashboard
- Aura rewards display
- Challenge leaderboard

### 5. Certificates (`/certificates`)
- Certificate showcase gallery
- Download PDF functionality
- Share functionality
- Challenge context
- Earned Aura display

### 6. Community (`/community`)
- Engineer discovery
- Follow/unfollow system
- Rising stars section
- Search functionality
- Aura badges

### 7. Leaderboard (`/leaderboard`)
- Global Aura rankings
- Your rank display
- Timeframe filtering (week/month/all-time)
- Statistics sidebar
- Medals for top 3

### 8. Discover (`/discover`)
- Trending hashtags
- Featured challenges
- Top posts this week
- Growth metrics

## 🎯 Core Components

### PremiumComponents.tsx

1. **AuraBadge**: Display Aura points with animation
2. **SocialPostCard**: Premium post card with interactions
3. **ChallengeCard**: Challenge preview card
4. **CertificateCard**: Certificate preview card
5. **ProfileCard**: User profile showcase
6. **LeaderboardEntry**: Leaderboard rank entry
7. **FloatingCard**: Floating animated card

### LayoutUI.tsx

1. **TopNavbar**: Fixed top navigation bar
2. **LeftSidebar**: Navigation sidebar
3. **RightSidebar**: Leaderboard & trending
4. **MobileBottomNav**: Mobile navigation
5. **Avatar**: User avatar component
6. **FullScreenLoader**: Loading animation

## ✨ Premium Features

### Aura System
- +20 points for daily problem solving
- +5 points for daily posts
- +1 point for each like
- +100-250 points for challenge completion
- +250 points for certificates
- Bonus aura for consecutive days

### Animations
- Smooth page transitions
- Card hover effects
- Floating animations
- Pulse glows
- Stagger animations
- Loading skeletons

### Authentication
- Google OAuth integration
- Persistent sessions
- Protected routes
- User profile sync with Supabase

### Interactive Elements
- Like, comment, repost posts
- Follow/unfollow engineers
- Challenge submissions
- Certificate downloads
- Search functionality

## 🗄️ Database Schema (Supabase)

### Users Table
```sql
- id (UUID)
- email (Text)
- name (Text)
- handle (Text)
- avatar (Text)
- bio (Text)
- aura_points (Integer)
- followers_count (Integer)
- following_count (Integer)
- challenges_solved (Integer)
- current_streak (Integer)
- created_at (Timestamp)
```

### Posts Table
```sql
- id (UUID)
- user_id (UUID FK)
- content (Text)
- image (Text)
- likes_count (Integer)
- comments_count (Integer)
- reposts_count (Integer)
- created_at (Timestamp)
```

### Challenges Table
```sql
- id (UUID)
- title (Text)
- description (Text)
- difficulty (Enum)
- category (Text)
- reward_points (Integer)
- language (Text)
- created_at (Timestamp)
```

### Certificates Table
```sql
- id (UUID)
- user_id (UUID FK)
- challenge_id (UUID FK)
- title (Text)
- score (Integer)
- earned_at (Timestamp)
```

### Challenge_Submissions Table
```sql
- id (UUID)
- user_id (UUID FK)
- challenge_id (UUID FK)
- submitted_date (Date)
- attempts (Integer)
- is_solved (Boolean)
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 Responsive Design

- **Mobile**: Full-featured experience on phones
- **Tablet**: Optimized layout for tablets
- **Desktop**: Multi-column layout with sidebars
- **Large Desktop**: Extended sidebars and widgets

## ⚡ Performance Optimizations

- Image optimization with Next.js Image
- Lazy loading of components
- Memoization of expensive components
- Efficient re-renders with Framer Motion
- CSS animations instead of JS where possible

## 🔒 Security

- OAuth 2.0 with Google
- Row-level security in Supabase
- Protected API routes
- Environment variable protection
- Secure session handling

## 🎭 Customization

### Colors
Edit `globals.css` `:root` variables:
```css
--brand: #f5c140;        /* Primary gold */
--brand-light: #fde68a;  /* Light gold */
--brand-dim: rgba(245, 193, 64, 0.10);
```

### Animations
All animations defined in `globals.css` as keyframes:
- `float`, `float-b` - Floating elements
- `pulse-glow` - Glowing effects
- `shimmer` - Shimmer effects
- `orbit-cw`, `orbit-ccw` - Orbital animations

### Typography
Configured in `tailwind.config.ts`:
- Font sizes, weights, line heights
- Letter spacing, text transforms

## 📚 Usage Examples

### Creating a New Page with Premium Layout

```tsx
'use client'
import { TopNavbar, LeftSidebar, RightSidebar, MobileBottomNav } from '@/app/components/LayoutUI'

export default function NewPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      <TopNavbar {...props} />
      <LeftSidebar activeNav="feed" {...props} />
      <main className="flex-1">
        {/* Your content */}
      </main>
      <RightSidebar />
      <MobileBottomNav activeNav="feed" />
    </div>
  )
}
```

### Using Premium Components

```tsx
import { AuraBadge, ChallengeCard, SocialPostCard } from '@/app/components/PremiumComponents'

// Aura Badge
<AuraBadge amount={250} size="md" animated />

// Challenge Card
<ChallengeCard challenge={challenge} difficulty="hard" />

// Social Post
<SocialPostCard post={post} user={user} isLiked={false} auraEarned={20} />
```

## 🧪 Testing Checklist

- [ ] All pages load correctly
- [ ] Navigation works on all devices
- [ ] Authentication flow works
- [ ] Animations are smooth
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark theme is consistent
- [ ] Performance is optimal
- [ ] All links work correctly
- [ ] Database queries are efficient

## 🐛 Troubleshooting

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript: `npx tsc --noEmit`

### Styling Issues
- Clear Tailwind cache
- Ensure globals.css is imported in layout.tsx
- Check CSS specificity conflicts

### Database Issues
- Verify Supabase credentials
- Check row-level security policies
- Ensure tables exist with correct schema

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Supabase Documentation](https://supabase.com/docs)

## 👥 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request
5. Wait for review and merge

## 📝 License

Proprietary - DevSpace 2025

---

**Built with ❤️ for Engineers Worldwide**
