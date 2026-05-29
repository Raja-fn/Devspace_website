'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, GitFork, Globe, Code2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Avatar } from './LayoutUI'

export function UserProjectsModal({ isOpen, onClose, targetUser }: any) {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && targetUser) {
      fetchProjects()
    }
  }, [isOpen, targetUser?.id])

  async function fetchProjects() {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', targetUser.id)
      .order('created_at', { ascending: false })
    
    if (!error) setProjects(data ?? [])
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#111]">
          <div className="flex items-center gap-3">
            <Avatar url={targetUser.avatar} initial={targetUser.name?.[0]} size={36} />
            <div>
              <h3 className="text-[14px] font-bold text-white">{targetUser.name}'s Projects</h3>
              <p className="text-[11px] text-white/30">@{targetUser.handle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="h-6 w-6 border-2 border-[#f5c140]/20 border-t-[#f5c140] rounded-full animate-spin" />
              <p className="text-xs text-white/20">Fetching projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-10">
              <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4">
                <Code2 size={24} className="text-white/20" />
              </div>
              <p className="text-sm font-semibold text-white/40">No projects to show</p>
              <p className="text-xs text-white/20 mt-1">{targetUser.name.split(' ')[0]} hasn't added any projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project, i) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#f5c140]/20 transition-all group"
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h4 className="text-[15px] font-bold text-white group-hover:text-[#f5c140] transition-colors">{project.title}</h4>
                    <div className="flex gap-2">
                      {project.repo_url && (
                        <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
                          <GitFork size={14} />
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#f5c140]/10 text-[#f5c140] hover:bg-[#f5c140]/20 transition-all">
                          <Globe size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-[13px] text-white/50 leading-relaxed line-clamp-2">{project.description}</p>
                  {project.image_url && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-white/10 h-32 relative">
                      <img src={project.image_url} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
