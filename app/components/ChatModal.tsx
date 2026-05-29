'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Avatar } from './LayoutUI'

export function ChatModal({ isOpen, onClose, currentUser, targetUser }: any) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [realtimeError, setRealtimeError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isOpen || !currentUser || !targetUser) return

    let isMounted = true
    fetchMessages()

    // Auto-focus input
    setTimeout(() => inputRef.current?.focus(), 100)

    // Start polling for new messages as a fallback for realtime.
    pollingRef.current = setInterval(() => {
      if (isMounted) fetchMessages()
    }, 4000)

    const channel = supabase
      .channel(`chat_room_${[currentUser.id, targetUser.id].sort().join('_')}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages'
      }, (payload) => {
        const msg = payload.new
        if (!msg) return

        const isRelevant = (msg.sender_id === currentUser.id && msg.receiver_id === targetUser.id) ||
                           (msg.sender_id === targetUser.id && msg.receiver_id === currentUser.id)
        
        if (isRelevant) {
          setMessages(prev => {
            if (prev.find(m => m.id === msg.id)) return prev
            return [...prev, msg]
          })
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeError(null)
        }
      })

    return () => {
      isMounted = false
      if (pollingRef.current) clearInterval(pollingRef.current)
      supabase.removeChannel(channel)
    }
  }, [isOpen, currentUser?.id, targetUser?.id])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function fetchMessages() {
    setLoading(true)
    try {
      // Safer fetching: get all messages where current user is sender or receiver
      // and then filter in JS for the target user. This avoids complex .or() filter issues.
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      
      const filtered = data?.filter(msg => 
        (msg.sender_id === currentUser.id && msg.receiver_id === targetUser.id) ||
        (msg.sender_id === targetUser.id && msg.receiver_id === currentUser.id)
      ) ?? []
      
      setMessages(filtered)
    } catch (err) {
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || sending || !currentUser || !targetUser) return
    setSending(true)
    
    try {
      const { data, error } = await supabase.from('messages').insert([
        { 
          sender_id: currentUser.id, 
          receiver_id: targetUser.id, 
          content: newMessage.trim() 
        }
      ]).select()

      if (error) throw error
      
      setNewMessage('')
      // If realtime is not enabled or slow, manually add the message to the state
      if (data && data[0]) {
        setMessages(prev => {
          if (prev.find(m => m.id === data[0].id)) return prev
          return [...prev, data[0]]
        })
      }
    } catch (err: any) {
      console.error('Error sending message:', err)
      const message = err?.message || 'Unknown error'
      setRealtimeError(message)
      alert(`Failed to send message: ${message}`)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#111]">
          <div className="flex items-center gap-3">
            <Avatar url={targetUser.avatar} initial={targetUser.name?.[0]} size={36} />
            <div>
              <h3 className="text-[14px] font-bold text-white">{targetUser.name}</h3>
              <p className="text-[11px] text-white/30">@{targetUser.handle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        {/* Messages */}
        <div className="px-6 py-3 flex items-center justify-between gap-3 border-b border-white/10 bg-[#0b0b0b]">
          <div className="text-[12px] text-white/40">Live chat with {targetUser.name.split(' ')[0]}</div>
          {realtimeError && (
            <div className="text-[11px] text-rose-400">Live update unavailable. Messages may lag.</div>
          )}
        </div>
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full text-white/20 text-xs">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-10">
              <div className="h-12 w-12 rounded-2xl bg-[#f5c140]/10 flex items-center justify-center mb-4">
                <Sparkles size={20} className="text-[#f5c140]/60" />
              </div>
              <p className="text-sm font-semibold text-white/40">No messages yet</p>
              <p className="text-xs text-white/20 mt-1">Start a conversation with {targetUser.name.split(' ')[0]}</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMine = msg.sender_id === currentUser.id
              return (
                <div key={msg.id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                    isMine 
                      ? 'bg-[#f5c140] text-black font-medium rounded-tr-none' 
                      : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-[#111]">
          <div className="flex gap-2 items-center bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-1.5 focus-within:border-[#f5c140]/30 transition-all">
            <input 
              ref={inputRef}
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-[13.5px] text-white/80 outline-none py-2"
              disabled={sending}
            />
            <button 
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="p-2 rounded-xl text-[#f5c140] hover:bg-[#f5c140]/10 disabled:opacity-30 transition-all"
            >
              {sending ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
