'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, Link as LinkIcon, Calendar, MapPin, 
  Briefcase, Code2, GraduationCap, ExternalLink, 
  Star, Search, X, Share2, Copy, CheckCircle2, Zap
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

import { ChatModal } from '../../components/ChatModal'
import { 
  TopNavbar, LeftSidebar, RightSidebar, MobileBottomNav, 
  Avatar, FullScreenLoader, FollowButton 
} from '../../components/LayoutUI'

import { PostCard } from '../../feed/page'

const TABS = ['Posts', 'Projects', 'Achievements', 'Activity']

export default function PublicProfilePage() {
  const router = useRouter()
  const params = useParams()
  const handle = params.handle as string
  
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null)
  const [currentUserAura, setCurrentUserAura] = useState<number>(0)
  const [profileUser, setProfileUser] = useState<any>(null)
  const [checking, setChecking]     = useState(true)
  const [activeTab, setActiveTab]   = useState('Posts')
  const [posts, setPosts]           = useState<any[]>([])
  const [projects, setProjects]     = useState<any[]>([])
  
  // Modals for Follows
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  async function fetchUserPosts(userId: string) {
    const { data } = await supabase
      .from('posts')
      .select('*, users (name, handle, avatar)')
      .order('created_at', { ascending: false })
      .eq('user_id', userId)
    
    setPosts(data ?? [])
  }

  async function fetchUserProjects(userId: string) {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    setProjects(data ?? [])
  }

  const handleShare = () => {
    if (typeof window === 'undefined') return
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setCurrentUser(data.user)
        const { data: dbData } = await supabase.from('users').select('aura_points').eq('id', data.user.id).single()
        if (dbData) setCurrentUserAura(dbData.aura_points || 0)
      }
    })

    async function fetchProfile() {
      setChecking(true)
      const { data: dbData, error } = await supabase
        .from('users')
        .select('*')
        .eq('handle', handle)
        .single()
      
      if (dbData) {
        setProfileUser(dbData)
        fetchUserPosts(dbData.id)
        fetchUserProjects(dbData.id)
      } else {
        // User not found or error
        console.error('User not found:', handle)
      }
      setChecking(false)
    }

    if (handle) fetchProfile()
  }, [handle])

  if (checking) return <FullScreenLoader />
  if (!profileUser) return <div className="min-h-screen bg-black text-white flex items-center justify-center">User not found.</div>

  const isOwnProfile = currentUser?.id === profileUser.id
  const avatarUrl = profileUser.avatar
  const userName  = profileUser.name || profileUser.email || 'Engineer'
  const bio       = profileUser.bio || 'No bio provided yet.'
  const aura      = profileUser.aura_points || 0
  const followersCount = profileUser.followers || 0
  const followingCount = profileUser.following || 0

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#f5c140]/30">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.015] noise" />
      
      <TopNavbar 
        avatarUrl={currentUser?.user_metadata?.avatar_url} 
        userName={currentUser?.user_metadata?.name || currentUser?.email || 'You'} 
        userInitial={(currentUser?.user_metadata?.name || currentUser?.email || 'Y')[0].toUpperCase()} 
        search="" setSearch={() => {}} signOut={() => supabase.auth.signOut().then(() => router.replace('/'))}
      />

      <div className="mx-auto max-w-7xl px-4 pt-[57px]">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_300px] min-h-screen relative">
          <LeftSidebar 
            activeNav={isOwnProfile ? "profile" : ""} 
            avatarUrl={currentUser?.user_metadata?.avatar_url} 
            userName={currentUser?.user_metadata?.name || currentUser?.email || 'You'} 
            userInitial={(currentUser?.user_metadata?.name || currentUser?.email || 'Y')[0].toUpperCase()} 
            signOut={() => supabase.auth.signOut()} 
          />

          <main className="border-x border-white/[0.055] min-h-screen pb-20 md:pb-0 bg-black/20">
            {/* ── COVER GLOW ── */}
            <div className="relative h-60 w-full overflow-hidden bg-[#050505] border-b border-white/[0.04]">
              {/* Animated Aurora */}
              <motion.div 
                animate={{ 
                  rotate: 360, 
                  scale: [1, 1.2, 1],
                  x: [0, 50, 0],
                  y: [0, -30, 0]
                }} 
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-32 -left-20 h-[600px] w-[600px] rounded-full bg-[#f5c140] opacity-[0.12] blur-[120px] mix-blend-screen"
              />
              <motion.div 
                animate={{ 
                  rotate: -360, 
                  scale: [1, 1.4, 1],
                  x: [0, -60, 0],
                  y: [0, 40, 0]
                }} 
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-32 -right-10 h-[500px] w-[500px] rounded-full bg-cyan-600 opacity-[0.1] blur-[120px] mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-80" />
            </div>

            {/* ── PROFILE HEADER ── */}
            <div className="relative px-6 pb-6">
              <div className="flex justify-between items-end -mt-20 mb-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative h-36 w-36 rounded-full p-1.5 bg-[#030303] shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-10"
                >
                  <div className="absolute inset-0 rounded-full opacity-40 group-hover:opacity-100 bg-gradient-to-br from-[#f5c140] via-[#f5c140]/20 to-transparent transition-opacity duration-1000 animate-[spin_8s_linear_infinite]" />
                  <div className="absolute inset-1 rounded-full bg-[#030303]" />
                  <div className="relative h-full w-full rounded-full overflow-hidden ring-4 ring-[#030303]">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-[#111] to-[#222] flex items-center justify-center text-5xl font-black text-white/50">{userName[0]?.toUpperCase()}</div>
                    )}
                  </div>
                </motion.div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 shadow-lg"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Share2 size={16} />}
                    {copied ? 'Copied' : 'Share'}
                  </button>
                  {isOwnProfile ? (
                    <button 
                      onClick={() => router.push('/profile')}
                      className="rounded-full border border-[#f5c140]/30 bg-[#f5c140]/10 px-6 py-2.5 text-[13px] font-bold text-[#f5c140] transition-all hover:bg-[#f5c140]/20 hover:border-[#f5c140]/50 active:scale-95 shadow-[0_0_20px_rgba(245,193,64,0.1)]"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FollowButton targetUserId={profileUser.id} currentUserId={currentUser?.id} />
                      <button
                        onClick={() => {
                          if (!currentUser) {
                            alert('Please login to chat with engineers.')
                            return
                          }
                          setIsChatOpen(true)
                        }}
                        className="rounded-full border border-[#f5c140]/30 bg-[#f5c140]/10 px-6 py-2.5 text-[13px] font-bold text-[#f5c140] transition-all hover:bg-[#f5c140]/20 active:scale-95 shadow-lg"
                      >
                        Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1.5 flex items-center gap-2">
                  {userName}
                  {aura > 1000 && <Star size={20} className="text-[#f5c140] fill-[#f5c140]" />}
                </h1>
                <p className="text-[15px] text-white/40 font-medium">@{profileUser.handle}</p>
              </motion.div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/50 mb-6 font-medium">
                {profileUser.role?.[0] && <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5"><Briefcase size={14} className="text-white/30" /> {profileUser.role[0]}</span>}
                {profileUser.college && <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5"><GraduationCap size={14} className="text-white/30" /> {profileUser.college}</span>}
                {profileUser.created_at && <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5"><Calendar size={14} className="text-white/30" /> Joined {new Date(profileUser.created_at).toLocaleDateString(undefined, { month: 'short', year:'numeric' })}</span>}
              </div>

              <p className="text-[15px] leading-relaxed text-white/70 max-w-2xl mb-8 font-medium italic">&quot;{bio}&quot;</p>

              {profileUser.stack && profileUser.stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {profileUser.stack.map((t: string) => (
                    <span key={t} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-semibold text-white/60">{t}</span>
                  ))}
                </div>
              )}

              {/* Live Stats Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.08] rounded-[2.5rem] p-6 shadow-2xl backdrop-blur-md mb-8">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">{posts.length}</span>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Posts</span>
                </div>
                <div className="flex flex-col group cursor-pointer">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black text-[#f5c140] drop-shadow-[0_0_10px_rgba(245,193,64,0.4)]">{aura.toLocaleString()}</span>
                    <Zap size={14} className="text-[#f5c140] fill-[#f5c140] animate-pulse" />
                  </div>
                  <span className="text-[10px] font-bold text-[#f5c140]/50 uppercase tracking-widest mt-1">Aura Points</span>
                </div>
                <button onClick={() => setShowFollowers(true)} className="flex flex-col items-start hover:translate-y-[-2px] transition-transform text-left">
                  <span className="text-2xl font-black text-white">{followersCount}</span>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Followers</span>
                </button>
                <button onClick={() => setShowFollowing(true)} className="flex flex-col items-start hover:translate-y-[-2px] transition-transform text-left">
                  <span className="text-2xl font-black text-white">{followingCount}</span>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Following</span>
                </button>
              </div>
            </div>

            {/* ── TABS ── */}
            <div className="border-b border-white/[0.08] px-6 flex gap-8 overflow-x-auto no-scrollbar relative sticky top-[57px] bg-[#030303]/80 backdrop-blur-xl z-20">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-4 pt-4 text-[14px] font-bold transition-all duration-300 whitespace-nowrap ${activeTab === tab ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'text-white/30 hover:text-white/70'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="tab-underline" 
                      className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-[#f5c140] shadow-[0_-2px_12px_rgba(245,193,64,0.8)] z-10" 
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="py-2"
                >
                  {activeTab === 'Posts' && (
                    <div className="divide-y divide-white/[0.04]">
                      {posts.length > 0 ? posts.map((p, i) => <PostCard key={p.id} post={p} index={i} currentUser={currentUser} />) : <div className="p-8 text-center text-white/30 text-sm">No posts yet.</div>}
                    </div>
                  )}

                  {activeTab === 'Projects' && (
                    <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.length > 0 ? projects.map((project, i) => (
                        <div key={project.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#f5c140]/20 transition-all group">
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <h4 className="text-[15px] font-bold text-white group-hover:text-[#f5c140] transition-colors">{project.title}</h4>
                            <div className="flex gap-2">
                              {project.repo_url && (
                                <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
                                  <LinkIcon size={14} />
                                </a>
                              )}
                              {project.live_url && (
                                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#f5c140]/10 text-[#f5c140] hover:bg-[#f5c140]/20 transition-all">
                                  <ExternalLink size={14} />
                                </a>
                              )}
                            </div>
                          </div>
                          <p className="text-[13px] text-white/50 leading-relaxed line-clamp-2">{project.description}</p>
                        </div>
                      )) : (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                          <div className="h-16 w-16 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4">
                            <Code2 size={24} className="text-white/20" />
                          </div>
                          <h3 className="text-[15px] font-bold text-white/90 mb-1">No projects yet</h3>
                          <p className="text-[13px] text-white/40">{profileUser.name.split(' ')[0]} hasn't shared any projects yet.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {(activeTab === 'Achievements' || activeTab === 'Activity') && (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                      <div className="h-16 w-16 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4">
                        <Star size={24} className="text-white/20" />
                      </div>
                      <h3 className="text-[15px] font-bold text-white/90 mb-1">No {activeTab.toLowerCase()} to show</h3>
                      <p className="text-[13px] text-white/40">Build and participate to grow {activeTab.toLowerCase()}.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {isChatOpen && currentUser && profileUser && (
                <ChatModal
                  isOpen={isChatOpen}
                  onClose={() => setIsChatOpen(false)}
                  currentUser={currentUser}
                  targetUser={profileUser}
                />
              )}
            </AnimatePresence>
          </main>

          <RightSidebar />
        </div>
      </div>
      <MobileBottomNav activeNav={isOwnProfile ? "profile" : ""} />

      {/* ── FOLLOWERS MODAL ── */}
      <AnimatePresence>
        {showFollowers && (
          <FollowsModal userId={profileUser.id} type="followers" onClose={() => setShowFollowers(false)} currentUser={currentUser!} />
        )}
      </AnimatePresence>

      {/* ── FOLLOWING MODAL ── */}
      <AnimatePresence>
        {showFollowing && (
          <FollowsModal userId={profileUser.id} type="following" onClose={() => setShowFollowing(false)} currentUser={currentUser!} />
        )}
      </AnimatePresence>
    </div>
  )
}

function FollowsModal({ userId, type, onClose, currentUser }: { userId: string; type: 'followers' | 'following'; onClose: () => void; currentUser: SupabaseUser }) {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFollows() {
      if (type === 'followers') {
        const { data } = await supabase
          .from('follows')
          .select('follower:follower_id (id, name, handle, avatar)')
          .eq('following_id', userId)
        if (data) setList(data.map((d: any) => d.follower))
      } else {
        const { data } = await supabase
          .from('follows')
          .select('following:following_id (id, name, handle, avatar)')
          .eq('follower_id', userId)
        if (data) setList(data.map((d: any) => d.following))
      }
      setLoading(false)
    }
    fetchFollows()
  }, [userId, type])

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-[#151515]">
          <h3 className="text-[15px] font-bold text-white capitalize">{type}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-2">
          {loading ? (
            <div className="p-8 text-center text-white/30 text-[13px] animate-pulse">Loading {type}...</div>
          ) : list.length === 0 ? (
            <div className="p-8 text-center text-white/30 text-[13px]">No {type} yet.</div>
          ) : (
            list.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer">
                <Avatar url={u.avatar} initial={u.name?.[0]} size={36} />
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${u.handle}`} className="text-[14px] font-bold text-white truncate hover:underline">{u.name}</Link>
                  <Link href={`/profile/${u.handle}`} className="text-[12px] text-white/40 truncate block">@{u.handle}</Link>
                </div>
                <FollowButton targetUserId={u.id} currentUserId={currentUser.id} />
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}
