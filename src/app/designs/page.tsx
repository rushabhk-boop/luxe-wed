import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/marketing/Chrome";
import { ThemeThumb } from "@/components/marketing/ThemeThumb";
import { THEME_LIST } from "@/lib/themes";

export const metadata = { title: "Wedding website designs" };

export default function Designs() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-10">
        <p className="eyebrow">The collection</p>
        <h1 className="display text-5xl sm:text-7xl mt-4 max-w-3xl leading-[1.02]">Six designs. Endless ways to make them yours.</h1>
        <p className="mt-6 max-w-xl text-ink-soft">Every design works with the same details, so you can switch at any time without losing a word. Open one to see a full sample website.</p>
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {THEME_LIST.map((t) => (
            <article key={t.key} className="group">
              <Link href={`/designs/${t.key}`} className="block">
                <ThemeThumb theme={t.key} />
              </Link>
              <p className="mt-5 text-[10px] tracking-[0.3em] text-stone">THEME {t.number}</p>
              <h2 className="font-display text-3xl mt-1">{t.name}</h2>
              <p className="mt-2 text-sm text-ink-soft">{t.description}</p>
              <div className="mt-4 flex gap-4 text-[11px] uppercase tracking-[0.2em]">
                <Link href={`/designs/${t.key}`} className="link">View sample</Link>
                <Link href={`/create?theme=${t.key}`} className="link text-gold">Use this design</Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
