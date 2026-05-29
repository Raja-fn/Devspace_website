"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const navGroups = [
  {
    label: "Platform",
    links: [
      { label: "Feed",         href: "#feed" },
      { label: "Challenges",   href: "#challenges" },
      { label: "Certificates", href: "#certificates" },
      { label: "Community",    href: "#community" },
    ],
  },
  {
    label: "Account",
    links: [
      { label: "Login",     href: "#" },
      { label: "Sign Up",   href: "#" },
      { label: "Aura",      href: "#aura" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About",   href: "#" },
      { label: "Blog",    href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.055]">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-48 w-80 opacity-[0.18]"
        style={{ background: "radial-gradient(ellipse, rgba(245,193,64,0.5) 0%, transparent 70%)", filter: "blur(50px)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">

          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <a href="#" className="group inline-flex items-center gap-3" aria-label="DevSpace">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <Image src="/logo.png" alt="DevSpace" width={36} height={36} className="object-contain" />
              </span>
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/50 group-hover:text-white/80 transition-colors">
                DevSpace
              </span>
            </a>
            <p className="text-[13px] leading-relaxed text-white/25 max-w-[200px]">
              The premium platform for engineers who ship.
            </p>
            <p className="text-[13px] text-white/20">
              Built for Engineers 🚀
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                {
                  label: "GitHub",
                  href: "https://github.com",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                  ),
                },
                {
                  label: "Twitter / X",
                  href: "https://twitter.com",
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-white/30 transition-all duration-200 hover:border-white/12 hover:text-white/70 hover:bg-white/6"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Nav columns */}
          {navGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 * (gi + 1) }}
              className="space-y-5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/25">
                {group.label}
              </p>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-white/30 hover:text-white/70 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.045] pt-8">
          <p className="text-[12px] text-white/15 tracking-widest uppercase">
            © {new Date().getFullYear()} DevSpace. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Status"].map((l) => (
              <a key={l} href="#" className="text-[12px] text-white/15 hover:text-white/40 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
