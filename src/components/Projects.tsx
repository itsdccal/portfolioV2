"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { profile } from "@/data/profile";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <SectionHeading index="003" title="Projects" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mb-16 max-w-lg text-muted"
        >
          Real systems I&apos;ve designed and shipped — from campus laboratory
          operations to production business software.
        </motion.p>

        <div className="space-y-16 md:space-y-24">
          {profile.projects.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.05, ease }}
              className="group grid overflow-hidden border border-border transition-colors hover:border-muted md:grid-cols-2"
            >
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative flex min-h-[280px] flex-col justify-between overflow-hidden border-border bg-border/10 p-8 transition-colors group-hover:bg-border/20 md:min-h-[380px] md:p-10 ${
                  i % 2 === 1 ? "md:order-2 md:border-l" : "md:border-r"
                }`}
              >
                {/* Typographic panel instead of a screenshot */}
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted">
                    {project.category}
                  </span>
                  <span className="font-mono text-xs text-muted">{project.year}</span>
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute -bottom-8 -left-2 select-none text-[10rem] font-bold leading-none tracking-tighter text-border/60 transition-colors duration-500 group-hover:text-border md:text-[13rem]">
                    {project.id}
                  </span>
                  <span className="relative block max-w-[16ch] text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                    {project.title}
                  </span>
                  <span className="relative mt-2 block font-mono text-xs text-muted">
                    {project.tagline}
                  </span>
                </div>

                <span className="absolute bottom-6 right-8 font-mono text-xs uppercase tracking-widest text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  View repo ↗
                </span>
              </a>

              <div className={`flex flex-col p-8 md:p-12 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                <p className="flex-1 text-sm leading-relaxed text-muted md:text-base">
                  {project.description}
                </p>

                <ul className="mt-6 space-y-2">
                  {project.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 text-sm text-foreground/90"
                    >
                      <span className="mt-[2px] text-muted">→</span>
                      {h}
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border border-border px-2 py-1 font-mono text-xs text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex items-center gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} on GitHub`}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    <GithubIcon />
                  </a>
                  <a
                    href={`${project.github}#readme`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} details`}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    <ArrowIcon />
                  </a>
                  <span className="ml-auto font-mono text-xs uppercase tracking-widest text-muted">
                    {project.id} / 0{profile.projects.length}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
