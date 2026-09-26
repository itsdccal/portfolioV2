"use client";

import { useEffect } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export default function SmoothScroll() {
  useSmoothScroll();

  // Route same-page hash links through Lenis so navbar/“NEXT” anchors
  // glide instead of jumping (Lenis owns the scroll loop while active).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(el as HTMLElement, { duration: 1.4 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
