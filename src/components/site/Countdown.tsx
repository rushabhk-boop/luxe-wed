"use client";
import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { countdownParts, zonedInstant } from "@/lib/time";
import type { Lang } from "@/lib/types";

export function Countdown({
  date,
  time,
  tz,
  lang,
  variant,
}: {
  date: string | null;
  time: string | null;
  tz: string;
  lang: Lang;
  variant: "full" | "compact";
}) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const L = t(lang);
  const target = date ? zonedInstant(date, time, tz) : null;
  const p = now == null ? null : countdownParts(target, now);

  if (variant === "compact") {
    return (
      <p className="lw-count-mini" aria-live="off">
        {p == null ? " " : p.done ? L.married : `${p.days} ${L.days.toLowerCase()} · ${pad(p.hours)}:${pad(p.minutes)}:${pad(p.seconds)}`}
      </p>
    );
  }
  if (p?.done) return <p className="lw-count-done">{L.married}</p>;
  const cells: [number | null, string][] = [
    [p?.days ?? null, L.days],
    [p?.hours ?? null, L.hours],
    [p?.minutes ?? null, L.minutes],
    [p?.seconds ?? null, L.seconds],
  ];
  return (
    <div className="lw-count" role="timer" aria-live="off">
      {cells.map(([v, label]) => (
        <div className="lw-count-cell" key={label}>
          <span className="lw-count-num" key={v == null ? "x" : v}>{v == null ? "–" : label === L.days ? v : pad(v)}</span>
          <span className="lw-count-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}
