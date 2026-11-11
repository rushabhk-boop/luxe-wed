import { blankBundle } from "./defaults";
import type { Bundle } from "./types";

/** The draft lives only in this browser (localStorage). The share link is the real copy. */
const KEY = "luxewed:draft:v1";

export function loadDraft(): Bundle | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const b = JSON.parse(raw) as Bundle;
    const base = blankBundle(b.design?.theme);
    return {
      wedding: { ...base.wedding, ...b.wedding, travel: b.wedding?.travel ?? {} },
      events: Array.isArray(b.events) ? b.events : [],
      family: { ...base.family, ...b.family },
      design: { ...base.design, ...b.design },
      rsvp: { ...base.rsvp, ...b.rsvp },
    };
  } catch {
    return null;
  }
}

export function saveDraft(b: Bundle): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(b));
    return true;
  } catch {
    return false;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* storage blocked: nothing to clear */
  }
}
