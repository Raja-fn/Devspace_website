'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Briefcase, Globe, Filter, Search, TrendingUp, Calendar, Users, ChevronRight, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { TopNavbar, LeftSidebar, RightSidebar, MobileBottomNav, FullScreenLoader, Avatar } from '@/app/components/LayoutUI'
import { OpportunityCard, LeaderboardEntry } from '@/app/components/PremiumComponents'

export default function OpportunitiesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [dbUser, setDbUser] = useState<any>(null)
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'student_opportunity' | 'hackathon'>('all')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user)
        const { data: dbData } = await supabase.from('users').select('*').eq('id', data.user.id).single()
        if (dbData) setDbUser(dbData)
      }
      setChecking(false)
      fetchOpportunities()
    })
  }, [])

  async function fetchOpportunities() {
    const { data } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false })
    
    setOpportunities(data ?? [])
    setLoading(false)
  }

  const filteredOpportunities = opportunities.filter(op => {
    const matchesFilter = filter === 'all' || op.type === filter
    const matchesSearch = op.title.toLowerCase().includes(search.toLowerCase()) || 
                         op.company.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (checking) return <FullScreenLoader />

  const studentOps = filteredOpportunities.filter(op => op.type === 'student_opportunity')
  const hackathons = filteredOpportunities.filter(op => op.type === 'hackathon')

  const avatarUrl  = dbUser?.avatar || user?.user_metadata?.avatar_url
  const userName   = dbUser?.name || user?.user_metadata?.name || user?.email || 'Engineer'
  const userInitial = (userName || 'U')[0].toUpperCase()

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.015] noise" />

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
          <LeftSidebar 
            activeNav="opportunities"
            avatarUrl={avatarUrl}
            userName={userName}
            userInitial={userInitial}
            signOut={() => supabase.auth.signOut()}
          />

          <main className="border-x border-white/[0.055] min-h-screen pb-20 md:pb-0 bg-black/20">
            <div className="px-6 py-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f5c140]/20 to-orange-500/10 border border-[#f5c140]/30 shadow-lg shadow-[#f5c140]/10">
                    <Briefcase size={28} className="text-[#f5c140]" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Opportunities</h1>
                    <p className="text-sm text-white/50 mt-1.5">Accelerate your career with exclusive roles and hackathons</p>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mt-8">
                  <button 
                    onClick={() => setFilter('all')}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                      filter === 'all' 
                        ? 'bg-gradient-to-r from-[#f5c140] to-orange-500 text-black border-[#f5c140]/50 shadow-lg shadow-[#f5c140]/30' 
                        : 'bg-white/8 text-white/70 hover:text-white hover:bg-white/15 border-white/10 hover:border-white/20'
                    }`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilter('student_opportunity')}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                      filter === 'student_opportunity' 
                        ? 'bg-gradient-to-r from-[#f5c140] to-orange-500 text-black border-[#f5c140]/50 shadow-lg shadow-[#f5c140]/30' 
                        : 'bg-white/8 text-white/70 hover:text-white hover:bg-white/15 border-white/10 hover:border-white/20'
                    }`}
                  >
                    Internships
                  </button>
                  <button 
                    onClick={() => setFilter('hackathon')}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                      filter === 'hackathon' 
                        ? 'bg-gradient-to-r from-[#f5c140] to-orange-500 text-black border-[#f5c140]/50 shadow-lg shadow-[#f5c140]/30' 
                        : 'bg-white/8 text-white/70 hover:text-white hover:bg-white/15 border-white/10 hover:border-white/20'
                    }`}
                  >
                    Hackathons
                  </button>
                </div>
              </motion.div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-white/30">
                  <div className="h-10 w-10 border-3 border-[#f5c140]/20 border-t-[#f5c140] rounded-full animate-spin mb-4" />
                  <p className="text-base font-semibold">Fetching opportunities...</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Student Opportunities Section */}
                  {(filter === 'all' || filter === 'student_opportunity') && studentOps.length > 0 && (
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-[#f5c140]/15 border border-[#f5c140]/25">
                          <Briefcase size={18} className="text-[#f5c140]" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Student Roles</h2>
                      </div>
                      <div className="grid grid-cols-1 gap-5">
                        {studentOps.map((op, idx) => (
                          <motion.div
                            key={op.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                          >
                            <OpportunityCard opportunity={op} />
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Hackathons Section */}
                  {(filter === 'all' || filter === 'hackathon') && hackathons.length > 0 && (
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/25">
                          <Globe size={18} className="text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Hackathons</h2>
                      </div>
                      <div className="grid grid-cols-1 gap-5">
                        {hackathons.map((op, idx) => (
                          <motion.div
                            key={op.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                          >
                            <OpportunityCard opportunity={op} />
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredOpportunities.length === 0 && (
                    <div className="text-center py-24 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-white/[0.005]">
                      <p className="text-white/25 text-base font-semibold">No opportunities found matching your criteria.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>

          <RightSidebar />
        </div>
      </div>

      <MobileBottomNav activeNav="opportunities" />
    </div>
  )
}
