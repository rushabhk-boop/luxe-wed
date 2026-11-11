import type { CSSProperties } from "react";
import type { ThemeKey } from "@/lib/types";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * A name split into letters for the "elegant" letter-by-letter entrance.
 * Only Latin names are split: splitting Devanagari or Gujarati would break
 * how conjunct letters join, so those names animate as one word.
 */
export function SplitName({ text, className, delay }: { text: string; className: string; delay: number }) {
  const latin = /^[\p{Script=Latin}\s'’.\-]+$/u.test(text);
  const parts = latin ? Array.from(text) : [text];
  return (
    <span className={className} style={{ animationDelay: `${delay}s`, "--d": `${delay}s` } as Vars}>
      {parts.map((c, i) => (
        <span className="lw-ch" key={i} style={{ "--i": i } as Vars}>
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}

const PETAL_KIND: Partial<Record<ThemeKey, "petal" | "leaf" | "spark" | "glint">> = {
  minimalist: "petal",
  luxury: "glint",
  botanical: "leaf",
  royal: "petal",
  celestial: "spark",
};

/**
 * Slow falling petals (or rising sparks for Celestial) behind the hero.
 * Positions come from the index, not Math.random, so every render is identical.
 */
export function Petals({ theme, count = 14 }: { theme: ThemeKey; count?: number }) {
  const kind = PETAL_KIND[theme];
  if (!kind) return null;
  return (
    <div className={`lw-petals lw-petals-${kind}`} aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const style: Vars = {
          "--x": `${(i * 37 + 11) % 100}%`,
          "--d": `${-((i * 1.9) % 14).toFixed(1)}s`,
          "--t": `${13 + ((i * 3) % 9)}s`,
          "--s": `${7 + ((i * 5) % 8)}px`,
          "--dx": `${(i % 2 ? 1 : -1) * (30 + ((i * 13) % 50))}px`,
          "--o": `${0.35 + ((i * 7) % 4) / 10}`,
        };
        return <span className="lw-petal" key={i} style={style} />;
      })}
    </div>
  );
}
