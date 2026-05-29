'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Filter, TrendingUp, Calendar, Users, ChevronRight, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { TopNavbar, LeftSidebar, RightSidebar, MobileBottomNav, FullScreenLoader, Avatar, stringToColor } from '@/app/components/LayoutUI'
import { ChallengeCard, AuraBadge, LeaderboardEntry } from '@/app/components/PremiumComponents'

const DIFFICULTY_FILTERS = ['all', 'easy', 'medium', 'hard', 'expert']
const CATEGORY_FILTERS = ['all', 'algorithms', 'systems', 'web', 'ai', 'devops']

export default function ChallengesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [challenges, setChallenges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(true)
  
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')
  
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [userStats, setUserStats] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user)
        
        // Fetch user stats
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        if (profile) {
          setUserStats(profile)
        }
      }
      setChecking(false)
      fetchChallenges()
      fetchLeaderboard()
    })
  }, [])

  async function fetchChallenges() {
    const { data } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false })
    
    setChallenges(data ?? [])
    setLoading(false)
  }

  async function fetchLeaderboard() {
    const { data } = await supabase
      .from('users')
      .select('name, handle, avatar, aura_points')
      .order('aura_points', { ascending: false })
      .limit(5)
    
    setLeaderboard(data ?? [])
  }

  const filteredChallenges = challenges.filter((c) => {
    const matchDifficulty = selectedDifficulty === 'all' || c.difficulty === selectedDifficulty
    const matchCategory = selectedCategory === 'all' || c.category === selectedCategory
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                       c.description.toLowerCase().includes(search.toLowerCase())
    return matchDifficulty && matchCategory && matchSearch
  })

  if (checking) return <FullScreenLoader />

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Top navbar */}
      <TopNavbar 
        avatarUrl={user?.user_metadata?.avatar_url}
        userName={user?.user_metadata?.name || user?.email || 'Engineer'}
        userInitial={(user?.user_metadata?.name || user?.email || 'U')[0]}
        search={search}
        setSearch={setSearch}
        signOut={() => supabase.auth.signOut()}
      />

      {/* Left sidebar */}
      <LeftSidebar 
        activeNav="challenges"
        avatarUrl={user?.user_metadata?.avatar_url}
        userName={user?.user_metadata?.name || user?.email || 'Engineer'}
        userInitial={(user?.user_metadata?.name || user?.email || 'U')[0]}
        signOut={() => supabase.auth.signOut()}
      />

      {/* Main content */}
      <main className="flex-1 pt-20 md:pt-0 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f5c140]/20 to-orange-500/10 border border-[#f5c140]/30 shadow-lg shadow-[#f5c140]/10">
                <Trophy size={28} className="text-[#f5c140]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Challenges</h1>
                <p className="text-sm text-white/50 mt-2">Solve weekly engineering challenges and earn Aura points</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-5 hover:border-white/20 transition-all">
                <p className="text-xs text-white/50 font-semibold uppercase tracking-wide mb-2">Total Challenges</p>
                <p className="text-3xl font-bold text-white">{challenges.length}</p>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-[#f5c140]/25 bg-gradient-to-br from-[#f5c140]/12 to-[#f5c140]/4 p-5 hover:border-[#f5c140]/40 transition-all shadow-[0_0_12px_rgba(245,193,64,0.1)]">
                <p className="text-xs text-[#f5c140]/70 font-semibold uppercase tracking-wide mb-2">Challenges Solved</p>
                <p className="text-3xl font-bold text-[#f5c140]">{userStats?.challenges_solved || 0}</p>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-5 hover:border-white/20 transition-all">
                <p className="text-xs text-white/50 font-semibold uppercase tracking-wide mb-2">Your Aura</p>
                <p className="text-3xl font-bold text-white">{userStats?.aura_points || 0}</p>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5 p-5 hover:border-red-500/40 transition-all">
                <p className="text-xs text-red-400/70 font-semibold uppercase tracking-wide mb-2">Win Streak</p>
                <p className="text-3xl font-bold text-white">{userStats?.current_streak || 0} 🔥</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-lg bg-[#f5c140]/15 border border-[#f5c140]/25">
                <Filter size={16} className="text-[#f5c140]" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Filters</h3>
            </div>

            <div className="space-y-5">
              {/* Difficulty */}
              <div>
                <p className="text-xs text-white/40 mb-3 uppercase tracking-wider font-semibold">Difficulty Level</p>
                <div className="flex gap-2.5 flex-wrap">
                  {DIFFICULTY_FILTERS.map((d) => (
                    <motion.button
                      key={d}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDifficulty(d)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                        selectedDifficulty === d
                          ? 'bg-gradient-to-r from-[#f5c140] to-orange-500 text-black border-[#f5c140]/50 shadow-lg shadow-[#f5c140]/30'
                          : 'bg-white/8 text-white/70 border-white/10 hover:text-white hover:bg-white/15 hover:border-white/20'
                      }`}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <p className="text-xs text-white/40 mb-3 uppercase tracking-wider font-semibold">Category</p>
                <div className="flex gap-2.5 flex-wrap">
                  {CATEGORY_FILTERS.map((c) => (
                    <motion.button
                      key={c}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(c)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                        selectedCategory === c
                          ? 'bg-gradient-to-r from-[#f5c140] to-orange-500 text-black border-[#f5c140]/50 shadow-lg shadow-[#f5c140]/30'
                          : 'bg-white/8 text-white/70 border-white/10 hover:text-white hover:bg-white/15 hover:border-white/20'
                      }`}
                    >
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Challenges list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {loading ? (
              <div className="col-span-2 text-center text-white/40 py-12 text-lg">Loading challenges...</div>
            ) : filteredChallenges.length > 0 ? (
              filteredChallenges.map((challenge, idx) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ChallengeCard challenge={challenge} difficulty={challenge.difficulty} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center text-white/40 py-12 text-lg">
                No challenges found matching your filters.
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Right sidebar - Leaderboard */}
      <aside className="hidden xl:flex flex-col gap-5 sticky top-[57px] h-[calc(100vh-57px)] pt-4 pb-6 pl-5 overflow-y-auto w-[300px] no-scrollbar">
        <div className="rounded-2xl border border-[#f5c140]/20 bg-gradient-to-br from-[#f5c140]/8 to-white/[0.02] backdrop-blur-xl p-4.5 shadow-[0_8px_32px_rgba(245,193,64,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy size={14} className="text-[#f5c140] fill-[#f5c140]" />
              <p className="text-sm font-bold text-white">Challenge Leaderboard</p>
            </div>
            <p className="text-[10px] text-[#f5c140]/70">Top 5</p>
          </div>
          <div className="space-y-2.5">
            {leaderboard.map((u, i) => (
              <LeaderboardEntry 
                key={u.handle || i}
                rank={i + 1}
                user={u}
                aura={u.aura_points || 0}
                isTop={i === 0}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <MobileBottomNav activeNav="challenges" />
    </div>
  )
}
