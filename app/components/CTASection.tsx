"use client";

import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function CTASection() {
  const signInWithGoogle = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
  };

  return (
    <section className="relative py-40 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 max-w-lg section-divider" />

      {/* Layered cinematic glows */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[700px] w-[700px] rounded-full opacity-[0.10] animate-pulse-glow"
          style={{ background: "radial-gradient(circle, rgba(245,193,64,0.6) 0%, transparent 60%)", filter: "blur(80px)" }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[400px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.8) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      {/* Rotating rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="h-[500px] w-[500px] rounded-full border border-dashed border-[#f5c140]/8"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute h-[700px] w-[700px] rounded-full border border-dashed border-white/4"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute h-[900px] w-[900px] rounded-full border border-[#f5c140]/[0.025]"
        />
      </div>

      {/* Grain overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] noise" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22,1,0.36,1] }}
          className="space-y-8"
        >
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f5c140]/45">
              Join the movement
            </p>
            <h2 className="text-5xl sm:text-6xl md:text-[4.5rem] font-black tracking-[-0.045em] leading-[0.92] text-white">
              The future belongs
              <br />
              <span className="text-gold">to builders.</span>
            </h2>
            <p className="mx-auto max-w-md text-[15px] leading-[1.85] text-white/30">
              Join engineers building the next generation of technology. Your breakthrough is one community away.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22,1,0.36,1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="/feed"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#f5c140] px-9 py-4 text-[15px] font-bold text-black transition-all duration-300 hover:scale-[1.06] hover:shadow-brand-lg active:scale-95"
            >
              {/* Shine sweep */}
              <span className="absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] bg-white/20 transition-transform duration-700 ease-out" />
              <span className="relative">Enter DevSpace</span>
              <svg className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/4 px-7 py-4 text-[14px] text-white/55 hover:border-white/18 hover:text-white/80 hover:bg-white/6 transition-all duration-300 backdrop-blur-sm"
            >
              Login with Google
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
