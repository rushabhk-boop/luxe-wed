import { WeddingSite } from "@/components/site/WeddingSite";
import { sampleBundle } from "@/lib/defaults";
import type { ThemeKey } from "@/lib/types";

/** Live hero of a theme with the sample couple, sized by its box. */
export function ThemeThumb({ theme, className = "" }: { theme: ThemeKey; className?: string }) {
  return (
    <div className={`relative aspect-[4/5] overflow-hidden border border-line shadow-soft transition-transform duration-500 group-hover:-translate-y-1 ${className}`}>
      <div className="absolute inset-0 [&_.lw-site]:h-full pointer-events-none" aria-hidden>
        <WeddingSite bundle={sampleBundle(theme)} mode="thumb" />
      </div>
    </div>
  );
}
