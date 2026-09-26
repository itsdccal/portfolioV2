"use client";

// Adapted from a MIT-licensed third-party component (Hyperiux Vault pattern,
// refined in the reference portfolio) — physics-based per-letter keyframes.

import { motion, useReducedMotion } from "framer-motion";
import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface DancingLettersProps {
  text: string;
  className?: string;
  letterClassName?: string;
  /** periodic random dances (default true) */
  autoplay?: boolean;
  autoPlayInterval?: number;
  /** delay before the mount ripple wave, ms */
  initialWaveDelay?: number;
}

// Physics-based keyframe sets, one per letter (cycled by index).
const letterAnimations = [
  // 1. Rubber band snap
  {
    active: {
      scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
      scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
    },
    transition: { duration: 0.8, ease: "easeInOut" as const },
    transformOrigin: "center center",
  },
  // 2. Playful twist
  {
    active: {
      rotate: [0, -18, 18, -12, 10, -5, 0],
      y: [0, -6, -14, -8, -2, 0],
      scale: [1, 1.12, 1.1, 1.06, 1.02, 1],
    },
    transition: { duration: 0.85, ease: "easeInOut" as const },
    transformOrigin: "bottom center",
  },
  // 3. Squash and jump
  {
    active: {
      scaleY: [1, 0.65, 1.25, 0.9, 1.05, 1],
      scaleX: [1, 1.25, 0.85, 1.1, 0.98, 1],
      y: [0, 8, -30, -8, 2, 0],
    },
    transition: { duration: 0.75, ease: "easeOut" as const },
    transformOrigin: "bottom center",
  },
  // 4. 3D tumbler flip
  {
    active: {
      rotateY: [0, 180, 360],
      scale: [1, 1.2, 1],
      y: [0, -16, 0],
    },
    transition: { duration: 0.8, ease: "easeInOut" as const },
    transformOrigin: "center center",
  },
  // 5. Elastic slide
  {
    active: {
      x: [0, -16, 14, -8, 4, 0],
      y: [0, -8, 0],
      scale: [1, 1.12, 1],
    },
    transition: { duration: 0.8, ease: "easeInOut" as const },
    transformOrigin: "center center",
  },
  // 6. Impact shake
  {
    active: {
      x: [0, -5, 5, -4, 4, -2, 2, 0],
      y: [0, -3, 3, -2, 2, -1, 1, 0],
      rotate: [0, -3, 3, -2, 2, 0],
    },
    transition: { duration: 0.55, ease: "linear" as const },
    transformOrigin: "center center",
  },
  // 7. Pop & bounce
  {
    active: {
      scale: [1, 1.35, 0.92, 1.08, 1],
      y: [0, -18, 4, -2, 0],
    },
    transition: { duration: 0.65, ease: "easeInOut" as const },
    transformOrigin: "center center",
  },
  // 8. Levitate float
  {
    active: {
      y: [0, -26, 0],
      scale: [1, 1.12, 1],
    },
    transition: { duration: 0.9, ease: "easeInOut" as const },
    transformOrigin: "center center",
  },
];

export default function DancingLetters({
  text,
  className,
  letterClassName,
  autoplay = true,
  autoPlayInterval = 3000,
  initialWaveDelay = 400,
}: DancingLettersProps) {
  const reduce = useReducedMotion();
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const letters = text.split("");
  const lastSwipeIndexRef = useRef<number | null>(null);
  const waveTimersRef = useRef<number[]>([]);

  const triggerDance = useCallback((index: number) => {
    setActiveIndices((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const handleAnimationComplete = useCallback((index: number) => {
    setActiveIndices((prev) => {
      if (!prev.has(index)) return prev;
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }, []);

  // Ripple wave across all letters.
  const triggerFullWave = useCallback(() => {
    waveTimersRef.current.forEach(clearTimeout);
    waveTimersRef.current = letters.map((letter, i) =>
      letter === " "
        ? 0
        : window.setTimeout(() => triggerDance(i), i * 85)
    );
  }, [letters, triggerDance]);

  // Initial ripple on mount (timed to the preloader curtain).
  useEffect(() => {
    if (reduce) return;
    const timer = window.setTimeout(() => {
      setIsLoaded(true);
      triggerFullWave();
    }, initialWaveDelay);
    return () => {
      clearTimeout(timer);
      waveTimersRef.current.forEach(clearTimeout);
    };
  }, [reduce, initialWaveDelay, triggerFullWave]);

  // Periodic playful dances.
  useEffect(() => {
    if (!autoplay || reduce || letters.length === 0) return;
    const interval = window.setInterval(() => {
      const validIndices = letters
        .map((l, i) => (l !== " " ? i : -1))
        .filter((i) => i !== -1);
      if (validIndices.length > 0) {
        const pick =
          validIndices[Math.floor(Math.random() * validIndices.length)];
        triggerDance(pick);
      }
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoplay, reduce, autoPlayInterval, letters, triggerDance]);

  // Touch swipe-to-dance.
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const letterIndexAttr = target?.getAttribute("data-letter-index");
      if (letterIndexAttr !== null && letterIndexAttr !== undefined) {
        const idx = Number(letterIndexAttr);
        if (!isNaN(idx) && idx !== lastSwipeIndexRef.current) {
          lastSwipeIndexRef.current = idx;
          triggerDance(idx);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    lastSwipeIndexRef.current = null;
  };

  // Reduced motion: static letters, no timers.
  if (reduce) {
    return (
      <span className={cn("inline-block select-none", className)}>
        {letters.map((letter, i) =>
          letter === " " ? (
            <span key={`space-${i}`}>&nbsp;</span>
          ) : (
            <span key={`${letter}-${i}`} className={cn("inline-block", letterClassName)}>
              {letter}
            </span>
          )
        )}
      </span>
    );
  }

  return (
    <motion.span
      className={cn(
        "inline-flex select-none touch-manipulation flex-wrap justify-center",
        className
      )}
      style={{ perspective: "1000px" }}
      initial="hidden"
      animate="visible"
      onClick={triggerFullWave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.05 },
        },
      }}
    >
      {letters.map((letter, id) => {
        if (letter === " ") {
          return (
            <span
              key={`space-${id}`}
              className="inline-block w-[0.28em] select-none"
            >
              &nbsp;
            </span>
          );
        }
        const anim = letterAnimations[id % letterAnimations.length];
        const isActive = activeIndices.has(id);

        return (
          <motion.span
            key={`${letter}-${id}`}
            data-letter-index={id}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.8 },
              visible: {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scaleX: 1,
                scaleY: 1,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              },
              active: {
                ...anim.active,
                opacity: 1,
                transition: anim.transition,
              },
            }}
            animate={isActive ? "active" : isLoaded ? "visible" : undefined}
            onHoverStart={() => {
              if (!isActive) triggerDance(id);
            }}
            onClick={(e) => {
              e.stopPropagation();
              triggerDance(id);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              triggerDance(id);
            }}
            onAnimationComplete={(definition) => {
              if (definition === "active") handleAnimationComplete(id);
            }}
            className={cn(
              "relative inline-block will-change-transform",
              letterClassName,
              isActive ? "z-10" : "z-0"
            )}
            style={{
              transformOrigin: anim.transformOrigin,
              transformStyle: "preserve-3d",
              touchAction: "manipulation",
            }}
          >
            {letter}
          </motion.span>
        );
      })}
    </motion.span>
  );
}
