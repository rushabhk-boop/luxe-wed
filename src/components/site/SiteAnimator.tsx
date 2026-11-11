"use client";
import { useEffect, useRef } from "react";

/** Adds scroll-reveal to `.lw-reveal` elements inside the nearest `.lw-site`. */
export function SiteAnimator() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = ref.current?.closest(".lw-site") as HTMLElement | null;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("lw-js");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    const observe = () => root.querySelectorAll(".lw-reveal:not(.is-in)").forEach((el) => io.observe(el));
    observe();
    // Sections can be added while editing: watch for new nodes.
    const mo = new MutationObserver(observe);
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      root.classList.remove("lw-js");
    };
  }, []);
  return <span ref={ref} hidden />;
}
