"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const QUOTES = profile.introQuotes;
const EXIT_THRESHOLD = 150; // accumulated wheel delta to trigger "enter"
const TOUCH_THRESHOLD = 80; // px of upward swipe to trigger "enter"
const LOCATION = profile.location.toUpperCase();

interface HeadTransform {
  rotX: number;
  rotY: number;
  rotZ: number;
  transX: number;
  transY: number;
  scale: number;
}

const IDLE_TRANSFORM: HeadTransform = {
  rotX: 0,
  rotY: 0,
  rotZ: 0,
  transX: 0,
  transY: 0,
  scale: 1,
};

export default function IntroLoader() {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  const isExiting = useRef(false);
  const openCooldownRef = useRef(0);
  const hasOpenedRef = useRef(false);
  const hasEnteredOnceRef = useRef(false);

  // Interactive states
  const [soundOn, setSoundOn] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [speech, setSpeech] = useState<string | null>(null);
  const [speechIndex, setSpeechIndex] = useState(0);
  const [scrollPull, setScrollPull] = useState(0);
  const [headTransform, setHeadTransform] = useState<HeadTransform>(IDLE_TRANSFORM);
  // 3D cutout avatar: optimistic — if /images/dccal-avatar-3d.png is missing the
  // img onError flips us back to the framed photo automatically.
  const [avatar3d, setAvatar3d] = useState(true);

  // Physics refs for the RAF spring loop
  const mouseTarget = useRef({ x: 0.5, y: 0.5 });
  const currentTransform = useRef<HeadTransform>({ ...IDLE_TRANSFORM });
  const clickBounce = useRef(1);

  // Web Audio — context is only created from user-gesture handlers
  const audioCtxRef = useRef<AudioContext | null>(null);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInteractRef = useRef(0);
  const avatarTouchRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const playSfx = useCallback(
    (type: "ping" | "click" | "enter") => {
      if (!soundOn) return;
      try {
        if (!audioCtxRef.current) {
          const AC =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext })
              .webkitAudioContext;
          if (!AC) return;
          audioCtxRef.current = new AC();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") void ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime;

        if (type === "click") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(587.33, t); // D5
          osc.frequency.exponentialRampToValueAtTime(880, t + 0.1); // A5
          gain.gain.setValueAtTime(0.08, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
          osc.start();
          osc.stop(t + 0.22);
        } else if (type === "ping") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(659.25, t); // E5
          osc.frequency.exponentialRampToValueAtTime(987.77, t + 0.14); // B5
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
          osc.start();
          osc.stop(t + 0.25);
        } else {
          osc.type = "sine";
          osc.frequency.setValueAtTime(329.63, t);
          osc.frequency.exponentialRampToValueAtTime(164.81, t + 0.45);
          gain.gain.setValueAtTime(0.09, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
          osc.start();
          osc.stop(t + 0.5);
        }

        osc.connect(gain);
        gain.connect(ctx.destination);
      } catch {
        // Audio unsupported or blocked — stay silent
      }
    },
    [soundOn]
  );

  // ----- Open transition: runs every time isOpen flips to true -----
  useEffect(() => {
    if (!isOpen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    if (!container) return;

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    // Freeze Lenis while the intro covers the page (retry for mount ordering).
    window.__lenis?.stop();
    window.__lenis?.scrollTo(0, { immediate: true });
    const retry = setTimeout(() => {
      window.__lenis?.stop();
      window.__lenis?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }, 60);
    window.scrollTo(0, 0);

    isExiting.current = true;
    openCooldownRef.current = Date.now() + 850;
    container.style.visibility = "visible";
    container.style.pointerEvents = "auto";

    let tl: gsap.core.Timeline | undefined;
    let slideTween: gsap.core.Tween | undefined;

    if (hasOpenedRef.current) {
      // Recall: slide down from above the viewport.
      slideTween = gsap.fromTo(
        container,
        { yPercent: -100 },
        {
          yPercent: 0,
          duration: 0.75,
          ease: "power4.out",
          onComplete: () => {
            window.scrollTo(0, 0);
            window.__lenis?.scrollTo(0, { immediate: true });
            playSfx("click");
            isExiting.current = false;
            setScrollPull(0);
          },
        }
      );
    } else {
      // First open: staggered entrance.
      hasOpenedRef.current = true;
      tl = gsap.timeline({ onComplete: () => (isExiting.current = false) });
      tl.fromTo(
        textGroupRef.current,
        { scale: 0.9, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
      tl.fromTo(
        frameRef.current,
        { scale: 0.7, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.4)" },
        "-=0.5"
      );
      tl.fromTo(
        bottomBarRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );
    }

    // ----- Scroll / touch / keyboard interception while open -----
    let accumulatedDelta = 0;
    let decayTimer: ReturnType<typeof setTimeout>;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // always block native scroll while the intro is up
      if (isExiting.current || Date.now() < openCooldownRef.current) return;

      // Only DOWNWARD input fills the "ENTERING" meter.
      if (e.deltaY <= 0) {
        accumulatedDelta = 0;
        setScrollPull(0);
        return;
      }

      accumulatedDelta += e.deltaY;
      clearTimeout(decayTimer);
      decayTimer = setTimeout(() => {
        accumulatedDelta = 0;
        setScrollPull(0);
      }, 350);

      setScrollPull(Math.min(100, Math.round((accumulatedDelta / EXIT_THRESHOLD) * 100)));

      if (accumulatedDelta >= EXIT_THRESHOLD) {
        clearTimeout(decayTimer);
        accumulatedDelta = 0;
        setScrollPull(100);
        exitIntro();
      }
    };

    let touchStartY = 0;
    let touchStartX = 0;
    let isTouchOnAvatar = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        const target = e.target as HTMLElement | null;
        isTouchOnAvatar = !!target?.closest("[data-avatar-interactive]");
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Touches that began on the avatar are avatar gestures, not dismissal.
      if (isTouchOnAvatar) return;
      if (isExiting.current || Date.now() < openCooldownRef.current) return;
      if (e.touches.length === 0) return;

      const diffY = touchStartY - e.touches[0].clientY;
      const diffX = Math.abs(touchStartX - e.touches[0].clientX);

      if (diffY > 10 && diffY > diffX) e.preventDefault();
      if (diffY <= 0) {
        setScrollPull(0);
        return;
      }

      setScrollPull(Math.min(100, Math.round((diffY / TOUCH_THRESHOLD) * 100)));
      if (diffY > TOUCH_THRESHOLD) {
        setScrollPull(100);
        exitIntro();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isExiting.current || Date.now() < openCooldownRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        exitIntro();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(retry);
      clearTimeout(decayTimer);
      tl?.kill();
      slideTween?.kill();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, playSfx]);

  // ----- Exit: animate the cover away, then re-enable Lenis -----
  const exitIntro = useCallback(() => {
    const container = containerRef.current;
    if (!container || isExiting.current) return;

    isExiting.current = true;
    playSfx("enter");

    window.__lenis?.stop();
    window.__lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    gsap.to(container, {
      yPercent: -100,
      duration: 0.75,
      ease: "power4.inOut",
      onComplete: () => {
        container.style.pointerEvents = "none";
        container.style.visibility = "hidden";
        window.scrollTo(0, 0);
        window.__lenis?.scrollTo(0, { immediate: true });
        window.__lenis?.start();
        ScrollTrigger.refresh();
        isExiting.current = false;
        hasEnteredOnceRef.current = true;
        setIsOpen(false);
        window.dispatchEvent(new CustomEvent("intro:entered"));
      },
    });
  }, [playSfx]);

  // ----- Initial open -----
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setIsOpen(true);
  }, []);

  // ----- Recall: deliberate scroll-up at the very top brings the intro back -----
  useEffect(() => {
    if (isOpen || !hasEnteredOnceRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastTriggerTime = 0;
    let accumulatedUpDelta = 0;
    let resetTimer: ReturnType<typeof setTimeout>;

    const handleWheel = (e: WheelEvent) => {
      const scrollY = window.scrollY || window.__lenis?.scroll || 0;
      if (scrollY <= 6 && e.deltaY < 0) {
        if (Date.now() - lastTriggerTime < 1000) return;
        accumulatedUpDelta += Math.abs(e.deltaY);
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => (accumulatedUpDelta = 0), 350);

        if (accumulatedUpDelta > 30 || e.deltaY < -30) {
          e.preventDefault();
          accumulatedUpDelta = 0;
          lastTriggerTime = Date.now();
          setIsOpen(true);
        }
      } else {
        accumulatedUpDelta = 0;
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const scrollY = window.scrollY || 0;
      if (scrollY <= 4 && e.touches.length > 0) {
        if (e.touches[0].clientY - touchStartY > 40) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      clearTimeout(resetTimer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isOpen]);

  // ----- Avatar spring physics (3D tilt following the pointer) -----
  useEffect(() => {
    if (!isOpen) return;
    let animId = 0;

    const updatePhysics = () => {
      const cur = currentTransform.current;
      const mouse = mouseTarget.current;

      const targetRotY = (mouse.x - 0.5) * 40;
      const targetRotX = -(mouse.y - 0.5) * 28;
      const targetRotZ = (mouse.x - 0.5) * 8;
      const targetTransX = (mouse.x - 0.5) * 30;
      const targetTransY = (mouse.y - 0.5) * 20;
      const targetScale = (hovered ? 1.06 : 1) * clickBounce.current;

      cur.rotX += (targetRotX - cur.rotX) * 0.1;
      cur.rotY += (targetRotY - cur.rotY) * 0.1;
      cur.rotZ += (targetRotZ - cur.rotZ) * 0.1;
      cur.transX += (targetTransX - cur.transX) * 0.09;
      cur.transY += (targetTransY - cur.transY) * 0.09;
      cur.scale += (targetScale - cur.scale) * 0.14;
      clickBounce.current += (1 - clickBounce.current) * 0.15;

      setHeadTransform({
        rotX: cur.rotX,
        rotY: cur.rotY,
        rotZ: cur.rotZ,
        transX: cur.transX,
        transY: cur.transY,
        scale: cur.scale,
      });

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);

    const handleMouseMove = (e: MouseEvent) => {
      mouseTarget.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseTarget.current = {
          x: e.touches[0].clientX / window.innerWidth,
          y: e.touches[0].clientY / window.innerHeight,
        };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("touchmove", handleTouch, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("touchmove", handleTouch);
    };
  }, [isOpen, hovered]);

  // ----- Avatar click / tap reaction: bounce + rotating speech bubble -----
  const triggerAvatarReaction = useCallback(() => {
    const now = Date.now();
    if (now - lastInteractRef.current < 250) return;
    lastInteractRef.current = now;

    playSfx("click");
    clickBounce.current = 1.22;

    setHovered(true);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setHovered(false), 1200);

    const nextPhrase = QUOTES[speechIndex % QUOTES.length];
    setSpeech(nextPhrase);
    setSpeechIndex((prev) => prev + 1);

    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => {
      setSpeech((curr) => (curr === nextPhrase ? null : curr));
    }, 3200);
  }, [playSfx, speechIndex]);

  useEffect(
    () => () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    },
    []
  );

  const handleAvatarTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      avatarTouchRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
      setHovered(true);
    }
  };

  const handleAvatarTouchEnd = (e: React.TouchEvent) => {
    if (!avatarTouchRef.current) return;
    const touch = e.changedTouches[0];
    if (touch) {
      const dx = Math.abs(touch.clientX - avatarTouchRef.current.x);
      const dy = Math.abs(touch.clientY - avatarTouchRef.current.y);
      const dt = Date.now() - avatarTouchRef.current.time;
      // Clean tap: under 25px travel within 650ms.
      if (dx < 25 && dy < 25 && dt < 650) {
        e.preventDefault();
        e.stopPropagation();
        triggerAvatarReaction();
      }
    }
    avatarTouchRef.current = null;
  };

  // Never opened and currently closed (initial state / reduced motion):
  // render nothing. Must not depend on `window` — server and first client
  // render must produce identical markup for hydration.
  if (!isOpen && !hasOpenedRef.current) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[95] flex select-none flex-col justify-between overflow-hidden border-b border-border bg-background p-4 sm:p-10 md:p-14"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome — scroll to explore the portfolio"
    >
      {/* Background architectural vertical hairlines */}
      <div className="pointer-events-none absolute inset-0 flex justify-between opacity-[0.05]">
        <div className="h-full w-px bg-foreground" />
        <div className="hidden h-full w-px bg-foreground sm:block" />
        <div className="hidden h-full w-px bg-foreground lg:block" />
        <div className="h-full w-px bg-foreground" />
      </div>

      {/* Radial atmosphere — large blurred accent wash behind the stage */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="pointer-events-none h-[520px] w-[520px] rounded-full bg-accent/[0.07] blur-[120px] sm:h-[760px] sm:w-[760px]" />
      </div>

      {/* Top telemetry bar */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-2 font-mono text-xs uppercase tracking-widest text-muted">
        <div className="flex items-center gap-2 border border-border bg-foreground/[0.04] px-3 py-1.5 backdrop-blur-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/portrait.jpg"
            alt=""
            className="h-5 w-5 rounded-full border border-border object-cover grayscale"
          />
          <span className="text-xs normal-case tracking-normal text-foreground">
            {profile.name}
          </span>
          <span className="ml-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              if (next) playSfx("ping");
            }}
            className="flex cursor-pointer items-center gap-1.5 border border-border bg-foreground/[0.04] px-3 py-1.5 text-[11px] text-muted transition-colors hover:bg-foreground/[0.08] hover:text-accent"
            title="Toggle interactive audio feedback"
            aria-label="Toggle interactive audio feedback"
            data-cursor="AUDIO"
          >
            {soundOn ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 text-foreground"
              >
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 5.5a9.5 9.5 0 0 1 0 13" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 text-muted"
              >
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <line x1="22" y1="9" x2="16" y2="15" />
                <line x1="16" y1="9" x2="22" y2="15" />
              </svg>
            )}
            <span className="hidden sm:inline">{soundOn ? "SFX ON" : "SFX MUTED"}</span>
          </button>

          <span className="hidden border border-border px-3 py-1.5 text-[11px] text-muted sm:inline-block">
            {LOCATION}
          </span>
        </div>
      </div>

      {/* Center stage: oversized type + spring-physics portrait frame */}
      <div className="relative z-10 mx-auto my-auto flex w-full max-w-7xl flex-col items-center justify-center py-8 sm:py-12">
        <div
          ref={textGroupRef}
          className="pointer-events-none relative flex w-full select-none flex-col items-center justify-center px-4 text-center leading-[0.9]"
        >
          <h1 className="select-none break-words font-display text-[clamp(3rem,13vw,12rem)] uppercase leading-[0.85] tracking-[-0.02em] text-foreground">
            WELCOME
          </h1>
          <h2 className="mt-1 break-words font-display text-[clamp(2rem,9vw,8rem)] uppercase leading-[0.85] tracking-[-0.02em] text-accent sm:-mt-2 md:-mt-4">
            LET&rsquo;S EXPLORE
          </h2>
        </div>

        {/* Interactive portrait — mono frame with invert corner accents */}
        <div
          data-avatar-interactive="true"
          className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer touch-manipulation flex-col items-center justify-center select-none"
          style={{ perspective: "750px" }}
          onClick={(e) => {
            e.stopPropagation();
            triggerAvatarReaction();
          }}
          onTouchStart={handleAvatarTouchStart}
          onTouchEnd={handleAvatarTouchEnd}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          data-cursor="TAP"
        >
          {/* Rotating speech bubble (invert) */}
          {speech && (
            <div className="pointer-events-none absolute -top-16 z-30 max-w-[260px] animate-bounce border border-accent bg-accent px-4 py-2 text-center font-mono text-xs text-background shadow-2xl sm:max-w-none sm:text-sm">
              <span>{speech}</span>
              <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-accent" />
            </div>
          )}

          <div
            ref={frameRef}
            className={`relative ${
              avatar3d ? "w-56 sm:w-72 md:w-96" : "w-44 sm:w-56 md:w-64"
            }`}
            style={{
              transform: `perspective(750px) rotateX(${headTransform.rotX}deg) rotateY(${headTransform.rotY}deg) rotateZ(${headTransform.rotZ}deg) translate3d(${headTransform.transX}px, ${headTransform.transY}px, 40px) scale(${headTransform.scale})`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Ground shadow */}
            <div
              className="pointer-events-none absolute -bottom-3 left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-full bg-black/80 blur-xl"
              style={{
                transform: `translateX(${-headTransform.transX * 0.5}px) scale(${
                  1 - headTransform.rotX * 0.01
                })`,
              }}
            />

            {/* Corner accents + framed photo, OR transparent 3D bust cutout */}
            {avatar3d ? (
              <>
                {/* Soft accent glow grounding the bust */}
                <div
                  className="pointer-events-none absolute inset-0 -z-10 scale-150"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 45%, var(--accent) 0%, transparent 62%)",
                    opacity: hovered ? 0.22 : 0.14,
                  }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/dccal-avatar-3d.png"
                  alt={`3D avatar of ${profile.name}`}
                  draggable={false}
                  onError={() => setAvatar3d(false)}
                  className="pointer-events-none w-full select-none object-contain"
                  style={{
                    filter: `drop-shadow(${
                      -headTransform.transX * 1.2
                    }px ${20 - headTransform.transY}px 34px rgba(0,0,0,0.85)) drop-shadow(0 0 35px rgba(125,211,252,${
                      hovered ? 0.45 : 0.2
                    }))`,
                  }}
                />
              </>
            ) : (
              <>
                {/* Corner accents (accent squares) */}
                <span className="absolute -left-1.5 -top-1.5 z-10 h-3 w-3 bg-accent" />
                <span className="absolute -right-1.5 -top-1.5 z-10 h-3 w-3 bg-accent" />
                <span className="absolute -bottom-1.5 -left-1.5 z-10 h-3 w-3 bg-accent" />
                <span className="absolute -bottom-1.5 -right-1.5 z-10 h-3 w-3 bg-accent" />

                {/* Framed grayscale portrait with dynamic cast shadow */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/portrait.jpg"
                  alt={profile.name}
                  draggable={false}
                  className="pointer-events-none aspect-[3/4] w-full select-none border border-border object-cover grayscale contrast-125"
                  style={{
                    filter: `grayscale(1) contrast(1.15) drop-shadow(${
                      -headTransform.transX * 1.2
                    }px ${20 - headTransform.transY}px 30px rgba(0,0,0,0.9))`,
                  }}
                />
              </>
            )}

            {/* Specular sheen tracking the pointer across the avatar surface */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-200"
              style={{
                opacity: hovered ? 0.35 : 0.15,
                background: `radial-gradient(circle at ${
                  50 + headTransform.transX * 1.2
                }% ${40 + headTransform.transY * 1.2}%, rgba(255,255,255,0.8) 0%, rgba(125,211,252,0.3) 35%, transparent 65%)`,
                mixBlendMode: "overlay",
              }}
            />
          </div>

          {/* Tap affordance pill */}
          <div className="mt-2 flex items-center gap-1.5 border border-border bg-background/90 px-3 py-1 font-mono text-[10px] text-muted shadow-xl transition-colors hover:border-foreground hover:text-foreground">
            <span className="h-1.5 w-1.5 bg-accent" />
            <span>INTERACTIVE AVATAR // TAP ME</span>
          </div>
        </div>
      </div>

      {/* Bottom bar: statement + entrance trigger */}
      <div
        ref={bottomBarRef}
        className="z-20 flex flex-col items-center gap-6 font-mono text-xs text-muted sm:flex-row sm:justify-between"
      >
        <div className="max-w-xs space-y-1 text-center sm:max-w-sm sm:text-left">
          <p className="text-xs leading-snug text-foreground sm:text-sm">{profile.role}</p>
          <p className="text-[11px] text-muted">
            {profile.name} // Portfolio 2026
          </p>
        </div>

        <button
          type="button"
          onClick={exitIntro}
          className="group relative flex cursor-pointer flex-col items-center gap-2 px-4 py-1 text-muted transition-colors hover:text-foreground sm:items-end"
          data-cursor="ENTER"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent sm:text-sm">
            <span>{scrollPull > 0 ? `ENTERING [${scrollPull}%]` : "SCROLL TO EXPLORE"}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-1"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </div>

          {/* Scroll capsule track filling with progress */}
          <div className="relative flex h-10 w-6 justify-center overflow-hidden border border-foreground/20 p-1 transition-colors group-hover:border-foreground">
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 bg-accent/40 transition-all duration-150"
              style={{ height: `${Math.max(scrollPull, 10)}%` }}
            />
            <div className="z-10 h-2.5 w-1.5 animate-bounce bg-accent" />
          </div>

          <span className="text-[10px] uppercase tracking-widest text-muted transition-colors group-hover:text-foreground">
            CLICK OR SCROLL DOWN
          </span>
        </button>
      </div>
    </div>
  );
}
