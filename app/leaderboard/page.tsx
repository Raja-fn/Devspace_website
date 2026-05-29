'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Award, Zap, Trophy, Crown, MessageCircle, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { TopNavbar, LeftSidebar, RightSidebar, MobileBottomNav, FullScreenLoader, Avatar } from '@/app/components/LayoutUI'
import { AuraBadge, LeaderboardEntry } from '@/app/components/PremiumComponents'
import { ChatModal } from '@/app/components/ChatModal'
import { UserProjectsModal } from '@/app/components/UserProjectsModal'

const TIMEFRAMES = ['this_week', 'this_month', 'all_time']

export default function LeaderboardPage() {
  const [user, setUser] = useState<any>(null)
  const [dbUser, setDbUser] = useState<any>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(true)
  const [timeframe, setTimeframe] = useState('all_time')
  const [userRank, setUserRank] = useState<any>(null)
  const [search, setSearch] = useState('')

  // Modals state
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)

  async function fetchLeaderboard() {
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('aura_points', { ascending: false })
      .limit(100)
    
    setLeaderboard(data ?? [])
    setLoading(false)
  }

  async function findUserRank(userId: string) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (data) {
      const { data: allUsers } = await supabase
        .from('users')
        .select('id, aura_points')
        .order('aura_points', { ascending: false })
      
      const rank = allUsers?.findIndex(u => u.id === userId) ?? -1
      setUserRank({
        ...data,
        rank: rank + 1,
      })
    }
  }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user)
        const { data: dbData } = await supabase.from('users').select('*').eq('id', data.user.id).single()
        if (dbData) setDbUser(dbData)
        findUserRank(data.user.id)
      }
      setChecking(false)
      fetchLeaderboard()
    })
  }, [timeframe])

  const handleChat = (targetUser: any) => {
    if (!user) {
      alert("Please login to chat with engineers.")
      return
    }
    if (user.id === targetUser.id) return
    setSelectedUser(targetUser)
    setIsChatOpen(true)
  }

  const handleViewProjects = (targetUser: any) => {
    setSelectedUser(targetUser)
    setIsProjectsOpen(true)
  }

  if (checking) return <FullScreenLoader />

  const avatarUrl  = dbUser?.avatar || user?.user_metadata?.avatar_url
  const userName   = dbUser?.name || user?.user_metadata?.name || user?.email || 'Engineer'
  const userInitial = (userName || 'U')[0].toUpperCase()

  const filteredLeaderboard = leaderboard.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.handle?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.015] noise" />

      {/* Top navbar */}
      <TopNavbar 
        avatarUrl={avatarUrl}
        userName={userName}
        userInitial={userInitial}
        search={search}
        setSearch={setSearch}
        signOut={() => supabase.auth.signOut()}
        auraPoints={dbUser?.aura_points}
      />

      <div className="mx-auto max-w-7xl px-4 pt-[57px]">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_300px] min-h-screen relative">
          {/* Left sidebar */}
          <LeftSidebar 
            activeNav="leaderboard"
            avatarUrl={avatarUrl}
            userName={userName}
            userInitial={userInitial}
            signOut={() => supabase.auth.signOut()}
          />

          {/* Main content */}
          <main className="border-x border-white/[0.055] min-h-screen pb-20 md:pb-0 bg-black/20">
            <div className="px-6 py-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f5c140]/20 to-orange-500/10 border border-[#f5c140]/30 shadow-lg shadow-[#f5c140]/10">
                    <Trophy size={28} className="text-[#f5c140]" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Aura Leaderboard</h1>
                    <p className="text-sm text-white/50 mt-1.5">Top engineering talent ranked by community Aura points</p>
                  </div>
                </div>
              </motion.div>

              {/* Your stats */}
              {userRank && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -2, boxShadow: '0 16px 40px rgba(245, 193, 64, 0.15)' }}
                  className="mb-10 rounded-3xl border border-[#f5c140]/25 bg-gradient-to-br from-[#f5c140]/12 to-[#f5c140]/4 backdrop-blur-xl p-7 shadow-[0_0_20px_rgba(245,193,64,0.1)]"
                >
                  <div className="flex items-center justify-between gap-6 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar url={userRank.avatar} initial={userRank.name?.[0] || 'U'} size={60} />
                        {userRank.rank <= 3 && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            className="absolute -inset-1.5 rounded-full border-2 border-[#f5c140]/40"
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <h3 className="text-xl font-bold text-white">{userRank.name || 'You'}</h3>
                          {userRank.rank <= 3 && <Crown size={18} className="text-[#f5c140] animate-pulse" />}
                        </div>
                        <p className="text-sm text-white/50">@{userRank.handle || 'user'}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-4xl font-black text-[#f5c140] mb-2 drop-shadow-[0_0_12px_rgba(245,193,64,0.4)]">#{userRank.rank}</div>
                      <div className="flex items-center gap-2 text-lg font-bold px-4 py-2 rounded-full bg-[#f5c140]/20 text-[#f5c140] border border-[#f5c140]/40 shadow-lg shadow-[#f5c140]/15">
                        <Zap size={16} className="fill-[#f5c140]" /> {userRank.aura_points || 0} Aura
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Timeframe filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-10 flex gap-3 overflow-x-auto no-scrollbar"
              >
                {TIMEFRAMES.map((tf) => (
                  <motion.button
                    key={tf}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeframe(tf)}
                    className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all border whitespace-nowrap ${
                      timeframe === tf
                        ? 'bg-gradient-to-r from-[#f5c140] to-orange-500 text-black border-[#f5c140]/50 shadow-lg shadow-[#f5c140]/30'
                        : 'bg-white/8 text-white/70 hover:text-white hover:bg-white/15 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {tf === 'this_week' ? 'This Week' : tf === 'this_month' ? 'This Month' : 'All Time'}
                  </motion.button>
                ))}
              </motion.div>

              {/* Leaderboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {loading ? (
                  <div className="text-center text-white/40 py-12 text-lg">Loading leaderboard...</div>
                ) : (
                  <div className="space-y-3 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur p-4 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                    {filteredLeaderboard.map((u, idx) => (
                      <LeaderboardEntry 
                        key={u.id}
                        rank={idx + 1}
                        user={u}
                        aura={u.aura_points || 0}
                        isTop={idx < 3}
                        onChat={handleChat}
                        onViewProjects={handleViewProjects}
                      />
                    ))}
                    {filteredLeaderboard.length === 0 && (
                      <div className="text-center py-12 text-white/30 text-sm italic">No engineers found matching your search.</div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </main>

          <RightSidebar />
        </div>
      </div>

      <MobileBottomNav activeNav="leaderboard" />

      {/* Modals */}
      <AnimatePresence>
        {isChatOpen && selectedUser && (
          <ChatModal 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
            currentUser={user} 
            targetUser={selectedUser} 
          />
        )}
        {isProjectsOpen && selectedUser && (
          <UserProjectsModal 
            isOpen={isProjectsOpen} 
            onClose={() => setIsProjectsOpen(false)} 
            targetUser={selectedUser} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}
