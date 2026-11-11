"use client";
import { useEffect, useMemo, useState } from "react";
import { downloadPoster, drawPoster } from "@/lib/poster";
import { shareLink, slugFor } from "@/lib/share";
import { useWedding } from "./WeddingProvider";

/** Preview and download of a printable poster with the wedding details and QR code. */
export function PosterCard() {
  const { bundle } = useWedding();
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const url = useMemo(() => (origin ? shareLink(bundle, origin) : ""), [bundle, origin]);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!url) return;
    let live = true;
    drawPoster(bundle, url)
      .then((c) => {
        if (!live) return;
        // a small copy for the page; the download is drawn at full size
        const s = document.createElement("canvas");
        s.width = 480;
        s.height = 600;
        s.getContext("2d")!.drawImage(c, 0, 0, 480, 600);
        setPreview(s.toDataURL("image/png"));
        setError("");
      })
      .catch(() => live && setError("The poster could not be drawn. Shorten long event details and try again."));
    return () => {
      live = false;
    };
  }, [bundle, url]);

  const download = async () => {
    setBusy(true);
    try {
      await downloadPoster(bundle, url, `${slugFor(bundle)}-poster.png`);
      setError("");
    } catch {
      setError("The poster could not be saved. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card mt-8 grid items-center gap-8 p-6 sm:p-8 md:grid-cols-[260px_1fr]" data-reveal>
      <div className="mx-auto w-[240px]">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- data: URL
          <img src={preview} alt="Poster preview" className="qr-in w-full border border-line shadow-lift transition-transform duration-700 hover:-translate-y-1 hover:rotate-[-1deg]" />
        ) : (
          <div className="grid aspect-[4/5] w-full place-items-center border border-line bg-sand text-xs text-stone">Drawing poster…</div>
        )}
      </div>
      <div>
        <p className="eyebrow">Wedding poster</p>
        <p className="mt-2 font-display text-3xl">A poster in your design</p>
        <p className="mt-2 text-sm text-ink-soft">
          Your names, date, venue and events with a QR code to your website. Send it on WhatsApp, post it on Instagram or
          print it for the venue. 1600 × 2000 pixels, PNG.
        </p>
        <button className="btn-primary mt-5" onClick={download} disabled={!url || busy}>
          {busy ? "Preparing…" : "Download poster"}
        </button>
        {error && <p className="error">{error}</p>}
        <p className="mt-4 text-xs text-stone">The poster shows up to four events. Change the design in the Design Studio and the poster follows.</p>
      </div>
    </div>
  );
}
