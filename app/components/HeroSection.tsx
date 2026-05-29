"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

/* ── Floating particles ── */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 4.7) % 90}%`,
  top:  `${10 + (i * 7.3) % 80}%`,
  size: 1 + (i % 3),
  delay: `${(i * 0.4) % 4}s`,
  duration: `${5 + (i * 0.7) % 8}s`,
  opacity: 0.15 + (i % 4) * 0.08,
}));

export default function HeroSection() {
  const [user, setUser] = useState<User | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y       = useTransform(scrollYProgress, [0, 1], [0,  100]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
  };

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-20"
    >
      {/* ── Ambient layers ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Center radial */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[1000px] w-[1000px] rounded-full opacity-[0.12]"
          style={{ background: "radial-gradient(circle, rgba(245,193,64,0.4) 0%, transparent 70%)", filter: "blur(120px)" }}
        />
        {/* Top-left accent */}
        <div className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, rgba(245,193,64,0.6) 0%, transparent 65%)", filter: "blur(140px)" }}
        />
        {/* Bottom-right accent */}
        <div className="absolute -bottom-20 -right-20 h-[600px] w-[600px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)", filter: "blur(120px)" }}
        />

        {/* Dynamic Grid overlay */}
        <motion.div 
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.7) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,0.7) 1.5px, transparent 1.5px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
          }}
        />

        {/* Scan line */}
        <div className="absolute left-0 right-0 h-[3px] animate-scan opacity-[0.06]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(245,193,64,0.9), transparent)" }}
        />

        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#f5c140]"
            style={{
              left: p.left, top: p.top,
              width: `${p.size}px`, height: `${p.size}px`,
              opacity: p.opacity,
              animation: `particle-rise ${p.duration} ${p.delay} ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 pb-16 lg:grid-cols-[1fr_1fr]"
      >
        {/* ─── LEFT: Typography ─── */}
        <div className="flex flex-col gap-8 max-w-xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22,1,0.36,1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f5c140]/20 bg-[#f5c140]/8 px-4 py-1.5 text-xs font-medium tracking-[0.22em] uppercase text-[#f5c140]/75">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f5c140] animate-pulse" />
              Now in public beta
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22,1,0.36,1] }}
            className="space-y-3"
          >
            <h1 className="text-[4rem] sm:text-[5rem] md:text-[5.5rem] font-black tracking-[-0.045em] leading-[0.9] text-white">
              Built for
              <br />
              <span className="text-gold">Engineers.</span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22,1,0.36,1] }}
            className="text-base sm:text-lg leading-[1.75] text-white/40 max-w-md"
          >
            A premium ecosystem where developers, builders, and creators connect, build projects, solve challenges, earn certificates, and grow together.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22,1,0.36,1] }}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="#feed"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#f5c140] px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.05] hover:shadow-brand-md active:scale-95"
            >
              Explore Feed
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            {user ? (
              <Link
                href="/feed"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.08] px-7 py-3.5 text-sm font-semibold text-white/80 transition-all duration-300 hover:border-[#f5c140]/30 hover:text-white hover:bg-white/10 active:scale-95"
              >
                Open Feed
              </Link>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/4 px-7 py-3.5 text-sm font-semibold text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-[#f5c140]/30 hover:text-white hover:bg-white/8 active:scale-95"
              >
                <GoogleBrandIcon />
                Login with Google
              </button>
            )}
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.75 }}
            className="flex items-center gap-3 pt-2"
          >
            <div className="flex -space-x-2.5">
              {["#7c3aed","#0891b2","#059669","#d97706","#dc2626"].map((c, i) => (
                <div key={i} className="h-7 w-7 rounded-full border-[1.5px] border-black flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: c }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="text-xs text-white/25 tracking-wide">
              Joined by <span className="text-white/55 font-medium">2,000+</span> engineers worldwide
            </span>
          </motion.div>
        </div>

        {/* ─── RIGHT: Premium Visual Stack ─── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.22,1,0.36,1] }}
          className="relative hidden lg:flex items-center justify-center"
          style={{ minHeight: 560 }}
        >
          {/* Ambient glow behind stack */}
          <div className="absolute inset-0 rounded-[40px] opacity-30 animate-pulse-glow"
            style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(245,193,64,0.2) 0%, transparent 70%)", filter: "blur(40px)" }}
          />

          {/* Rotating orbit ring */}
          <div className="absolute h-[400px] w-[400px] rounded-full border border-dashed border-[#f5c140]/8 animate-spin-slow" />
          <div className="absolute h-[520px] w-[520px] rounded-full border border-dashed border-white/4 animate-spin-slow-ccw" />

          {/* ── Center: floating logo ── */}
          <div className="animate-float relative z-20 flex flex-col items-center gap-2">
            <div className="relative flex items-center justify-center h-24 w-24 rounded-3xl overflow-hidden shadow-brand-lg">
              <Image src="/logo.png" alt="DevSpace" width={96} height={96} className="object-contain" priority />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/30">DevSpace</span>
          </div>

          {/* ── Card 1: Feed post preview ── */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 left-[-10px] glass rounded-2xl p-4 w-56 z-30 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">A</div>
              <div>
                <p className="text-[11px] font-semibold text-white/80">Alex Chen</p>
                <p className="text-[10px] text-white/30">@alexbuilds</p>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-white/50">Just shipped my first open-source CLI tool. 3 weeks of work 🚀</p>
            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-white/5">
              <span className="text-[10px] text-white/25">❤️ 48</span>
              <span className="text-[10px] text-white/25">💬 12</span>
              <span className="ml-auto text-[10px] text-[#f5c140]/60">+24 Aura</span>
            </div>
          </motion.div>

          {/* ── Card 2: Certificate preview ── */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-8 right-[-20px] glass-brand rounded-2xl p-4 w-52 z-30 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-[#f5c140]/15 border border-[#f5c140]/20 flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-[#f5c140]">
                  <path d="M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-[11px] font-semibold text-[#f5c140]/80">Certificate Earned</p>
            </div>
            <p className="text-[12px] font-bold text-white/80">Systems Design</p>
            <p className="text-[10px] text-white/35 mt-0.5">Challenge #042 · Verified</p>
            <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-[#f5c140] to-[#fde68a]" />
            </div>
          </motion.div>

          {/* ── Card 3: Aura points ── */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[45%] right-[-40px] glass rounded-2xl px-4 py-3 z-30 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/25 mb-1">Aura Points</p>
            <p className="text-2xl font-black text-[#f5c140] tracking-tight">2,840</p>
            <p className="text-[10px] text-white/25 mt-0.5">↑ +128 this week</p>
          </motion.div>

          {/* ── Card 4: Live builders ── */}
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-[36%] left-[-30px] glass rounded-xl px-4 py-3 z-30"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[11px] text-white/50"><span className="text-white/80 font-semibold">247</span> builders online</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/15">
            <path d="M10 4v12M5 11l5 5 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

function GoogleBrandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
