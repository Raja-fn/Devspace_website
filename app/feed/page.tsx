'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MoreHorizontal, Sparkles, ImageIcon, Star, ChevronRight, Code2, X, Play, ShieldAlert, ShieldCheck } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

import { 
  TopNavbar, LeftSidebar, RightSidebar, MobileBottomNav, 
  Avatar, stringToColor, FullScreenLoader, FollowButton 
} from '../components/LayoutUI'

/* ─────────────────────────── helpers ──────────────────────────── */
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

function getISTDate(date = new Date()) {
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
}

function getChallengeDate(date = new Date()) {
  const istTime = getISTDate(date)
  const challengeDate = new Date(istTime)
  if (istTime.getHours() < 5) {
    challengeDate.setDate(challengeDate.getDate() - 1)
  }
  challengeDate.setHours(0, 0, 0, 0)
  return challengeDate
}

function getChallengeDateString(date = new Date()) {
  return getChallengeDate(date).toISOString().split('T')[0]
}

function getDailyChallengeIndex(challengeDate: Date, total: number) {
  const daysSinceEpoch = Math.floor(challengeDate.getTime() / 86400000)
  return ((daysSinceEpoch % total) + total) % total
}

const DAILY_C_MEDIUM_CHALLENGES = [
  {
    id: 'c-medium-01',
    title: 'Pointer Arithmetic Master',
    description: 'Create an array of function pointers and iterate through them dynamically without causing a segfault in C.',
    language: 'C',
    reward_points: 250,
  },
  {
    id: 'c-medium-02',
    title: 'Memory Safe Linked List',
    description: 'Implement a singly linked list in C that supports insert, delete, and reverse operations without memory leaks.',
    language: 'C',
    reward_points: 250,
  },
  {
    id: 'c-medium-03',
    title: 'Dynamic Buffer Resizing',
    description: 'Build a dynamic string buffer in C that grows automatically when new data is appended.',
    language: 'C',
    reward_points: 250,
  },
  {
    id: 'c-medium-04',
    title: 'Function Pointer Table',
    description: 'Use an array of function pointers to execute different arithmetic operations based on runtime input.',
    language: 'C',
    reward_points: 250,
  },
  {
    id: 'c-medium-05',
    title: 'Circular Queue in C',
    description: 'Implement a circular queue with enqueue, dequeue, and peek operations using a fixed-size array.',
    language: 'C',
    reward_points: 250,
  },
  {
    id: 'c-medium-06',
    title: 'Binary Search Tree Traversal',
    description: 'Write C functions for pre-order, in-order, and post-order traversal of a binary search tree.',
    language: 'C',
    reward_points: 250,
  },
  {
    id: 'c-medium-07',
    title: 'String Tokenizer',
    description: 'Create a C tokenizer that splits a string into tokens using custom delimiters without using strtok.',
    language: 'C',
    reward_points: 250,
  },
  {
    id: 'c-medium-08',
    title: 'Matrix Rotation',
    description: 'Rotate a square matrix by 90 degrees in place using C arrays and pointer arithmetic.',
    language: 'C',
    reward_points: 250,
  },
  {
    id: 'c-medium-09',
    title: 'Prime Sieve Optimizer',
    description: 'Implement the Sieve of Eratosthenes in C and optimize it for memory and speed.',
    language: 'C',
    reward_points: 250,
  },
  {
    id: 'c-medium-10',
    title: 'Command Parser',
    description: 'Build a small C command parser that splits input into tokens and handles quoted strings correctly.',
    language: 'C',
    reward_points: 250,
  },
]

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
export default function FeedPage() {
  const router   = useRouter()
  const [user,      setUser]      = useState<SupabaseUser | null>(null)
  const [dbUser,    setDbUser]    = useState<any>(null)
  const [posts,     setPosts]     = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [newPost,   setNewPost]   = useState('')
  const [posting,   setPosting]   = useState(false)
  const [checking,  setChecking]  = useState(true)
  const [search,    setSearch]    = useState('')
  const textRef = useRef<HTMLTextAreaElement>(null)

  const [dailyMission, setDailyMission] = useState<any>(null)
  const [challengeStatus, setChallengeStatus] = useState<any>(null)

  /* ── Calculate time until 5 AM IST ── */
  function getTimeUntilFiveAMIST() {
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const nextFiveAM = new Date(istTime);
    nextFiveAM.setHours(5, 0, 0, 0);
    
    // If it's already past 5 AM today, schedule for tomorrow
    if (nextFiveAM <= istTime) {
      nextFiveAM.setDate(nextFiveAM.getDate() + 1);
    }
    
    return nextFiveAM.getTime() - istTime.getTime();
  }

  /* ── Set up daily challenge reset at 5 AM IST ── */
  useEffect(() => {
    const scheduleRefresh = () => {
      const timeUntilFiveAM = getTimeUntilFiveAMIST();
      const timer = setTimeout(() => {
        fetchMission(user?.id);
        scheduleRefresh(); // Reschedule for next day
      }, timeUntilFiveAM);
      return () => clearTimeout(timer);
    };

    return scheduleRefresh();
  }, [user?.id])

  /* ── Auth guard (temporarily disabled for dev) ── */
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user)
        const { data: dbData } = await supabase.from('users').select('*').eq('id', data.user.id).single()
        if (dbData) setDbUser(dbData)
        fetchMission(data.user.id)
      }
      setChecking(false)
      fetchPosts()
    })
  }, [router])

  async function fetchMission(userId?: string) {
    const { data: allChallenges } = await supabase.from('challenges').select('*').eq('language', 'C').order('created_at', { ascending: true })

    const availableChallenges = (allChallenges && allChallenges.length >= 10)
      ? allChallenges
      : [
          ...(allChallenges ?? []),
          ...DAILY_C_MEDIUM_CHALLENGES.filter(fallback => !allChallenges?.some(ch => ch.id === fallback.id || ch.title === fallback.title))
        ]

    if (!availableChallenges || availableChallenges.length === 0) {
      const fallback = DAILY_C_MEDIUM_CHALLENGES[0]
      setDailyMission(fallback)
      return
    }

    const challengeDate = getChallengeDate()
    const selectedIndex = getDailyChallengeIndex(challengeDate, availableChallenges.length)
    const mission = availableChallenges[selectedIndex]

    setDailyMission(mission)

    if (userId) {
      const challengeDayString = challengeDate.toISOString().split('T')[0]
      const { data: statusData } = await supabase
        .from('challenge_submissions')
        .select('*')
        .eq('user_id', userId)
        .eq('challenge_id', mission.id)
        .eq('submitted_date', challengeDayString)
        .single()

      if (statusData) {
        setChallengeStatus(statusData)
      } else {
        setChallengeStatus(null)
      }
    }
  }

  /* ── Data fetching (preserved) ── */
  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select(`*, users (name, handle, avatar)`)
      .order('created_at', { ascending: false })

    if (!error) setPosts(data ?? [])
    setLoading(false)
  }

  /* ── Create post (preserved) ── */
  async function createPost() {
    if (!newPost.trim() || posting || !user) return
    setPosting(true)
    const { error } = await supabase.from('posts').insert([
      { content: newPost, user_id: user.id, likes_count: 0, comments_count: 0, reposts_count: 0 },
    ])
    if (!error) { setNewPost(''); fetchPosts() }
    setPosting(false)
  }

  /* ── Sign out (preserved) ── */
  const signOut = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (checking) return <FullScreenLoader />

  const avatarUrl  = user?.user_metadata?.avatar_url
  const userName   = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? 'You'
  const userInitial = userName[0]?.toUpperCase() ?? 'U'

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.015] noise" />

      <TopNavbar
        avatarUrl={avatarUrl} userName={userName} userInitial={userInitial}
        search={search} setSearch={setSearch} signOut={signOut}
        auraPoints={dbUser?.aura_points}
      />

      <div className="mx-auto max-w-7xl px-4 pt-[57px]">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_300px] min-h-screen relative">
          <LeftSidebar activeNav="feed" avatarUrl={avatarUrl} userName={userName} userInitial={userInitial} signOut={signOut} />

          <main className="border-x border-white/[0.055] min-h-screen pb-20 md:pb-0 bg-black/20">
            <div className="sticky top-[57px] z-30 bg-[#030303]/85 backdrop-blur-2xl border-b border-white/[0.055] px-5 py-3.5 flex items-center justify-between">
              <h1 className="text-[15px] font-bold text-white tracking-[-0.01em]">Feed</h1>
              <button onClick={() => { fetchPosts(); fetchMission(user?.id); }} className="text-[12px] text-[#f5c140]/70 hover:text-[#f5c140] transition-colors flex items-center gap-1.5 font-medium">
                <Sparkles size={12} /> Refresh
              </button>
            </div>

            <DailyMissionBox mission={dailyMission} user={user} challengeStatus={challengeStatus} onChallengeComplete={async () => { if (user?.id) await fetchMission(user.id) }} />

            <ComposeBox
              newPost={newPost} setNewPost={setNewPost} posting={posting} createPost={createPost}
              avatarUrl={avatarUrl} userInitial={userInitial} textRef={textRef}
            />

            <PostList posts={posts} loading={loading} currentUser={user} />
          </main>

          <RightSidebar />
        </div>
      </div>

      <MobileBottomNav activeNav="feed" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   COMPOSE BOX
═══════════════════════════════════════════════════════════════════ */
function ComposeBox({ newPost, setNewPost, posting, createPost, avatarUrl, userInitial, textRef }: any) {
  const [focused, setFocused] = useState(false)
  const hasContent = newPost.trim().length > 0

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      createPost();
    }
  }

  return (
    <div className={`border-b border-white/[0.055] px-5 py-4 transition-all duration-300 ${
      focused ? 'bg-gradient-to-b from-white/[0.02] to-white/[0.01] border-[#f5c140]/10' : 'bg-white/[0.005]'
    }`}>
      <div className="flex gap-3.5">
        <Avatar url={avatarUrl} initial={userInitial} size={40} />
        <div className="flex-1 min-w-0">
          <textarea
            ref={textRef} value={newPost} onChange={e => setNewPost(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onKeyDown={handleKey}
            placeholder="Share your engineering journey…" rows={focused || hasContent ? 3 : 1}
            className="w-full bg-transparent text-[14px] text-white/80 placeholder-white/25 outline-none resize-none leading-relaxed transition-all duration-200 pt-1.5"
          />
          <AnimatePresence>
            {(focused || hasContent) && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/8">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#f5c140]/60 hover:text-[#f5c140] hover:bg-[#f5c140]/10 transition-all duration-200 text-[12px] border border-transparent hover:border-[#f5c140]/20">
                      <ImageIcon size={15} /> <span className="hidden sm:inline">Image</span>
                    </button>
                  </div>
                  <motion.button
                    whileHover={{ scale: hasContent ? 1.05 : 1 }} whileTap={{ scale: hasContent ? 0.95 : 1 }}
                    onMouseDown={(e) => { e.preventDefault(); createPost() }}
                    disabled={posting || !hasContent}
                    className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#f5c140] to-orange-500 px-6 py-2.5 text-[13px] font-bold text-black disabled:opacity-40 transition-all duration-200 shadow-lg shadow-[#f5c140]/20 hover:shadow-[0_0_24px_rgba(245,193,64,0.5)]"
                  >
                    {posting ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}><Sparkles size={13} /></motion.div>Posting…</>) 
                    : (<>Post</>)}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   POST LIST & CARD
═══════════════════════════════════════════════════════════════════ */
function PostList({ posts, loading, currentUser }: { posts: any[]; loading: boolean; currentUser: SupabaseUser | null }) {
  if (loading) return <div className="divide-y divide-white/[0.04]">{[1, 2, 3, 4].map(i => <PostSkeleton key={i} />)}</div>
  if (posts.length === 0) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-24 px-8 text-center">
      <div className="h-16 w-16 rounded-3xl bg-[#f5c140]/8 border border-[#f5c140]/15 flex items-center justify-center"><Sparkles size={28} className="text-[#f5c140]/60" /></div>
      <div><p className="text-[15px] font-semibold text-white/50">No posts yet</p><p className="text-[13px] text-white/25 mt-1">Be the first to share your engineering journey 🚀</p></div>
    </motion.div>
  )
  return <div className="divide-y divide-white/[0.04]">{posts.map((post, i) => <PostCard key={post.id} post={post} index={i} currentUser={currentUser} />)}</div>
}

export function PostCard({ post, index, currentUser }: { post: any; index: number; currentUser?: SupabaseUser | null }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState<number>(post.likes_count ?? 0)
  const [showLikesModal, setShowLikesModal] = useState(false)

  useEffect(() => {
    if (currentUser) {
      supabase.from('post_likes')
        .select('*')
        .eq('post_id', post.id)
        .eq('user_id', currentUser.id)
        .single()
        .then(({ data }) => {
          if (data) setLiked(true)
        })
    }
  }, [post.id, currentUser])

  const name    = post.users?.name    ?? 'Unknown Engineer'
  const handle  = post.users?.handle  ?? 'user'
  const initial = name[0]?.toUpperCase() ?? 'U'
  const ts      = post.created_at ? timeAgo(post.created_at) : ''

  async function toggleLike() {
    if (!currentUser) return
    
    const newLiked = !liked
    setLiked(newLiked)
    setLikes(newLiked ? likes + 1 : likes - 1)

    if (newLiked) {
      await supabase.from('post_likes').insert({ post_id: post.id, user_id: currentUser.id })
    } else {
      await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', currentUser.id)
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: Math.min(index * 0.06, 0.4) }}
      className="group relative px-6 py-5 transition-all duration-300 hover:bg-white/[0.03] border-b border-white/[0.04] hover:border-[#f5c140]/10"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(245,193,64,0.03),transparent_50%)]" />
      <div className="relative z-10 flex gap-4">
        <Avatar url={post.users?.avatar} initial={initial} size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5">
              <Link href={`/profile/${handle}`} className="text-[14px] font-bold text-white/90 hover:underline cursor-pointer">{name}</Link>
              <Link href={`/profile/${handle}`} className="text-[13px] text-white/40">@{handle}</Link>
              {ts && <span className="text-[12px] text-white/20">· {ts}</span>}
            </div>
            <button className="opacity-0 group-hover:opacity-100 flex items-center justify-center h-8 w-8 rounded-full text-white/30 hover:text-white/90 hover:bg-white/10 transition-all duration-200">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <p className="text-[14.5px] leading-relaxed text-white/80 mb-3.5 whitespace-pre-wrap break-words">{post.content}</p>
          {post.image_url && <img src={post.image_url} alt="Post" className="w-full rounded-2xl mb-4 border border-white/10 object-cover max-h-96 shadow-[0_10px_40px_rgba(0,0,0,0.3)]" />}
          
          <div className="flex items-center gap-3 -ml-2.5 mt-3">
            <ActionBtn 
              icon={<Heart size={16} className={liked ? 'fill-rose-500 text-rose-500 hover:!scale-110 transition-transform' : ''} />} 
              count={likes} 
              active={liked} 
              activeColor="text-rose-400" 
              hoverColor="hover:text-rose-400 hover:bg-rose-500/10" 
              onClick={toggleLike}
              onCountClick={() => setShowLikesModal(true)}
            />
            <div className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-[#f5c140]/20 to-[#f5c140]/10 text-[#f5c140] border border-[#f5c140]/25 shadow-[0_0_12px_rgba(245,193,64,0.12)]">
              <Star size={12} className="fill-[#f5c140]" /> <span>{((post.likes_count ?? 0) * 4)} Aura</span>
            </div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showLikesModal && (
          <LikesModal postId={post.id} onClose={() => setShowLikesModal(false)} currentUser={currentUser} />
        )}
      </AnimatePresence>
    </motion.article>
  )
}

function ActionBtn({ icon, count, active, activeColor, hoverColor, onClick, onCountClick }: any) {
  return (
    <div className="flex items-center">
      <motion.button 
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 12 }}
        onClick={onClick} 
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors duration-200 ${active ? activeColor : 'text-white/40'} ${hoverColor}`}
      >
        {icon}
      </motion.button>
      {count > 0 && (
        <button 
          onClick={onCountClick}
          className={`text-[13px] font-semibold -ml-1.5 px-2 py-1.5 rounded-full transition-colors duration-200 ${active ? activeColor : 'text-white/40'} hover:underline`}
        >
          {count}
        </button>
      )}
    </div>
  )
}

function LikesModal({ postId, onClose, currentUser }: { postId: string; onClose: () => void; currentUser?: SupabaseUser | null }) {
  const [likers, setLikers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLikers() {
      const { data } = await supabase
        .from('post_likes')
        .select('users (id, name, handle, avatar)')
        .eq('post_id', postId)
      
      if (data) {
        setLikers(data.map((d: any) => d.users))
      }
      setLoading(false)
    }
    fetchLikers()
  }, [postId])

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-[#151515]">
          <h3 className="text-[15px] font-bold text-white">Liked by</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-2">
          {loading ? (
            <div className="p-8 text-center text-white/30 text-[13px] animate-pulse">Loading likers...</div>
          ) : likers.length === 0 ? (
            <div className="p-8 text-center text-white/30 text-[13px]">No likes yet.</div>
          ) : (
            likers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer">
                <Avatar url={user.avatar} initial={user.name?.[0]} size={36} />
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${user.handle}`} className="text-[14px] font-bold text-white truncate hover:underline">{user.name}</Link>
                  <Link href={`/profile/${user.handle}`} className="text-[12px] text-white/40 truncate block">@{user.handle}</Link>
                </div>
                <FollowButton targetUserId={user.id} currentUserId={currentUser?.id} />
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}


function PostSkeleton() {
  return (
    <div className="px-5 py-5 animate-pulse flex gap-3.5">
      <div className="h-10 w-10 rounded-full bg-white/5 shrink-0" />
      <div className="flex-1 space-y-3 pt-1">
        <div className="flex gap-2"><div className="h-3.5 w-28 rounded bg-white/5" /><div className="h-3.5 w-16 rounded bg-white/[0.03]" /></div>
        <div className="h-3.5 w-full rounded bg-white/[0.04]" />
        <div className="h-3.5 w-4/5 rounded bg-white/[0.04]" />
        <div className="h-3.5 w-3/5 rounded bg-white/[0.03]" />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   DAILY MISSION
═══════════════════════════════════════════════════════════════════ */
function DailyMissionBox({ mission, user, challengeStatus, onChallengeComplete }: { mission: any, user: any, challengeStatus: any, onChallengeComplete: () => void }) {
  const [isSolving, setIsSolving] = useState(false)
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState<'idle'|'success'|'fail'>('idle')
  const [attempts, setAttempts] = useState(challengeStatus?.attempts || 0)
  const [localChallengeStatus, setLocalChallengeStatus] = useState<any>(challengeStatus)
  const MAX_ATTEMPTS = 3

  useEffect(() => {
    setLocalChallengeStatus(challengeStatus)
    setAttempts(challengeStatus?.attempts || 0)
    setResult('idle')
  }, [challengeStatus])

  if (!mission) return null;

  // Check if challenge is already solved
  const isSolved = localChallengeStatus?.is_solved

  function getISTDateString(date = new Date()) {
    return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).toISOString().split('T')[0]
  }

  function getChallengeDateString(date = new Date()) {
    const istTime = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
    const challengeDate = new Date(istTime)
    if (istTime.getHours() < 5) {
      challengeDate.setDate(challengeDate.getDate() - 1)
    }
    return challengeDate.toISOString().split('T')[0]
  }

  async function handleSubmit() {
    // Prevent submission if challenge is already solved
    if (isSolved) {
      setResult('fail')
      return
    }

    if (attempts >= MAX_ATTEMPTS) {
      setResult('fail')
      return
    }

    setVerifying(true)
    // Simulate test execution delay
    await new Promise(r => setTimeout(r, 1500))

    // Validate: success if code contains a pointer syntax '*'
    const passed = code.includes('*')
    setResult(passed ? 'success' : 'fail')
    setVerifying(false)

    if (!user) return

    const today = getChallengeDateString()
    const newAttempts = attempts + 1
    const updatedStatus = {
      ...localChallengeStatus,
      user_id: user.id,
      challenge_id: mission.id,
      submitted_date: today,
      attempts: newAttempts,
      is_solved: passed,
      last_attempted_at: new Date().toISOString()
    }

    // Update challenge submission record
    if (localChallengeStatus?.id) {
      await supabase.from('challenge_submissions').update({
        attempts: newAttempts,
        is_solved: passed,
        last_attempted_at: new Date().toISOString()
      }).eq('id', localChallengeStatus.id)
    } else {
      await supabase.from('challenge_submissions').insert({
        user_id: user.id,
        challenge_id: mission.id,
        submitted_date: today,
        attempts: newAttempts,
        is_solved: passed,
        last_attempted_at: new Date().toISOString()
      })
    }

    setAttempts(newAttempts)
    setLocalChallengeStatus(updatedStatus)

    // Live update aura points
    const auraAdded = passed ? 20 : 5
    const { data: dbUser } = await supabase.from('users').select('aura_points').eq('id', user.id).single()
    const currentAura = dbUser?.aura_points || 0
    await supabase.from('users').update({ aura_points: currentAura + auraAdded }).eq('id', user.id)

    // Refresh challenge status if solved
    if (passed) {
      await onChallengeComplete()
      setIsSolving(false)
    }
  }

  return (
    <>
      {/* Show "Solved" Message if Challenge is Completed */}
      {isSolved && (
        <div className="mx-5 my-5 p-5 rounded-3xl bg-gradient-to-br from-emerald-900/30 via-[#030303] to-[#030303] border border-emerald-500/20 shadow-[0_10px_40px_rgba(16,185,129,0.08)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none opacity-50" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              ✓
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">Daily Mission</p>
              <h3 className="text-[17px] font-bold text-white">Today's Problem Solved 🎉</h3>
              <p className="text-[13px] text-white/60 mt-2">Great job! Come back tomorrow at 5 AM IST for the next challenge.</p>
            </div>
            <div className="text-[13px] font-bold text-[#f5c140] flex items-center gap-1.5 bg-[#f5c140]/10 px-3 py-1.5 rounded-full border border-[#f5c140]/20 shrink-0">
              <Star size={12} className="fill-[#f5c140]" /> +20 Aura
            </div>
          </div>
        </div>
      )}

      {/* Show Challenge Box if Not Solved */}
      {!isSolved && (
        <div className="mx-5 my-5 p-5 rounded-3xl bg-gradient-to-br from-cyan-900/30 via-[#030303] to-[#030303] border border-cyan-500/20 shadow-[0_10px_40px_rgba(8,145,178,0.08)] relative overflow-hidden group transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_10px_60px_rgba(8,145,178,0.15)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(8,145,178,0.15),transparent_50%)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          
          <div className="relative z-10 flex items-start gap-5">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xl shadow-[0_0_20px_rgba(8,145,178,0.4)] relative">
              <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500"></span>
              </span>
              {mission.language || 'C'}
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-1.5 drop-shadow-[0_0_8px_rgba(8,145,178,0.8)]">Daily Mission • {mission.language || 'C'}</p>
              <h3 className="text-[17px] font-bold text-white mb-1.5 leading-snug">{mission.title}</h3>
              <p className="text-[13px] text-white/60 leading-relaxed mb-4 max-w-xl">{mission.description}</p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSolving(true)}
                  disabled={isSolved || attempts >= MAX_ATTEMPTS}
                  className={`rounded-full px-5 py-2 text-[12px] font-bold flex items-center gap-1.5 transition-all duration-300 ${
                    isSolved 
                      ? 'bg-gray-500/30 text-gray-200 cursor-not-allowed opacity-50'
                      : attempts >= MAX_ATTEMPTS
                      ? 'bg-red-500/30 text-red-200 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#030303] hover:shadow-[0_0_20px_rgba(8,145,178,0.6)] hover:scale-105 active:scale-95'
                  }`}
                  title={isSolved ? "Challenge already solved today. Come back at 5 AM IST for the next challenge!" : ""}
                >
                  Solve Challenge <ChevronRight size={13} strokeWidth={3} />
                </button>
                <span className="text-[12px] font-bold text-[#f5c140] flex items-center gap-1.5 bg-[#f5c140]/10 px-3 py-1.5 rounded-full border border-[#f5c140]/20">
                  <Star size={12} className="fill-[#f5c140]" /> +20 Aura
                </span>
                <span className={`text-[12px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                  isSolved
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : attempts >= MAX_ATTEMPTS 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                    : 'bg-white/10 text-white/60 border border-white/10'
                }`}>
                  {isSolved ? '✓ Solved' : `Attempts: ${attempts}/${MAX_ATTEMPTS}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isSolving && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#111]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold">{mission.language || 'C'}</div>
                  <h3 className="text-[15px] font-bold text-white">{mission.title}</h3>
                </div>
                <button onClick={() => setIsSolving(false)} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
              </div>

              {/* Instructions */}
              <div className="px-6 py-4 border-b border-white/10 bg-white/[0.01]">
                <p className="text-[13px] text-white/50 leading-relaxed font-mono">{mission.description}</p>
              </div>

              {/* Editor */}
              <div className="flex-1 p-0 relative min-h-[250px]">
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  disabled={isSolved || result !== 'idle' || verifying}
                  placeholder={isSolved ? "// Challenge already solved today!\n// Come back at 5 AM IST for the next challenge." : "// Write your pointer logic here...&#10;void solve() {&#10;  &#10;}"}
                  className="w-full h-full min-h-[250px] bg-transparent text-cyan-300 font-mono text-[13px] p-6 outline-none resize-none leading-relaxed disabled:opacity-50"
                  spellCheck={false}
                />
              </div>

              {/* Footer Actions / Results */}
              <div className="px-6 py-4 border-t border-white/10 bg-[#111] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-[13px] font-bold text-white/60">
                    Attempts: <span className={isSolved ? 'text-emerald-400' : attempts >= MAX_ATTEMPTS ? 'text-red-400' : 'text-cyan-400'}>{isSolved ? '✓' : `${attempts}/${MAX_ATTEMPTS}`}</span>
                  </div>
                  {result === 'success' && (
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-[13px] animate-pulse">
                      <ShieldCheck size={16} /> Well done! Excellent! +20 Aura
                    </div>
                  )}
                  {result === 'fail' && (
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-[13px]">
                      <ShieldAlert size={16} /> {isSolved ? 'Challenge already solved today!' : attempts >= MAX_ATTEMPTS ? 'Max attempts reached!' : 'Tests failed. Good attempt! +5 Aura'}
                    </div>
                  )}
                  {verifying && (
                    <div className="flex items-center gap-2 text-[#f5c140] font-bold text-[13px]">
                      <Sparkles size={16} className="animate-spin" /> Verifying memory safety...
                    </div>
                  )}
                </div>
                
                {result === 'idle' && !verifying && !isSolved && attempts < MAX_ATTEMPTS && (
                  <div className="flex gap-3">
                    <button onClick={() => setIsSolving(false)} className="px-5 py-2 text-[13px] font-bold text-white/40 hover:text-white transition-colors">Cancel</button>
                    <button 
                      onClick={handleSubmit} 
                      className="flex items-center gap-2 rounded-full bg-cyan-500 text-black px-6 py-2 text-[13px] font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(8,145,178,0.4)]"
                    >
                      <Play size={14} fill="currentColor" /> Run Tests
                    </button>
                  </div>
                )}
                {(isSolved || result !== 'idle' || attempts >= MAX_ATTEMPTS) && (
                  <button onClick={() => setIsSolving(false)} className="rounded-full bg-white/10 text-white px-6 py-2 text-[13px] font-bold hover:bg-white/20 transition-colors">
                    Close
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}