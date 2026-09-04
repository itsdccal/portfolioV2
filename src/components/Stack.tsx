"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { profile } from "@/data/profile";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const groupVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

export default function Stack() {
  return (
    <section id="stack" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <SectionHeading index="002" title="Stack" />
        </motion.div>

        <div className="space-y-12">
          {profile.stack.map((group, gi) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: gi * 0.08, ease }}
              className="grid gap-6 border-b border-border pb-10 md:grid-cols-[80px_240px_1fr]"
            >
              <span className="font-mono text-sm text-muted">{group.id}</span>
              <h3 className="text-xl font-semibold">{group.title}</h3>
              <motion.ul
                variants={groupVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className="flex flex-wrap gap-3"
              >
                {group.items.map((item) => (
                  <motion.li
                    key={item}
                    variants={itemVariants}
                    whileHover={{ y: -3 }}
                    className="cursor-default border border-border px-4 py-2 font-mono text-sm text-muted transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
