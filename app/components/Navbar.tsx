"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Zap, Trophy, Users, Award, BriefcaseBusiness } from "lucide-react";
import { Avatar } from "./LayoutUI";

const navLinks = [
  { label: "Feed",          href: "/feed",          icon: Zap },
  { label: "Community",     href: "/community",     icon: Users },
  { label: "Opportunities", href: "/opportunities", icon: BriefcaseBusiness },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [user,      setUser]      = useState<User | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  /* ── Auth state ── */
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user ?? null);
      if (data.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        setUserProfile(profile);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  /* ── Scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const signInWithGoogle = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    router.replace('/');
  };

  if (pathname !== "/") return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y:   0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-2 bg-black/80 backdrop-blur-2xl border-b border-white/6 shadow-[0_1px_0_rgba(245,193,64,0.1)]"
          : "py-4 bg-transparent"
      }`}
    >
      {/* ── Scroll progress ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#f5c140] to-orange-500 shadow-[0_0_10px_rgba(245,193,64,0.5)]"
          style={{ 
            scaleX: typeof window !== 'undefined' ? (scrolled ? 1 : 0) : 0, 
            transformOrigin: "left",
            width: "100%"
          }}
          animate={{ scaleX: typeof window !== 'undefined' ? (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 30, restDelta: 0.001 }}
        />
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6">
        
        {/* ── Logo ── */}
        <Link href="/" className="group flex items-center gap-3 shrink-0 hover:opacity-80 transition-opacity">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-brand-sm bg-[#f5c140]/10 border border-[#f5c140]/20"
          >
            <Image src="/logo.png" alt="DevSpace" width={36} height={36} className="object-contain" priority />
          </motion.div>
          <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-white/90 group-hover:text-[#f5c140] transition-colors duration-200">
            DevSpace
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-200 group"
              >
                <Icon size={14} className="group-hover:text-[#f5c140] transition-colors" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Right side CTAs ── */}
        <div className="hidden md:flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                /* Authenticated state */
                <div className="flex items-center gap-4">
                  <Link
                    href="/feed"
                    className="text-[12px] text-white/50 hover:text-[#f5c140] transition-colors font-medium"
                  >
                    Open Feed
                  </Link>
                  <Link href="/profile">
                    <motion.div
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#f5c140]/30 transition-all group cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.2)]"
                    >
                      <Avatar 
                        url={userProfile?.avatar || user.user_metadata?.avatar_url} 
                        initial={(userProfile?.name || user.user_metadata?.name || user.email)?.[0]?.toUpperCase() || 'U'} 
                        size={28} 
                      />
                      <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors max-w-[100px] truncate">
                        {(userProfile?.name || user.user_metadata?.name || user.email?.split('@')[0])}
                      </span>
                    </motion.div>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={signOut}
                    className="text-[12px] text-white/30 hover:text-red-400/80 transition-colors font-medium px-2 py-1"
                  >
                    Sign out
                  </motion.button>
                </div>
              ) : (
                /* Unauthenticated state */
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={signInWithGoogle}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] text-white/60 hover:border-[#f5c140]/20 hover:text-white/90 hover:bg-white/6 transition-all duration-200 font-medium"
                  >
                    <GoogleIcon />
                    Login
                  </motion.button>
                  <motion.a
                    href="/feed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#f5c140] px-5 py-2 text-[13px] font-bold text-black transition-all duration-300 hover:shadow-brand-sm hover:bg-[#fde68a]"
                  >
                    Explore DevSpace
                  </motion.a>
                </>
              )}
            </>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-black/95 backdrop-blur-2xl"
          >
            <div className="px-6 py-5 space-y-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-white/60 hover:text-white/90 hover:bg-white/5 transition-all font-medium"
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-white/5 space-y-3 mt-3">
                {user ? (
                  <>
                    <Link href="/profile" className="block px-3 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                      My Profile
                    </Link>
                    <Link href="/feed" className="block px-3 py-2 text-sm text-[#f5c140] font-medium">
                      Open Feed →
                    </Link>
                    <button 
                      onClick={signOut}
                      className="w-full text-left px-3 py-2 text-sm text-white/30 hover:text-red-400/70 transition-colors"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={signInWithGoogle}
                      className="w-full flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:text-white transition-all"
                    >
                      <GoogleIcon /> Login
                    </motion.button>
                    <Link 
                      href="/feed" 
                      className="w-full flex items-center justify-center rounded-lg bg-[#f5c140] px-4 py-2.5 text-sm font-bold text-black transition-all"
                      onClick={() => setMenuOpen(false)}
                    >
                      Explore DevSpace
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
