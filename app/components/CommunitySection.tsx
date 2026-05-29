"use client";

import { motion } from "framer-motion";

const posts = [
  {
    user: { name: "Mia Zhang", handle: "miabuilds", color: "#7c3aed", initial: "M" },
    content: "Rewrote our entire Kubernetes HPA setup from scratch. The performance gains are insane — 40% less resource consumption.",
    tags: ["#DevOps", "#Kubernetes"],
    aura: "+56 Aura",
    time: "2m ago",
    comments: 18,
  },
  {
    user: { name: "Rajan Mehta", handle: "rajan_dev", color: "#0891b2", initial: "R" },
    content: "Open sourcing my Rust HTTP client library today. Built it during last month's DevSpace challenge. Check the link 👇",
    tags: ["#Rust", "#OpenSource"],
    aura: "+88 Aura",
    time: "15m ago",
    comments: 34,
  },
  {
    user: { name: "Sofia Park", handle: "sofiapark_", color: "#059669", initial: "S" },
    content: "Finished the Systems Design challenge #041. Honestly the hardest problem I have solved all year — and the most rewarding.",
    tags: ["#SystemsDesign"],
    aura: "+72 Aura",
    time: "1h ago",
    comments: 9,
  },
];

export default function CommunitySection() {
  return (
    <section id="community" className="relative py-36 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 max-w-lg section-divider" />

      {/* Ambient left glow */}
      <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, rgba(245,193,64,1) 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.2fr] items-center">

          {/* ── Left: Post stream ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
            className="relative space-y-4"
          >
            {/* Live indicator */}
            <div className="absolute -top-5 right-0 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-400/70 tracking-wide font-medium">Live feed</span>
            </div>

            {posts.map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22,1,0.36,1] }}
                className="group glass rounded-2xl p-5 transition-all duration-300 hover:border-[#f5c140]/12 hover:bg-white/[0.04]"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: post.user.color }}>
                    {post.user.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[13px] font-semibold text-white/80">{post.user.name}</span>
                      <span className="text-[12px] text-white/25">@{post.user.handle}</span>
                      <span className="ml-auto text-[11px] text-white/20">{post.time}</span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-white/45 mb-3">{post.content}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {post.tags.map((t) => (
                        <span key={t} className="rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-[11px] text-white/35">
                          {t}
                        </span>
                      ))}
                      <span className="ml-auto flex items-center gap-2 text-[11px] text-white/20">
                        <span>💬 {post.comments}</span>
                        <span className="text-[#f5c140]/60 font-medium">{post.aura}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* More hint */}
            <div className="absolute -bottom-6 left-0 right-0 h-16 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent, #000)" }}
            />
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
                Community
              </p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.04em] leading-[1.05] text-white">
                Ship in public.
                <br />
                <span className="text-white/25">Grow together.</span>
              </h2>
              <p className="text-[15px] leading-[1.85] text-white/35 max-w-sm">
                DevSpace is where engineers share real work — not polished highlights. Discuss architecture decisions, share what broke at 2am, and celebrate real wins.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Posts per day", value: "1,200+" },
                { label: "Engineers", value: "2,400+" },
                { label: "Countries", value: "40+" },
                { label: "Challenges solved", value: "18K+" },
              ].map((stat) => (
                <div key={stat.label} className="glass-brand rounded-2xl px-5 py-4">
                  <p className="text-2xl font-black text-[#f5c140] tracking-tight">{stat.value}</p>
                  <p className="text-[12px] text-white/30 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            <a href="/feed" className="inline-flex items-center gap-2 text-[13px] text-[#f5c140]/70 hover:text-[#f5c140] transition-colors font-medium">
              Explore the feed →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
