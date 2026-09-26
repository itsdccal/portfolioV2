"use client";

// Adapted from a MIT-licensed third-party component (Hyperiux Vault pattern)
// — cards start as a rotated cluster and spread with scroll, then gain
// pointer parallax; clicking a card smooth-scrolls to its target section.

import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StackSpreadItem {
  image: string;
  label: string;
  target: string;
  alt?: string;
}

interface SpreadTarget {
  x: number; // vw from center
  y: number; // vh from center
  rotate: number;
  w: number; // vw
  h: number; // vh
}

// Hand-tuned desktop spread (8 cards) around the central manifesto.
const DESKTOP_TARGETS: SpreadTarget[] = [
  { x: -26, y: -32, rotate: -2, w: 16, h: 26 },
  { x: 28, y: -30, rotate: 2, w: 19, h: 30 },
  { x: -36, y: 0, rotate: -2, w: 15, h: 29 },
  { x: 6, y: -34, rotate: 1.5, w: 20, h: 23 },
  { x: 36, y: 4, rotate: 2, w: 17, h: 29 },
  { x: -26, y: 33, rotate: -2, w: 20, h: 23 },
  { x: 2, y: 36, rotate: 1, w: 18, h: 23 },
  { x: 28, y: 33, rotate: -1.5, w: 16, h: 23 },
];

// Clustered offsets/rotations per stack position (back -> front).
const STACK_OFFSETS = [
  { x: -8, y: -8, r: -16 },
  { x: 10, y: -9, r: 18 },
  { x: -13, y: 0, r: -5 },
  { x: 1, y: -9, r: -2 },
  { x: 14, y: 1, r: 6 },
  { x: -5, y: 8, r: 5 },
  { x: 7, y: 6, r: 3 },
  { x: 16, y: 10, r: -7 },
];

function desktopTarget(index: number, total: number): SpreadTarget {
  if (total === DESKTOP_TARGETS.length) return DESKTOP_TARGETS[index];
  // Fallback ring layout for any other card count.
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Math.cos(angle) * 30,
    y: Math.sin(angle) * 32,
    rotate: Math.sin(angle * 2) * 2,
    w: 17,
    h: 26,
  };
}

function stackPose(index: number) {
  return STACK_OFFSETS[index % STACK_OFFSETS.length];
}

// Mobile: two columns, rows spaced down the viewport.
function smallTarget(index: number, total: number): SpreadTarget {
  const col = index % 2 === 0 ? -22 : 22; // vw
  const rows = Math.ceil(total / 2);
  const rowHeight = 76 / Math.max(rows, 1);
  const row = Math.floor(index / 2);
  const y = -38 + rowHeight * row + rowHeight / 2;
  return { x: col, y, rotate: 0, w: 40, h: rowHeight * 0.72 };
}

const SCATTER_END = 0.52;
const PARALLAX_X = 2.6;
const PARALLAX_Y = 2.2;
const PARALLAX_SPRING = { stiffness: 90, damping: 22, mass: 0.6 };
const parallaxDepth = (i: number, total: number) =>
  total <= 1 ? 1 : 0.55 + (i / (total - 1)) * 0.75;

function useIsSmall() {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const read = () => setSmall(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  return small;
}

function usePointerParallax(active: boolean, enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, PARALLAX_SPRING);
  const y = useSpring(rawY, PARALLAX_SPRING);

  useEffect(() => {
    if (!enabled) return;
    if (!active) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [active, enabled, rawX, rawY]);

  return { x, y };
}

function scrollToTarget(target: string) {
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4 });
    return;
  }
  document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}

function SpreadCard({
  item,
  index,
  total,
  progress,
  flat,
  isSmall,
  stackScale,
  pointer,
  depth,
}: {
  item: StackSpreadItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  flat: boolean;
  isSmall: boolean;
  stackScale: number;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  depth: number;
}) {
  const target = isSmall
    ? smallTarget(index, total)
    : desktopTarget(index, total);
  const pose = stackPose(index);
  const stackRotate = flat ? 0 : pose.r;
  const endRotate = flat || isSmall ? 0 : target.rotate;

  const translate = useTransform(
    [progress, pointer.x, pointer.y],
    ([p, px, py]: number[]) => {
      const tx = pose.x + (target.x - pose.x) * p - px * PARALLAX_X * depth * p;
      const ty = pose.y + (target.y - pose.y) * p - py * PARALLAX_Y * depth * p;
      return `calc(-50% + ${tx}vw) calc(-50% + ${ty}vh)`;
    }
  );
  const rotate = useTransform(progress, [0, 1], [stackRotate, endRotate]);
  const scale = useTransform(progress, [0, 1], [stackScale, 1]);

  return (
    <motion.div
      className="pointer-events-auto absolute left-1/2 top-1/2 will-change-transform"
      style={{
        width: `${target.w}vw`,
        height: `${target.h}vh`,
        zIndex: index + 2,
        translate,
        rotate,
        scale,
      }}
    >
      <a
        href={item.target}
        aria-label={`${item.label} — jump to section`}
        data-cursor="GO"
        onClick={(e) => {
          e.preventDefault();
          scrollToTarget(item.target);
        }}
        className="group relative block h-full w-full overflow-hidden border border-border bg-background shadow-2xl transition-colors duration-300 hover:border-foreground"
      >
        <Image
          src={item.image}
          alt={item.alt ?? item.label}
          fill
          sizes="(max-width: 768px) 40vw, 22vw"
          draggable={false}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-border bg-background/90 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-muted transition-colors group-hover:text-foreground">
          <span className="truncate">{item.label}</span>
          <span className="ml-1 shrink-0">↗</span>
        </div>
      </a>
    </motion.div>
  );
}

export default function StackSpread({
  items,
  children,
  className,
}: {
  items: StackSpreadItem[];
  children: ReactNode;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isSmall = useIsSmall();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const progress = useTransform(
    scrollYProgress,
    [0, SCATTER_END, 1],
    [0, 1, 1]
  );

  const [spread, setSpread] = useState(false);
  useMotionValueEvent(progress, "change", (p) => {
    setSpread((was) => (was ? p > 0.9 : p >= 0.95));
  });

  const parallaxEnabled = reduce !== true && !isSmall;
  const pointer = usePointerParallax(spread, parallaxEnabled);

  const flat = reduce === true;
  const copyOpacity = useTransform(
    progress,
    [0, 0.4],
    [isSmall ? 0.85 : 0.25, 1]
  );
  const copyScale = useTransform(progress, [0, 0.5], [0.92, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const scrollLength = isSmall ? 110 : 150;

  return (
    <div
      ref={wrapRef}
      className={cn("relative w-full", className)}
      style={{ height: `${scrollLength}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Central manifesto reveal — desktop only; on small screens the
            cards are the focus and the copy renders in flow above (About). */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[5] hidden flex-col items-center justify-center px-6 text-center select-none md:flex"
          style={{
            opacity: copyOpacity,
            scale: flat ? 1 : copyScale,
          }}
        >
          {children}
        </motion.div>

        {/* Scattering cards */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {items.map((item, i) => (
            <SpreadCard
              key={`${item.label}-${i}`}
              item={item}
              index={i}
              total={items.length}
              progress={progress}
              flat={flat}
              isSmall={isSmall}
              stackScale={0.82}
              pointer={pointer}
              depth={parallaxEnabled ? parallaxDepth(i, items.length) : 0}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-[4vh] z-20 flex flex-col items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-muted"
          style={{ opacity: hintOpacity }}
        >
          <span className="text-foreground">Scroll to spread</span>
          <span className="animate-bounce">↓</span>
        </motion.div>
      </div>
    </div>
  );
}
