"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import DancingLetters from "./ui/dancing-letters";
import Parallax from "./Parallax";
import { profile } from "@/data/profile";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const [firstName, lastName] = [
  profile.name.split(" ").slice(0, -1).join(" "),
  profile.name.split(" ").slice(-1)[0],
];

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const firstNameRef = useRef<HTMLSpanElement>(null);
  const lastNameRef = useRef<HTMLSpanElement>(null);
  const photoWrapperRef = useRef<HTMLDivElement>(null);
  const photoImgRef = useRef<HTMLDivElement>(null);
  const nameWrapperRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Entrance animations wait for the interactive intro instead of a fixed
  // delay; reduced-motion users (no intro) enter immediately.
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEntered(true);
      return;
    }
    const onEntered = () => setEntered(true);
    window.addEventListener("intro:entered", onEntered);
    // Fallback: never leave the hero hidden if the intro misfires.
    const fallback = window.setTimeout(() => setEntered(true), 12000);
    return () => {
      window.removeEventListener("intro:entered", onEntered);
      window.clearTimeout(fallback);
    };
  }, []);

  // GSAP scroll-scrub: first/last name drift apart, the FIG. 01 frame
  // sinks and scales toward the About section while the image pans.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      tl.to(firstNameRef.current, { xPercent: -4, scale: 0.97, ease: "power1.out" }, 0);
      tl.to(
        lastNameRef.current,
        { xPercent: 6, yPercent: 14, scale: 0.97, ease: "power1.out" },
        0
      );
      tl.to(photoWrapperRef.current, { yPercent: 34, scale: 1.06, ease: "power1.out" }, 0);
      tl.to(photoImgRef.current, { yPercent: 6, ease: "none" }, 0);
      tl.to(nameWrapperRef.current, { opacity: 0.35, scale: 0.95, ease: "none" }, 0.3);
      tl.to(statementRef.current, { y: -40, opacity: 0.25, ease: "none" }, 0);
      tl.to(metadataRef.current, { y: -30, opacity: 0.2, ease: "none" }, 0);
      tl.to(scrollIndicatorRef.current, { opacity: 0, ease: "none" }, 0);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={rootRef}
      className="blueprint-grid relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-20"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.4fr_1fr]">
        <div ref={nameWrapperRef}>
          <motion.div
            ref={metadataRef}
            initial={{ opacity: 0 }}
            animate={entered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 font-mono text-[11px] uppercase tracking-widest text-muted"
          >
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              <span className="text-foreground">[000] — Portfolio / 2026</span>
            </span>
            <span className="hidden sm:inline">{profile.location}</span>
            <span>{profile.availability}</span>
          </motion.div>

          <h1 className="flex flex-wrap items-baseline gap-x-5 uppercase leading-[0.95] tracking-tight">
            <span className="sr-only">{profile.name}</span>
            <span
              ref={firstNameRef}
              aria-hidden
              className="inline-flex will-change-transform"
              data-cursor="DANCE"
            >
              {entered && (
                <DancingLetters
                  text={firstName}
                  initialWaveDelay={150}
                  autoPlayInterval={3200}
                  letterClassName="text-3xl sm:text-4xl md:text-6xl font-bold"
                />
              )}
            </span>
            <span
              ref={lastNameRef}
              aria-hidden
              className="inline-flex will-change-transform"
              data-cursor="DANCE"
            >
              {entered && (
                <DancingLetters
                  text={lastName}
                  initialWaveDelay={500}
                  autoPlayInterval={3800}
                  letterClassName="text-3xl sm:text-4xl md:text-6xl font-bold"
                />
              )}
            </span>
          </h1>

          <div ref={statementRef}>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 font-mono text-sm uppercase tracking-widest text-muted"
            >
              {profile.role}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="mt-4 max-w-xl text-lg text-muted md:text-xl"
            >
              {profile.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={entered ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href="#projects"
                data-cursor="GO"
                className="border border-accent bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-background transition-colors hover:bg-transparent hover:text-accent"
              >
                View Projects
              </a>
              <a
                href="#contact"
                data-cursor="GO"
                className="border border-border px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Get in Touch
              </a>
            </motion.div>
          </div>
        </div>

        {/* FIG. 01 portrait frame */}
        <motion.div
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={entered ? { clipPath: "inset(0% 0 0 0)" } : { clipPath: "inset(100% 0 0 0)" }}
          transition={{ duration: 1, delay: 0.35, ease }}
          className="relative hidden md:block"
        >
          <div ref={photoWrapperRef} className="relative will-change-transform">
            {/* Accent corner squares */}
            <span className="absolute -left-1 -top-1 z-20 h-2 w-2 bg-accent" />
            <span className="absolute -right-1 -top-1 z-20 h-2 w-2 bg-accent" />
            <span className="absolute -bottom-1 -left-1 z-20 h-2 w-2 bg-accent" />
            <span className="absolute -bottom-1 -right-1 z-20 h-2 w-2 bg-accent" />

            <div className="relative border border-border bg-background">
              {/* Top telemetry bar */}
              <div className="flex items-center justify-between border-b border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                  <span className="text-foreground">FIG. 01</span>
                </span>
                <span>Portrait</span>
              </div>

              <div className="relative aspect-[4/5] overflow-hidden">
                <div ref={photoImgRef} className="h-full w-full will-change-transform">
                  <Parallax speed={5} className="h-full w-full">
                    <Image
                      src="/images/portrait.jpg"
                      alt={profile.name}
                      fill
                      priority
                      className="scale-110 object-cover grayscale"
                    />
                  </Parallax>
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/80 to-transparent" />
              </div>

              {/* Bottom caption bar */}
              <div className="flex items-center justify-between border-t border-border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                <span className="text-foreground">{profile.shortName}</span>
                <span>{profile.location}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        ref={scrollIndicatorRef}
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          Scroll ↓
        </span>
      </motion.div>
    </section>
  );
}
