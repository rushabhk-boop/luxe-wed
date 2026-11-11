import Link from "next/link";
import { notFound } from "next/navigation";
import { WeddingSite } from "@/components/site/WeddingSite";
import { sampleBundle } from "@/lib/defaults";
import { THEMES } from "@/lib/themes";
import type { ThemeKey } from "@/lib/types";

export function generateStaticParams() {
  return Object.keys(THEMES).map((theme) => ({ theme }));
}

export async function generateMetadata({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  return { title: THEMES[theme as ThemeKey]?.name ?? "Design" };
}

export default async function ThemeSample({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  if (!(theme in THEMES)) notFound();
  const t = THEMES[theme as ThemeKey];
  return (
    <>
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-ivory/95 px-4 py-3 backdrop-blur sm:px-8">
        <Link href="/designs" className="text-sm text-stone link">← All designs</Link>
        <p className="text-sm"><span className="text-stone">Sample website · </span><span className="font-display text-lg">{t.name}</span></p>
        <Link href={`/create?theme=${t.key}`} className="btn-primary btn-sm">Use this design</Link>
      </div>
      <WeddingSite bundle={sampleBundle(t.key)} mode="preview" />
    </>
  );
}
