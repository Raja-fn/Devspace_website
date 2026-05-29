'use client'

import { motion } from 'framer-motion'
import { Heart, MessageCircle, Repeat2, Share, Star, Trophy, Award, TrendingUp, Zap, Briefcase, Globe, ExternalLink, Calendar } from 'lucide-react'
import Image from 'next/image'
import { Avatar, stringToColor } from './LayoutUI'

/* ═══════════════════════════════════════════════════════════════════
   OPPORTUNITY CARD
═══════════════════════════════════════════════════════════════════ */
export function OpportunityCard({ opportunity }: any) {
  const isHackathon = opportunity.type === 'hackathon'
  const Icon = isHackathon ? Globe : Briefcase
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card-premium rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-5 backdrop-blur-xl group transition-all duration-300 hover:border-[#f5c140]/20"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${isHackathon ? 'bg-blue-500/10 text-blue-400' : 'bg-[#f5c140]/10 text-[#f5c140]'} border border-white/5`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-white truncate">{opportunity.title}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isHackathon ? 'bg-blue-500/20 text-blue-400' : 'bg-[#f5c140]/20 text-[#f5c140]'}`}>
              {isHackathon ? 'HACKATHON' : 'OPPORTUNITY'}
            </span>
          </div>
          <p className="text-xs text-white/60 mb-3">{opportunity.company}</p>
          <p className="text-xs text-white/40 line-clamp-2 mb-4 leading-relaxed">{opportunity.description}</p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1.5 text-white/30 text-[11px]">
              <Calendar size={12} />
              <span>{opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'No deadline'}</span>
            </div>
            <a
              href={opportunity.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-[#f5c140] hover:text-[#fde68a] transition-colors"
            >
              Apply <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   AURA BADGE
═══════════════════════════════════════════════════════════════════ */
export function AuraBadge({ amount, size = 'md', animated = false }: { amount: number; size?: 'sm' | 'md' | 'lg'; animated?: boolean }) {
  const sizeClass = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3.5 py-1.5',
  }[size]

  return (
    <motion.div
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#f5c140]/15 border border-[#f5c140]/30 ${sizeClass} ${animated ? 'animate-bounce-soft' : ''}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <Zap size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} className="text-[#f5c140]" />
      <span className="font-bold text-[#f5c140]">{amount.toLocaleString()}</span>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SOCIAL POST CARD
═══════════════════════════════════════════════════════════════════ */
export function SocialPostCard({ 
  post, 
  user, 
  onLike, 
  onComment, 
  isLiked = false,
  auraEarned = 0 
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium group rounded-2xl border border-white/8 bg-white/[0.02] p-4 backdrop-blur-xl hover:border-[#f5c140]/20 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <Avatar url={user?.avatar} initial={user?.name?.[0] || 'U'} size={40} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-white/90 truncate">{user?.name || 'Engineer'}</p>
              {user?.verified && (
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <Award size={14} className="text-[#f5c140]" />
                </motion.div>
              )}
            </div>
            <p className="text-xs text-white/40">@{user?.handle || 'user'} · {post?.created_at ? timeAgo(post.created_at) : 'now'}</p>
          </div>
        </div>
        {auraEarned > 0 && <AuraBadge amount={auraEarned} size="sm" animated />}
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-sm text-white/85 leading-relaxed mb-2">{post?.content || ''}</p>
        {post?.image && (
          <div className="relative h-48 rounded-xl overflow-hidden border border-white/10 mb-3">
            <Image src={post.image} alt="Post" fill className="object-cover" />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 text-xs text-white/40 mb-3 pb-3 border-b border-white/5">
        <span>{post?.likes || 0} likes</span>
        <span>·</span>
        <span>{post?.comments || 0} comments</span>
        <span>·</span>
        <span>{post?.reposts || 0} reposts</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-around text-white/40 hover:[&>button]:text-white/80 transition-colors">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLike}
          className={`flex items-center gap-1.5 p-2 rounded-full transition-all duration-200 ${isLiked ? 'text-red-500/80 bg-red-500/10' : 'hover:text-red-500/60 hover:bg-red-500/5'}`}
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          <span className="text-xs">{post?.likes || 0}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComment}
          className="flex items-center gap-1.5 p-2 rounded-full hover:text-[#00bfff]/60 hover:bg-[#00bfff]/5"
        >
          <MessageCircle size={16} />
          <span className="text-xs">{post?.comments || 0}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 p-2 rounded-full hover:text-green-500/60 hover:bg-green-500/5"
        >
          <Repeat2 size={16} />
          <span className="text-xs">{post?.reposts || 0}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 p-2 rounded-full hover:text-[#f5c140]/60 hover:bg-[#f5c140]/5"
        >
          <Share size={16} />
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   CHALLENGE CARD
═══════════════════════════════════════════════════════════════════ */
export function ChallengeCard({ challenge, difficulty = 'medium' }: any) {
  const diffColor: Record<string, string> = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-orange-400',
    expert: 'text-red-400',
  }
  const colorClass = diffColor[difficulty] || diffColor.medium

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card-premium rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-5 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${colorClass}`}>
            {difficulty}
          </div>
          <h3 className="text-sm font-bold text-white mb-1">{challenge?.title || 'Challenge Title'}</h3>
          <p className="text-xs text-white/40 line-clamp-2">{challenge?.description || 'Challenge description'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-[#f5c140]" />
          <span className="text-xs font-bold text-[#f5c140]">+{challenge?.reward_points || 100} Aura</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#f5c140]/15 text-[#f5c140] border border-[#f5c140]/30 hover:bg-[#f5c140]/25 transition-all"
        >
          Solve
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   CERTIFICATE CARD
═══════════════════════════════════════════════════════════════════ */
export function CertificateCard({ certificate, userName = 'Engineer' }: any) {
  return (
    <motion.div
      whileHover={{ rotateY: 5, y: -4 }}
      className="card-premium rounded-2xl p-6 backdrop-blur-xl border border-white/10 bg-gradient-to-br from-[#f5c140]/[0.08] to-white/[0.02] overflow-hidden relative group"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5c140]/10 via-transparent to-[#00bfff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Award size={28} className="text-[#f5c140]" />
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#f5c140]/20 text-[#f5c140]">
            VERIFIED
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">{certificate?.title || 'Certificate Title'}</h3>
        <p className="text-xs text-white/40 mb-4">Completed on {certificate?.date || new Date().toLocaleDateString()}</p>

        <div className="mb-4 p-3 rounded-lg bg-white/[0.02] border border-white/5">
          <p className="text-[10px] text-white/50 mb-1">Awarded to</p>
          <p className="text-sm font-bold text-white">{userName}</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          className="w-full text-xs font-bold py-2 rounded-lg bg-[#f5c140]/20 text-[#f5c140] border border-[#f5c140]/30 hover:bg-[#f5c140]/30 transition-all"
        >
          Download PDF
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   PROFILE CARD
═══════════════════════════════════════════════════════════════════ */
export function ProfileCard({ user, stats }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-6 backdrop-blur-xl"
    >
      {/* Cover */}
      {user?.coverImage && (
        <div className="relative h-24 -m-6 mb-4 rounded-t-2xl overflow-hidden">
          <Image src={user.coverImage} alt="Cover" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        </div>
      )}

      {/* Avatar and info */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="mb-3">
            <Avatar url={user?.avatar} initial={user?.name?.[0] || 'U'} size={56} ring />
          </div>
          <h2 className="text-lg font-bold text-white">{user?.name || 'Engineer'}</h2>
          <p className="text-sm text-white/40">@{user?.handle || 'user'}</p>
        </div>
      </div>

      {/* Bio */}
      {user?.bio && (
        <p className="text-sm text-white/70 mb-4 leading-relaxed">{user.bio}</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-lg bg-white/[0.02] border border-white/5">
        <div className="text-center">
          <p className="text-lg font-bold text-[#f5c140]">{stats?.followers || 0}</p>
          <p className="text-[10px] text-white/40">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white/80">{stats?.following || 0}</p>
          <p className="text-[10px] text-white/40">Following</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#f5c140]">{stats?.aura || 0}</p>
          <p className="text-[10px] text-white/40">Aura</p>
        </div>
      </div>

      {/* Action */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2.5 rounded-lg font-bold text-white bg-[#f5c140]/20 border border-[#f5c140]/30 hover:bg-[#f5c140]/30 transition-all"
      >
        Follow
      </motion.button>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   LEADERBOARD ENTRY
═══════════════════════════════════════════════════════════════════ */
export function LeaderboardEntry({ rank, user, aura, isTop = false, onChat, onViewProjects }: any) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(245, 193, 64, 0.1)' }}
      className={`flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 ${
        isTop 
          ? 'bg-gradient-to-r from-[#f5c140]/12 to-[#f5c140]/5 border-[#f5c140]/30 shadow-[0_0_20px_rgba(245,193,64,0.15)]' 
          : 'bg-white/[0.03] border-white/8 hover:bg-white/[0.06] hover:border-white/15'
      }`}
    >
      {/* Rank Badge */}
      <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center font-black text-lg ${
        isTop 
          ? 'bg-gradient-to-br from-[#f5c140] to-orange-500 text-black shadow-lg shadow-[#f5c140]/40' 
          : 'bg-white/5 border border-white/10 text-white/60'
      }`}>
        {rank}
      </div>

      {/* User Info */}
      <div className="flex-1 flex items-center gap-3.5 min-w-0">
        <Avatar url={user?.avatar} initial={user?.name?.[0] || 'U'} size={40} />
        <button
          type="button"
          onClick={() => onChat?.(user)}
          className="flex-1 min-w-0 text-left group"
        >
          <p className="text-sm font-bold text-white group-hover:text-[#f5c140] transition-colors truncate">
            {user?.name || 'Engineer'}
          </p>
          <p className="text-xs text-white/40 group-hover:text-[#f5c140]/70 transition-colors truncate">
            @{user?.handle || 'user'}
          </p>
        </button>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => onChat?.(user)}
          className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-[#f5c140] hover:bg-[#f5c140]/10 transition-all border border-white/10 hover:border-[#f5c140]/20"
          title="Chat"
        >
          <MessageCircle size={16} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => onViewProjects?.(user)}
          className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-[#f5c140] hover:bg-[#f5c140]/10 transition-all border border-white/10 hover:border-[#f5c140]/20"
          title="View Projects"
        >
          <ExternalLink size={16} />
        </motion.button>
        <AuraBadge amount={aura} size="sm" />
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   FLOATING CARD
═══════════════════════════════════════════════════════════════════ */
export function FloatingCard({ icon: Icon, title, subtitle, value, gradient = 'from-[#f5c140] to-orange-500' }: any) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className={`rounded-2xl border border-white/10 bg-gradient-to-br ${gradient}/[0.08] p-4 backdrop-blur-xl`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient}/20`}>
          <Icon size={16} className={`text-${gradient.split('-')[1]}`} />
        </div>
        <div>
          <p className="text-xs text-white/40">{subtitle}</p>
          <p className="text-sm font-bold text-white">{title}</p>
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   HELPER: TIME AGO
═══════════════════════════════════════════════════════════════════ */
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}
