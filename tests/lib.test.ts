import { describe, expect, it } from "vitest";
import { names, sampleBundle } from "@/lib/defaults";
import { DICTS } from "@/lib/i18n";
import { decodeBundle, encodeBundle, readHash, shareLink, slugFor } from "@/lib/share";
import { coupleSlug, isValidSlug, slugify } from "@/lib/slug";
import { resolvePalette, THEMES, TYPOGRAPHY } from "@/lib/themes";
import { countdownParts, formatTime, zonedInstant } from "@/lib/time";
import { publishProblems, stepErrors } from "@/lib/validate";
import { deflateSync, strToU8 } from "fflate";

describe("share links", () => {
  it("round-trips a whole wedding through the link", () => {
    const b = sampleBundle("royal");
    b.design.colors = { accent: "#aa3344" };
    b.design.hidden_sections = ["travel"];
    b.rsvp.questions = [{ id: "q1", label: "Pick-up?", type: "yesno", required: true }];
    const back = decodeBundle(encodeBundle(b));
    expect(back.wedding.bride_name).toBe("Riya Mehta");
    expect(back.wedding.travel.airport).toBe(b.wedding.travel.airport);
    expect(back.events.map((e) => e.name)).toEqual(b.events.map((e) => e.name));
    expect(back.events[1].start_time).toBe("19:30");
    expect(back.family.bride_parents).toBe(b.family.bride_parents);
    expect(back.design.theme).toBe("royal");
    expect(back.design.colors.accent).toBe("#aa3344");
    expect(back.design.hidden_sections).toEqual(["travel"]);
    expect(back.rsvp.whatsapp).toBe("+91 98765 43210");
    expect(back.rsvp.questions[0].label).toBe("Pick-up?");
  });
  it("makes a readable link with the couple's names", () => {
    const b = sampleBundle();
    const url = shareLink(b, "https://x.github.io");
    expect(url.startsWith("https://x.github.io/wedding/#riya-and-rahul.")).toBe(true);
    expect(url.length).toBeLessThan(2500);
    expect(readHash(new URL(url).hash)?.wedding.groom_name).toBe("Rahul Kapoor");
    expect(slugFor(b)).toBe("riya-and-rahul");
  });
  it("rejects unsafe values from edited links", () => {
    const evil = { v: 1, w: { bride_name: "A".repeat(500), wedding_date: "<script>" }, d: { theme: "nope", colors: { bg: "url(https://evil)" }, typography: "x" }, r: { max_attendees: 9999 } };
    const data = Buffer.from(deflateSync(strToU8(JSON.stringify(evil)))).toString("base64url");
    const b = decodeBundle(data);
    expect(b.wedding.bride_name.length).toBe(120);
    expect(b.wedding.wedding_date).toBeNull();
    expect(b.design.theme).toBe("minimalist");
    expect(b.design.colors.bg).toBeUndefined();
    expect(b.rsvp.max_attendees).toBe(50);
  });
  it("throws on a broken link", () => {
    expect(() => decodeBundle("not-valid-data")).toThrow();
  });
});

describe("slugs", () => {
  it("builds a slug from the couple's first names", () => {
    expect(coupleSlug("Riya Mehta", "Rahul Kapoor")).toBe("riya-and-rahul");
    expect(slugify("  Zoë & José!! ")).toBe("zoe-and-jose");
    expect(coupleSlug("", "")).toBe("our-wedding");
    expect(isValidSlug("riya-and-rahul")).toBe(true);
  });
});

describe("time", () => {
  it("converts wall-clock time in a zone to an instant", () => {
    expect(zonedInstant("2027-02-14", "18:30", "Asia/Kolkata")?.toISOString()).toBe("2027-02-14T13:00:00.000Z");
    expect(zonedInstant("2027-07-01", "12:00", "Europe/London")?.toISOString()).toBe("2027-07-01T11:00:00.000Z");
    expect(zonedInstant("nonsense", null, "UTC")).toBeNull();
  });
  it("counts down", () => {
    const t = new Date("2027-01-02T01:01:01Z");
    expect(countdownParts(t, new Date("2027-01-01T00:00:00Z").getTime())).toMatchObject({ days: 1, hours: 1, minutes: 1, seconds: 1, done: false });
    expect(countdownParts(t, t.getTime() + 5)?.done).toBe(true);
  });
  it("formats times", () => {
    expect(formatTime("18:30", "en")).toContain("6:30");
  });
});

describe("translations", () => {
  it("has every key in every language", () => {
    const keys = Object.keys(DICTS.en).sort();
    for (const d of Object.values(DICTS)) expect(Object.keys(d).sort()).toEqual(keys);
  });
});

describe("themes", () => {
  it("has six themes with known typography", () => {
    expect(Object.keys(THEMES)).toHaveLength(6);
    for (const t of Object.values(THEMES)) expect(TYPOGRAPHY[t.typography]).toBeDefined();
  });
  it("applies colour overrides", () => {
    expect(resolvePalette({ theme: "royal", palette: "default", colors: { accent: "#123456" } }).accent).toBe("#123456");
  });
});

describe("validation", () => {
  it("requires names, date and an RSVP contact", () => {
    const b = sampleBundle();
    expect(publishProblems(b)).toEqual([]);
    b.wedding.bride_name = "";
    b.wedding.wedding_date = null;
    b.rsvp.whatsapp = "";
    expect(publishProblems(b).map((p) => p.step)).toEqual([1, 2, 6]);
    expect(stepErrors(1, b)).toHaveProperty("bride_name");
  });
  it("uses display names, then first names", () => {
    expect(names({ bride_name: "Riya Mehta", groom_name: "Rahul Kapoor", bride_display: "", groom_display: "Rahu" }).both).toBe("Riya & Rahu");
  });
});
