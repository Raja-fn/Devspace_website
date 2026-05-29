'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, UserPlus, UserCheck } from 'lucide-react'
import { Avatar } from './LayoutUI'
import { AuraBadge } from './PremiumComponents'

interface User {
  id: string
  name?: string
  handle?: string
  avatar?: string
  aura_points?: number
  bio?: string
}

interface FollowersModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  users: User[]
  onFollowClick: (userId: string) => void
  followedIds: Set<string>
  currentUserId?: string
}

export function FollowersModal({
  isOpen,
  onClose,
  title,
  users,
  onFollowClick,
  followedIds,
  currentUserId,
}: FollowersModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/8">
                <h2 className="text-lg font-bold text-white">{title}</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </motion.button>
              </div>

              {/* Users list */}
              <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                {users.length === 0 ? (
                  <div className="p-8 text-center text-white/40">
                    <p>No users yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/8">
                    {users.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar url={user.avatar} initial={user.name?.[0] || 'U'} size={40} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user.name || 'Engineer'}</p>
                            <p className="text-xs text-white/40 truncate">@{user.handle || 'user'}</p>
                          </div>
                        </div>

                        {user.id !== currentUserId && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onFollowClick(user.id)}
                            className={`p-2 rounded-lg transition-all ml-2 flex-shrink-0 ${
                              followedIds.has(user.id)
                                ? 'bg-white/10 text-white/60 hover:bg-white/15'
                                : 'bg-[#00bfff]/10 text-[#00bfff] hover:bg-[#00bfff]/20'
                            }`}
                          >
                            {followedIds.has(user.id) ? (
                              <UserCheck size={16} />
                            ) : (
                              <UserPlus size={16} />
                            )}
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface LikesModalProps {
  isOpen: boolean
  onClose: () => void
  users: User[]
}

export function LikesModal({ isOpen, onClose, users }: LikesModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/8">
                <h2 className="text-lg font-bold text-white">
                  {users.length === 1 ? '1 Like' : `${users.length} Likes`}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </motion.button>
              </div>

              {/* Users list */}
              <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                {users.length === 0 ? (
                  <div className="p-8 text-center text-white/40">
                    <p>No likes yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/8">
                    {users.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
                      >
                        <Avatar url={user.avatar} initial={user.name?.[0] || 'U'} size={40} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{user.name || 'Engineer'}</p>
                          <p className="text-xs text-white/40 truncate">@{user.handle || 'user'}</p>
                        </div>
                        <AuraBadge amount={user.aura_points || 0} size="sm" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
