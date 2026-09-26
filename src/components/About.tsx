"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import StackSpread, { type StackSpreadItem } from "./ui/stack-spread";
import { profile } from "@/data/profile";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

// Eight cards mirroring the reference spread: every project gets a card with
// its real screenshot (full color), plus three portrait/place cards.
const CARD_DEFS: StackSpreadItem[] = [
  { label: "FULL STACK", target: "#stack", image: "/images/about/about-1.jpg", alt: `${profile.name} — graduation portrait` },
  { label: "SCM RECRUIT", target: "#projects", image: "/images/projects/hr.jpg", alt: "SCM Recruitment project" },
  { label: "SEKELAS", target: "#projects", image: "/images/projects/sekelas.jpg", alt: "Sekelas learning platform project" },
  { label: "METRIKGO", target: "#projects", image: "/images/projects/metrik-go.jpg", alt: "MetrikGo project" },
  { label: "LAB MS", target: "#projects", image: "/images/projects/silab.jpg", alt: "Lab Management System project" },
  { label: "INT'L CLASS", target: "#projects", image: "/images/projects/international-class.jpg", alt: "International Class project" },
  { label: "UNIVERSITY", target: "#roadmap", image: "/images/about/about-2.jpg", alt: `${profile.name} — graduation portrait` },
  { label: "MAKASSAR", target: "#contact", image: "/images/about/about-3.jpg", alt: `${profile.name} — graduation portrait` },
];

function Manifesto() {
  return (
    <>
      <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
        [001] — Manifesto
      </div>
      <h3 className="mt-4 max-w-2xl text-xl font-semibold leading-snug md:text-2xl">
        I&apos;m a Full Stack Developer focused on building clean and
        sustainable systems.
      </h3>
      <div className="mt-5 max-w-2xl space-y-3.5 text-left text-sm leading-relaxed md:text-base">
        {profile.about.map((paragraph, i) => (
          <p key={i} className="text-muted">
            {paragraph}
          </p>
        ))}
      </div>
    </>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <SectionHeading index="001" title="About" />
        </motion.div>

        {/* Mobile: manifesto in flow — the sticky spread below is cards-only
            on small screens, where the central copy would be covered. */}
        <div className="-mt-8 mb-12 md:hidden">
          <Manifesto />
        </div>
      </div>

      <StackSpread items={CARD_DEFS}>
        <Manifesto />
      </StackSpread>
    </section>
  );
}
