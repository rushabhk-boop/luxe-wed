import Link from "next/link";
import type { CSSProperties } from "react";
import { initialsOf, names } from "@/lib/defaults";
import { t } from "@/lib/i18n";
import { resolvePalette, TYPOGRAPHY, THEMES } from "@/lib/themes";
import { dotDate, formatDate, formatTime } from "@/lib/time";
import type { Bundle, SectionKey, WeddingEvent } from "@/lib/types";
import { Countdown } from "./Countdown";
import { Divider, EventIcon, Frame, iconFor, MinimalArch, Moon, RoyalArch, Sprig, Star } from "./Ornaments";
import { Petals, SplitName } from "./Motion";
import { RsvpForm } from "./RsvpForm";
import { SiteAnimator } from "./SiteAnimator";

export type SiteMode = "public" | "preview" | "thumb";

export function mapsLink(url: string, venue: string, address: string) {
  if (url && /^https?:\/\//i.test(url)) return url;
  const q = [venue, address].filter(Boolean).join(", ");
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : "";
}

function timeRange(e: WeddingEvent, lang: Bundle["wedding"]["language"]) {
  const a = formatTime(e.start_time, lang);
  const b = formatTime(e.end_time, lang);
  return a && b ? `${a} – ${b}` : a;
}

export function WeddingSite({
  bundle,
  mode = "public",
  banner,
  editHref,
}: {
  bundle: Bundle;
  mode?: SiteMode;
  banner?: "draft" | null;
  editHref?: string;
}) {
  const { wedding: w, events, family, design, rsvp } = bundle;
  const L = t(w.language);
  const theme = THEMES[design.theme] ? design.theme : "minimalist";
  const pal = resolvePalette(design);
  const typo = TYPOGRAPHY[design.typography] ?? TYPOGRAPHY.classic;
  const { a, b } = names(w);
  const mono = initialsOf(w);
  const texts = design.texts ?? {};
  const hidden = new Set(design.hidden_sections ?? []);
  if (family.hidden) hidden.add("families");
  if (!rsvp.enabled) hidden.add("rsvp");

  const style = {
    "--bg": pal.bg,
    "--surface": pal.surface,
    "--ink": pal.ink,
    "--muted": pal.muted,
    "--accent": pal.accent,
    "--line": pal.line,
    "--font-display": typo.display,
    "--font-names": typo.names,
    "--font-body": typo.body,
  } as CSSProperties;

  const cls = [
    "lw-site",
    `t-${theme}`,
    `lay-${design.layout}`,
    `bg-${design.background}`,
    `deco-${design.decorations}`,
    `anim-${mode === "thumb" ? "none" : design.animation}`,
    `mode-${mode}`,
  ].join(" ");

  const venueMap = mapsLink(w.maps_url, w.venue, w.venue_address);
  const travelItems = (
    [
      ["airport", w.travel?.airport],
      ["railway", w.travel?.railway],
      ["hotels", w.travel?.hotels],
      ["accommodation", w.travel?.accommodation],
      ["parking", w.travel?.parking],
      ["assistance", w.travel?.assistance],
    ] as const
  ).filter(([, v]) => v && v.trim());

  const hasFamily =
    family.bride_parents || family.groom_parents || family.grandparents || family.introduction || family.acknowledgements;

  const present: Record<SectionKey, boolean> = {
    welcome: Boolean(w.welcome_message.trim()),
    events: events.length > 0,
    countdown: Boolean(w.wedding_date),
    families: Boolean(hasFamily),
    location: Boolean(w.venue || w.venue_address),
    travel: travelItems.length > 0,
    rsvp: rsvp.enabled && (mode !== "public" || Boolean(rsvp.whatsapp.trim() || rsvp.email.trim())),
  };

  const order = (design.section_order?.length ? design.section_order : (Object.keys(present) as SectionKey[])).filter(
    (k) => present[k] && !hidden.has(k),
  );

  const head = (key: SectionKey, i: number, fallback: string) => (
    <header className="lw-head lw-reveal">
      <span className="lw-index">{String(i + 1).padStart(2, "0")}</span>
      <h2 className="lw-title">{texts[key] || fallback}</h2>
      <Divider theme={theme} />
    </header>
  );

  const sections: Record<SectionKey, (i: number) => React.ReactNode> = {
    welcome: (i) => (
      <section id="welcome" className="lw-section lw-welcome" key="welcome">
        {head("welcome", i, L.welcome)}
        <p className="lw-lead lw-reveal">{w.welcome_message}</p>
        {w.family_names && <p className="lw-sign lw-reveal">— {w.family_names}</p>}
      </section>
    ),
    events: (i) => (
      <section id="events" className="lw-section lw-events" key="events">
        {head("events", i, L.events)}
        <div className="lw-cards">
          {events.map((e, n) => {
            const icon = iconFor(e.kind, e.illustration);
            const map = mapsLink(e.maps_url, e.venue, e.address);
            return (
              <article className="lw-card lw-reveal" key={e.id} style={{ transitionDelay: `${(n % 3) * 120}ms` }}>
                <div className="lw-card-in">
                  {icon && <EventIcon name={icon} className="lw-card-icon lw-orn" />}
                  <span className="lw-card-num">{String(n + 1).padStart(2, "0")}</span>
                  <h3 className="lw-card-title">{e.name || "Event"}</h3>
                  {(e.event_date || e.start_time) && (
                    <p className="lw-card-when">
                      {formatDate(e.event_date, w.language)}
                      {e.event_date && e.start_time ? <span className="lw-dot"> · </span> : null}
                      {timeRange(e, w.language)}
                    </p>
                  )}
                  {e.venue && <p className="lw-card-venue">{e.venue}</p>}
                  {e.address && <p className="lw-card-addr">{e.address}</p>}
                  {e.description && <p className="lw-card-desc">{e.description}</p>}
                  {e.dress_code && (
                    <p className="lw-card-dress">
                      <span>{L.dressCode}</span> {e.dress_code}
                    </p>
                  )}
                  {map && (
                    <a className="lw-btn lw-btn-ghost" href={map} target="_blank" rel="noopener noreferrer">
                      {L.viewMap}
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    ),
    countdown: (i) => (
      <section id="countdown" className="lw-section lw-countdown" key="countdown">
        {head("countdown", i, L.countdown)}
        <div className="lw-reveal">
          <Countdown date={w.wedding_date} time={w.wedding_time} tz={w.timezone} lang={w.language} variant="full" />
        </div>
        <p className="lw-count-date lw-reveal">
          {formatDate(w.wedding_date, w.language)}
          {w.wedding_time ? ` · ${formatTime(w.wedding_time, w.language)}` : ""}
        </p>
      </section>
    ),
    families: (i) => (
      <section id="families" className="lw-section lw-families" key="families">
        {head("families", i, L.families)}
        {family.introduction && <p className="lw-lead lw-reveal">{family.introduction}</p>}
        <div className="lw-fam-grid">
          {family.bride_parents && (
            <div className="lw-fam lw-reveal">
              <span className="lw-label">{L.brideFamily}</span>
              <p className="lw-fam-names">{family.bride_parents}</p>
            </div>
          )}
          {family.bride_parents && family.groom_parents && <span className="lw-amp lw-reveal">&</span>}
          {family.groom_parents && (
            <div className="lw-fam lw-reveal">
              <span className="lw-label">{L.groomFamily}</span>
              <p className="lw-fam-names">{family.groom_parents}</p>
            </div>
          )}
        </div>
        {family.grandparents && (
          <div className="lw-fam lw-fam-wide lw-reveal">
            <span className="lw-label">{L.grandparents}</span>
            <p className="lw-fam-names">{family.grandparents}</p>
          </div>
        )}
        {family.acknowledgements && <p className="lw-note lw-reveal">{family.acknowledgements}</p>}
      </section>
    ),
    location: (i) => (
      <section id="location" className="lw-section lw-location" key="location">
        {head("location", i, L.location)}
        <div className="lw-venue lw-reveal">
          <MinimalArch className="lw-venue-art lw-orn" />
          {w.venue && <h3 className="lw-venue-name">{w.venue}</h3>}
          {w.city && <p className="lw-label">{w.city}</p>}
          {w.venue_address && <p className="lw-venue-addr">{w.venue_address}</p>}
          {venueMap && (
            <a className="lw-btn" href={venueMap} target="_blank" rel="noopener noreferrer">
              {L.directions}
            </a>
          )}
        </div>
      </section>
    ),
    travel: (i) => (
      <section id="travel" className="lw-section lw-travel" key="travel">
        {head("travel", i, L.travel)}
        <dl className="lw-travel-grid">
          {travelItems.map(([k, v]) => (
            <div className="lw-travel-item lw-reveal" key={k}>
              <dt className="lw-label">{L[k]}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    ),
    rsvp: (i) => (
      <section id="rsvp" className="lw-section lw-rsvp" key="rsvp">
        {head("rsvp", i, L.rsvp)}
        {rsvp.deadline && (
          <p className="lw-note lw-reveal">
            {L.respondBy} {formatDate(rsvp.deadline, w.language, "short")}
          </p>
        )}
        <div className="lw-reveal">
          <RsvpForm settings={rsvp} events={events} lang={w.language} couple={`${a} & ${b}`} preview={mode !== "public"} />
        </div>
      </section>
    ),
  };

  const hero = (
    <section className="lw-hero" id="top">
      <div className="lw-hero-bg lw-orn" aria-hidden>
        {theme === "minimalist" && <MinimalArch className="lw-hero-art" />}
        {theme === "botanical" && (
          <>
            <Sprig className="lw-sprig lw-sprig-a" />
            <Sprig className="lw-sprig lw-sprig-b" flip />
          </>
        )}
        {theme === "royal" && <RoyalArch className="lw-hero-art" />}
        {theme === "celestial" && (
          <>
            <Moon className="lw-hero-art" />
            <svg className="lw-starfield" viewBox="0 0 400 300" aria-hidden>
              {[[30, 40, 3], [80, 220, 2], [340, 60, 3], [370, 200, 2.5], [200, 20, 2], [120, 120, 1.5], [300, 260, 2], [20, 160, 2]].map(([x, y, r], k) => (
                <Star key={k} x={x} y={y} r={r * 2} />
              ))}
            </svg>
          </>
        )}
        {mode !== "thumb" && <Petals theme={theme} />}
      </div>
      {(theme === "luxury" || theme === "royal") && <Frame className="lw-frame lw-ornate" />}
      <div className="lw-hero-in">
        <p className="lw-eyebrow lw-rise" style={{ animationDelay: "0.1s" }}>
          {texts.tagline || (theme === "editorial" ? L.saveDate : L.together)}
        </p>
        <div className="lw-monogram lw-rise" style={{ animationDelay: "0.15s" }} aria-hidden>
          {mono}
        </div>
        <h1 className="lw-names" aria-label={`${a || "Bride"} & ${b || "Groom"}`}>
          <SplitName className="lw-name lw-rise" delay={0.25} text={a || "Bride"} />
          <span className="lw-and lw-rise" style={{ animationDelay: "0.55s" }}>&amp;</span>
          <SplitName className="lw-name lw-rise" delay={0.7} text={b || "Groom"} />
        </h1>
        <p className="lw-invite lw-rise" style={{ animationDelay: "0.8s" }}>{L.invite}</p>
        {w.wedding_date && (
          <p className="lw-hero-date lw-rise" style={{ animationDelay: "0.95s" }}>
            <span className="lw-date-long">{formatDate(w.wedding_date, w.language)}</span>
            <span className="lw-date-dots">{dotDate(w.wedding_date)}</span>
          </p>
        )}
        {(w.venue || w.city) && (
          <p className="lw-hero-place lw-rise" style={{ animationDelay: "1.05s" }}>
            {[w.venue, w.city].map((x) => x?.trim()).filter(Boolean).join(", ")}
          </p>
        )}
        {w.wedding_date && (
          <div className="lw-rise" style={{ animationDelay: "1.2s" }}>
            <Countdown date={w.wedding_date} time={w.wedding_time} tz={w.timezone} lang={w.language} variant="compact" />
          </div>
        )}
        {w.hashtag && <p className="lw-hashtag lw-rise" style={{ animationDelay: "1.3s" }}>{w.hashtag}</p>}
      </div>
      {mode !== "thumb" && order.length > 0 && <div className="lw-scroll" aria-hidden />}
    </section>
  );

  return (
    <div className={cls} style={style} lang={w.language}>
      {mode !== "thumb" && <SiteAnimator />}
      {w.is_demo && <div className="lw-ribbon">Demo wedding · sample content for testing LUXE WED</div>}
      {banner === "draft" && (
        <div className="lw-ribbon lw-ribbon-draft">Draft preview · only you can see this page until you publish it</div>
      )}
      {mode !== "thumb" && (
        <nav className="lw-nav" aria-label="Wedding sections">
          <span className="lw-progress" aria-hidden />
          <a href="#top" className="lw-nav-mono">{mono}</a>
          <div className="lw-nav-links">
            {order
              .filter((k) => k !== "rsvp")
              .map((k) => (
                <a key={k} href={`#${k}`}>
                  {texts[k] || L[k]}
                </a>
              ))}
          </div>
          {order.includes("rsvp") && (
            <a href="#rsvp" className="lw-nav-rsvp">
              RSVP
            </a>
          )}
        </nav>
      )}
      {hero}
      {mode !== "thumb" && order.map((k, i) => sections[k](i))}
      {mode !== "thumb" && (
        <footer className="lw-footer">
          <div className="lw-monogram lw-reveal" aria-hidden>{mono}</div>
          <p className="lw-closing lw-reveal">{texts.closing || L.closing}</p>
          <p className="lw-footer-names lw-reveal">
            {a} &amp; {b}
            {w.wedding_date ? ` · ${dotDate(w.wedding_date)}` : ""}
          </p>
          {w.hashtag && <p className="lw-hashtag">{w.hashtag}</p>}
          <Link className="lw-made" href="/" target="_blank">
            Made with LUXE WED
          </Link>
          {editHref && (
            <Link className="lw-made" style={{ marginTop: 4 }} href={editHref}>
              Edit this website
            </Link>
          )}
        </footer>
      )}
    </div>
  );
}
