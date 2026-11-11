"use client";
import { useEffect, useState } from "react";
import { PreviewFrame } from "@/components/site/PreviewFrame";
import { sampleBundle } from "@/lib/defaults";
import { THEME_LIST } from "@/lib/themes";
import type { ThemeKey } from "@/lib/types";

/** Interactive example website: a live sample that cycles through the themes. */
export function HeroPreview() {
  const [theme, setTheme] = useState<ThemeKey>("royal");
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setTheme((t) => {
        const i = THEME_LIST.findIndex((x) => x.key === t);
        return THEME_LIST[(i + 1) % THEME_LIST.length].key;
      });
    }, 4200);
    return () => clearInterval(id);
  }, [auto]);
  const bundle = sampleBundle(theme);
  bundle.design.animation = "elegant";
  return (
    <div className="relative">
      <div className="relative mx-auto grid max-w-[640px] grid-cols-[1fr_auto] items-end gap-4">
        <div className="float-slower hidden sm:block h-[420px] border border-line bg-paper p-2 shadow-lift">
          <div className="mb-2 flex gap-1.5 px-1"><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /></div>
          <div className="swap-in h-[calc(100%-16px)]" key={theme + "d"}><PreviewFrame bundle={bundle} device="desktop" /></div>
        </div>
        <div className="float-slow mx-auto h-[460px] w-[230px] sm:-ml-24 sm:mb-[-28px]">
          <div className="swap-in h-full" key={theme + "m"}><PreviewFrame bundle={bundle} device="mobile" /></div>
        </div>
      </div>
      <div className="mt-12 flex flex-wrap justify-center gap-2" role="group" aria-label="Try a design">
        {THEME_LIST.map((t) => (
          <button
            key={t.key}
            onClick={() => { setAuto(false); setTheme(t.key); }}
            className={`chip text-[12px] ${theme === t.key ? "chip-on" : ""}`}
            aria-pressed={theme === t.key}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
