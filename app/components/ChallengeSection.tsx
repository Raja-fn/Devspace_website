"use client";

import { motion } from "framer-motion";

const challenges = [
  { id: "041", title: "Build a Rate Limiter", difficulty: "Hard", tags: ["Systems", "Concurrency"], reward: 120 },
  { id: "042", title: "Design a URL Shortener", difficulty: "Medium", tags: ["APIs", "Databases"], reward: 80 },
  { id: "043", title: "Write a Memory Allocator", difficulty: "Expert", tags: ["C", "Low-Level"], reward: 200 },
];

const difficultyColors: Record<string, string> = {
  Medium: "#10b981",
  Hard:   "#f59e0b",
  Expert: "#ef4444",
};

export default function ChallengeSection() {
  return (
    <section id="certificates" className="relative py-36 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 max-w-lg section-divider" />

      {/* Ambient right glow */}
      <div className="pointer-events-none absolute -right-20 top-1/3 h-[500px] w-[500px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, rgba(245,193,64,1) 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.2fr_1fr]">

          {/* ── Left: Certificate + challenge cards ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
            className="relative space-y-4"
          >
            {/* Premium certificate card */}
            <div className="relative overflow-hidden rounded-3xl border border-[#f5c140]/20 bg-gradient-to-br from-[#f5c140]/10 via-[#f5c140]/5 to-transparent p-7 shadow-[0_30px_80px_rgba(245,193,64,0.12)]">
              {/* Corner glow */}
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-30"
                style={{ background: "radial-gradient(circle, rgba(245,193,64,0.8) 0%, transparent 70%)", filter: "blur(20px)" }}
              />
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#f5c140]/50 mb-1">Certificate of Achievement</p>
                  <h3 className="text-xl font-black text-white tracking-tight">Systems Design</h3>
                  <p className="text-[13px] text-white/35 mt-0.5">Challenge #042 · Completed</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#f5c140]/25 bg-[#f5c140]/12">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#f5c140]">
                    <path d="M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-[11px] text-white/30">
                  <span>Completion</span><span>100%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.22,1,0.36,1], delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#f5c140] to-[#fde68a]"
                  />
                </div>
              </div>

              {/* Aura reward */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f5c140]/20 bg-[#f5c140]/8 px-4 py-2">
                <span className="text-[12px] text-white/40">Aura earned:</span>
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-[15px] font-black text-[#f5c140]"
                >
                  +120 ⚡
                </motion.span>
              </div>
            </div>

            {/* Challenge list */}
            <div className="space-y-3">
              {challenges.map((ch) => (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
                  className="group glass rounded-2xl px-5 py-4 flex items-center gap-4 transition-all duration-300 hover:border-[#f5c140]/12"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-[10px] text-white/25 font-mono">#{ch.id}</span>
                      <span className="text-[13px] font-semibold text-white/80">{ch.title}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ch.tags.map((t) => (
                        <span key={t} className="rounded-full border border-white/6 bg-white/3 px-2 py-0.5 text-[10px] text-white/30">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[11px] font-semibold" style={{ color: difficultyColors[ch.difficulty] }}>
                      {ch.difficulty}
                    </span>
                    <span className="text-[11px] text-[#f5c140]/60">+{ch.reward} Aura</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Copy ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22,1,0.36,1] }}
            className="space-y-8 lg:pl-8"
          >
            <div className="space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f5c140]/50">
                Challenges &amp; Certificates
              </p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.04em] leading-[1.05] text-white">
                Prove what
                <br />
                <span className="text-white/25">you can build.</span>
              </h2>
              <p className="text-[15px] leading-[1.85] text-white/35 max-w-sm">
                Weekly engineering challenges designed by senior engineers. Earn verified certificates and Aura points that reflect real growth — not just résumé padding.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: "⚡", title: "New challenge every week", desc: "Curated problems across systems, algorithms, and architecture." },
                { icon: "🏆", title: "On-chain verified certificates", desc: "Certificates that are tamper-proof and permanently verifiable." },
                { icon: "⭐", title: "Aura reputation system", desc: "A score that grows with every contribution you make to the community." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 glass rounded-2xl px-5 py-4">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-white/80 mb-0.5">{item.title}</p>
                    <p className="text-[12px] text-white/30 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
