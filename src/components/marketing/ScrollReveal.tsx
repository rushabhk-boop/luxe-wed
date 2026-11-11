"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fades `[data-reveal]` elements up as they scroll into view. Set `--i` on an
 * element to stagger it within a group. Without JavaScript, or with reduced
 * motion, everything simply shows.
 */
export function ScrollReveal() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );
    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // Elements already on screen show straight away, without a hidden flash.
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
        else io.observe(el);
      });
    };
    scan();
    html.classList.add("js-reveal");
    // Pages that render after loading (the builder waits for the saved draft) add elements later.
    let queued = 0;
    const mo = new MutationObserver(() => {
      if (!queued) queued = requestAnimationFrame(() => ((queued = 0), scan()));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(queued);
    };
  }, [path]);
  return null;
}
