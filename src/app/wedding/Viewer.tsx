"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { WeddingSite } from "@/components/site/WeddingSite";
import { names } from "@/lib/defaults";
import { readHash } from "@/lib/share";
import type { Bundle } from "@/lib/types";

/** Guest view: the wedding is read from the link (#slug.data); nothing is loaded from a server. */
export function Viewer() {
  const [state, setState] = useState<{ bundle: Bundle; hash: string } | "empty" | "bad" | null>(null);

  useEffect(() => {
    const read = () => {
      try {
        const b = readHash(window.location.hash);
        if (!b) return setState("empty");
        setState({ bundle: b, hash: window.location.hash });
      } catch {
        setState("bad");
      }
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  // Next renders a fixed metadata <title> first in <head>; keep the couple's names in the tab.
  const title = state && typeof state === "object" ? `${names(state.bundle.wedding).both} — Wedding Invitation` : "";
  useEffect(() => {
    if (!title) return;
    const apply = () => {
      if (document.title !== title) document.title = title;
    };
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => obs.disconnect();
  }, [title]);

  if (state === null) return <div className="min-h-svh" />;
  if (state === "empty" || state === "bad") {
    return (
      <main className="grid min-h-svh place-items-center px-6 text-center">
        <div className="max-w-md">
          <p className="eyebrow">{state === "bad" ? "Link not complete" : "No wedding here"}</p>
          <h1 className="display mt-4 text-5xl">{state === "bad" ? "This link could not be opened" : "Open the link you were sent"}</h1>
          <p className="mt-5 text-ink-soft">
            {state === "bad"
              ? "Part of the link may be missing. Please copy the whole link again, or ask the person who sent it."
              : "Wedding websites made with LUXE WED open from the link the couple shared with you."}
          </p>
          <Link href="/" className="btn-outline mt-8">Visit LUXE WED</Link>
        </div>
      </main>
    );
  }
  return (
    <main>
      <WeddingSite bundle={state.bundle} mode="public" editHref={`/create/${state.hash}`} />
    </main>
  );
}
