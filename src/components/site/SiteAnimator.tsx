"use client";
import { useLayoutEffect, useRef } from "react";

const DRAWABLE = ".lw-hero-bg svg, .lw-frame, .lw-divider, .lw-venue-art, .lw-card-icon";
const SHAPES = "path, circle, ellipse, line, polyline, polygon, rect";

/**
 * Motion for a wedding site:
 * - scroll-reveal for `.lw-reveal` elements inside the nearest `.lw-site`;
 * - line ornaments that draw themselves (each stroke gets pathLength=1 so CSS
 *   can animate stroke-dashoffset from 1 to 0, whatever the path's real length).
 * Runs before paint so ornaments never flash fully drawn first. State is kept in
 * data attributes: React rewrites class lists when the design changes.
 */
export function SiteAnimator() {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const root = ref.current?.closest(".lw-site") as HTMLElement | null;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The CSS only animates these under .anim-subtle / .anim-elegant, so switching
    // animation in the Design Studio takes effect without re-running this.
    root.setAttribute("data-lw-motion", "");
    const settle = window.setTimeout(() => root.setAttribute("data-lw-settled", ""), 3200);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    const scan = () => {
      root.querySelectorAll(".lw-reveal:not([data-in])").forEach((el) => io.observe(el));
      root.querySelectorAll(DRAWABLE).forEach((svg) => {
        svg.querySelectorAll(SHAPES).forEach((p) => {
          if (p.hasAttribute("data-dp") || p.closest(".lw-star")) return;
          p.setAttribute("pathLength", "1");
          p.setAttribute("data-dp", "");
        });
      });
    };
    scan();
    // Sections and ornaments change while editing: pick up new nodes.
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(settle);
      root.removeAttribute("data-lw-motion");
      root.removeAttribute("data-lw-settled");
    };
  }, []);
  return <span ref={ref} hidden />;
}
