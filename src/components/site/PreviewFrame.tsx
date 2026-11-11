"use client";
import { useEffect, useRef, useState } from "react";
import type { Bundle } from "@/lib/types";
import { WeddingSite } from "./WeddingSite";

/** Scaled, live preview of the guest website (desktop or mobile width). */
export function PreviewFrame({ bundle, device, height = "100%" }: { bundle: Bundle; device: "desktop" | "mobile"; height?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(1000);
  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const target = device === "desktop" ? 1280 : 390;
  const scale = Math.min(1, w / target);
  return (
    <div ref={outer} className="relative h-full w-full overflow-hidden" style={{ height }}>
      <div
        className={`absolute top-0 left-1/2 overflow-y-auto overflow-x-hidden bg-paper ${device === "mobile" ? "rounded-[28px] border-[6px] border-ink shadow-lift" : "border border-line shadow-soft"}`}
        style={{
          width: target,
          height: `calc(${100 / scale}% )`,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <WeddingSite bundle={bundle} mode="preview" />
      </div>
    </div>
  );
}

