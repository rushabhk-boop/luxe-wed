import type { Design, ThemeKey } from "./types";

export type Palette = {
  name: string;
  bg: string; // page background
  surface: string; // cards
  ink: string; // main text
  muted: string; // secondary text
  accent: string; // ornaments, buttons
  line: string; // hairlines
};

export type Theme = {
  key: ThemeKey;
  name: string;
  number: string;
  description: string;
  typography: string;
  palettes: Record<string, Palette>;
  layout: Design["layout"];
  background: Design["background"];
  decorations: Design["decorations"];
};

export const THEMES: Record<ThemeKey, Theme> = {
  minimalist: {
    key: "minimalist",
    number: "01",
    name: "Modern Minimalist",
    description: "Ivory paper, oversized serif names, fine line drawings and a lot of quiet space.",
    typography: "classic",
    layout: "centered",
    background: "plain",
    decorations: "minimal",
    palettes: {
      default: { name: "Ivory & Ink", bg: "#FAF7F1", surface: "#FFFFFF", ink: "#161514", muted: "#6E6A63", accent: "#1F1D1A", line: "#DED8CC" },
      stone: { name: "Stone", bg: "#EFECE6", surface: "#F8F6F2", ink: "#23211E", muted: "#6F6A62", accent: "#7B6F5D", line: "#D3CDC2" },
      noir: { name: "Noir", bg: "#141413", surface: "#1C1C1A", ink: "#F3EEE5", muted: "#A7A196", accent: "#D9CBB0", line: "#34322E" },
    },
  },
  luxury: {
    key: "luxury",
    number: "02",
    name: "Quiet Luxury",
    description: "Champagne and beige, refined serifs, hairline gold borders and a paper texture.",
    typography: "royal-serif",
    layout: "centered",
    background: "paper",
    decorations: "ornate",
    palettes: {
      default: { name: "Champagne", bg: "#F4EDE1", surface: "#FBF7F0", ink: "#3A3127", muted: "#857766", accent: "#B39563", line: "#DCCDB4" },
      oat: { name: "Oat Milk", bg: "#EFE8DC", surface: "#F8F4EC", ink: "#2F2A24", muted: "#7F7466", accent: "#9C8761", line: "#D9CDB9" },
      mocha: { name: "Mocha", bg: "#E7DCCD", surface: "#F2EADF", ink: "#3B2D22", muted: "#7A6553", accent: "#8E6B45", line: "#CDB9A0" },
    },
  },
  botanical: {
    key: "botanical",
    number: "03",
    name: "Botanical Romance",
    description: "Sage and cream with delicate leaves and hand-drawn florals around every section.",
    typography: "script",
    layout: "centered",
    background: "wash",
    decorations: "ornate",
    palettes: {
      default: { name: "Sage", bg: "#F6F3EA", surface: "#FCFAF4", ink: "#2E3A2F", muted: "#6B7668", accent: "#7D9479", line: "#D8DDCD" },
      eucalyptus: { name: "Eucalyptus", bg: "#EEF1EA", surface: "#F8FAF5", ink: "#263330", muted: "#62716C", accent: "#5F8279", line: "#CFD8D1" },
      blush: { name: "Blush Garden", bg: "#F8F1EC", surface: "#FDF9F6", ink: "#3A302C", muted: "#7C6E68", accent: "#B98A7E", line: "#E6D6CD" },
    },
  },
  royal: {
    key: "royal",
    number: "04",
    name: "Royal Indian",
    description: "Deep burgundy, champagne gold, palace arches and refined traditional patterns.",
    typography: "royal",
    layout: "centered",
    background: "pattern",
    decorations: "ornate",
    palettes: {
      default: { name: "Burgundy & Gold", bg: "#4A1520", surface: "#561B27", ink: "#F6E9D3", muted: "#D8BFA0", accent: "#D4AF6A", line: "#7A3443" },
      ivory: { name: "Palace Ivory", bg: "#F7EFE2", surface: "#FFF9EF", ink: "#4A1520", muted: "#7E5A4A", accent: "#B08A3E", line: "#E3D2B5" },
      emerald: { name: "Emerald Court", bg: "#13372F", surface: "#18423A", ink: "#F4EAD5", muted: "#C9BB9B", accent: "#D2AE66", line: "#2B5A4F" },
    },
  },
  editorial: {
    key: "editorial",
    number: "05",
    name: "Contemporary Editorial",
    description: "Bold type, asymmetric grids and high contrast, like the cover of a fashion magazine.",
    typography: "fashion",
    layout: "editorial",
    background: "plain",
    decorations: "minimal",
    palettes: {
      default: { name: "Press", bg: "#F2F0EB", surface: "#FFFFFF", ink: "#0E0E0E", muted: "#5D5B57", accent: "#B23A2B", line: "#0E0E0E" },
      mono: { name: "Monochrome", bg: "#FFFFFF", surface: "#F4F4F2", ink: "#000000", muted: "#555555", accent: "#000000", line: "#000000" },
      clay: { name: "Clay", bg: "#E9E1D6", surface: "#F4EFE8", ink: "#1E1A16", muted: "#6A6158", accent: "#A2522F", line: "#1E1A16" },
    },
  },
  celestial: {
    key: "celestial",
    number: "06",
    name: "Celestial Romance",
    description: "Midnight navy, muted champagne, a crescent moon and constellations.",
    typography: "celestial",
    layout: "centered",
    background: "pattern",
    decorations: "minimal",
    palettes: {
      default: { name: "Midnight", bg: "#111A2E", surface: "#17223A", ink: "#EFE6D2", muted: "#AAB0BF", accent: "#CDB27E", line: "#2A3653" },
      dusk: { name: "Dusk", bg: "#2A2438", surface: "#332C44", ink: "#F1E7DA", muted: "#B7ACBF", accent: "#D7B48A", line: "#463D5A" },
      dawn: { name: "Moonlit Ivory", bg: "#F3F0E8", surface: "#FBF9F4", ink: "#1C2640", muted: "#636B80", accent: "#A88A55", line: "#DAD5C8" },
    },
  },
};

export const THEME_LIST = Object.values(THEMES);

export type Typography = {
  name: string;
  display: string; // CSS var for headings
  names: string; // couple names
  body: string;
};

export const TYPOGRAPHY: Record<string, Typography> = {
  classic: { name: "Cormorant & Jost", display: "var(--f-cormorant)", names: "var(--f-cormorant)", body: "var(--f-jost)" },
  modern: { name: "Playfair & Inter", display: "var(--f-playfair)", names: "var(--f-playfair)", body: "var(--f-inter)" },
  fashion: { name: "Bodoni & Manrope", display: "var(--f-bodoni)", names: "var(--f-bodoni)", body: "var(--f-manrope)" },
  royal: { name: "Cinzel & Cormorant", display: "var(--f-cinzel)", names: "var(--f-cinzel)", body: "var(--f-cormorant)" },
  "royal-serif": { name: "Cormorant & Marcellus", display: "var(--f-cormorant)", names: "var(--f-cormorant)", body: "var(--f-marcellus)" },
  script: { name: "Great Vibes & Cormorant", display: "var(--f-cormorant)", names: "var(--f-greatvibes)", body: "var(--f-jost)" },
  celestial: { name: "Marcellus & Jost", display: "var(--f-marcellus)", names: "var(--f-italiana)", body: "var(--f-jost)" },
  romantic: { name: "Italiana & Jost", display: "var(--f-italiana)", names: "var(--f-italiana)", body: "var(--f-jost)" },
};

export const BACKGROUNDS: { key: Design["background"]; name: string }[] = [
  { key: "plain", name: "Plain" },
  { key: "paper", name: "Paper texture" },
  { key: "pattern", name: "Theme pattern" },
  { key: "wash", name: "Soft wash" },
];

export const DECORATIONS: { key: Design["decorations"]; name: string }[] = [
  { key: "none", name: "None" },
  { key: "minimal", name: "Minimal" },
  { key: "ornate", name: "Ornate" },
];

export const ANIMATIONS: { key: Design["animation"]; name: string }[] = [
  { key: "none", name: "None" },
  { key: "subtle", name: "Soft fade" },
  { key: "elegant", name: "Elegant motion" },
];

export const LAYOUTS: { key: Design["layout"]; name: string }[] = [
  { key: "centered", name: "Centred classic" },
  { key: "editorial", name: "Editorial asymmetric" },
];

/** Resolve the final colours for a design (theme palette + custom overrides). */
export function resolvePalette(design: Pick<Design, "theme" | "palette" | "colors">): Palette {
  const theme = THEMES[design.theme] ?? THEMES.minimalist;
  const base = theme.palettes[design.palette] ?? theme.palettes.default;
  return {
    ...base,
    bg: design.colors?.bg || base.bg,
    ink: design.colors?.ink || base.ink,
    accent: design.colors?.accent || base.accent,
  };
}

/** Design defaults when a theme is chosen: keeps the user's content, resets look. */
export function themeDefaults(key: ThemeKey): Pick<
  Design,
  "theme" | "palette" | "colors" | "typography" | "layout" | "background" | "decorations"
> {
  const t = THEMES[key];
  return {
    theme: key,
    palette: "default",
    colors: {},
    typography: t.typography,
    layout: t.layout,
    background: t.background,
    decorations: t.decorations,
  };
}

export const EVENT_KINDS: { kind: string; name: string; dress: string; blurb: string }[] = [
  { kind: "engagement", name: "Engagement", dress: "Festive formal", blurb: "The exchange of rings, with both families together." },
  { kind: "mehendi", name: "Mehendi", dress: "Greens and florals", blurb: "An afternoon of henna, music and laughter." },
  { kind: "haldi", name: "Haldi", dress: "Yellow, something you don't mind getting stained", blurb: "Turmeric, blessings and a lot of colour." },
  { kind: "sangeet", name: "Sangeet", dress: "Indo-western glam", blurb: "An evening of music and dance performances by both families." },
  { kind: "cocktail", name: "Cocktail Party", dress: "Black tie", blurb: "Drinks, music and a toast to the couple." },
  { kind: "ceremony", name: "Wedding Ceremony", dress: "Traditional Indian", blurb: "The pheras, the vows and the beginning of forever." },
  { kind: "reception", name: "Reception", dress: "Formal evening wear", blurb: "Dinner and celebration with the newlyweds." },
  { kind: "afterparty", name: "After Party", dress: "Dance-ready", blurb: "For those who are not done dancing yet." },
  { kind: "custom", name: "Custom Event", dress: "", blurb: "" },
];

export const ILLUSTRATIONS = [
  "auto",
  "none",
  "rings",
  "leaf",
  "marigold",
  "music",
  "glass",
  "mandap",
  "chandelier",
  "moon",
  "diamond",
] as const;

export const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Kathmandu",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "America/Toronto",
  "Australia/Sydney",
  "Pacific/Auckland",
  "Africa/Nairobi",
  "UTC",
];
