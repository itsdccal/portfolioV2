"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { profile } from "@/data/profile";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const channels = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
  },
  {
    label: "LinkedIn",
    value: "andimuhhaikal ↗",
    href: profile.linkedin,
    external: true,
  },
  {
    label: "Phone / WhatsApp",
    value: profile.phone,
    href: `tel:${profile.phone}`,
    external: false,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <SectionHeading index="005" title="Contact" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mb-12 max-w-lg text-lg text-muted"
        >
          Whether we start fresh to bring a project to life or take an existing
          system further — let&apos;s talk.
        </motion.p>

        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {channels.map((channel, i) => (
            <motion.div
              key={channel.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              whileHover={{ y: -6 }}
              className="h-full"
            >
              <a
                href={channel.href}
                {...(channel.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex h-full flex-col bg-background p-8 transition-colors hover:bg-border/30"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-muted">
                  {channel.label}
                </span>
                <span className="mt-4 break-all text-lg font-semibold transition-transform group-hover:translate-x-1">
                  {channel.value}
                </span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
