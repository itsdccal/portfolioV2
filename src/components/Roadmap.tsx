"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.21, 0.47, 0.32, 0.98] as const;
const stages = profile.roadmap;

export default function Roadmap() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 40%",
        end: "bottom 60%",
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.min(
            stages.length - 1,
            Math.floor(self.progress * stages.length)
          );
          setActiveStage(idx);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const stage = stages[activeStage];

  return (
    <section ref={sectionRef} id="roadmap" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <SectionHeading index="005" title="Roadmap" />
        </motion.div>

        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mb-12 max-w-lg text-muted"
        >
          How the work has evolved — from programming fundamentals to shipping
          production systems. Scroll to move through the phases.
        </motion.p>

        {/* Trajectory continuum bar */}
        <div className="mb-14 flex flex-wrap items-center gap-2 border border-border px-4 py-3 font-mono text-[11px] uppercase tracking-widest md:gap-3">
          <span className="mr-2 text-muted">// TRAJECTORY</span>
          {profile.trajectory.map((label, idx) => (
            <span key={label} className="inline-flex items-center gap-2 md:gap-3">
              <span
                className={cn(
                  "border px-2.5 py-1 transition-colors duration-300",
                  idx === activeStage
                    ? "border-accent bg-accent text-background"
                    : "border-border text-muted"
                )}
              >
                {label}
              </span>
              {idx < profile.trajectory.length - 1 && (
                <span className="text-border">→</span>
              )}
            </span>
          ))}
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-12">
          {/* Stage selector with laser spine */}
          <div className="relative lg:col-span-5">
            <div
              className={cn(
                "absolute bottom-6 left-[7px] top-6 hidden w-px transition-colors duration-500 sm:block",
                "bg-gradient-to-b from-foreground/40 via-border to-foreground/40"
              )}
              aria-hidden
            />
            <div
              className="absolute bottom-6 left-[7px] top-6 hidden w-px bg-accent shadow-[0_0_12px_var(--accent)] transition-all duration-500 ease-out sm:block"
              style={{
                top: `calc(1.5rem + (100% - 3rem) * ${activeStage / stages.length})`,
                height: `calc((100% - 3rem) / ${stages.length})`,
              }}
              aria-hidden
            />
            <div className="relative z-10 flex flex-col gap-3">
              {stages.map((item, idx) => {
                const isActive = activeStage === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveStage(idx)}
                    data-cursor="SELECT"
                    className={cn(
                      "flex items-center gap-4 border p-4 text-left transition-colors duration-300 sm:ml-6",
                      isActive
                        ? "border-accent bg-accent text-background"
                        : "border-border text-muted hover:border-accent hover:text-accent"
                    )}
                  >
                    <span
                      className={cn(
                        "hidden h-2 w-2 shrink-0 rounded-full sm:block",
                        isActive ? "bg-background" : "bg-muted"
                      )}
                      aria-hidden
                    />
                    <span className="font-mono text-2xl font-bold tracking-tight md:text-3xl">
                      {item.shortYear}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          "block font-mono text-[10px] uppercase tracking-widest",
                          isActive ? "opacity-70" : "text-muted"
                        )}
                      >
                        {profile.trajectory[idx]}
                      </span>
                    </span>
                    <span className="font-mono text-xs opacity-60">{item.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage detail panel */}
          <div className="lg:col-span-7 lg:pl-4">
            <motion.div
              key={stage.id}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease }}
              className="border border-border p-8 md:p-10"
            >
              <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-widest">
                <span className="text-muted">
                  Phase {stage.id} / 0{stages.length}
                </span>
                <span className="text-5xl font-bold tracking-tighter text-border md:text-7xl">
                  {stage.year}
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
                {stage.title}
              </h3>

              <p className="mt-4 max-w-2xl leading-relaxed text-muted">
                {stage.description}
              </p>

              <ul className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
                {stage.tags.map((tag) => (
                  <li
                    key={tag}
                    className="border border-border px-2 py-1 font-mono text-xs text-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
