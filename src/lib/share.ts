import { deflateSync, inflateSync, strFromU8, strToU8 } from "fflate";
import { blankBundle, names } from "./defaults";
import { coupleSlug } from "./slug";
import { THEMES, TYPOGRAPHY } from "./themes";
import { ALL_SECTIONS, type Bundle, type SectionKey } from "./types";

/*
 * No database: the whole wedding travels inside the link, after the "#".
 * The part after "#" is never sent to the web server, so the details stay
 * between the couple and the people they share the link with.
 *
 * Link format:  <site>/wedding/#<slug>.<data>
 *   slug = readable names (riya-and-rahul), data = deflated JSON, base64url.
 */

const WEDDING_KEYS = [
  "bride_name", "groom_name", "bride_display", "groom_display", "initials", "hashtag", "welcome_message",
  "family_names", "wedding_date", "wedding_time", "city", "venue", "venue_address", "language", "timezone",
  "maps_url", "travel",
] as const;
const EVENT_KEYS = ["kind", "name", "event_date", "start_time", "end_time", "venue", "address", "maps_url", "dress_code", "description", "illustration"] as const;
const FAMILY_KEYS = ["bride_parents", "groom_parents", "grandparents", "introduction", "acknowledgements", "hidden"] as const;
const DESIGN_KEYS = ["theme", "palette", "colors", "typography", "layout", "background", "decorations", "animation", "section_order", "hidden_sections", "texts"] as const;
const RSVP_KEYS = ["enabled", "deadline", "ask_phone", "ask_email", "ask_dietary", "ask_message", "ask_events", "max_attendees", "questions", "whatsapp", "email"] as const;

type Obj = Record<string, unknown>;

/** Keep only values that differ from the defaults, so links stay short. */
function diff(obj: Obj, base: Obj, keys: readonly string[]): Obj {
  const out: Obj = {};
  for (const k of keys) {
    const v = obj[k];
    if (v === undefined || JSON.stringify(v) === JSON.stringify(base[k])) continue;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const clean = Object.fromEntries(Object.entries(v as Obj).filter(([, x]) => x !== "" && x != null));
      if (!Object.keys(clean).length && !base[k]) continue;
      out[k] = clean;
    } else out[k] = v;
  }
  return out;
}

function toB64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function encodeBundle(b: Bundle): string {
  const base = blankBundle(b.design.theme);
  const baseEvent = { kind: "custom", name: "", event_date: null, start_time: null, end_time: null, venue: "", address: "", maps_url: "", dress_code: "", description: "", illustration: "auto" };
  const data = {
    v: 1,
    w: diff(b.wedding as unknown as Obj, base.wedding as unknown as Obj, WEDDING_KEYS),
    e: b.events.map((e) => diff(e as unknown as Obj, baseEvent, EVENT_KEYS)),
    f: diff(b.family as unknown as Obj, base.family as unknown as Obj, FAMILY_KEYS),
    d: diff(b.design as unknown as Obj, {} as Obj, DESIGN_KEYS),
    r: diff(b.rsvp as unknown as Obj, base.rsvp as unknown as Obj, RSVP_KEYS),
  };
  return toB64Url(deflateSync(strToU8(JSON.stringify(data)), { level: 9 }));
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const bool = (v: unknown, d: boolean) => (typeof v === "boolean" ? v : d);
const date = (v: unknown) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);
const time = (v: unknown) => (typeof v === "string" && /^\d{2}:\d{2}(:\d{2})?$/.test(v) ? v.slice(0, 5) : null);
const pick = <T extends string>(v: unknown, allowed: readonly T[], d: T): T => (allowed.includes(v as T) ? (v as T) : d);
const color = (v: unknown) => (typeof v === "string" && /^#[0-9a-f]{3,8}$/i.test(v) ? v : undefined);

/** Read a link's data back into a wedding. Every value is checked, since links can be edited by anyone. */
export function decodeBundle(data: string): Bundle {
  const raw = JSON.parse(strFromU8(inflateSync(fromB64Url(data)))) as Obj;
  if (raw.v !== 1) throw new Error("This link was made by a newer version.");
  const w = (raw.w ?? {}) as Obj;
  const d = (raw.d ?? {}) as Obj;
  const f = (raw.f ?? {}) as Obj;
  const r = (raw.r ?? {}) as Obj;
  const theme = pick(d.theme, Object.keys(THEMES) as (keyof typeof THEMES)[], "minimalist");
  const b = blankBundle(theme);
  const tr = (w.travel ?? {}) as Obj;

  Object.assign(b.wedding, {
    bride_name: str(w.bride_name, 120), groom_name: str(w.groom_name, 120),
    bride_display: str(w.bride_display, 60), groom_display: str(w.groom_display, 60),
    initials: str(w.initials, 8), hashtag: str(w.hashtag, 60), welcome_message: str(w.welcome_message, 2000),
    family_names: str(w.family_names, 200), wedding_date: date(w.wedding_date), wedding_time: time(w.wedding_time),
    city: str(w.city, 120), venue: str(w.venue, 200), venue_address: str(w.venue_address, 500),
    language: pick(w.language, ["en", "hi", "gu"] as const, "en"),
    timezone: str(w.timezone, 64) || "Asia/Kolkata", maps_url: str(w.maps_url, 1000),
    travel: Object.fromEntries(["airport", "railway", "hotels", "parking", "assistance", "accommodation"].map((k) => [k, str(tr[k], 800)])),
    status: "published", onboarding_step: 8, onboarding_done: true,
  });

  b.events = (Array.isArray(raw.e) ? (raw.e as Obj[]) : []).slice(0, 40).map((e, i) => ({
    id: `e${i}`, wedding_id: b.wedding.id, position: i,
    kind: str(e.kind, 40) || "custom", name: str(e.name, 120), event_date: date(e.event_date),
    start_time: time(e.start_time), end_time: time(e.end_time), venue: str(e.venue, 200), address: str(e.address, 500),
    maps_url: str(e.maps_url, 1000), dress_code: str(e.dress_code, 200), description: str(e.description, 1500),
    illustration: str(e.illustration, 40) || "auto",
  }));

  Object.assign(b.family, {
    bride_parents: str(f.bride_parents, 300), groom_parents: str(f.groom_parents, 300), grandparents: str(f.grandparents, 600),
    introduction: str(f.introduction, 2000), acknowledgements: str(f.acknowledgements, 2000), hidden: bool(f.hidden, false),
  });

  const dd = b.design;
  const cols = (d.colors ?? {}) as Obj;
  const texts = (d.texts ?? {}) as Obj;
  const sections = (v: unknown) => (Array.isArray(v) ? v.filter((k): k is SectionKey => ALL_SECTIONS.includes(k as SectionKey)) : null);
  Object.assign(dd, {
    palette: typeof d.palette === "string" && THEMES[theme].palettes[d.palette] ? d.palette : dd.palette,
    colors: { bg: color(cols.bg), ink: color(cols.ink), accent: color(cols.accent) },
    typography: typeof d.typography === "string" && TYPOGRAPHY[d.typography] ? d.typography : dd.typography,
    layout: pick(d.layout, ["centered", "editorial"] as const, dd.layout),
    background: pick(d.background, ["plain", "paper", "pattern", "wash"] as const, dd.background),
    decorations: pick(d.decorations, ["none", "minimal", "ornate"] as const, dd.decorations),
    animation: pick(d.animation, ["none", "subtle", "elegant"] as const, dd.animation),
    hidden_sections: sections(d.hidden_sections) ?? [],
    texts: Object.fromEntries(Object.entries(texts).filter(([k]) => [...ALL_SECTIONS, "closing", "tagline"].includes(k)).map(([k, v]) => [k, str(v, 200)])),
  });
  const order = sections(d.section_order);
  if (order) dd.section_order = [...order, ...ALL_SECTIONS.filter((k) => !order.includes(k))];

  const qs = Array.isArray(r.questions) ? (r.questions as Obj[]) : [];
  Object.assign(b.rsvp, {
    enabled: bool(r.enabled, true), deadline: date(r.deadline),
    ask_phone: bool(r.ask_phone, true), ask_email: bool(r.ask_email, true), ask_dietary: bool(r.ask_dietary, true),
    ask_message: bool(r.ask_message, true), ask_events: bool(r.ask_events, true),
    max_attendees: Math.min(50, Math.max(1, Number(r.max_attendees) || 6)),
    questions: qs.slice(0, 10).map((q, i) => ({ id: str(q.id, 12) || `q${i}`, label: str(q.label, 200), type: q.type === "yesno" ? "yesno" : "text", required: bool(q.required, false) })),
    whatsapp: str(r.whatsapp, 30), email: str(r.email, 200),
  });

  b.wedding.slug = slugFor(b);
  return b;
}

export function slugFor(b: Bundle): string {
  const n = names(b.wedding);
  return coupleSlug(n.a, n.b);
}

/** Base path of the site (e.g. "/luxe-wed" on GitHub Pages). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function shareLink(b: Bundle, origin: string): string {
  return `${origin}${BASE_PATH}/wedding/#${slugFor(b)}.${encodeBundle(b)}`;
}

/** Read "#slug.data" (or "#data"). */
export function readHash(hash: string): Bundle | null {
  const h = hash.replace(/^#/, "");
  if (!h) return null;
  const data = h.includes(".") ? h.slice(h.indexOf(".") + 1) : h;
  return decodeBundle(data);
}

export function whatsappText(url: string): string {
  return `You're invited to celebrate our special day!\nWe would love to have you with us.\nExplore our wedding invitation here:\n${url}`;
}
