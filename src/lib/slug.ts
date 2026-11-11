/** Turn text into a URL slug: "Riya & Rahul" -> "riya-and-rahul". */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

export function coupleSlug(bride: string, groom: string): string {
  const a = slugify(bride.split(/\s+/)[0] ?? "");
  const b = slugify(groom.split(/\s+/)[0] ?? "");
  if (a && b) return `${a}-and-${b}`;
  return a || b || "our-wedding";
}

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isValidSlug(s: string): boolean {
  return s.length >= 3 && s.length <= 60 && SLUG_RE.test(s);
}

/** Candidate slugs: base, base-2, base-3 ... */
export function slugCandidates(base: string, count = 20): string[] {
  const b = base.length < 3 ? `${base}-wedding` : base;
  const out = [b];
  for (let i = 2; i <= count; i++) out.push(`${b.slice(0, 56)}-${i}`);
  return out;
}

export function isDraftSlug(s: string): boolean {
  return s.startsWith("draft-");
}
