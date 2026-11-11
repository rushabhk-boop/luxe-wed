import type { ThemeKey } from "@/lib/types";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const };

function Leaf({ x, y, r, s = 1 }: { x: number; y: number; r: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0 C 9 -9, 25 -9, 34 0 C 25 9, 9 9, 0 0 Z" {...S} />
      <path d="M2 0 H 30" {...S} opacity={0.6} />
    </g>
  );
}

export function Sprig({ className, flip = false }: { className?: string; flip?: boolean }) {
  const leaves = [
    [52, 210, -150, 1], [64, 186, -30, 0.95], [80, 160, -160, 0.9], [96, 140, -40, 0.9],
    [116, 118, -170, 0.85], [134, 104, -55, 0.8], [158, 88, 175, 0.75], [178, 80, -70, 0.7],
    [204, 72, 160, 0.6], [226, 70, -95, 0.55],
  ];
  return (
    <svg viewBox="0 0 260 260" className={className} aria-hidden style={flip ? { transform: "scale(-1,-1)" } : undefined}>
      <path d="M20 250 C 40 200, 90 120, 250 66" {...S} />
      <path d="M70 176 C 60 150, 70 120, 92 104" {...S} opacity={0.7} />
      {leaves.map(([x, y, r, s], i) => (
        <Leaf key={i} x={x} y={y} r={r} s={s} />
      ))}
      <circle cx="92" cy="104" r="5" {...S} />
      <circle cx="92" cy="104" r="1.6" fill="currentColor" />
      <circle cx="40" cy="226" r="3.5" {...S} />
    </svg>
  );
}

export function RoyalArch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 600" className={className} aria-hidden preserveAspectRatio="xMidYMid meet">
      <path d="M30 600 V270 C30 168 110 110 200 40 C290 110 370 168 370 270 V600" {...S} />
      <path d="M52 600 V276 C52 182 124 130 200 70 C276 130 348 182 348 276 V600" {...S} opacity={0.65} />
      <path d="M200 40 V18" {...S} />
      <circle cx="200" cy="12" r="6" {...S} />
      <path d="M186 40 C192 30, 208 30, 214 40" {...S} />
      {[100, 160, 220, 280, 340, 400, 460, 520].map((y) => (
        <g key={y}>
          <path d={`M30 ${y} l-8 8 l8 8 l8 -8 z`} {...S} opacity={0.6} />
          <path d={`M370 ${y} l-8 8 l8 8 l8 -8 z`} {...S} opacity={0.6} />
        </g>
      )).slice(3)}
      <path d="M120 600 C 150 560, 250 560, 280 600" {...S} opacity={0.5} />
    </svg>
  );
}

export function Moon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 220" className={className} aria-hidden>
      <path d="M150 30 A 72 72 0 1 0 150 174 A 58 58 0 1 1 150 30 Z" {...S} />
      <g opacity={0.8}>
        <path d="M200 60 L236 40 L268 70 L300 52" {...S} strokeDasharray="2 4" />
        <path d="M236 40 L250 100 L290 120" {...S} strokeDasharray="2 4" />
      </g>
      {[[200, 60, 3], [236, 40, 4], [268, 70, 2.5], [300, 52, 3], [250, 100, 3], [290, 120, 2.5], [40, 150, 2], [60, 40, 2.5], [110, 190, 2]].map(([x, y, r], i) => (
        <Star key={i} x={x} y={y} r={r * 2.4} />
      ))}
    </svg>
  );
}

export function Star({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      className="lw-star"
      d={`M${x} ${y - r} C ${x + r * 0.15} ${y - r * 0.15}, ${x + r * 0.15} ${y - r * 0.15}, ${x + r} ${y} C ${x + r * 0.15} ${y + r * 0.15}, ${x + r * 0.15} ${y + r * 0.15}, ${x} ${y + r} C ${x - r * 0.15} ${y + r * 0.15}, ${x - r * 0.15} ${y + r * 0.15}, ${x - r} ${y} C ${x - r * 0.15} ${y - r * 0.15}, ${x - r * 0.15} ${y - r * 0.15}, ${x} ${y - r} Z`}
      fill="currentColor"
    />
  );
}

export function MinimalArch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden>
      <path d="M0 270 H400" {...S} />
      <path d="M130 270 V140 A70 70 0 0 1 270 140 V270" {...S} />
      <path d="M150 270 V146 A50 50 0 0 1 250 146 V270" {...S} opacity={0.55} />
      <circle cx="200" cy="200" r="26" {...S} opacity={0.7} />
      <path d="M60 270 V220 H100 V270 M300 270 V200 H340 V270" {...S} opacity={0.4} />
      <path d="M240 288 H380 M20 288 H160" {...S} opacity={0.3} />
    </svg>
  );
}

export function Frame({ className }: { className?: string }) {
  const corner = (
    <g {...S}>
      <path d="M0 40 V0 H40" />
      <path d="M8 40 V8 H40" opacity={0.6} />
      <path d="M16 16 C 26 16, 30 22, 30 30" opacity={0.8} />
      <circle cx="16" cy="16" r="2.2" fill="currentColor" stroke="none" />
    </g>
  );
  return (
    <div className={className} aria-hidden>
      {["tl", "tr", "bl", "br"].map((c) => (
        <svg key={c} viewBox="0 0 48 48" className={`lw-corner lw-corner-${c}`}>
          {corner}
        </svg>
      ))}
    </div>
  );
}

export function Divider({ theme }: { theme: ThemeKey }) {
  if (theme === "editorial") return <div className="lw-rule" aria-hidden />;
  return (
    <svg viewBox="0 0 240 24" className="lw-divider lw-orn" aria-hidden>
      <path d="M0 12 H96 M144 12 H240" {...S} />
      {theme === "celestial" ? (
        <Star x={120} y={12} r={8} />
      ) : theme === "botanical" ? (
        <g transform="translate(104 12)">
          <path d="M0 0 C 5 -6, 13 -6, 16 0 C 13 6, 5 6, 0 0 Z" {...S} />
          <path d="M32 0 C 27 -6, 19 -6, 16 0 C 19 6, 27 6, 32 0 Z" {...S} />
        </g>
      ) : theme === "royal" ? (
        <g {...S}>
          <path d="M120 2 L130 12 L120 22 L110 12 Z" />
          <path d="M120 7 L125 12 L120 17 L115 12 Z" fill="currentColor" />
          <circle cx="102" cy="12" r="2" fill="currentColor" />
          <circle cx="138" cy="12" r="2" fill="currentColor" />
        </g>
      ) : (
        <g {...S}>
          <path d="M120 5 L127 12 L120 19 L113 12 Z" />
        </g>
      )}
    </svg>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  rings: (
    <>
      <circle cx="19" cy="29" r="10" />
      <circle cx="30" cy="29" r="10" />
      <path d="M22 13 L25 9 L28 13 L25 17 Z" />
    </>
  ),
  leaf: (
    <>
      <path d="M10 38 C 10 20, 22 10, 38 10 C 38 26, 28 38, 10 38 Z" />
      <path d="M10 38 L 30 18 M18 30 H26 M22 26 V18" />
    </>
  ),
  marigold: (
    <>
      <circle cx="24" cy="24" r="4" />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const x = Math.round((24 + Math.cos(a) * 10) * 100) / 100;
        const y = Math.round((24 + Math.sin(a) * 10) * 100) / 100;
        return <ellipse key={i} cx={x} cy={y} rx="5" ry="3" transform={`rotate(${i * 36} ${x} ${y})`} />;
      })}
    </>
  ),
  music: (
    <>
      <path d="M18 34 V12 L36 8 V30" />
      <circle cx="14" cy="34" r="4" />
      <circle cx="32" cy="30" r="4" />
      <path d="M18 18 L36 14" />
    </>
  ),
  glass: (
    <>
      <path d="M12 10 H36 L24 26 Z" />
      <path d="M24 26 V38 M17 38 H31 M16 15 H32" />
      <circle cx="33" cy="9" r="3" />
    </>
  ),
  mandap: (
    <>
      <path d="M8 18 C 14 8, 34 8, 40 18 Z" />
      <path d="M12 18 V40 M36 18 V40 M8 40 H40 M24 6 V3" />
      <path d="M20 40 L24 32 L28 40" />
    </>
  ),
  chandelier: (
    <>
      <path d="M24 4 V14 M12 20 C 12 28, 36 28, 36 20 M12 20 H36" />
      <path d="M12 20 V24 M24 20 V28 M36 20 V24" />
      <circle cx="12" cy="27" r="2" />
      <circle cx="24" cy="31" r="2" />
      <circle cx="36" cy="27" r="2" />
      <path d="M18 36 L24 44 L30 36" />
    </>
  ),
  moon: (
    <>
      <path d="M26 8 A 16 16 0 1 0 26 40 A 13 13 0 1 1 26 8 Z" />
      <path d="M36 12 l1.5 3 3 1.5 -3 1.5 -1.5 3 -1.5 -3 -3 -1.5 3 -1.5 z" />
    </>
  ),
  diamond: (
    <>
      <path d="M8 18 L16 8 H32 L40 18 L24 40 Z" />
      <path d="M8 18 H40 M16 8 L20 18 L24 40 L28 18 L32 8" />
    </>
  ),
};

const KIND_ICON: Record<string, string> = {
  engagement: "rings",
  mehendi: "leaf",
  haldi: "marigold",
  sangeet: "music",
  cocktail: "glass",
  ceremony: "mandap",
  reception: "chandelier",
  afterparty: "moon",
  custom: "diamond",
};

export function iconFor(kind: string, illustration: string): string | null {
  if (illustration === "none") return null;
  if (illustration && illustration !== "auto" && ICONS[illustration]) return illustration;
  return KIND_ICON[kind] ?? "diamond";
}

export function EventIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinejoin="round" strokeLinecap="round">
      {ICONS[name]}
    </svg>
  );
}
