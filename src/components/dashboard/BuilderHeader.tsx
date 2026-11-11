"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { SaveStatus } from "./WeddingProvider";

const NAV = [
  ["/create", "Details"],
  ["/studio", "Design Studio"],
  ["/share", "Share"],
] as const;

export function BuilderHeader({ children }: { children?: React.ReactNode }) {
  const path = usePathname().replace(/\/$/, "");
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ivory/90 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Builder">
            {NAV.map(([href, label]) => (
              <Link key={href} href={href} className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors ${path.endsWith(href) ? "bg-ink text-ivory" : "text-stone hover:text-ink"}`}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <SaveStatus />
      </div>
      <nav className="flex border-t border-line md:hidden" aria-label="Builder">
        {NAV.map(([href, label]) => (
          <Link key={href} href={href} className={`flex-1 py-2.5 text-center text-[10px] uppercase tracking-[0.18em] ${path.endsWith(href) ? "bg-ink text-ivory" : "text-stone"}`}>
            {label}
          </Link>
        ))}
      </nav>
      {children}
    </header>
  );
}

export function DeviceToggle({ device, setDevice }: { device: "desktop" | "mobile"; setDevice: (d: "desktop" | "mobile") => void }) {
  return (
    <div className="inline-flex border border-line bg-paper p-0.5" role="group" aria-label="Preview size">
      {(["desktop", "mobile"] as const).map((d) => (
        <button key={d} type="button" onClick={() => setDevice(d)} aria-pressed={device === d} className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${device === d ? "bg-ink text-ivory" : "text-stone hover:text-ink"}`}>
          {d}
        </button>
      ))}
    </div>
  );
}
