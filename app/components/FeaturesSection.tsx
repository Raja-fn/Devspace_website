"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    id: "feed",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#f5c140]">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 17.5h7M17.5 14v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Engineering Feed",
    description: "A curated stream of engineering stories, project updates, and technical insights from real builders.",
  },
  {
    id: "aura",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#f5c140]">
        <path d="M12 2l2.5 7.5H22l-6.5 4.7 2.5 7.5L12 17l-6 4.7 2.5-7.5L3 9.5h7.5L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Aura Points",
    description: "A reputation system that rewards real contributions — posts, challenges, and collaboration.",
  },
  {
    id: "team",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#f5c140]">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Team Collaboration",
    description: "Build with others. Create teams, pair on projects, and ship together like a real engineering org.",
  },
  {
    id: "opportunities",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#f5c140]">
        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Opportunities",
    description: "Exclusive student opportunities, internships, and hackathons from top engineering companies.",
  },
  {
    id: "community",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#f5c140]">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Engineering Community",
    description: "Connect with thousands of builders who ship, learn, and grow together every single day.",
  },
];

import { Variants } from "framer-motion";

const containerV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const cardV: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" } },
};

export default function FeaturesSection() {
  const ref   = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-36 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 max-w-lg section-divider" />

      {/* Subtle glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, rgba(245,193,64,1) 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="mb-20 space-y-4 text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f5c140]/50">
            Everything you need
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-black tracking-[-0.035em] leading-[1.05] text-white">
            One platform.
            <br />
            <span className="text-white/25">Infinite growth.</span>
          </h2>
        </motion.div>

        {/* 2×3 grid */}
        <motion.div
          ref={ref}
          variants={containerV}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div
              key={f.id}
              id={f.id}
              variants={cardV}
              className="group relative overflow-hidden rounded-[28px] border border-white/[0.055] bg-white/[0.025] p-7 transition-all duration-500 hover:border-[#f5c140]/18 hover:-translate-y-1 cursor-default"
            >
              {/* Inner radial on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 60% 45% at 50% 0%, rgba(245,193,64,0.07) 0%, transparent 100%)" }}
              />
              {/* Top shine on hover */}
              <div className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(245,193,64,0.45), transparent)" }}
              />

              <div className="relative z-10 flex flex-col gap-6">
                {/* Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.04] transition-all duration-300 group-hover:border-[#f5c140]/20 group-hover:bg-[#f5c140]/8">
                  {f.icon}
                </div>
                {/* Text */}
                <div className="space-y-2.5">
                  <h3 className="text-[17px] font-semibold tracking-tight text-white/90">
                    {f.title}
                  </h3>
                  <p className="text-[13.5px] leading-[1.8] text-white/35 group-hover:text-white/50 transition-colors duration-300">
                    {f.description}
                  </p>
                </div>
                {/* Arrow hint */}
                <div className="flex items-center gap-1.5 text-[12px] text-[#f5c140]/0 group-hover:text-[#f5c140]/60 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                  <span>Learn more</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
