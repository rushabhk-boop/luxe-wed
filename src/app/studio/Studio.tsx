"use client";
import Link from "next/link";
import { useState } from "react";
import { BuilderHeader, DeviceToggle } from "@/components/dashboard/BuilderHeader";
import { PreviewFrame, RsvpPreviewToggle, SectionControls, StyleControls, TextControls, ThemePicker } from "@/components/dashboard/design";
import { EventsEditor } from "@/components/dashboard/forms";
import { useWedding } from "@/components/dashboard/WeddingProvider";

const TABS = ["Theme", "Style", "Sections", "Text", "Events", "RSVP"] as const;

export function Studio() {
  const { bundle } = useWedding();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Theme");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="flex h-svh flex-col">
      <BuilderHeader />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="flex max-h-[48svh] min-h-0 flex-col border-b border-line bg-ivory md:max-h-none md:w-[420px] md:border-b-0 md:border-r">
          <nav className="flex overflow-x-auto border-b border-line" aria-label="Studio tabs">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`shrink-0 border-b-2 px-4 py-3 text-[11px] uppercase tracking-[0.2em] transition-colors ${tab === t ? "border-ink text-ink" : "border-transparent text-stone hover:text-ink"}`}>
                {t}
              </button>
            ))}
          </nav>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {tab === "Theme" && (
              <>
                <p className="mb-4 text-sm text-stone">Switching themes keeps all your information and resets colours and fonts to the theme&apos;s defaults.</p>
                <ThemePicker />
              </>
            )}
            {tab === "Style" && <StyleControls />}
            {tab === "Sections" && <SectionControls />}
            {tab === "Text" && <TextControls />}
            {tab === "Events" && <EventsEditor />}
            {tab === "RSVP" && (
              <div className="space-y-4">
                <RsvpPreviewToggle />
                <p className="text-sm text-stone">
                  Scroll to the RSVP section in the preview and try the form. Your WhatsApp number and questions are in{" "}
                  <Link className="link" href="/create">Details → step 6</Link>.
                </p>
              </div>
            )}
          </div>
          <div className="border-t border-line p-4">
            <Link href="/share" className="btn-primary w-full">Get my wedding link</Link>
          </div>
        </aside>
        <section className="min-h-0 flex-1 bg-sand/70 p-3 sm:p-6">
          <div className="mb-3 flex justify-center"><DeviceToggle device={device} setDevice={setDevice} /></div>
          <div className="h-[calc(100%-44px)]">
            <PreviewFrame bundle={bundle} device={device} />
          </div>
        </section>
      </div>
    </div>
  );
}
