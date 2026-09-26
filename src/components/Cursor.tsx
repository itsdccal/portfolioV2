"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.6 });

  useEffect(() => {
    // Only on devices with a fine pointer (mouse), not touch.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    // Reduced motion: keep the native cursor.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest) return;
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setHovering(true);
        setLabel(labelled.getAttribute("data-cursor"));
        return;
      }
      setLabel(null);
      setHovering(
        !!target.closest("a, button, [role='button'], input, textarea, select, label")
      );
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  const labelled = hovering && label;

  return (
    <>
      {/* Center dot — follows instantly, inverts the backdrop */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[200] h-2 w-2 rounded-full bg-foreground mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: pressed ? 0.5 : labelled ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />

      {/* Trailing ring — follows with a spring; grows on hover.
          Blend only applies to this circle, never to the label chip. */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[199] rounded-full mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: pressed ? 0.8 : hovering ? 1.6 : 1,
          opacity: hovering ? 1 : 0.5,
        }}
        transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div
          className={`h-10 w-10 rounded-full transition-colors duration-200 ${
            hovering && !labelled
              ? "border border-foreground bg-foreground/15"
              : "border border-foreground/60"
          }`}
        />
      </motion.div>

      {/* Context label pill — solid accent, unblended so it stays readable
          over any backdrop (the blend above would distort its color). */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[201] flex items-center justify-center"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: labelled ? 1 : 0.5,
          opacity: labelled ? 1 : 0,
        }}
        transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div className="flex h-9 items-center justify-center whitespace-nowrap rounded-full bg-accent px-4 shadow-lg shadow-accent/20">
          <span className="select-none font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-background">
            {label}
          </span>
        </div>
      </motion.div>
    </>
  );
}
