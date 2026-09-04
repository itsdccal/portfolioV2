"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { profile } from "@/data/profile";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export default function Roadmap() {
  return (
    <section id="roadmap" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <SectionHeading index="004" title="Roadmap" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mb-12 max-w-lg text-muted"
        >
          A timeline of the experiences and technologies I&apos;ve picked up
          along my software journey.
        </motion.p>

        <div className="space-y-0">
          {profile.roadmap.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.05, ease }}
              className="group grid gap-4 border-b border-border py-10 transition-colors md:grid-cols-[80px_120px_1fr_120px] md:gap-8"
            >
              <span className="font-mono text-sm text-muted">{item.id}</span>

              <motion.h3
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.1, ease }}
                className="text-3xl font-bold tracking-tight md:text-4xl"
              >
                {item.year}
              </motion.h3>

              <div>
                <h4 className="mb-2 text-lg font-semibold">{item.title}</h4>
                <p className="max-w-2xl leading-relaxed text-muted">
                  {item.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border border-border px-2 py-1 font-mono text-xs text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <span className="hidden text-right font-mono text-5xl font-bold text-border transition-colors duration-500 group-hover:text-muted md:block">
                {item.shortYear}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
