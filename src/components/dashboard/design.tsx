"use client";

export { PreviewFrame } from "@/components/site/PreviewFrame";
import { t } from "@/lib/i18n";
import { ANIMATIONS, BACKGROUNDS, DECORATIONS, LAYOUTS, resolvePalette, THEME_LIST, THEMES, themeDefaults, TYPOGRAPHY } from "@/lib/themes";
import type { SectionKey } from "@/lib/types";
import { Field, Toggle } from "./forms";
import { useWedding } from "./WeddingProvider";

export function ThemePicker() {
  const { bundle, setDesign } = useWedding();
  const d = bundle.design;
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {THEME_LIST.map((th) => {
        const pal = th.palettes.default;
        const on = d.theme === th.key;
        return (
          <button
            type="button"
            key={th.key}
            onClick={() => setDesign(themeDefaults(th.key))}
            className={`group text-left border transition-all ${on ? "border-ink shadow-soft" : "border-line hover:border-line-strong"}`}
            aria-pressed={on}
          >
            <div className="relative h-24 overflow-hidden" style={{ background: pal.bg, color: pal.ink }}>
              <div className="absolute inset-0 grid place-items-center">
                <span style={{ fontFamily: TYPOGRAPHY[th.typography].names, fontSize: 30, lineHeight: 1 }}>
                  A <span style={{ color: pal.accent, fontStyle: "italic" }}>&amp;</span> V
                </span>
              </div>
              <div className="absolute bottom-2 left-2 flex gap-1">
                {[pal.bg, pal.accent, pal.ink].map((c) => (
                  <span key={c} className="h-3 w-3 rounded-full border border-black/10" style={{ background: c }} />
                ))}
              </div>
              {on && <span className="absolute top-2 right-2 bg-ink px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-ivory">Selected</span>}
            </div>
            <div className="px-3.5 py-3 bg-paper">
              <p className="text-[10px] tracking-[0.25em] text-stone">THEME {th.number}</p>
              <p className="font-display text-lg leading-tight">{th.name}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Options<T extends string>({ value, options, onChange }: { value: T; options: { key: T; name: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button type="button" key={o.key} className={`chip ${value === o.key ? "chip-on" : ""}`} onClick={() => onChange(o.key)} aria-pressed={value === o.key}>
          {o.name}
        </button>
      ))}
    </div>
  );
}

export function StyleControls({ compact = false }: { compact?: boolean }) {
  const { bundle, setDesign } = useWedding();
  const d = bundle.design;
  const theme = THEMES[d.theme];
  const pal = resolvePalette(d);
  return (
    <div className="space-y-7">
      <div>
        <p className="field-label">Colour palette</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {Object.entries(theme.palettes).map(([key, p]) => (
            <button
              type="button"
              key={key}
              onClick={() => setDesign({ palette: key, colors: {} })}
              className={`flex items-center gap-3 border px-3 py-2.5 text-left text-sm transition-colors ${d.palette === key && !d.colors.bg && !d.colors.accent && !d.colors.ink ? "border-ink" : "border-line hover:border-line-strong"}`}
            >
              <span className="flex -space-x-1.5">
                {[p.bg, p.accent, p.ink].map((c, i) => (
                  <span key={i} className="h-5 w-5 rounded-full border border-black/10" style={{ background: c }} />
                ))}
              </span>
              {p.name}
            </button>
          ))}
        </div>
        {!compact && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {(["bg", "ink", "accent"] as const).map((k) => (
              <label key={k} className="flex items-center gap-2 border border-line bg-paper px-3 py-2 text-xs text-stone cursor-pointer">
                <input
                  type="color"
                  value={pal[k]}
                  onChange={(e) => setDesign({ colors: { ...d.colors, [k]: e.target.value } })}
                  className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0"
                />
                {k === "bg" ? "Background" : k === "ink" ? "Text" : "Accent"}
              </label>
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="field-label">Typography</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {Object.entries(TYPOGRAPHY).map(([key, ty]) => (
            <button
              type="button"
              key={key}
              onClick={() => setDesign({ typography: key })}
              className={`border px-3 py-2.5 text-left transition-colors ${d.typography === key ? "border-ink" : "border-line hover:border-line-strong"}`}
            >
              <span className="block text-2xl leading-tight" style={{ fontFamily: ty.names }}>Aanya &amp; Vihaan</span>
              <span className="block text-[11px] text-stone mt-0.5" style={{ fontFamily: ty.body }}>{ty.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="field-label">Website layout</p>
        <Options value={d.layout} options={LAYOUTS} onChange={(v) => setDesign({ layout: v })} />
      </div>
      <div>
        <p className="field-label">Background style</p>
        <Options value={d.background} options={BACKGROUNDS} onChange={(v) => setDesign({ background: v })} />
      </div>
      <div>
        <p className="field-label">Decorative elements</p>
        <Options value={d.decorations} options={DECORATIONS} onChange={(v) => setDesign({ decorations: v })} />
      </div>
      <div>
        <p className="field-label">Animation</p>
        <Options value={d.animation} options={ANIMATIONS} onChange={(v) => setDesign({ animation: v })} />
      </div>
    </div>
  );
}

export function SectionControls() {
  const { bundle, setDesign } = useWedding();
  const d = bundle.design;
  const L = t(bundle.wedding.language);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= d.section_order.length) return;
    const o = [...d.section_order];
    [o[i], o[j]] = [o[j], o[i]];
    setDesign({ section_order: o });
  };
  const toggle = (k: SectionKey, show: boolean) =>
    setDesign({ hidden_sections: show ? d.hidden_sections.filter((x) => x !== k) : [...d.hidden_sections, k] });
  return (
    <div>
      <p className="text-sm text-stone mb-4">The hero always comes first and the closing footer last. Reorder and hide everything in between.</p>
      <ol className="divide-y divide-line border border-line bg-paper">
        {d.section_order.map((k, i) => {
          const shown = !d.hidden_sections.includes(k);
          return (
            <li key={k} className="flex items-center gap-2 px-3 py-2">
              <span className="w-6 text-xs text-stone">{String(i + 1).padStart(2, "0")}</span>
              <span className={`flex-1 text-[15px] ${shown ? "" : "text-stone line-through"}`}>{d.texts[k] || L[k]}</span>
              <button type="button" className="px-2 text-stone hover:text-ink disabled:opacity-25" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" className="px-2 text-stone hover:text-ink disabled:opacity-25" onClick={() => move(i, 1)} disabled={i === d.section_order.length - 1} aria-label="Move down">↓</button>
              <button type="button" className={`ml-1 min-w-16 border px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${shown ? "border-line text-ink-soft" : "border-ink bg-ink text-ivory"}`} onClick={() => toggle(k, !shown)}>
                {shown ? "Hide" : "Show"}
              </button>
            </li>
          );
        })}
      </ol>
      {!bundle.rsvp.enabled && <p className="hint">RSVP is switched off in RSVP settings, so it is not shown.</p>}
      {bundle.family.hidden && <p className="hint">The families section is hidden in Wedding Details.</p>}
    </div>
  );
}

export function TextControls() {
  const { bundle, setDesign, setWedding } = useWedding();
  const d = bundle.design;
  const L = t(bundle.wedding.language);
  const setText = (k: string, v: string) => setDesign({ texts: { ...d.texts, [k]: v.slice(0, 200) } });
  return (
    <div className="space-y-5">
      <Field label="Line above your names" optional>
        <input className="input" value={d.texts.tagline ?? ""} placeholder={L.together} onChange={(e) => setText("tagline", e.target.value)} />
      </Field>
      <Field label="Welcome message" optional>
        <textarea className="input" rows={4} value={bundle.wedding.welcome_message} onChange={(e) => setWedding({ welcome_message: e.target.value.slice(0, 2000) })} />
      </Field>
      <p className="field-label pt-2">Section headings</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {d.section_order.map((k) => (
          <input key={k} className="input" value={d.texts[k] ?? ""} placeholder={L[k]} onChange={(e) => setText(k, e.target.value)} aria-label={`Heading for ${L[k]}`} />
        ))}
      </div>
      <Field label="Closing message" optional>
        <input className="input" value={d.texts.closing ?? ""} placeholder={L.closing} onChange={(e) => setText("closing", e.target.value)} />
      </Field>
    </div>
  );
}

export function RsvpPreviewToggle() {
  const { bundle, setRsvp } = useWedding();
  return <Toggle on={bundle.rsvp.enabled} onChange={(v) => setRsvp({ enabled: v })} label="RSVP form on the website" hint="Try the form in the preview: preview submissions are not saved." />;
}
