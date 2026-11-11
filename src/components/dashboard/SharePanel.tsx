"use client";
import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import { names } from "@/lib/defaults";
import { shareLink, slugFor, whatsappText } from "@/lib/share";
import { useWedding } from "./WeddingProvider";

function useOrigin() {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  return origin;
}

function useQr(url: string) {
  const [qr, setQr] = useState<string | null>(null);
  const [tooLong, setTooLong] = useState(false);
  useEffect(() => {
    if (!url) return;
    QRCode.toDataURL(url, { width: 1400, margin: 2, errorCorrectionLevel: "L", color: { dark: "#1f1b16", light: "#ffffff" } })
      .then((d) => {
        setQr(d);
        setTooLong(false);
      })
      .catch(() => {
        setQr(null);
        setTooLong(true);
      });
  }, [url]);
  return { qr, tooLong };
}

export function SharePanel() {
  const { bundle } = useWedding();
  const origin = useOrigin();
  const url = useMemo(() => (origin ? shareLink(bundle, origin) : ""), [bundle, origin]);
  const { qr, tooLong } = useQr(url);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQr = () => {
    if (!qr) return;
    const a = document.createElement("a");
    a.href = qr;
    a.download = `${slugFor(bundle)}-qr.png`;
    a.click();
  };

  return (
    <div className="card grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_240px]">
      <div className="min-w-0">
        <p className="eyebrow flex items-center gap-2"><span className="live-dot h-1.5 w-1.5 rounded-full bg-success" /> Ready to share</p>
        <p className="mt-2 font-display text-3xl">{names(bundle.wedding).both} — your wedding link</p>
        <p className="mt-2 text-sm text-ink-soft">
          Your whole website is inside this link. Anyone with it can open your website — no app, no sign-up.
        </p>
        <div className="mt-5 flex items-stretch border border-line bg-ivory">
          <span className="min-w-0 flex-1 truncate px-4 py-3 text-[15px]" title={url}>{url || "…"}</span>
          <button className="border-l border-line px-4 text-[11px] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-ivory" onClick={copy} disabled={!url}>
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <a className="btn-primary" href={url ? `https://wa.me/?text=${encodeURIComponent(whatsappText(url))}` : undefined} target="_blank" rel="noopener noreferrer">
            Share on WhatsApp
          </a>
          <button className="btn-outline" onClick={downloadQr} disabled={!qr}>Download QR code</button>
          <a className="btn-ghost" href={url || undefined} target="_blank" rel="noopener noreferrer">Preview website</a>
          <Link className="btn-ghost" href="/studio">Edit website</Link>
        </div>
        <div className="mt-6">
          <p className="field-label">WhatsApp message</p>
          <pre className="whitespace-pre-wrap break-all border border-line bg-ivory p-4 font-sans text-sm text-ink-soft">{url ? whatsappText(url) : ""}</pre>
        </div>
        <div className="mt-6 space-y-2 text-sm text-stone">
          <p><strong className="font-medium text-ink-soft">Changed something?</strong> Every change makes a new link. Send the new one; people with the old link keep seeing the old version.</p>
          <p><strong className="font-medium text-ink-soft">Keep this link safe.</strong> It is also your backup: open it, press “Edit this website” at the bottom, and you can edit again on any device.</p>
        </div>
      </div>
      <div className="relative flex flex-col items-center gap-3">
        {qr && <Burst />}
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element -- data: URL
          <img src={qr} alt="QR code for your wedding website" className="qr-in h-[220px] w-[220px] border border-line bg-white p-2" />
        ) : (
          <div className="grid h-[220px] w-[220px] place-items-center border border-line bg-sand p-4 text-center text-xs text-stone">
            {tooLong ? "Too much text for a QR code. Shorten event descriptions or the welcome message." : "…"}
          </div>
        )}
        <p className="text-center text-xs text-stone">
          {url.length > 1200 ? "A detailed website makes a dense QR code: print it at least 4 cm wide." : "Print it on invitation cards or place it at the venue."}
        </p>
      </div>
    </div>
  );
}

/** One-time champagne sparkle burst around the QR code when the link is ready. */
function Burst() {
  return (
    <div className="burst -top-2 h-[236px]" aria-hidden>
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          style={{ "--a": `${(i * 360) / 14}deg`, "--r": `${120 + (i % 3) * 22}px`, "--w": `${(i % 4) * 0.06}s` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
