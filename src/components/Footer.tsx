"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect width="14" height="14" x="8" y="8" rx="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

const socials = [
  { label: "LinkedIn", href: profile.linkedin, icon: <LinkedInIcon /> },
  { label: "Instagram", href: "https://instagram.com/itsdccal", icon: <InstagramIcon /> },
  { label: "GitHub", href: "https://github.com/itsdccal", icon: <GithubIcon /> },
];

const channels = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
  },
  {
    label: "LinkedIn",
    value: "andimuhhaikal",
    href: profile.linkedin,
    external: true,
  },
  {
    label: "Phone / WA",
    value: profile.phone,
    href: `tel:+62${profile.phone.slice(1)}`,
    external: false,
  },
];

export default function Footer() {
  const [time, setTime] = useState("--:--:--");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: profile.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = profile.email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="contact" className="relative overflow-hidden">
      {/* CTA block with looping video background */}
      <div className="relative">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          src="/videos/footer-ink.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background/80" />

        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-24 md:pb-32 md:pt-32">
          {/* Telemetry strip: chapter, live clock, availability, location */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="mb-16 flex flex-wrap items-center justify-between gap-3 border-y border-border py-3 font-mono text-[11px] uppercase tracking-widest"
          >
            <span className="text-accent">[007] — Contact</span>
            <span className="flex items-center gap-3">
              <span className="text-muted">Local time</span>
              <span className="tabular-nums text-foreground">{time}</span>
              <span className="hidden text-muted sm:inline">{profile.timezone}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              <span>{profile.availability}</span>
            </span>
          </motion.div>

          {/* Macro-typography statement */}
          <motion.h2
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="font-display uppercase leading-[0.9] tracking-[-0.02em]"
          >
            <span className="block text-[clamp(2.75rem,9vw,8rem)]">
              Have an idea?
            </span>
            <span className="mt-2 block text-[clamp(2.75rem,9vw,8rem)] text-accent">
              Let&apos;s build it
              <span aria-hidden> →</span>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted"
          >
            Whether we start fresh to bring a project to life or take an
            existing system further — my inbox is always open.
          </motion.p>

          {/* Email CTA + copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={`mailto:${profile.email}`}
              data-cursor="SAY HELLO"
              className="inline-block border border-accent bg-accent px-8 py-4 font-mono text-xs uppercase tracking-widest text-background transition-colors hover:bg-transparent hover:text-accent"
            >
              {profile.email}
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={profile.cv}
              download
              data-cursor="CV"
              className="inline-flex items-center gap-2 border border-border px-8 py-4 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
                <path d="M12 15V3" />
              </svg>
              Download CV
            </motion.a>
            <button
              type="button"
              onClick={copyEmail}
              data-cursor
              className={cn(
                "flex items-center gap-2 border px-5 py-4 font-mono text-xs uppercase tracking-widest transition-colors",
                copied
                  ? "border-accent bg-accent text-background"
                  : "border-border text-muted hover:border-accent hover:text-accent"
              )}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </motion.div>

          {/* Channel links */}
          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-3"
          >
            {channels.map((channel) => (
              <li key={channel.label} className="bg-background/90">
                <a
                  href={channel.href}
                  {...(channel.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  data-cursor
                  className="group flex h-full flex-col gap-2 p-6 transition-colors hover:bg-accent hover:text-background"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted transition-colors group-hover:text-background/70">
                    {channel.label}
                  </span>
                  <span className="break-all font-mono text-sm font-semibold transition-transform duration-200 group-hover:translate-x-1">
                    {channel.value}
                  </span>
                </a>
              </li>
            ))}
          </motion.ul>

          {/* Socials */}
          <motion.ul
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-14 flex items-center gap-4"
          >
            {socials.map((social) => (
              <li key={social.label}>
                <motion.a
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/30 text-foreground/80 backdrop-blur-sm transition-colors hover:border-accent hover:bg-accent hover:text-background"
                >
                  {social.icon}
                </motion.a>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-border bg-background px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <span className="font-mono text-sm font-bold tracking-widest">
            {profile.shortName}
            <span className="text-muted">.dev</span>
          </span>

          <p className="font-mono text-xs text-muted">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>

          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            {profile.location}
          </span>
        </div>
      </div>
    </footer>
  );
}
