"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { blankBundle } from "@/lib/defaults";
import { clearDraft, loadDraft, saveDraft } from "@/lib/draft";
import type { Bundle, Design, Family, RsvpSettings, Wedding, WeddingEvent } from "@/lib/types";

type Status = "saved" | "dirty" | "error";

type Ctx = {
  bundle: Bundle;
  status: Status;
  setWedding: (patch: Partial<Wedding>) => void;
  setFamily: (patch: Partial<Family>) => void;
  setDesign: (patch: Partial<Design>) => void;
  setRsvp: (patch: Partial<RsvpSettings>) => void;
  setEvents: (events: WeddingEvent[]) => void;
  save: () => boolean;
  replace: (b: Bundle) => void;
  reset: () => void;
};

const WeddingCtx = createContext<Ctx | null>(null);

export function useWedding() {
  const c = useContext(WeddingCtx);
  if (!c) throw new Error("useWedding outside WeddingProvider");
  return c;
}

/**
 * Holds the wedding being edited and keeps it in this browser (localStorage).
 * Children render only after the draft is loaded, so server and browser HTML match.
 */
export function WeddingProvider({ children, initial }: { children: React.ReactNode; initial?: Bundle }) {
  const [bundle, setBundle] = useState<Bundle | null>(initial ?? null);
  const [status, setStatus] = useState<Status>("saved");
  const latest = useRef<Bundle | null>(initial ?? null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (initial) return;
    const b = loadDraft() ?? blankBundle();
    latest.current = b;
    setBundle(b);
  }, [initial]);

  const save = useCallback(() => {
    clearTimeout(timer.current);
    if (!latest.current || initial) return true;
    const ok = saveDraft(latest.current);
    setStatus(ok ? "saved" : "error");
    return ok;
  }, [initial]);

  const update = useCallback(
    (fn: (b: Bundle) => Bundle) => {
      if (!latest.current) return;
      const n = fn(latest.current);
      latest.current = n;
      setBundle(n);
      setStatus("dirty");
      clearTimeout(timer.current);
      timer.current = setTimeout(save, 400);
    },
    [save],
  );

  useEffect(() => {
    const h = () => save();
    window.addEventListener("pagehide", h);
    return () => window.removeEventListener("pagehide", h);
  }, [save]);

  const value = useMemo<Ctx | null>(
    () =>
      bundle && {
        bundle,
        status,
        setWedding: (p) => update((b) => ({ ...b, wedding: { ...b.wedding, ...p } })),
        setFamily: (p) => update((b) => ({ ...b, family: { ...b.family, ...p } })),
        setDesign: (p) => update((b) => ({ ...b, design: { ...b.design, ...p } })),
        setRsvp: (p) => update((b) => ({ ...b, rsvp: { ...b.rsvp, ...p } })),
        setEvents: (events) => update((b) => ({ ...b, events })),
        save,
        replace: (b) => update(() => b),
        reset: () => {
          clearDraft();
          const b = blankBundle();
          latest.current = b;
          setBundle(b);
          setStatus("saved");
        },
      },
    [bundle, status, update, save],
  );

  if (!value) {
    return <div className="grid min-h-svh place-items-center text-sm text-stone">Loading…</div>;
  }
  return <WeddingCtx.Provider value={value}>{children}</WeddingCtx.Provider>;
}

export function SaveStatus() {
  const { status, save } = useWedding();
  const label = { saved: "Saved in this browser", dirty: "Saving…", error: "Could not save — browser storage is blocked" }[status];
  return (
    <div className="flex items-center gap-3">
      <span className={`hidden sm:inline-flex items-center gap-2 text-xs ${status === "error" ? "text-danger" : "text-stone"}`} aria-live="polite">
        <span className={`h-1.5 w-1.5 rounded-full ${status === "saved" ? "bg-success" : status === "error" ? "bg-danger" : "bg-champagne animate-pulse"}`} />
        {label}
      </span>
      <button className="btn-outline btn-sm" onClick={() => save()}>
        Save changes
      </button>
    </div>
  );
}
