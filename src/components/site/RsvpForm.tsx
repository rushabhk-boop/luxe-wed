"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { t } from "@/lib/i18n";
import type { Lang, RsvpSettings, WeddingEvent } from "@/lib/types";

const schema = z.object({
  guest_name: z.string().trim().min(1, "Please enter your name.").max(120),
  phone: z.string().trim().max(30).refine((v) => v === "" || /^[+()\d\s-]{6,30}$/.test(v), "Please check the phone number."),
  email: z.string().trim().max(200).refine((v) => v === "" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), "Please check the email address."),
  status: z.enum(["confirmed", "declined", "pending"]),
  attendees: z.coerce.number().int().min(1).max(50),
  event_ids: z.array(z.string()),
  dietary: z.string().max(300),
  message: z.string().max(1500),
  answers: z.record(z.string(), z.string().max(500)),
});

type Values = z.input<typeof schema>;

/** Digits only, for wa.me links. */
export function waNumber(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

/**
 * No database: the response is written as a message and sent to the couple
 * on WhatsApp (or by email) from the guest's own phone.
 */
export function RsvpForm({
  settings,
  events,
  lang,
  couple,
  preview,
}: {
  settings: RsvpSettings;
  events: WeddingEvent[];
  lang: Lang;
  couple: string;
  preview: boolean;
}) {
  const L = t(lang);
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wa = waNumber(settings.whatsapp);
  const email = settings.email.trim();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { guest_name: "", phone: "", email: "", status: "confirmed", attendees: 1, event_ids: events.map((e) => e.id), dietary: "", message: "", answers: {} },
  });
  const status = watch("status");

  const closed = settings.deadline && new Date().toISOString().slice(0, 10) > settings.deadline;
  if (closed) return <p className="lw-note">{L.closed}</p>;

  const compose = (v: Values) => {
    const answer = v.status === "confirmed" ? L.yes : v.status === "declined" ? L.no : L.maybe;
    const lines = [`RSVP — ${couple}`, "", `${L.name}: ${v.guest_name.trim()}`, `${L.attend} ${answer}`];
    if (v.status !== "declined") {
      lines.push(`${L.guests}: ${v.attendees}`);
      if (settings.ask_events && events.length > 1) {
        const picked = events.filter((e) => v.event_ids.includes(e.id)).map((e) => e.name);
        lines.push(`${L.whichEvents} ${picked.join(", ") || "—"}`);
      }
      if (v.dietary.trim()) lines.push(`${L.dietary}: ${v.dietary.trim()}`);
    }
    if (v.phone.trim()) lines.push(`${L.phone}: ${v.phone.trim()}`);
    if (v.email.trim()) lines.push(`${L.email}: ${v.email.trim()}`);
    for (const q of settings.questions) {
      const a = v.answers?.[q.id]?.trim();
      if (a) lines.push(`${q.label}: ${a}`);
    }
    if (v.message.trim()) lines.push("", v.message.trim());
    return lines.join("\n");
  };

  const send = (via: "whatsapp" | "email") =>
    handleSubmit((v) => {
      setError(null);
      for (const q of settings.questions) {
        if (q.required && !(v.answers?.[q.id] ?? "").trim()) {
          setError(`Please answer: ${q.label}`);
          return;
        }
      }
      const text = compose(v);
      if (preview) {
        setSent(`Preview only. Guests will send this to you on ${via === "whatsapp" ? "WhatsApp" : "email"}:\n\n${text}`);
        return;
      }
      const href =
        via === "whatsapp"
          ? `https://wa.me/${wa}?text=${encodeURIComponent(text)}`
          : `mailto:${email}?subject=${encodeURIComponent(`RSVP — ${couple}`)}&body=${encodeURIComponent(text)}`;
      window.open(href, "_blank", "noopener");
      setSent(`${L.thanks}`);
    });

  if (!wa && !email) {
    return <p className="lw-note">{preview ? "Add your WhatsApp number or email in RSVP settings so guests can reply." : L.closed}</p>;
  }

  if (sent) {
    return (
      <div className="lw-rsvp-done" role="status">
        <p style={{ whiteSpace: "pre-wrap" }}>{sent}</p>
        {!preview && <p className="lw-note">If WhatsApp or your email app did not open, please message the couple directly.</p>}
        <button className="lw-btn lw-btn-ghost" style={{ marginTop: 16 }} onClick={() => setSent(null)}>Edit response</button>
      </div>
    );
  }

  return (
    <form className="lw-form" onSubmit={send(wa ? "whatsapp" : "email")} noValidate>
      <div className="lw-field">
        <label htmlFor="rsvp-name">{L.name}</label>
        <input id="rsvp-name" autoComplete="name" {...register("guest_name")} />
        {errors.guest_name && <span className="lw-err">{errors.guest_name.message}</span>}
      </div>

      <fieldset className="lw-field">
        <legend>{L.attend}</legend>
        <div className="lw-choices">
          {(["confirmed", "declined", "pending"] as const).map((s) => (
            <label key={s} className={`lw-choice ${status === s ? "is-on" : ""}`}>
              <input type="radio" value={s} {...register("status")} />
              <span>{s === "confirmed" ? L.yes : s === "declined" ? L.no : L.maybe}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {status !== "declined" && (
        <div className="lw-field">
          <label htmlFor="rsvp-count">{L.guests}</label>
          <select id="rsvp-count" {...register("attendees")}>
            {Array.from({ length: settings.max_attendees }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      )}

      {status !== "declined" && settings.ask_events && events.length > 1 && (
        <fieldset className="lw-field">
          <legend>{L.whichEvents}</legend>
          <div className="lw-checks">
            {events.map((e) => (
              <label key={e.id} className="lw-check">
                <input type="checkbox" value={e.id} {...register("event_ids")} />
                <span>{e.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="lw-row">
        {settings.ask_phone && (
          <div className="lw-field">
            <label htmlFor="rsvp-phone">{L.phone} <small>({L.optional})</small></label>
            <input id="rsvp-phone" type="tel" autoComplete="tel" {...register("phone")} />
            {errors.phone && <span className="lw-err">{errors.phone.message}</span>}
          </div>
        )}
        {settings.ask_email && (
          <div className="lw-field">
            <label htmlFor="rsvp-email">{L.email} <small>({L.optional})</small></label>
            <input id="rsvp-email" type="email" autoComplete="email" {...register("email")} />
            {errors.email && <span className="lw-err">{errors.email.message}</span>}
          </div>
        )}
      </div>

      {status !== "declined" && settings.ask_dietary && (
        <div className="lw-field">
          <label htmlFor="rsvp-diet">{L.dietary} <small>({L.optional})</small></label>
          <input id="rsvp-diet" placeholder="Vegetarian, Jain, no onion-garlic…" {...register("dietary")} />
        </div>
      )}

      {settings.questions.map((q) => (
        <div className="lw-field" key={q.id}>
          <label htmlFor={`q-${q.id}`}>{q.label} {!q.required && <small>({L.optional})</small>}</label>
          {q.type === "yesno" ? (
            <select id={`q-${q.id}`} {...register(`answers.${q.id}`)}>
              <option value="">—</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          ) : (
            <input id={`q-${q.id}`} {...register(`answers.${q.id}`)} />
          )}
        </div>
      ))}

      {settings.ask_message && (
        <div className="lw-field">
          <label htmlFor="rsvp-msg">{L.message} <small>({L.optional})</small></label>
          <textarea id="rsvp-msg" rows={3} {...register("message")} />
        </div>
      )}

      {error && <p className="lw-err" role="alert">{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {wa && <button className="lw-btn lw-btn-solid" type="button" onClick={send("whatsapp")}>{L.send} · WhatsApp</button>}
        {email && <button className={`lw-btn ${wa ? "" : "lw-btn-solid"}`} type="button" onClick={send("email")}>{L.send} · Email</button>}
      </div>
    </form>
  );
}
