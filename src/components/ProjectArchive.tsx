"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
      className={cn("transition-transform duration-200", open && "rotate-180")}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export default function ProjectArchive() {
  const archive = profile.archive;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(archive.map((p) => p.category))),
    [archive]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return archive.filter((p) => {
      const matchesFilter = filter === "ALL" || p.category === filter;
      const matchesQuery =
        q === "" ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesFilter && matchesQuery;
    });
  }, [archive, query, filter]);

  // Archive section stays hidden until secondary projects are added to profile.archive.
  if (archive.length === 0) return null;

  return (
    <section id="archive" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <SectionHeading index="004" title="Archive" />
        </motion.div>

        {/* Controls: live search + category pills */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex items-center md:w-72">
            <span className="absolute left-3 text-muted">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH PROJECTS..."
              aria-label="Search archive projects"
              className="w-full border border-border bg-background py-2 pl-9 pr-4 font-mono text-xs uppercase tracking-widest text-foreground placeholder:text-muted focus:border-foreground focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-px border border-border bg-border">
            {["ALL", ...categories].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                data-cursor
                className={cn(
                  "px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors",
                  filter === cat
                    ? "bg-foreground text-background"
                    : "bg-background text-muted hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Card grid */}
        <div className="grid gap-px border border-border bg-border md:grid-cols-2">
          {filtered.map((project, i) => {
            const isExpanded = expandedId === project.id;
            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease }}
                className="flex flex-col bg-background p-8"
              >
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-muted">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>{project.year}</span>
                </div>

                <h3 className="mt-4 text-2xl font-bold tracking-tight">
                  {project.title}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
                  {project.category}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>

                {/* Expandable detail drawer */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 border-t border-border pt-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-muted">
                          // Tags
                        </span>
                        <div className="mt-3 flex flex-wrap gap-px bg-border">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-border/40 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : project.id)}
                    data-cursor
                    className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-foreground"
                  >
                    <span>{isExpanded ? "Less" : "Details"}</span>
                    <ChevronDownIcon open={isExpanded} />
                  </button>

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor
                      className="flex items-center gap-2 border border-foreground px-4 py-2 font-mono text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
                    >
                      <GithubIcon />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="border border-t-0 border-border py-10 text-center font-mono text-xs uppercase tracking-widest text-muted">
            No projects match your search.
          </p>
        )}
      </div>
    </section>
  );
}
