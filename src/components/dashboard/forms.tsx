"use client";
import { useState } from "react";
import { LANGUAGES } from "@/lib/i18n";
import { EVENT_KINDS, ILLUSTRATIONS, TIMEZONES } from "@/lib/themes";
import { formatDate, formatTime } from "@/lib/time";
import type { RsvpQuestion, Travel, WeddingEvent } from "@/lib/types";
import { EventIcon, iconFor } from "@/components/site/Ornaments";
import { useWedding } from "./WeddingProvider";

export type Errors = Partial<Record<string, string>>;

export function Field({
  label,
  hint,
  error,
  optional,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="field-label">
        {label} {optional && <span className="normal-case tracking-normal text-stone/70">· optional</span>}
      </label>
      {children}
      {error ? <p className="error">{error}</p> : hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`input ${props.className ?? ""}`} value={props.value ?? ""} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={`input resize-y ${props.className ?? ""}`} value={props.value ?? ""} />;
}

export function Toggle({ on, onChange, label, hint }: { on: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="flex w-full items-start justify-between gap-6 py-3.5 text-left" aria-pressed={on}>
      <span>
        <span className="block text-[15px]">{label}</span>
        {hint && <span className="block text-xs text-stone mt-0.5">{hint}</span>}
      </span>
      <span className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors ${on ? "bg-ink border-ink" : "bg-sand border-line-strong"}`}>
        <span className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-paper shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

export function Panel({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="card p-5 sm:p-8">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-[28px] leading-tight">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Step 1: couple                                                      */
/* ------------------------------------------------------------------ */
export function CoupleFields({ errors = {} }: { errors?: Errors }) {
  const { bundle, setWedding } = useWedding();
  const w = bundle.wedding;
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Bride's full name" error={errors.bride_name}>
        <TextInput value={w.bride_name} onChange={(e) => setWedding({ bride_name: e.target.value })} placeholder="Riya Mehta" maxLength={120} />
      </Field>
      <Field label="Groom's full name" error={errors.groom_name}>
        <TextInput value={w.groom_name} onChange={(e) => setWedding({ groom_name: e.target.value })} placeholder="Rahul Kapoor" maxLength={120} />
      </Field>
      <Field label="Bride's display name" hint="Shown large on the website. Leave empty to use the first name." optional>
        <TextInput value={w.bride_display} onChange={(e) => setWedding({ bride_display: e.target.value })} placeholder="Riya" maxLength={60} />
      </Field>
      <Field label="Groom's display name" hint="Leave empty to use the first name." optional>
        <TextInput value={w.groom_display} onChange={(e) => setWedding({ groom_display: e.target.value })} placeholder="Rahul" maxLength={60} />
      </Field>
      <Field label="Couple's initials" hint="Used as your monogram, e.g. R&R" optional>
        <TextInput value={w.initials} onChange={(e) => setWedding({ initials: e.target.value })} placeholder="R&R" maxLength={8} />
      </Field>
      <Field label="Wedding hashtag" optional>
        <TextInput value={w.hashtag} onChange={(e) => setWedding({ hashtag: e.target.value })} placeholder="#RiyaWedsRahul" maxLength={60} />
      </Field>
      <Field label="A short welcome message" className="sm:col-span-2" hint="A few warm lines for your guests." optional>
        <TextArea
          value={w.welcome_message}
          onChange={(e) => setWedding({ welcome_message: e.target.value })}
          maxLength={2000}
          placeholder="Two families, one celebration. We would be honoured to have you with us…"
        />
      </Field>
      <Field label="Names of both families" className="sm:col-span-2" optional>
        <TextInput value={w.family_names} onChange={(e) => setWedding({ family_names: e.target.value })} placeholder="The Mehta & Kapoor families" maxLength={200} />
      </Field>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 2: wedding                                                     */
/* ------------------------------------------------------------------ */
export function WeddingFields({ errors = {} }: { errors?: Errors }) {
  const { bundle, setWedding } = useWedding();
  const w = bundle.wedding;
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Wedding date" error={errors.wedding_date} hint={w.wedding_date ? formatDate(w.wedding_date) : undefined}>
        <TextInput type="date" value={w.wedding_date ?? ""} onChange={(e) => setWedding({ wedding_date: e.target.value || null })} />
      </Field>
      <Field label="Wedding time" hint={w.wedding_time ? formatTime(w.wedding_time) : "Used for the countdown"} optional>
        <TextInput type="time" value={w.wedding_time?.slice(0, 5) ?? ""} onChange={(e) => setWedding({ wedding_time: e.target.value || null })} />
      </Field>
      <Field label="City">
        <TextInput value={w.city} onChange={(e) => setWedding({ city: e.target.value })} placeholder="Udaipur" maxLength={120} />
      </Field>
      <Field label="Venue">
        <TextInput value={w.venue} onChange={(e) => setWedding({ venue: e.target.value })} placeholder="The Lake Palace Gardens" maxLength={200} />
      </Field>
      <Field label="Full venue address" className="sm:col-span-2">
        <TextArea rows={2} value={w.venue_address} onChange={(e) => setWedding({ venue_address: e.target.value })} placeholder="Lake Pichola, Udaipur, Rajasthan 313001" maxLength={500} />
      </Field>
      <Field label="Website language" hint="Headings, buttons and the RSVP form use this language.">
        <select className="input" value={w.language} onChange={(e) => setWedding({ language: e.target.value as typeof w.language })}>
          {LANGUAGES.map((l) => (
            <option key={l.key} value={l.key}>{l.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Time zone" hint="The countdown counts to this local time.">
        <select className="input" value={w.timezone} onChange={(e) => setWedding({ timezone: e.target.value })}>
          {(TIMEZONES.includes(w.timezone) ? TIMEZONES : [w.timezone, ...TIMEZONES]).map((z) => (
            <option key={z} value={z}>{z.replace("_", " ")}</option>
          ))}
        </select>
      </Field>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 3: events                                                      */
/* ------------------------------------------------------------------ */
function newEvent(weddingId: string, kind: string, date: string | null, position: number): WeddingEvent {
  const k = EVENT_KINDS.find((x) => x.kind === kind) ?? EVENT_KINDS[EVENT_KINDS.length - 1];
  return {
    id: crypto.randomUUID(),
    wedding_id: weddingId,
    position,
    kind: k.kind,
    name: k.kind === "custom" ? "" : k.name,
    event_date: date,
    start_time: null,
    end_time: null,
    venue: "",
    address: "",
    maps_url: "",
    dress_code: k.dress,
    description: k.blurb,
    illustration: "auto",
  };
}

export function EventsEditor() {
  const { bundle, setEvents } = useWedding();
  const events = bundle.events;
  const [openId, setOpenId] = useState<string | null>(events[0]?.id ?? null);

  const add = (kind: string) => {
    const e = newEvent(bundle.wedding.id, kind, bundle.wedding.wedding_date, events.length);
    if (kind === "ceremony" || kind === "reception") {
      e.venue = bundle.wedding.venue;
      e.address = bundle.wedding.venue_address;
    }
    setEvents([...events, e]);
    setOpenId(e.id);
  };
  const patch = (id: string, p: Partial<WeddingEvent>) => setEvents(events.map((e) => (e.id === id ? { ...e, ...p } : e)));
  const remove = (id: string) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    setEvents(events.filter((e) => e.id !== id));
  };
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= events.length) return;
    const copy = [...events];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setEvents(copy);
  };
  const sortByDate = () =>
    setEvents([...events].sort((a, b) => `${a.event_date ?? "9"}${a.start_time ?? ""}`.localeCompare(`${b.event_date ?? "9"}${b.start_time ?? ""}`)));

  return (
    <div>
      <p className="field-label">Add an event</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {EVENT_KINDS.map((k) => (
          <button type="button" key={k.kind} className="chip" onClick={() => add(k.kind)}>
            <span className="text-gold">+</span> {k.name}
          </button>
        ))}
      </div>

      {events.length === 0 && (
        <div className="border border-dashed border-line-strong p-10 text-center text-stone">
          No events yet. Add your Mehendi, Sangeet, Ceremony or any custom function above.
        </div>
      )}

      {events.length > 1 && (
        <div className="mb-3 flex justify-end">
          <button type="button" className="text-xs text-stone link" onClick={sortByDate}>Sort by date</button>
        </div>
      )}

      <ol className="space-y-3">
        {events.map((e, i) => {
          const open = openId === e.id;
          const icon = iconFor(e.kind, e.illustration);
          return (
            <li key={e.id} className="card">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center border border-line text-gold">
                  {icon ? <EventIcon name={icon} className="h-6 w-6" /> : <span className="text-xs">{i + 1}</span>}
                </span>
                <button type="button" className="flex-1 min-w-0 text-left" onClick={() => setOpenId(open ? null : e.id)} aria-expanded={open}>
                  <span className="block font-display text-xl truncate">{e.name || "Untitled event"}</span>
                  <span className="block text-xs text-stone truncate">
                    {[formatDate(e.event_date, "en", "short"), formatTime(e.start_time), e.venue].filter(Boolean).join(" · ") || "Add date, time and venue"}
                  </span>
                </button>
                <div className="flex items-center gap-1">
                  <IconBtn label="Move up" onClick={() => move(i, -1)} disabled={i === 0} d="M6 15 L12 9 L18 15" />
                  <IconBtn label="Move down" onClick={() => move(i, 1)} disabled={i === events.length - 1} d="M6 9 L12 15 L18 9" />
                  <IconBtn label="Delete event" onClick={() => remove(e.id)} d="M5 7 H19 M9 7 V4 H15 V7 M7 7 L8 20 H16 L17 7" />
                </div>
              </div>
              {open && (
                <div className="grid gap-5 border-t border-line px-4 py-6 sm:grid-cols-2 sm:px-6">
                  <Field label="Event name">
                    <TextInput value={e.name} onChange={(x) => patch(e.id, { name: x.target.value })} maxLength={120} placeholder="Sangeet" />
                  </Field>
                  <Field label="Event date">
                    <TextInput type="date" value={e.event_date ?? ""} onChange={(x) => patch(e.id, { event_date: x.target.value || null })} />
                  </Field>
                  <Field label="Starting time">
                    <TextInput type="time" value={e.start_time?.slice(0, 5) ?? ""} onChange={(x) => patch(e.id, { start_time: x.target.value || null })} />
                  </Field>
                  <Field label="Ending time" optional>
                    <TextInput type="time" value={e.end_time?.slice(0, 5) ?? ""} onChange={(x) => patch(e.id, { end_time: x.target.value || null })} />
                  </Field>
                  <Field label="Venue name">
                    <TextInput value={e.venue} onChange={(x) => patch(e.id, { venue: x.target.value })} maxLength={200} />
                  </Field>
                  <Field label="Dress code" optional>
                    <TextInput value={e.dress_code} onChange={(x) => patch(e.id, { dress_code: x.target.value })} maxLength={200} />
                  </Field>
                  <Field label="Complete address" className="sm:col-span-2">
                    <TextInput value={e.address} onChange={(x) => patch(e.id, { address: x.target.value })} maxLength={500} />
                  </Field>
                  <Field label="Google Maps link" hint="Paste a share link from Google Maps. If empty, guests get a search for the venue and address." optional className="sm:col-span-2">
                    <TextInput value={e.maps_url} onChange={(x) => patch(e.id, { maps_url: x.target.value })} maxLength={1000} placeholder="https://maps.app.goo.gl/…" />
                  </Field>
                  <Field label="Description" optional className="sm:col-span-2">
                    <TextArea rows={3} value={e.description} onChange={(x) => patch(e.id, { description: x.target.value })} maxLength={1500} />
                  </Field>
                  <div className="sm:col-span-2">
                    <p className="field-label">Illustration</p>
                    <div className="flex flex-wrap gap-2">
                      {ILLUSTRATIONS.map((il) => {
                        const ic = il === "auto" ? iconFor(e.kind, "auto") : il === "none" ? null : il;
                        return (
                          <button
                            type="button"
                            key={il}
                            title={il}
                            onClick={() => patch(e.id, { illustration: il })}
                            className={`grid h-12 min-w-12 place-items-center border px-2 text-[10px] uppercase tracking-widest transition-colors ${e.illustration === il ? "border-ink bg-ink text-ivory" : "border-line text-gold hover:border-ink"}`}
                          >
                            {il === "none" ? "None" : il === "auto" ? <span className="flex items-center gap-1">{ic && <EventIcon name={ic} className="h-5 w-5" />}Auto</span> : ic && <EventIcon name={ic} className="h-6 w-6" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function IconBtn({ label, onClick, d, disabled }: { label: string; onClick: () => void; d: string; disabled?: boolean }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className="grid h-9 w-9 place-items-center text-stone hover:text-ink disabled:opacity-25 transition-colors">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={d} />
      </svg>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Step 4: family                                                      */
/* ------------------------------------------------------------------ */
export function FamilyFields() {
  const { bundle, setFamily } = useWedding();
  const f = bundle.family;
  return (
    <div>
      <div className="border-b border-line mb-6">
        <Toggle on={!f.hidden} onChange={(v) => setFamily({ hidden: !v })} label="Show the families section" hint="Turn off to hide it from your website completely." />
      </div>
      <div className={`grid gap-6 sm:grid-cols-2 ${f.hidden ? "opacity-50" : ""}`}>
        <Field label="Bride's parents" optional>
          <TextInput value={f.bride_parents} onChange={(e) => setFamily({ bride_parents: e.target.value })} placeholder="Mrs. Anjali & Mr. Sanjay Mehta" maxLength={300} />
        </Field>
        <Field label="Groom's parents" optional>
          <TextInput value={f.groom_parents} onChange={(e) => setFamily({ groom_parents: e.target.value })} placeholder="Mrs. Kavita & Mr. Vikram Kapoor" maxLength={300} />
        </Field>
        <Field label="Grandparents" optional className="sm:col-span-2">
          <TextInput value={f.grandparents} onChange={(e) => setFamily({ grandparents: e.target.value })} maxLength={600} />
        </Field>
        <Field label="Family introduction" optional className="sm:col-span-2">
          <TextArea rows={3} value={f.introduction} onChange={(e) => setFamily({ introduction: e.target.value })} maxLength={2000} />
        </Field>
        <Field label="Additional acknowledgements" optional className="sm:col-span-2">
          <TextArea rows={3} value={f.acknowledgements} onChange={(e) => setFamily({ acknowledgements: e.target.value })} maxLength={2000} />
        </Field>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 5: venue & travel                                              */
/* ------------------------------------------------------------------ */
export function TravelFields({ errors = {} }: { errors?: Errors }) {
  const { bundle, setWedding } = useWedding();
  const w = bundle.wedding;
  const tr = w.travel ?? {};
  const setT = (p: Partial<Travel>) => setWedding({ travel: { ...tr, ...p } });
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Wedding venue">
        <TextInput value={w.venue} onChange={(e) => setWedding({ venue: e.target.value })} maxLength={200} />
      </Field>
      <Field label="Google Maps link" error={errors.maps_url} hint="Optional. Without it, guests get a map search for the venue." optional>
        <TextInput value={w.maps_url} onChange={(e) => setWedding({ maps_url: e.target.value })} placeholder="https://maps.app.goo.gl/…" maxLength={1000} />
      </Field>
      <Field label="Address" className="sm:col-span-2">
        <TextArea rows={2} value={w.venue_address} onChange={(e) => setWedding({ venue_address: e.target.value })} maxLength={500} />
      </Field>
      <Field label="Nearby airport" optional>
        <TextInput value={tr.airport} onChange={(e) => setT({ airport: e.target.value })} placeholder="Maharana Pratap Airport (UDR), 25 km" maxLength={300} />
      </Field>
      <Field label="Nearby railway station" optional>
        <TextInput value={tr.railway} onChange={(e) => setT({ railway: e.target.value })} maxLength={300} />
      </Field>
      <Field label="Nearby hotels" optional className="sm:col-span-2">
        <TextArea rows={2} value={tr.hotels} onChange={(e) => setT({ hotels: e.target.value })} maxLength={800} />
      </Field>
      <Field label="Parking information" optional>
        <TextInput value={tr.parking} onChange={(e) => setT({ parking: e.target.value })} maxLength={400} />
      </Field>
      <Field label="Travel assistance" optional>
        <TextInput value={tr.assistance} onChange={(e) => setT({ assistance: e.target.value })} placeholder="Contact Karan on +91 …" maxLength={400} />
      </Field>
      <Field label="Accommodation information" optional className="sm:col-span-2">
        <TextArea rows={2} value={tr.accommodation} onChange={(e) => setT({ accommodation: e.target.value })} maxLength={800} />
      </Field>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 6: RSVP settings                                               */
/* ------------------------------------------------------------------ */
export function RsvpFields() {
  const { bundle, setRsvp } = useWedding();
  const r = bundle.rsvp;
  const [label, setLabel] = useState("");
  const [type, setType] = useState<RsvpQuestion["type"]>("text");
  const addQ = () => {
    if (!label.trim()) return;
    setRsvp({ questions: [...r.questions, { id: crypto.randomUUID().slice(0, 8), label: label.trim().slice(0, 200), type, required: false }] });
    setLabel("");
  };
  return (
    <div className="space-y-8">
      <div className="divide-y divide-line border-y border-line">
        <Toggle on={r.enabled} onChange={(v) => setRsvp({ enabled: v })} label="Collect RSVPs on my website" hint="Guests fill in the form and it is sent to you as a ready-written WhatsApp message or email." />
      </div>
      <div className={r.enabled ? "" : "opacity-50 pointer-events-none"}>
        <div className="grid gap-6 sm:grid-cols-2 mb-6">
          <Field label="Your WhatsApp number" hint="With country code, e.g. +91 98765 43210. RSVPs arrive here.">
            <TextInput type="tel" value={r.whatsapp} onChange={(e) => setRsvp({ whatsapp: e.target.value })} placeholder="+91 98765 43210" maxLength={30} />
          </Field>
          <Field label="Or your email" hint="Optional. Guests can reply by email instead." optional>
            <TextInput type="email" value={r.email} onChange={(e) => setRsvp({ email: e.target.value })} placeholder="riya.rahul@gmail.com" maxLength={200} />
          </Field>
        </div>
        {r.enabled && !r.whatsapp.trim() && !r.email.trim() && (
          <p className="mb-6 border border-champagne/60 bg-champagne/10 px-4 py-3 text-sm">Add a WhatsApp number or email, otherwise the RSVP form is not shown on your website.</p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 mb-6">
          <Field label="RSVP deadline" optional>
            <TextInput type="date" value={r.deadline ?? ""} onChange={(e) => setRsvp({ deadline: e.target.value || null })} />
          </Field>
          <Field label="Maximum guests per response">
            <select className="input" value={r.max_attendees} onChange={(e) => setRsvp({ max_attendees: Number(e.target.value) })}>
              {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>
        </div>
        <p className="field-label">What guests are asked</p>
        <p className="text-sm text-stone mb-1">Name, attendance and number of guests are always asked.</p>
        <div className="divide-y divide-line border-y border-line">
          <Toggle on={r.ask_events} onChange={(v) => setRsvp({ ask_events: v })} label="Which events they will attend" />
          <Toggle on={r.ask_phone} onChange={(v) => setRsvp({ ask_phone: v })} label="Contact number (optional for guests)" />
          <Toggle on={r.ask_email} onChange={(v) => setRsvp({ ask_email: v })} label="Email (optional for guests)" />
          <Toggle on={r.ask_dietary} onChange={(v) => setRsvp({ ask_dietary: v })} label="Dietary preferences" />
          <Toggle on={r.ask_message} onChange={(v) => setRsvp({ ask_message: v })} label="Message to the couple" />
        </div>

        <p className="field-label mt-8">Your own questions</p>
        {r.questions.length > 0 && (
          <ul className="mb-4 divide-y divide-line border border-line bg-paper">
            {r.questions.map((q) => (
              <li key={q.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="flex-1 min-w-[160px]">{q.label}</span>
                <span className="text-xs text-stone">{q.type === "yesno" ? "Yes / No" : "Text"}</span>
                <label className="flex items-center gap-2 text-xs text-stone">
                  <input type="checkbox" checked={q.required} onChange={(e) => setRsvp({ questions: r.questions.map((x) => (x.id === q.id ? { ...x, required: e.target.checked } : x)) })} />
                  Required
                </label>
                <button type="button" className="text-xs text-danger link" onClick={() => setRsvp({ questions: r.questions.filter((x) => x.id !== q.id) })}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <input className="input flex-1" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Will you need airport pick-up?" maxLength={200} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addQ())} />
          <select className="input sm:w-40" value={type} onChange={(e) => setType(e.target.value as RsvpQuestion["type"])}>
            <option value="text">Text answer</option>
            <option value="yesno">Yes / No</option>
          </select>
          <button type="button" className="btn-outline" onClick={addQ}>Add question</button>
        </div>
      </div>
    </div>
  );
}
