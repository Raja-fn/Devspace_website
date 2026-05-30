'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Zap, Award, Users, User, Search, Bell,
  LogOut, Star, ChevronRight, TrendingUp, X, Trophy, Briefcase
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { LeaderboardEntry } from './PremiumComponents'
import { ChatModal } from './ChatModal'
import { UserProjectsModal } from './UserProjectsModal'

/* ─────────────────────────── constants ─────────────────────────── */
const NAV = [
  { icon: Home,    label: 'Feed',          key: 'feed',          href: '/feed' },
  { icon: Briefcase, label: 'Opportunities', key: 'opportunities', href: '/opportunities' },
  { icon: Trophy,  label: 'Leaderboard',   key: 'leaderboard',   href: '/leaderboard' },
  { icon: User,    label: 'Profile',       key: 'profile',       href: '/profile' },
]

const TRENDING = [
  { tag: '#SystemsDesign',   posts: '1.2k posts' },
  { tag: '#OpenSource',      posts: '980 posts'  },
  { tag: '#Kubernetes',      posts: '740 posts'  },
  { tag: '#Rust',            posts: '610 posts'  },
  { tag: '#AIEngineering',   posts: '590 posts'  },
]

/* ═══════════════════════════════════════════════════════════════════
   TOP NAVBAR
═══════════════════════════════════════════════════════════════════ */
export function TopNavbar({ avatarUrl, userName, userInitial, search, setSearch, signOut, auraPoints }: any) {
  const [showUser, setShowUser] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    let channel: any;

    async function setupNotifications() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Fetch initial notifications
      const { data } = await supabase
        .from('notifications')
        .select('*, actor:actor_id(name, handle, avatar)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
      
      if (data) {
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.is_read).length)
      }

      // 2. Subscribe to real-time changes
      const uniqueSuffix = Math.random().toString(36).substring(7)
      channel = supabase
        .channel(`user-notifications-${user.id}-${uniqueSuffix}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          async (payload) => {
            const { data: actorData } = await supabase
              .from('users')
              .select('name, handle, avatar')
              .eq('id', payload.new.actor_id)
              .single()
            
            const newNotif = { ...payload.new, actor: actorData }
            setNotifications(prev => [newNotif, ...prev].slice(0, 20))
            setUnreadCount(prev => prev + 1)
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          (payload) => {
            setNotifications(prev => prev.map(n => n.id === payload.new.id ? { ...n, is_read: payload.new.is_read } : n))
            setUnreadCount(prev => {
              if (payload.old.is_read === false && payload.new.is_read === true) return Math.max(0, prev - 1)
              if (payload.old.is_read === true && payload.new.is_read === false) return prev + 1
              return prev
            })
          }
        )
        .subscribe()
    }

    setupNotifications()
    return () => { if (channel) supabase.removeChannel(channel) }
  }, [])

  const markAsRead = async () => {
    if (unreadCount === 0) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUnreadCount(0)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/90 backdrop-blur-2xl border-b border-white/[0.055] h-[57px] flex items-center px-4 gap-4 shadow-xl">
      <a href="/feed" className="flex items-center gap-2.5 shrink-0 w-[148px] pl-2 hover:opacity-80 transition-opacity">
        <div className="h-7 w-7 rounded-lg overflow-hidden shrink-0">
          <Image src="/logo.png" alt="DevSpace" width={28} height={28} className="object-contain" />
        </div>
        <span className="text-[13px] font-bold uppercase tracking-[0.15em] text-white/80 hidden sm:block">DevSpace</span>
      </a>

      <div className="flex-1 max-w-md mx-auto relative hidden sm:block">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search engineers, posts, challenges…"
          className="w-full bg-white/[0.04] border border-white/[0.07] rounded-full pl-9 pr-4 py-1.5 text-[13px] text-white/70 placeholder-white/20 outline-none focus:border-[#f5c140]/25 focus:bg-white/[0.06] transition-all duration-200"
        />
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications)
              if (!showNotifications) markAsRead()
              setShowUser(false)
            }}
            className="relative flex h-8 w-8 items-center justify-center rounded-full text-white/35 hover:text-white/80 hover:bg-white/6 transition-all duration-200"
          >
            <Bell size={16} className={unreadCount > 0 ? 'text-[#f5c140]' : ''} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 flex items-center justify-center rounded-full bg-[#f5c140] text-black text-[9px] font-bold border border-black">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <p className="text-[13px] font-bold text-white">Notifications</p>
                  <button onClick={() => setShowNotifications(false)} className="text-white/20 hover:text-white"><X size={14} /></button>
                </div>
                <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                      <Bell size={24} className="mb-2" />
                      <p className="text-[12px]">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.04] transition-colors flex gap-3 ${!n.is_read ? 'bg-[#f5c140]/[0.03]' : ''}`}>
                        <Avatar url={n.actor?.avatar} initial={n.actor?.name?.[0]} size={34} ring={!n.is_read} />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-[12px] text-white/90 leading-snug">
                              <span className="font-bold">{n.actor?.name}</span>
                              <span className="text-white/50 ml-1">
                                {n.type === 'message' ? 'sent you a message' : 
                                 n.type === 'like' ? 'liked your post' : 
                                 n.type === 'follow' ? 'started following you' : n.content}
                              </span>
                            </p>
                            {!n.is_read && <div className="h-1.5 w-1.5 rounded-full bg-[#f5c140] mt-1 shrink-0" />}
                          </div>
                          {n.type === 'message' && (
                            <p className="text-[11px] text-[#f5c140]/70 mt-1 line-clamp-1 italic bg-white/5 px-2 py-0.5 rounded border border-white/5">
                              &ldquo;{n.content}&rdquo;
                            </p>
                          )}
                          <p className="text-[10px] text-white/25 mt-1.5 font-medium">
                            {new Date(n.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowUser(v => !v)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10"
          >
            <Avatar url={avatarUrl} initial={userInitial} size={28} />
            <span className="hidden sm:block text-[12px] text-white/50 max-w-[80px] truncate">{userName.split(' ')[0]}</span>
          </button>
          <AnimatePresence>
            {showUser && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-1.5 z-50"
              >
                <div className="px-3 py-2.5 mb-1 border-b border-white/5">
                  <p className="text-[13px] font-semibold text-white/80 truncate">{userName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Zap size={10} className="text-[#f5c140] fill-[#f5c140]" />
                    <p className="text-[11px] text-[#f5c140]/90 font-bold">{(auraPoints || 0).toLocaleString()} Aura</p>
                  </div>
                </div>
                <a href="/profile" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-white/60 hover:bg-white/5 hover:text-white transition-colors duration-150">
                  <User size={14} /> Profile
                </a>
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-red-400/80 hover:bg-red-500/8 hover:text-red-400 transition-colors duration-150"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   LEFT SIDEBAR
═══════════════════════════════════════════════════════════════════ */
export function LeftSidebar({ activeNav, avatarUrl, userName, userInitial, signOut }: any) {
  return (
    <aside className="hidden md:flex flex-col gap-1 sticky top-[57px] h-[calc(100vh-57px)] pt-4 pb-6 pr-3 overflow-y-auto">
      {NAV.map(({ icon: Icon, label, key, href }) => {
        const active = activeNav === key
        return (
          <a
            key={key}
            href={href}
            className={`group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 relative
              ${active
                ? 'text-[#f5c140]'
                : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
              }`}
          >
            {active && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 rounded-xl bg-[#f5c140]/8 border border-[#f5c140]/15"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <Icon size={17} className={`relative z-10 transition-colors ${active ? 'text-[#f5c140]' : 'group-hover:text-white/70'}`} />
            <span className="relative z-10">{label}</span>
          </a>
        )
      })}

      <div className="mt-auto pt-4 border-t border-white/[0.055]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors cursor-default">
          <Avatar url={avatarUrl} initial={userInitial} size={34} ring />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white/70 truncate">{userName}</p>
            <p className="text-[10px] text-white/25 mt-0.5">Engineer</p>
          </div>
          <button onClick={signOut} className="text-white/20 hover:text-red-400/70 transition-colors">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   RIGHT SIDEBAR
═══════════════════════════════════════════════════════════════════ */
export function RightSidebar() {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user)
    })

    async function fetchLeaderboard() {
      const { data } = await supabase
        .from('users')
        .select('id, name, handle, avatar, aura_points')
        .order('aura_points', { ascending: false })
        .limit(4)
      
      if (data) setLeaderboard(data)
    }
    fetchLeaderboard()
  }, [])

  const handleChat = (targetUser: any) => {
    if (!user) {
      alert("Please login to chat.")
      return
    }
    if (user.id === targetUser.id) return
    setSelectedUser(targetUser)
    setIsChatOpen(true)
  }

  return (
    <aside className="hidden xl:flex flex-col gap-5 sticky top-[57px] h-[calc(100vh-57px)] pt-4 pb-6 pl-5 overflow-y-auto w-[300px] no-scrollbar">
      <div className="rounded-2xl border border-[#f5c140]/20 bg-gradient-to-br from-[#f5c140]/8 to-white/[0.02] backdrop-blur-xl p-4.5 shadow-[0_8px_32px_rgba(245,193,64,0.1)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star size={14} className="text-[#f5c140] fill-[#f5c140]" />
            <p className="text-sm font-bold text-white">Aura Leaderboard</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {leaderboard.map((u, i) => (
            <motion.div
              key={u.id || i}
              whileHover={{ y: -1 }}
              className={`rounded-2xl border transition-all p-3.5 cursor-pointer ${
                i === 0 ? 'bg-[#f5c140]/10 border-[#f5c140]/30' : 'bg-white/[0.04] border-white/10'
              }`}
              onClick={() => handleChat(u)}
            >
              <div className="flex items-center gap-3">
                <Avatar url={u.avatar} initial={u.name?.[0]} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{u.name}</p>
                  <p className="text-[10px] text-white/40 truncate">@{u.handle}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#f5c140]">
                  <Zap size={10} className="fill-[#f5c140]" />
                  {u.aura_points || 0}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isChatOpen && selectedUser && (
          <ChatModal 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
            currentUser={user} 
            targetUser={selectedUser} 
          />
        )}
      </AnimatePresence>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-lg p-4.5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} className="text-white/40" />
          <p className="text-sm font-bold text-white">Trending</p>
        </div>
        <div className="space-y-3">
          {TRENDING.map((t) => (
            <div key={t.tag}>
              <p className="text-[12px] font-semibold text-white/65">{t.tag}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{t.posts}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

export function MobileBottomNav({ activeNav }: any) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] border-t border-white/[0.06] bg-black/95 backdrop-blur-2xl px-2 py-2 safe-area-bottom pb-4">
      <div className="flex items-center justify-around">
        {NAV.map(({ icon: Icon, label, key, href }) => {
          const active = activeNav === key
          return (
            <a
              key={key}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1.5"
            >
              <Icon size={20} className={active ? 'text-[#f5c140]' : 'text-white/30'} />
              <span className={`text-[9px] font-medium ${active ? 'text-[#f5c140]' : 'text-white/20'}`}>
                {label}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}

export function Avatar({ url, initial = 'U', size, ring }: { url?: string; initial?: string; size: number; ring?: boolean }) {
  const cls = `rounded-full object-cover shrink-0 ${ring ? 'ring-1 ring-[#f5c140]/25' : 'ring-1 ring-white/8'}`
  
  if (url && (url.startsWith('http') || url.startsWith('/'))) {
    return <Image src={url} alt="Avatar" width={size} height={size} className={cls} style={{ width: size, height: size }} />
  }
  
  return (
    <div
      className={`flex shrink-0 items-center justify-center font-bold text-white ${ring ? 'ring-1 ring-[#f5c140]/25' : 'ring-1 ring-white/8'}`}
      style={{
        width: size, height: size,
        borderRadius: '50%',
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${stringToColor(initial)}, ${stringToColor(initial + '2')})`,
      }}
    >
      {initial}
    </div>
  )
}

export function FollowButton({ targetUserId, currentUserId }: { targetUserId: string; currentUserId?: string }) {
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUserId && targetUserId && currentUserId !== targetUserId) {
      supabase.from('follows').select('*').eq('follower_id', currentUserId).eq('following_id', targetUserId).single()
        .then(({ data }) => {
          if (data) setFollowing(true)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [targetUserId, currentUserId])

  async function toggleFollow() {
    if (!currentUserId || !targetUserId || currentUserId === targetUserId) return
    const newFollowing = !following
    setFollowing(newFollowing)
    if (newFollowing) {
      await supabase.from('follows').insert({ follower_id: currentUserId, following_id: targetUserId })
    } else {
      await supabase.from('follows').delete().eq('follower_id', currentUserId).eq('following_id', targetUserId)
    }
  }

  if (!currentUserId || currentUserId === targetUserId) return null

  return (
    <button onClick={toggleFollow} disabled={loading} className={`rounded-full px-4 py-1.5 text-[12px] font-bold transition-all ${following ? 'bg-white/10 text-white' : 'bg-white text-black'}`}>
      {loading ? '...' : following ? 'Following' : 'Follow'}
    </button>
  )
}

export function stringToColor(str: string) {
  if (!str) return '#7c3aed'
  const colors = ['#7c3aed','#0891b2','#059669','#d97706','#dc2626','#6366f1','#0284c7','#0d9488']
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <Image src="/logo.png" alt="Logo" width={56} height={56} className="rounded-2xl" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }} className="absolute -inset-2 rounded-full border-t border-[#f5c140]/40" />
        </div>
        <p className="text-[13px] font-semibold text-white/60">Loading...</p>
      </div>
    </div>
  )
}
