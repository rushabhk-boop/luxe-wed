import { z } from "zod";
import type { Bundle } from "./types";

export const coupleSchema = z.object({
  bride_name: z.string().trim().min(1, "Please enter the bride's name."),
  groom_name: z.string().trim().min(1, "Please enter the groom's name."),
});

export const weddingSchema = z.object({
  wedding_date: z.string({ error: "Please choose the wedding date." }).regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose the wedding date."),
});

export const travelSchema = z.object({
  maps_url: z.string().refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Paste a full link starting with https://"),
});

export function stepErrors(step: number, b: Bundle): Record<string, string> {
  const schema = step === 1 ? coupleSchema : step === 2 ? weddingSchema : step === 5 ? travelSchema : null;
  if (!schema) return {};
  const r = schema.safeParse(b.wedding);
  if (r.success) return {};
  const out: Record<string, string> = {};
  for (const i of r.error.issues) out[String(i.path[0])] = i.message;
  return out;
}

/** What still blocks publishing, in plain words. */
export function publishProblems(b: Bundle): { step: number; text: string }[] {
  const out: { step: number; text: string }[] = [];
  if (!b.wedding.bride_name.trim() || !b.wedding.groom_name.trim()) out.push({ step: 1, text: "Add both of your names." });
  if (!b.wedding.wedding_date) out.push({ step: 2, text: "Choose the wedding date." });
  const bad = b.events.find((e) => !e.name.trim());
  if (bad) out.push({ step: 3, text: "Every event needs a name." });
  if (b.rsvp.enabled && !b.rsvp.whatsapp.trim() && !b.rsvp.email.trim())
    out.push({ step: 6, text: "Add a WhatsApp number or email for RSVPs, or switch RSVP off." });
  return out;
}
