import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-baseline gap-2 ${className}`} aria-label="LUXE WED home">
      <span className="font-display text-[26px] leading-none tracking-[0.18em] font-medium">LUXE</span>
      <span className="text-[10px] tracking-[0.5em] text-gold font-medium">WED</span>
    </Link>
  );
}

export function Monogram({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`grid place-items-center rounded-full border border-champagne/70 font-display text-gold ${className}`}>{text}</span>
  );
}
