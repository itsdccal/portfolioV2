"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Learn.", "Build.", "Inspire."];

// Words appear one by one (450ms stagger), hold, then curtain lifts.
const LIFT_DELAY = 2.8;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.45, delayChildren: 0.3 },
  },
};

const wordVariants = {
  hidden: { y: "110%" },
  show: {
    y: 0,
    transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] as const },
  },
};

export default function Preloader() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLifted(true), LIFT_DELAY * 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = lifted ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lifted]);

  return (
    <AnimatePresence>
      {!lifted && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <span className="absolute left-6 top-6 font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Portfolio
          </span>

          <motion.div
            className="flex flex-wrap justify-center gap-x-4 px-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {words.map((word) => (
              <span key={word} className="overflow-hidden pb-2">
                <motion.span
                  variants={wordVariants}
                  className="block font-serif text-5xl italic tracking-tight md:text-7xl"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.div>

          <div className="absolute inset-x-0 bottom-0 h-px bg-border">
            <motion.div
              className="h-full w-full origin-left bg-foreground"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.4, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
