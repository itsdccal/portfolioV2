"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import Parallax from "./Parallax";
import { profile } from "@/data/profile";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export default function Hero() {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const rootRef = useRef<HTMLElement>(null);

  // GSAP: split the name into characters, stagger them up from below
  // right after the preloader curtain lifts.
  useEffect(() => {
    const el = nameRef.current;
    const root = rootRef.current;
    if (!el || !root) return;

    const chars = el.querySelectorAll<HTMLElement>("[data-char]");
    gsap.set(chars, { yPercent: 110 });

    const ctx = gsap.context(() => {
      gsap.to(chars, {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.028,
        ease: "power4.out",
        delay: 3.0,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-20"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.0 }}
            className="mb-6 font-mono text-sm text-muted"
          >
            [000] — Hello, I&apos;m
          </motion.p>

          <h1
            ref={nameRef}
            className="text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
          >
            <span className="sr-only">{profile.name}</span>
            <span aria-hidden className="inline-block">
              {profile.name.split(" ").map((word, wi) => (
                <span key={wi} className="inline-block whitespace-nowrap">
                  {word.split("").map((ch, ci) => (
                    <span key={ci} className="inline-block overflow-hidden pb-1 align-bottom">
                      <span data-char className="inline-block will-change-transform">
                        {ch}
                      </span>
                    </span>
                  ))}
                  {wi < profile.name.split(" ").length - 1 && (
                    <span className="inline-block">&nbsp;</span>
                  )}
                </span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.45 }}
            className="mt-6 font-mono text-sm uppercase tracking-widest text-muted"
          >
            {profile.role}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.58 }}
            className="mt-4 max-w-xl text-lg text-muted md:text-xl"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.7 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="border border-foreground bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-widest text-background transition-colors hover:bg-transparent hover:text-foreground"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="border border-border px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-foreground hover:text-foreground"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 1, delay: 3.3, ease }}
          className="relative hidden aspect-[3/4] overflow-hidden border border-border md:block"
        >
          <Parallax speed={6} className="h-full w-full">
            <Image
              src="/images/portrait.jpg"
              alt={profile.name}
              fill
              priority
              className="scale-110 object-cover grayscale"
            />
          </Parallax>
          <span className="absolute bottom-3 left-3 z-10 font-mono text-xs uppercase tracking-widest text-foreground/70">
            {profile.location}
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 4.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          Scroll ↓
        </span>
      </motion.div>
    </section>
  );
}
