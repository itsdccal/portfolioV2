"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const ALL = "ALL";

function ProvenanceStrip({ skill }: { skill: string | null }) {
  const usedIn = skill ? profile.skillProvenance[skill] : undefined;

  return (
    <div className="flex min-h-[52px] flex-col justify-between gap-2 border border-border bg-accent px-4 py-3 font-mono text-xs text-background sm:flex-row sm:items-center">
      <div className="flex items-center gap-3 uppercase tracking-widest">
        <span className="inline-block h-2 w-2 animate-pulse bg-background" />
        <span>
          {skill ? (
            <>
              <span className="font-bold">{skill}</span>
              <span className="ml-3 opacity-70">// WHERE I USE IT</span>
            </>
          ) : (
            <span className="opacity-70">HOVER A SKILL TO TRACE ITS USAGE</span>
          )}
        </span>
      </div>
      <div className="uppercase tracking-widest">
        {skill ? (
          usedIn ? (
            <span>
              USED IN: <span className="font-bold">{usedIn.join(", ")}</span>
            </span>
          ) : (
            <span className="opacity-70">Core toolchain</span>
          )
        ) : (
          <span className="opacity-70">SKILLS &amp; TECHNOLOGIES</span>
        )}
      </div>
    </div>
  );
}

export default function SkillsMatrix() {
  const [activeFilter, setActiveFilter] = useState<string>(ALL);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const visibleGroups =
    activeFilter === ALL
      ? profile.stack
      : profile.stack.filter((g) => g.title === activeFilter);

  return (
    <section id="stack" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <SectionHeading index="002" title="Stack" />
        </motion.div>

        <div className="flex flex-wrap gap-2">
          {[ALL, ...profile.stack.map((g) => g.title)].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveFilter(label)}
              data-cursor="FILTER"
              className={cn(
                "border border-border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors",
                activeFilter === label
                  ? "border-accent bg-accent text-background"
                  : "text-muted hover:border-accent hover:text-accent"
              )}
            >
              {label === ALL ? "All" : label}
            </button>
          ))}
        </div>

        <div className="mt-12 space-y-12">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleGroups.map((group) => (
              <motion.div
                key={group.id}
                layout
                initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease }}
                className="grid gap-6 border-b border-border pb-10 md:grid-cols-[80px_240px_1fr]"
              >
                <span className="font-mono text-sm text-muted">{group.id}</span>
                <h3 className="text-xl font-semibold">{group.title}</h3>
                <ul className="flex flex-wrap gap-3">
                  {group.items.map((item, i) => {
                    const isHovered = hoveredSkill === item;
                    return (
                      <motion.li
                        key={item}
                        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.4, delay: i * 0.03, ease }}
                        whileHover={reducedMotion ? undefined : { y: -3 }}
                        onMouseEnter={() => setHoveredSkill(item)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        data-cursor="TECH"
                        className={cn(
                          "cursor-default border px-4 py-2 font-mono text-sm transition-colors",
                          isHovered
                            ? "border-accent bg-accent text-background"
                            : "border-border text-muted hover:border-accent hover:text-accent"
                        )}
                      >
                        {item}
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-12">
          <ProvenanceStrip skill={hoveredSkill} />
        </div>
      </div>
    </section>
  );
}
