'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, UserPlus, Heart, MessageCircle, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { TopNavbar, LeftSidebar, RightSidebar, MobileBottomNav, FullScreenLoader, Avatar } from '@/app/components/LayoutUI'
import { ProfileCard, LeaderboardEntry, AuraBadge } from '@/app/components/PremiumComponents'
import { FollowersModal } from '@/app/components/InteractiveModals'

export default function CommunityPage() {
  const [user, setUser] = useState<any>(null)
  const [dbUser, setDbUser] = useState<any>(null)
  const [engineers, setEngineers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(true)
  const [search, setSearch] = useState('')
  const [followed, setFollowed] = useState<Set<string>>(new Set())

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user)
        const { data: dbData } = await supabase.from('users').select('*').eq('id', data.user.id).single()
        if (dbData) setDbUser(dbData)
        fetchEngineers()
      }
      setChecking(false)
    })
  }, [])

  async function fetchEngineers() {
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('aura_points', { ascending: false })
      .limit(20)
    
    setEngineers(data ?? [])
    setLoading(false)
  }

  const filteredEngineers = engineers.filter(e => 
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.handle?.toLowerCase().includes(search.toLowerCase()) ||
    e.bio?.toLowerCase().includes(search.toLowerCase())
  )

  const toggleFollow = (engineerId: string) => {
    const newFollowed = new Set(followed)
    if (newFollowed.has(engineerId)) {
      newFollowed.delete(engineerId)
    } else {
      newFollowed.add(engineerId)
    }
    setFollowed(newFollowed)
  }

  if (checking) return <FullScreenLoader />

  const avatarUrl  = dbUser?.avatar || user?.user_metadata?.avatar_url
  const userName   = dbUser?.name || user?.user_metadata?.name || user?.email || 'Engineer'
  const userInitial = (userName || 'U')[0].toUpperCase()

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
            activeNav="community"
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
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00bfff]/20 to-cyan-500/10 border border-[#00bfff]/30 shadow-lg shadow-[#00bfff]/10">
                    <Users size={28} className="text-[#00bfff]" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Community</h1>
                    <p className="text-sm text-white/50 mt-1.5">Discover and connect with world-class engineers</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-5 hover:border-white/20 transition-all">
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-2">Engineers</p>
                    <p className="text-2xl font-bold text-white">{engineers.length}</p>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-[#00bfff]/25 bg-gradient-to-br from-[#00bfff]/12 to-[#00bfff]/4 p-5 hover:border-[#00bfff]/40 transition-all shadow-[0_0_12px_rgba(0,191,255,0.1)]">
                    <p className="text-[10px] text-[#00bfff]/70 font-bold uppercase tracking-wider mb-2">Following</p>
                    <p className="text-2xl font-bold text-[#00bfff]">{followed.size}</p>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-5 hover:border-white/20 transition-all">
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-2">Global Reach</p>
                    <p className="text-2xl font-bold text-white">12.4k</p>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-[#f5c140]/25 bg-gradient-to-br from-[#f5c140]/12 to-[#f5c140]/4 p-5 hover:border-[#f5c140]/40 transition-all">
                    <p className="text-[10px] text-[#f5c140]/70 font-bold uppercase tracking-wider mb-2">Hot Topic</p>
                    <p className="text-xl font-bold text-[#f5c140]">#Rust</p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Featured engineers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-10"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#f5c140]/15 border border-[#f5c140]/25">
                      <TrendingUp size={16} className="text-[#f5c140]" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Rising Stars</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {engineers.slice(0, 3).map((engineer, idx) => (
                    <motion.div
                      key={engineer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0, 191, 255, 0.12)' }}
                      className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-6 backdrop-blur-xl hover:border-[#00bfff]/25 transition-all flex flex-col"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <Avatar url={engineer.avatar} initial={engineer.name?.[0] || 'U'} size={44} />
                        <span className="text-[10px] font-bold text-white bg-[#f5c140]/20 text-[#f5c140] px-2 py-0.5 rounded-full border border-[#f5c140]/30">
                          #{idx + 1}
                        </span>
                      </div>

                      <h3 className="font-bold text-white mb-0.5 truncate text-sm">{engineer.name || 'Engineer'}</h3>
                      <p className="text-[11px] text-white/40 mb-3 truncate">@{engineer.handle || 'user'}</p>
                      <p className="text-[12px] text-white/50 line-clamp-2 mb-6 leading-relaxed flex-1">{engineer.bio || 'No bio'}</p>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-[#00bfff]/10 text-[#00bfff] border border-[#00bfff]/20">
                          <Zap size={10} className="fill-[#00bfff]" /> {engineer.aura_points || 0}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleFollow(engineer.id)}
                          className={`flex-1 py-1.5 rounded-full font-bold text-[11px] transition-all border ${
                            followed.has(engineer.id)
                              ? 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                              : 'bg-gradient-to-r from-[#00bfff] to-cyan-500 text-black border-[#00bfff]/50 shadow-lg shadow-[#00bfff]/20'
                          }`}
                        >
                          {followed.has(engineer.id) ? 'Following' : 'Follow'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* All engineers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-white mb-5">All Engineers</h2>

                {loading ? (
                  <div className="text-center text-white/40 py-12 text-lg">Loading engineers...</div>
                ) : (
                  <div className="space-y-2.5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                    {filteredEngineers.map((engineer) => (
                      <motion.div
                        key={engineer.id}
                        whileHover={{ x: 4, boxShadow: '0 8px 24px rgba(0, 191, 255, 0.08)' }}
                        className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/15 transition-all group"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <Avatar url={engineer.avatar} initial={engineer.name?.[0] || 'U'} size={40} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white/90 truncate">{engineer.name || 'Engineer'}</p>
                            <p className="text-xs text-white/40">@{engineer.handle || 'user'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#00bfff]/10 text-[#00bfff] border border-[#00bfff]/20">
                            <Zap size={10} className="fill-[#00bfff]" /> {engineer.aura_points || 0}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleFollow(engineer.id)}
                            className={`p-2 rounded-full transition-all border ${
                              followed.has(engineer.id)
                                ? 'bg-white/10 text-white/60 border-white/10'
                                : 'bg-[#00bfff]/10 text-[#00bfff] border-[#00bfff]/20 hover:bg-[#00bfff]/20'
                            }`}
                          >
                            <UserPlus size={14} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </main>

          <RightSidebar />
        </div>
      </div>

      <MobileBottomNav activeNav="community" />
    </div>
  )
}
