import QRCode from "qrcode";
import { initialsOf, names } from "./defaults";
import { t } from "./i18n";
import { resolvePalette, THEMES, TYPOGRAPHY } from "./themes";
import { formatDate, formatTime } from "./time";
import type { Bundle, ThemeKey } from "./types";

/** Poster size: 4:5 portrait, sharp on phones and fine for A4 / A3 prints. */
export const POSTER_W = 1600;
export const POSTER_H = 2000;

type Ctx = CanvasRenderingContext2D;

/** Turn a typography entry like "var(--f-cinzel)" into the real font family name. */
function family(cssVar: string, fallback: string): string {
  const m = /var\((--[\w-]+)\)/.exec(cssVar);
  const v = m ? getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim() : "";
  return v ? `${v}, ${fallback}` : fallback;
}

function alpha(hex: string, a: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** Text with letter spacing, centred on x (works where ctx.letterSpacing is missing). */
function spaced(ctx: Ctx, text: string, x: number, y: number, spacing: number) {
  const chars = Array.from(text);
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((s, w) => s + w, 0) + spacing * (chars.length - 1);
  let cx = x - total / 2;
  const align = ctx.textAlign;
  ctx.textAlign = "left";
  chars.forEach((c, i) => {
    ctx.fillText(c, cx, y);
    cx += widths[i] + spacing;
  });
  ctx.textAlign = align;
}

/** Largest font size (<= max) at which the text fits the width. */
function fit(ctx: Ctx, text: string, font: (px: number) => string, max: number, width: number) {
  let px = max;
  ctx.font = font(px);
  while (px > 24 && ctx.measureText(text).width > width) {
    px -= 4;
    ctx.font = font(px);
  }
  return px;
}

/** Wrap text into at most `maxLines` lines that fit the width. */
function wrap(ctx: Ctx, text: string, width: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width <= width || !line) line = next;
    else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    const last = kept[maxLines - 1];
    kept[maxLines - 1] = (last.includes(" ") ? last.replace(/\s*\S*$/, "") : last.slice(0, -1)) + "…";
    return kept;
  }
  return lines;
}

function diamond(ctx: Ctx, x: number, y: number, r: number, fill: boolean) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  else ctx.stroke();
}

function divider(ctx: Ctx, cx: number, y: number, half: number, accent: string) {
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - half, y);
  ctx.lineTo(cx - 26, y);
  ctx.moveTo(cx + 26, y);
  ctx.lineTo(cx + half, y);
  ctx.stroke();
  diamond(ctx, cx, y, 12, false);
  diamond(ctx, cx, y, 5, true);
}

/** The background ornament for each theme, drawn in thin accent lines. */
function ornament(ctx: Ctx, theme: ThemeKey, accent: string, top: number, bottom: number) {
  const cx = POSTER_W / 2;
  ctx.save();
  const fade = ctx.createLinearGradient(0, top, 0, bottom);
  fade.addColorStop(0, alpha(accent, 0.32));
  fade.addColorStop(0.55, alpha(accent, 0.22));
  fade.addColorStop(1, alpha(accent, 0));
  ctx.strokeStyle = theme === "botanical" ? alpha(accent, 0.17) : fade;
  ctx.lineWidth = 2;
  if (theme === "celestial") {
    ctx.strokeStyle = alpha(accent, 0.28);
    // crescent moon and scattered stars
    ctx.beginPath();
    ctx.arc(cx, top + 70, 60, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = alpha(accent, 0.18);
    ctx.beginPath();
    ctx.arc(cx, top + 70, 60, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(cx - 18, top + 70, 52, Math.PI * 1.5, Math.PI * 0.5, true);
    ctx.fill();
    ctx.fillStyle = alpha(accent, 0.55);
    for (let i = 0; i < 26; i++) {
      const x = 140 + ((i * 397) % (POSTER_W - 280));
      const y = 160 + ((i * 613) % (POSTER_H - 520));
      if (y > POSTER_H - 560 || (Math.abs(x - POSTER_W / 2) < 620 && y > 360)) continue; // keep text and QR clear
      const r = 3 + (i % 4) * 2;
      ctx.beginPath();
      ctx.moveTo(x, y - r * 2);
      ctx.quadraticCurveTo(x, y, x + r * 2, y);
      ctx.quadraticCurveTo(x, y, x, y + r * 2);
      ctx.quadraticCurveTo(x, y, x - r * 2, y);
      ctx.quadraticCurveTo(x, y, x, y - r * 2);
      ctx.fill();
    }
  } else if (theme === "botanical") {
    // two leafy sprigs from the corners
    const sprig = (x: number, y: number, dir: 1 | -1) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + dir * 120, y - 180, x + dir * 220, y - 320, x + dir * 260, y - 520);
      ctx.stroke();
      for (let i = 1; i <= 7; i++) {
        const k = i / 8;
        const px = x + dir * (260 * k + 40 * Math.sin(k * 3));
        const py = y - 520 * k;
        for (const side of [-1, 1]) {
          ctx.beginPath();
          ctx.ellipse(px + side * 30, py, 34, 13, side * dir * -0.6, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };
    sprig(150, POSTER_H - 520, 1);
    sprig(POSTER_W - 150, POSTER_H - 520, -1);
  } else if (theme !== "editorial") {
    // arch (minimalist, luxury) or pointed royal arch
    const w = theme === "royal" ? 560 : 520;
    const x0 = cx - w / 2;
    for (const inset of [0, 26]) {
      ctx.beginPath();
      ctx.moveTo(x0 + inset, bottom);
      if (theme === "royal") {
        ctx.lineTo(x0 + inset, top + 330);
        ctx.quadraticCurveTo(x0 + inset, top + 120 + inset, cx, top + inset);
        ctx.quadraticCurveTo(x0 + w - inset, top + 120 + inset, x0 + w - inset, top + 330);
      } else {
        ctx.lineTo(x0 + inset, top + w / 2);
        ctx.arc(cx, top + w / 2, w / 2 - inset, Math.PI, 0);
      }
      ctx.lineTo(x0 + w - inset, bottom);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function frame(ctx: Ctx, theme: ThemeKey, accent: string) {
  ctx.save();
  ctx.strokeStyle = alpha(accent, theme === "minimalist" ? 0.35 : 0.7);
  if (theme === "editorial") {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(90, 120);
    ctx.lineTo(POSTER_W - 90, 120);
    ctx.moveTo(90, POSTER_H - 120);
    ctx.lineTo(POSTER_W - 90, POSTER_H - 120);
    ctx.stroke();
  } else {
    ctx.lineWidth = 2;
    ctx.strokeRect(56, 56, POSTER_W - 112, POSTER_H - 112);
    ctx.lineWidth = 1;
    ctx.strokeRect(74, 74, POSTER_W - 148, POSTER_H - 148);
    if (theme === "royal" || theme === "luxury") {
      ctx.fillStyle = accent;
      for (const [x, y] of [[65, 65], [POSTER_W - 65, 65], [65, POSTER_H - 65], [POSTER_W - 65, POSTER_H - 65]]) {
        diamond(ctx, x, y, 16, false);
        diamond(ctx, x, y, 6, true);
      }
    }
  }
  ctx.restore();
}

async function qrCanvas(url: string, size: number, ink: string): Promise<HTMLCanvasElement> {
  const c = document.createElement("canvas");
  await QRCode.toCanvas(c, url, { width: size, margin: 1, errorCorrectionLevel: "L", color: { dark: ink, light: "#ffffff" } });
  return c;
}

/** Draw the poster for a wedding. Needs a browser (canvas + loaded fonts). */
export async function drawPoster(bundle: Bundle, url: string): Promise<HTMLCanvasElement> {
  const { wedding: w, events, design } = bundle;
  const theme: ThemeKey = THEMES[design.theme] ? design.theme : "minimalist";
  const pal = resolvePalette(design);
  const typo = TYPOGRAPHY[design.typography] ?? TYPOGRAPHY.classic;
  const L = t(w.language);
  const serif = "Georgia, 'Times New Roman', serif";
  const fDisplay = family(typo.display, serif);
  const fNames = family(typo.names, serif);
  const fBody = family(typo.body, "system-ui, sans-serif");
  const upper = theme === "royal" || theme === "editorial";
  const script = design.typography === "script";

  await Promise.all(
    [`400 60px ${fDisplay}`, `italic 400 60px ${fDisplay}`, `400 60px ${fNames}`, `400 30px ${fBody}`, `500 30px ${fBody}`].map((f) =>
      document.fonts.load(f).catch(() => []),
    ),
  );

  const c = document.createElement("canvas");
  c.width = POSTER_W;
  c.height = POSTER_H;
  const ctx = c.getContext("2d")!;
  const cx = POSTER_W / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // background with a soft accent glow
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);
  const glow = ctx.createRadialGradient(cx, 760, 80, cx, 760, 1100);
  glow.addColorStop(0, alpha(pal.accent, 0.1));
  glow.addColorStop(1, alpha(pal.accent, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);

  frame(ctx, theme, pal.accent);
  ornament(ctx, theme, pal.accent, 200, 1000);

  // eyebrow
  ctx.fillStyle = pal.muted;
  ctx.font = `500 26px ${fBody}`;
  spaced(ctx, (design.texts?.tagline || (theme === "editorial" ? L.saveDate : L.together)).toUpperCase(), cx, 190, 7);

  // monogram
  const mono = initialsOf(w);
  ctx.strokeStyle = alpha(pal.accent, 0.7);
  ctx.lineWidth = 2;
  if (theme === "royal") diamond(ctx, cx, 290, 58, false);
  else if (theme === "minimalist" || theme === "editorial") ctx.strokeRect(cx - 50, 240, 100, 100);
  else {
    ctx.beginPath();
    ctx.arc(cx, 290, 52, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = pal.accent;
  ctx.font = `400 34px ${fDisplay}`;
  spaced(ctx, mono, cx + 4, 302, 8);

  // names
  const { a, b } = names(w);
  const nameA = upper ? (a || "Bride").toUpperCase() : a || "Bride";
  const nameB = upper ? (b || "Groom").toUpperCase() : b || "Groom";
  const nameFont = (px: number) => `${theme === "luxury" ? "italic " : ""}400 ${px}px ${fNames}`;
  // leave room for the events: up to 4, in two columns when there are 3 or 4
  const list = events.slice(0, 4);
  const cols = list.length > 2 ? 2 : 1;
  const rows = Math.ceil(list.length / cols);
  const moreH = events.length > list.length ? 50 : 0;
  const eventsH = list.length ? rows * 128 + moreH + 30 : 0;
  const qrTop = POSTER_H - 470;
  const textBelowNames = 90 + 70 + (w.wedding_date ? 62 : 0) + 96 + 40;
  const byRoom = Math.floor((qrTop - 70 - 420 - textBelowNames - eventsH) / 2.13);
  const maxName = Math.max(96, Math.min(script ? 250 : upper ? 170 : 210, byRoom));
  const px = Math.min(fit(ctx, nameA, nameFont, maxName, 1180), fit(ctx, nameB, nameFont, maxName, 1180));
  ctx.font = nameFont(px);
  ctx.fillStyle = pal.ink;
  const nameTop = 420 + px * 0.75;
  ctx.fillText(nameA, cx, nameTop);
  ctx.fillStyle = pal.accent;
  ctx.font = `italic 400 ${Math.round(px * 0.45)}px ${fDisplay}`;
  ctx.fillText("&", cx, nameTop + px * 0.62);
  ctx.fillStyle = pal.ink;
  ctx.font = nameFont(px);
  const nameBottom = nameTop + px * 1.38;
  ctx.fillText(nameB, cx, nameBottom);

  // invitation line, divider, date and place
  let y = nameBottom + 90;
  ctx.fillStyle = pal.muted;
  ctx.font = `400 34px ${fBody}`;
  ctx.fillText(L.invite, cx, y);
  y += 70;
  divider(ctx, cx, y, 220, pal.accent);
  y += 96;
  if (w.wedding_date) {
    ctx.fillStyle = pal.ink;
    ctx.font = `400 ${fit(ctx, formatDate(w.wedding_date, w.language), (p) => `400 ${p}px ${fDisplay}`, 76, 1200)}px ${fDisplay}`;
    ctx.fillText(formatDate(w.wedding_date, w.language), cx, y);
    y += 62;
  }
  const place = [w.venue, w.city].map((x) => x?.trim()).filter(Boolean).join(", ");
  if (place || w.wedding_time) {
    ctx.fillStyle = pal.accent;
    ctx.font = `500 26px ${fBody}`;
    const line = [w.wedding_time ? formatTime(w.wedding_time, w.language) : "", place].filter(Boolean).join("  ·  ").toUpperCase();
    spaced(ctx, line.length > 70 ? line.slice(0, 68) + "…" : line, cx, y, 6);
    y += 40;
  }

  // events
  if (list.length) {
    y += 30;
    const room = qrTop - 70 - y;
    const rowH = Math.max(84, Math.min(140, (room - moreH) / rows));
    // centre the list in the space between the date and the QR code
    y += Math.max(0, (room - rowH * rows - moreH) / 2);
    const colW = cols === 2 ? 600 : 1150;
    list.forEach((e, i) => {
      const lone = cols === 2 && i === list.length - 1 && list.length % 2 === 1;
      const x = cols === 2 && !lone ? cx + (i % 2 ? 310 : -310) : cx;
      const ry = y + Math.floor(i / cols) * rowH;
      ctx.fillStyle = pal.ink;
      const title = upper ? (e.name || "Event").toUpperCase() : e.name || "Event";
      fit(ctx, title, (p) => `400 ${p}px ${fDisplay}`, Math.round(rowH * 0.4), colW - 20);
      ctx.fillText(title, x, ry + rowH * 0.4);
      ctx.fillStyle = pal.muted;
      ctx.font = `400 ${Math.round(rowH * 0.235)}px ${fBody}`;
      const when = [formatDate(e.event_date, w.language, "short"), formatTime(e.start_time, w.language)].filter(Boolean).join("  ·  ");
      ctx.fillText(when, x, ry + rowH * 0.68);
      if (e.venue) {
        ctx.fillStyle = pal.accent;
        ctx.font = `500 ${Math.round(rowH * 0.19)}px ${fBody}`;
        ctx.fillText(wrap(ctx, e.venue, colW, 1)[0] ?? "", x, ry + rowH * 0.9);
      }
    });
    if (cols === 2) {
      // a hairline between the two columns
      ctx.strokeStyle = alpha(pal.accent, 0.35);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, y + 10);
      ctx.lineTo(cx, y + Math.floor(list.length / 2) * rowH - 10);
      ctx.stroke();
    }
    if (moreH) {
      ctx.fillStyle = pal.accent;
      ctx.font = `italic 400 30px ${fDisplay}`;
      ctx.fillText(`+ ${events.length - list.length} more on our website`, cx, y + rows * rowH + 34);
    }
  }

  else if (w.welcome_message.trim()) {
    ctx.fillStyle = pal.ink;
    ctx.font = `italic 400 44px ${fDisplay}`;
    const lines = wrap(ctx, w.welcome_message.trim(), 1080, 4);
    const top = y + Math.max(60, (qrTop - 70 - y - lines.length * 62) / 2);
    lines.forEach((l, i) => ctx.fillText(l, cx, top + i * 62));
  }

  // QR code block
  const qrSize = 300;
  const qr = await qrCanvas(url, qrSize, "#1f1b16");
  const boxX = cx - 470;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = alpha(pal.accent, 0.6);
  ctx.lineWidth = 2;
  ctx.fillRect(boxX, qrTop, qrSize + 40, qrSize + 40);
  ctx.strokeRect(boxX, qrTop, qrSize + 40, qrSize + 40);
  ctx.drawImage(qr, boxX + 20, qrTop + 20, qrSize, qrSize);

  const tx = boxX + qrSize + 100;
  ctx.textAlign = "left";
  ctx.fillStyle = pal.accent;
  ctx.font = `500 24px ${fBody}`;
  ctx.fillText("SCAN THE CODE", tx, qrTop + 70);
  ctx.fillStyle = pal.ink;
  ctx.font = `400 50px ${fDisplay}`;
  ctx.fillText("Our wedding website", tx, qrTop + 136);
  ctx.fillStyle = pal.muted;
  ctx.font = `400 30px ${fBody}`;
  const detail = bundle.rsvp.enabled ? "All the events, the venue and RSVP." : "All the events, the venue and travel.";
  ctx.fillText(detail, tx, qrTop + 190);
  if (w.hashtag) {
    ctx.fillStyle = pal.accent;
    ctx.font = `500 30px ${fBody}`;
    ctx.fillText(w.hashtag, tx, qrTop + 260);
  }
  ctx.textAlign = "center";

  // closing line
  ctx.fillStyle = alpha(pal.muted, 0.8);
  ctx.font = `500 18px ${fBody}`;
  spaced(ctx, "MADE WITH LUXE WED", cx, POSTER_H - 92, 6);
  return c;
}

/** Draw the poster and save it as a PNG file. */
export async function downloadPoster(bundle: Bundle, url: string, filename: string) {
  const canvas = await drawPoster(bundle, url);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
  if (!blob) throw new Error("Could not create the poster image.");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
