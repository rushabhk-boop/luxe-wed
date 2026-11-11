"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BuilderHeader, DeviceToggle } from "@/components/dashboard/BuilderHeader";
import { PreviewFrame, StyleControls, ThemePicker } from "@/components/dashboard/design";
import { CoupleFields, EventsEditor, FamilyFields, RsvpFields, TravelFields, WeddingFields } from "@/components/dashboard/forms";
import { useWedding } from "@/components/dashboard/WeddingProvider";
import { names } from "@/lib/defaults";
import { LANGUAGES } from "@/lib/i18n";
import { decodeBundle, encodeBundle, readHash } from "@/lib/share";
import { THEMES, TYPOGRAPHY } from "@/lib/themes";
import { formatDate, formatTime } from "@/lib/time";
import type { Bundle, ThemeKey } from "@/lib/types";
import { publishProblems, stepErrors } from "@/lib/validate";
import { themeDefaults } from "@/lib/themes";

const STEPS = [
  { title: "The two of you", sub: "Your names as they should appear, and a few words for your guests." },
  { title: "The wedding day", sub: "When and where the main celebration takes place." },
  { title: "Your functions", sub: "Add every celebration — Mehendi, Sangeet, Ceremony, Reception or your own." },
  { title: "Your families", sub: "Optional. Introduce your families or hide this section." },
  { title: "Venue & travel", sub: "Help guests arrive and stay comfortably." },
  { title: "RSVP", sub: "Guests' replies come straight to your WhatsApp or email." },
  { title: "Design", sub: "Choose a theme and make it yours. You can change everything later." },
  { title: "Final review", sub: "Check everything, then create your link." },
];

function hasContent(b: ReturnType<typeof useWedding>["bundle"]) {
  return Boolean(b.wedding.bride_name || b.wedding.groom_name || b.events.length);
}

export function SetupWizard() {
  const { bundle, setWedding, setDesign, replace, reset, save } = useWedding();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [notice, setNotice] = useState<string | null>(null);
  const didInit = useRef(false);
  const [pending, setPending] = useState<Bundle | null>(null);

  const openLinked = (b: Bundle) => {
    replace({ ...b, wedding: { ...b.wedding, onboarding_step: 8 } });
    save();
    setPending(null);
    setStep(8);
    setNotice("Your website is open for editing. Remember: after changes, share the new link.");
  };

  // Open on the step the user reached last time; read ?theme= and a pasted link (#slug.data).
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const params = new URLSearchParams(window.location.search);
    const theme = params.get("theme");
    if (window.location.hash.length > 1) {
      try {
        const b = readHash(window.location.hash);
        if (b && hasContent(bundle) && encodeBundle(b) !== encodeBundle(decodeBundle(encodeBundle(bundle)))) setPending(b);
        else if (b) openLinked(b);
      } catch {
        setNotice("That link could not be read. It may be incomplete — copy the whole link and try again.");
      }
      // Keep Next.js's own history state, only drop the long #data from the address bar.
      history.replaceState(history.state, "", window.location.pathname + window.location.search);
      return;
    }
    if (theme && theme in THEMES && !hasContent(bundle)) setDesign(themeDefaults(theme as ThemeKey));
    setStep(Math.min(8, Math.max(1, bundle.wedding.onboarding_step || 1)));
    // run once on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // a new step starts at the top of the page, not halfway down the last one
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  const go = (n: number, validate = true) => {
    if (validate && n > step) {
      const e = stepErrors(step, bundle);
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    setErrors({});
    if (n > bundle.wedding.onboarding_step) setWedding({ onboarding_step: n });
    setStep(n);
  };

  const finish = () => {
    setWedding({ onboarding_done: true, onboarding_step: 8 });
    save();
    router.push("/share");
  };

  const problems = publishProblems(bundle);
  const s = STEPS[step - 1];

  return (
    <div className="min-h-svh">
      <BuilderHeader>
        <ol className="grid grid-cols-8 gap-1 px-4 pb-3 sm:px-8" aria-label="Progress">
          {STEPS.map((x, i) => {
            const n = i + 1;
            const reached = n <= Math.max(bundle.wedding.onboarding_step, step);
            return (
              <li key={x.title}>
                <button type="button" onClick={() => reached && go(n, false)} disabled={!reached} className="w-full text-left" aria-current={n === step ? "step" : undefined} title={x.title}>
                  <span className={`block h-[3px] transition-colors ${n === step ? "bg-ink" : reached ? "bg-champagne" : "bg-line"}`} />
                  <span className={`mt-1.5 hidden truncate text-[10px] uppercase tracking-[0.16em] md:block ${n === step ? "text-ink" : "text-stone"}`}>
                    {n}. {x.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </BuilderHeader>

      <div className={`mx-auto grid gap-10 px-4 py-10 sm:px-8 ${step === 8 ? "max-w-6xl" : "max-w-7xl xl:grid-cols-[minmax(0,1fr)_420px]"}`}>
        <div className="reveal min-w-0" key={step}>
          {pending && (
            <div className="mb-8 border border-ink bg-paper p-5" role="dialog" aria-label="Open website from link">
              <p className="font-display text-2xl">Open {names(pending.wedding).both}&apos;s website for editing?</p>
              <p className="mt-1 text-sm text-ink-soft">This replaces the draft saved in this browser ({names(bundle.wedding).both}).</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-primary btn-sm" onClick={() => openLinked(pending)}>Open for editing</button>
                <button className="btn-ghost btn-sm" onClick={() => setPending(null)}>Keep my draft</button>
              </div>
            </div>
          )}
          {notice && <p className="mb-6 border border-champagne/60 bg-champagne/10 px-4 py-3 text-sm">{notice}</p>}
          <p className="eyebrow">Step {step} of 8</p>
          <h1 className="display mt-3 text-4xl leading-[1.05] sm:text-6xl">{s.title}</h1>
          <p className="mb-10 mt-3 max-w-xl text-ink-soft">{s.sub}</p>

          {step === 1 && <CoupleFields errors={errors} />}
          {step === 2 && <WeddingFields errors={errors} />}
          {step === 3 && <EventsEditor />}
          {step === 4 && <FamilyFields />}
          {step === 5 && <TravelFields errors={errors} />}
          {step === 6 && <RsvpFields />}
          {step === 7 && (
            <div className="space-y-10">
              <ThemePicker />
              <StyleControls compact />
            </div>
          )}
          {step === 8 && <Review goTo={(n) => go(n, false)} device={device} setDevice={setDevice} />}

          {step === 8 && (
            <div className="card mt-10 p-6 sm:p-8">
              {problems.length > 0 ? (
                <div className="mb-6">
                  <p className="field-label">Before you create your link</p>
                  <ul className="space-y-1">
                    {problems.map((p) => (
                      <li key={p.text} className="text-sm text-danger">
                        {p.text} <button className="link text-ink" onClick={() => go(p.step, false)}>Fix in step {p.step}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mb-6 text-ink-soft">Everything looks lovely. Your link, QR code and WhatsApp message are one click away.</p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="btn-outline" onClick={() => router.push("/studio")}>Fine-tune in Design Studio</button>
                <button className="btn-primary" onClick={finish} disabled={problems.length > 0}>Create my wedding link</button>
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
            <button className="btn-ghost" onClick={() => go(step - 1, false)} disabled={step === 1}>Back</button>
            {step < 8 ? (
              <div className="flex items-center gap-4">
                {[3, 4, 5, 6].includes(step) && <button className="text-sm text-stone link" onClick={() => go(step + 1)}>Skip for now</button>}
                <button className="btn-primary" onClick={() => go(step + 1)}>Continue</button>
              </div>
            ) : (
              <button
                className="text-sm text-danger link"
                onClick={() => {
                  if (confirm("Start a new website? This clears the draft saved in this browser. Links you already shared keep working.")) {
                    reset();
                    setStep(1);
                  }
                }}
              >
                Start a new website
              </button>
            )}
          </div>
        </div>

        {step < 8 && (
          <aside className="hidden xl:block">
            <div className="sticky top-36">
              <div className="mb-3 flex items-center justify-between">
                <p className="eyebrow">Live preview</p>
                <span className="text-xs text-stone">{THEMES[bundle.design.theme].name}</span>
              </div>
              <div className="h-[calc(100svh-220px)] max-h-[760px]">
                <PreviewFrame bundle={bundle} device="mobile" />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function Review({ goTo, device, setDevice }: { goTo: (n: number) => void; device: "desktop" | "mobile"; setDevice: (d: "desktop" | "mobile") => void }) {
  const { bundle } = useWedding();
  const { wedding: w, events, family, rsvp, design } = bundle;
  const tr = w.travel ?? {};
  const rows: { step: number; title: string; items: [string, string][] }[] = [
    { step: 1, title: "The couple", items: [["Names", `${w.bride_name} & ${w.groom_name}`], ["Shown as", names(w).both], ["Initials", w.initials], ["Hashtag", w.hashtag], ["Welcome", w.welcome_message], ["Families", w.family_names]] },
    { step: 2, title: "Wedding day", items: [["Date", formatDate(w.wedding_date)], ["Time", formatTime(w.wedding_time)], ["Venue", [w.venue, w.city].filter(Boolean).join(", ")], ["Address", w.venue_address], ["Language", LANGUAGES.find((l) => l.key === w.language)?.name ?? ""], ["Time zone", w.timezone]] },
    { step: 3, title: `Functions (${events.length})`, items: events.map((e) => [e.name || "Untitled", [formatDate(e.event_date, "en", "short"), formatTime(e.start_time), e.venue].filter(Boolean).join(" · ")]) },
    { step: 4, title: "Families", items: family.hidden ? [["Section", "Hidden"]] : [["Bride's parents", family.bride_parents], ["Groom's parents", family.groom_parents], ["Grandparents", family.grandparents]] },
    { step: 5, title: "Travel", items: [["Maps link", w.maps_url], ["Airport", tr.airport ?? ""], ["Railway", tr.railway ?? ""], ["Hotels", tr.hotels ?? ""], ["Parking", tr.parking ?? ""]] },
    { step: 6, title: "RSVP", items: [["RSVP", rsvp.enabled ? "On" : "Off"], ["WhatsApp", rsvp.whatsapp], ["Email", rsvp.email], ["Deadline", formatDate(rsvp.deadline)], ["Max guests", String(rsvp.max_attendees)]] },
    { step: 7, title: "Design", items: [["Theme", THEMES[design.theme].name], ["Palette", THEMES[design.theme].palettes[design.palette]?.name ?? "Custom"], ["Typography", TYPOGRAPHY[design.typography]?.name ?? ""], ["Layout", design.layout]] },
  ];
  return (
    <div className="space-y-10">
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((r) => (
          <section key={r.step} className="card p-5">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-display text-2xl">{r.title}</h2>
              <button className="text-xs uppercase tracking-[0.2em] text-stone link" onClick={() => goTo(r.step)}>Edit</button>
            </div>
            <dl className="space-y-1.5 text-sm">
              {r.items.filter(([, v]) => v).length === 0 && <p className="text-stone">Nothing added.</p>}
              {r.items
                .filter(([, v]) => v)
                .map(([k, v], i) => (
                  <div key={i} className="grid grid-cols-[110px_1fr] gap-3">
                    <dt className="text-stone">{k}</dt>
                    <dd className="line-clamp-2">{v}</dd>
                  </div>
                ))}
            </dl>
          </section>
        ))}
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="eyebrow">Full website preview</p>
          <DeviceToggle device={device} setDevice={setDevice} />
        </div>
        <div className="h-[78svh] bg-sand/60 p-3 sm:p-6">
          <PreviewFrame bundle={bundle} device={device} />
        </div>
      </div>
    </div>
  );
}
