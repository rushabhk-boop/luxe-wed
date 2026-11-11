import type { Lang } from "./types";

const LOCALE: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", gu: "gu-IN" };

/** Milliseconds that `tz` is ahead of UTC at instant `ts`. */
function tzOffset(ts: number, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const part of dtf.formatToParts(new Date(ts))) p[part.type] = part.value;
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  return asUtc - ts;
}

/** The instant of a wall-clock date + time in a time zone. */
export function zonedInstant(date: string, time: string | null, tz: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date ?? "");
  if (!m) return null;
  const [hh, mm] = (time ?? "00:00").split(":").map((n) => Number(n) || 0);
  const guess = Date.UTC(+m[1], +m[2] - 1, +m[3], hh, mm);
  try {
    const o1 = tzOffset(guess, tz);
    let t = guess - o1;
    const o2 = tzOffset(t, tz);
    if (o2 !== o1) t = guess - o2;
    return new Date(t);
  } catch {
    return new Date(guess);
  }
}

export function formatDate(date: string | null, lang: Lang = "en", style: "long" | "short" = "long"): string {
  if (!date) return "";
  const d = new Date(`${date}T00:00:00Z`);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(LOCALE[lang], {
    timeZone: "UTC",
    weekday: style === "long" ? "long" : undefined,
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  }).format(d);
}

export function formatTime(time: string | null, lang: Lang = "en"): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h)) return "";
  const d = new Date(Date.UTC(2000, 0, 1, h, m || 0));
  return new Intl.DateTimeFormat(LOCALE[lang], {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

/** "14 · 02 · 2027" style date. */
export function dotDate(date: string | null): string {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${d} · ${m} · ${y}`;
}

export function countdownParts(target: Date | null, now: number) {
  if (!target) return null;
  let s = Math.max(0, Math.floor((target.getTime() - now) / 1000));
  const days = Math.floor(s / 86400);
  s -= days * 86400;
  const hours = Math.floor(s / 3600);
  s -= hours * 3600;
  const minutes = Math.floor(s / 60);
  const seconds = s - minutes * 60;
  return { days, hours, minutes, seconds, done: target.getTime() <= now };
}
