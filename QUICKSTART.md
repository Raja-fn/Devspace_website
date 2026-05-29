# DevSpace - Quick Start Guide

## 🎯 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google OAuth credentials

### 1️⃣ Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd devspace-web

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 2️⃣ Environment Setup

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from:
1. Supabase Dashboard → Project Settings → API
2. Copy URL and Anon Key

### 3️⃣ Database Setup

Run these SQL commands in Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  name TEXT,
  handle TEXT,
  avatar TEXT,
  bio TEXT,
  aura_points INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  challenges_solved INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create other tables (see DEVSPACE_ARCHITECTURE.md for full schema)
```

### 4️⃣ Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 5️⃣ Test the App

1. Click "Explore DevSpace" or "Login"
2. Sign in with Google
3. Navigate to /feed
4. Explore all pages

## 📚 Key Pages to Test

| Page | URL | Feature |
|------|-----|---------|
| Landing | / | Hero, features, CTA |
| Feed | /feed | Posts, compose, daily missions |
| Profile | /profile | User profile, settings |
| Challenges | /challenges | Challenges, filtering, rewards |
| Certificates | /certificates | Certificate showcase |
| Community | /community | Engineer discovery |
| Leaderboard | /leaderboard | Global rankings |
| Discover | /discover | Trending content |

## 🛠️ Development Commands

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production build
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 🎨 Customization

### Change Brand Colors
Edit `/app/globals.css` `:root` variables:
```css
--brand: #f5c140;        /* Primary gold */
--brand-light: #fde68a;
```

### Add New Animation
Add to `/app/globals.css` @keyframes:
```css
@keyframes my-animation {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-my-animation {
  animation: my-animation 0.6s ease-out;
}
```

### Create New Page
1. Create folder: `app/new-page/`
2. Create file: `page.tsx`
3. Use layout components from `LayoutUI.tsx`
4. Add to navigation in `Navbar.tsx`

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `app/globals.css` | Design system, animations |
| `app/components/Navbar.tsx` | Navigation bar |
| `app/components/LayoutUI.tsx` | Layout components |
| `app/components/PremiumComponents.tsx` | Premium UI components |
| `lib/supabase.ts` | Supabase client |

## ✅ Common Tasks

### Add a New Component
```tsx
// app/components/MyComponent.tsx
'use client'
import { motion } from 'framer-motion'

export function MyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-lg border border-white/8 bg-white/[0.02] p-4"
    >
      Content here
    </motion.div>
  )
}
```

### Add Google OAuth
Already implemented! Just ensure env vars are set.

### Add Database Query
```tsx
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', 'value')
```

### Use Premium Components
```tsx
import { AuraBadge, ChallengeCard, SocialPostCard } from '@/app/components/PremiumComponents'

<AuraBadge amount={250} size="md" />
```

## 🐛 Troubleshooting

### Blank page?
1. Clear browser cache
2. Restart dev server
3. Check browser console for errors

### Components not showing?
1. Check imports are correct
2. Ensure 'use client' is at top
3. Check TypeScript errors

### Database errors?
1. Verify Supabase credentials
2. Check database tables exist
3. Enable Row-Level Security policies

### Auth not working?
1. Verify Google OAuth credentials
2. Check redirect URL in Supabase
3. Check env vars are loaded

## 📱 Mobile Testing

```bash
# Test on mobile
npm run dev -- -H 0.0.0.0
# Visit: http://<your-ip>:3000
```

## 🚀 Deployment to Vercel

1. Push code to GitHub
2. Go to vercel.com
3. Import GitHub repository
4. Set environment variables
5. Deploy!

## 📖 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)

## 💡 Tips & Tricks

1. Use `cmd+shift+p` in VS Code for quick file access
2. Install "Tailwind CSS IntelliSense" extension
3. Use browser DevTools to inspect responsive design
4. Test with mobile device for real feel
5. Use `console.log` for debugging
6. Check Network tab for failed requests

## 🎓 Learning Resources

- Study existing components in `app/components/`
- Review page implementations in each folder
- Check `globals.css` for animation examples
- Read inline comments in components

## 🚨 Important Notes

- Never commit `.env.local`
- Keep Supabase keys secret
- Test before deploying
- Backup database before major changes
- Monitor Vercel analytics after deployment

## 🆘 Need Help?

1. Check error message in console
2. Search for similar issues in docs
3. Review relevant component code
4. Check database schema
5. Test with simplified code

---

**Happy coding! 🚀 Build something amazing with DevSpace**
