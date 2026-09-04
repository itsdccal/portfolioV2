"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Parallax from "./Parallax";
import SectionHeading from "./SectionHeading";
import { profile } from "@/data/profile";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export default function About() {
  return (
    <section id="about" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <SectionHeading index="001" title="About" />
        </motion.div>

        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            whileInView={{ clipPath: "inset(0 0 0% 0)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease }}
            className="relative aspect-[4/5] overflow-hidden border border-border"
          >
            <motion.div
              initial={{ scale: 1.15 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.4, ease }}
              className="h-full w-full"
            >
              <Parallax speed={6} className="h-full w-full">
                <Image
                  src="/images/sitting.jpg"
                  alt={profile.name}
                  fill
                  className="scale-110 object-cover grayscale"
                />
              </Parallax>
            </motion.div>
          </motion.div>

          <div>
            <motion.h3
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="text-2xl font-semibold leading-snug md:text-3xl"
            >
              I&apos;m a Full Stack Developer focused on building clean and
              sustainable systems.
            </motion.h3>

            <div className="mt-8 space-y-5">
              {profile.about.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease }}
                  className="leading-relaxed text-muted"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
