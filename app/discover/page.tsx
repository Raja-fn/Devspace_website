'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, Sparkles, Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { TopNavbar, LeftSidebar, RightSidebar, MobileBottomNav, FullScreenLoader, Avatar } from '@/app/components/LayoutUI'
import { AuraBadge } from '@/app/components/PremiumComponents'

export default function DiscoverPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(true)
  const [trendingTags, setTrendingTags] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user)
      }
      setChecking(false)
      fetchTrendingData()
    })
  }, [])

  async function fetchTrendingData() {
    // Mock trending data
    const mockTrending = [
      { tag: '#SystemsDesign', posts: 1240, growth: '+12%' },
      { tag: '#Kubernetes', posts: 980, growth: '+8%' },
      { tag: '#Rust', posts: 740, growth: '+15%' },
      { tag: '#AI/ML', posts: 610, growth: '+22%' },
      { tag: '#DevOps', posts: 590, growth: '+6%' },
    ]
    setTrendingTags(mockTrending)
    setLoading(false)
  }

  if (checking) return <FullScreenLoader />

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Top navbar */}
      <TopNavbar 
        avatarUrl={user?.user_metadata?.avatar_url}
        userName={user?.user_metadata?.name || user?.email || 'Engineer'}
        userInitial={(user?.user_metadata?.name || user?.email || 'U')[0]}
        search=""
        setSearch={() => {}}
        signOut={() => supabase.auth.signOut()}
      />

      {/* Left sidebar */}
      <LeftSidebar 
        activeNav="feed"
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
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-[#f5c140]/10 border border-[#f5c140]/20">
                <TrendingUp size={24} className="text-[#f5c140]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Discover</h1>
                <p className="text-sm text-white/40 mt-1">Explore trending topics, challenges, and engineers</p>
              </div>
            </div>
          </motion.div>

          {/* Trending Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap size={18} className="text-[#f5c140]" />
              Trending Tags
            </h2>

            <div className="space-y-3">
              {trendingTags.map((trend, idx) => (
                <motion.div
                  key={trend.tag}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: 4, boxShadow: '0 8px 24px rgba(245, 193, 64, 0.08)' }}
                  className={`rounded-2xl border transition-all group cursor-pointer ${
                    idx === 0 
                      ? 'border-[#f5c140]/30 bg-gradient-to-br from-[#f5c140]/12 to-white/[0.02] shadow-[0_0_15px_rgba(245,193,64,0.1)]' 
                      : 'border-white/12 bg-gradient-to-br from-white/[0.05] to-white/[0.01] hover:border-white/20 hover:bg-white/[0.08]'
                  } p-5`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-bold transition-colors ${
                        idx === 0 
                          ? 'text-[#f5c140] group-hover:text-white' 
                          : 'text-white/80 group-hover:text-[#f5c140]'
                      }`}>
                        {trend.tag}
                      </p>
                      <p className="text-xs text-white/40 mt-1.5">{trend.posts.toLocaleString()} posts</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20">{trend.growth}</span>
                      <p className="text-[10px] text-white/25">trending</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Featured Challenges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-[#f5c140]" />
              Featured Challenges
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(245, 193, 64, 0.12)' }}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] hover:border-[#f5c140]/25 p-6 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#f5c140] mb-2">Medium</p>
                      <h3 className="text-sm font-bold text-white">Challenge #{idx}: System Design</h3>
                      <p className="text-xs text-white/40 mt-2 line-clamp-2">Build a highly scalable microservice architecture</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/8">
                    <span className="text-sm font-bold text-[#f5c140] bg-[#f5c140]/10 px-3 py-1.5 rounded-full border border-[#f5c140]/20">+{100 + idx * 50} Aura</span>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs font-bold px-4 py-2 rounded-full bg-gradient-to-r from-[#f5c140] to-orange-500 text-black border border-[#f5c140]/40 shadow-lg shadow-[#f5c140]/20 hover:shadow-[0_0_16px_rgba(245,193,64,0.4)] transition-all"
                    >
                      Solve
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Posts This Week */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Heart size={18} className="text-red-500" />
              Top Posts This Week
            </h2>

            <div className="space-y-4">
              {[1, 2, 3].map((idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 6, boxShadow: '0 8px 24px rgba(245, 193, 64, 0.08)' }}
                  className="rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.05] to-white/[0.02] hover:border-white/20 p-5 transition-all group"
                >
                    <div className="w-10 h-10 rounded-full bg-[#f5c140]/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-[#f5c140]">#{idx}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/90 group-hover:text-white transition-colors">
                        "Just shipped a 10x performance optimization in our backend..."
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-white/40 flex items-center gap-1">
                          <Heart size={12} /> 1.2k
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Right sidebar */}
      <RightSidebar />

      {/* Mobile bottom nav */}
      <MobileBottomNav activeNav="feed" />
    </div>
  )
}
