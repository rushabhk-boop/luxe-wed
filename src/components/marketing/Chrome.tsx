import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ivory/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-10">
        <Logo />
        <nav className="hidden items-center gap-8 text-[12px] uppercase tracking-[0.2em] text-ink-soft md:flex">
          <Link href="/#how" className="hover:text-ink">How it works</Link>
          <Link href="/designs" className="hover:text-ink">Designs</Link>
          <Link href="/#features" className="hover:text-ink">Features</Link>
          <Link href="/#faq" className="hover:text-ink">FAQ</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/studio" className="hidden text-[12px] uppercase tracking-[0.2em] text-ink-soft hover:text-ink sm:inline">My draft</Link>
          <Link href="/create" className="btn-primary btn-sm">Create website</Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs font-display text-2xl leading-snug">Every love story deserves its own website.</p>
        </div>
        {[
          ["Product", [["Designs", "/designs"], ["How it works", "/#how"], ["Features", "/#features"]]],
          ["Builder", [["Create website", "/create"], ["Design Studio", "/studio"], ["Share", "/share"]]],
          ["Help", [["FAQ", "/#faq"], ["How it works", "/#how"]]],
        ].map(([title, links]) => (
          <div key={title as string}>
            <p className="eyebrow mb-4">{title as string}</p>
            <ul className="space-y-2.5 text-sm text-ink-soft">
              {(links as string[][]).map(([l, h]) => (
                <li key={h}><Link href={h} className="hover:text-ink">{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-5 py-6 text-xs text-stone sm:px-10">
          <span>© {new Date().getFullYear()} LUXE WED</span>
          <span>Free. No sign-up. Your details stay in your link.</span>
        </div>
      </div>
    </footer>
  );
}
