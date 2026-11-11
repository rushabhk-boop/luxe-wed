import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/marketing/Chrome";
import { HeroPreview } from "@/components/marketing/HeroPreview";
import { ThemeThumb } from "@/components/marketing/ThemeThumb";
import { THEME_LIST } from "@/lib/themes";

const STEPS = [
  ["01", "Tell your story", "Your names, the date, every function from Mehendi to Reception, families and travel — in a calm, guided form that saves as you go."],
  ["02", "Choose a design", "Pick from six premium designs, then tune colours, typography, layout, ornaments and animation in the Design Studio."],
  ["03", "Get your link", "Your website gets its own link with your names in it, a QR code and a ready-to-send WhatsApp message."],
  ["04", "Collect RSVPs", "Guests fill in a short form and their reply arrives on your WhatsApp or email — attendance, guest count and dietary notes."],
];

const FEATURES = [
  ["Unlimited events", "Add, reorder and describe every function, each with its own card, dress code and map button."],
  ["Live preview", "See every change on desktop and mobile as you type, before anyone else does."],
  ["RSVPs on WhatsApp", "Every reply arrives as a neat message on your WhatsApp or email, ready to forward to the family group."],
  ["WhatsApp ready", "One tap shares a warm invitation message with your link to any chat or group."],
  ["QR code", "Download a high-resolution QR code for printed cards, envelopes and venue signage."],
  ["Countdown", "A live countdown to your ceremony, in your wedding's own time zone."],
  ["Hindi & Gujarati", "Show headings, buttons and the RSVP form in English, हिन्दी or ગુજરાતી."],
  ["No photos needed", "Every design is built on typography, illustration and ornament — beautiful without a single photo."],
];

const FAQ = [
  ["Is it really free?", "Yes. There is no account, no database and nothing to pay. The website is static and hosted for free."],
  ["How long does it take?", "Most couples finish in 10–15 minutes. Your draft is saved in your browser as you type, so you can stop and continue later on the same device."],
  ["Where are our details stored?", "Inside your link. The part of the link after the # holds your website and is never sent to any server, so your details stay between you and the people you share it with."],
  ["Do guests need an account?", "No. Guests simply open your link, read everything and send their RSVP from their own WhatsApp or email."],
  ["Can I change things after sharing?", "Yes. Edit anything and you get a new link — send that one. People with the old link keep seeing the older version, so share the final link once you're happy."],
  ["Can I edit on another phone or laptop?", "Yes. Open your link, scroll to the bottom and press “Edit this website”. Everything opens in the builder again."],
  ["Where do RSVPs go?", "To the WhatsApp number or email you enter. Each reply is a ready-written message with the guest's name, attendance, number of guests, events and notes."],
  ["Do I need photographs?", "No. LUXE WED designs use elegant typography, line art and ornaments instead of photos."],
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-line">
          <div className="hairline-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden />
          <svg viewBox="0 0 600 600" className="pointer-events-none absolute -left-40 top-24 w-[560px] text-champagne/40" fill="none" stroke="currentColor" aria-hidden>
            <path d="M80 600 V280 A220 220 0 0 1 520 280 V600" />
            <path d="M130 600 V290 A170 170 0 0 1 470 290 V600" />
            <path d="M180 600 V300 A120 120 0 0 1 420 300 V600" />
          </svg>
          <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 py-16 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:py-24">
            <div className="reveal">
              <p className="eyebrow">LUXE WED · Wedding website builder</p>
              <h1 className="display mt-6 text-[3.4rem] leading-[0.98] sm:text-7xl xl:text-[5.6rem]">
                Your Wedding.<br />
                <em className="text-gold">Your Story.</em><br />
                Your Website.
              </h1>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-soft">
                Create a beautiful personalized wedding website in minutes. Share your special moments, celebrations, event details and memories with everyone you love.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/create" className="btn-primary px-8 py-4">Create your wedding website</Link>
                <Link href="/designs" className="btn-outline px-8 py-4">Explore designs</Link>
              </div>
              <p className="mt-6 text-xs tracking-wide text-stone">Free · No sign-up · No photos needed · RSVPs straight to your WhatsApp</p>
            </div>
            <div className="reveal [animation-delay:200ms]">
              <HeroPreview />
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-24 sm:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="display mt-4 text-5xl leading-[1.05]">From “yes” to a website, in four quiet steps.</h2>
            </div>
            <ol className="grid gap-px border border-line bg-line sm:grid-cols-2">
              {STEPS.map(([n, t, d]) => (
                <li key={n} className="bg-ivory p-8">
                  <span className="font-display text-5xl text-champagne">{n}</span>
                  <h3 className="mt-4 font-display text-3xl">{t}</h3>
                  <p className="mt-3 text-ink-soft">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-line bg-sand/50">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Explore wedding designs</p>
                <h2 className="display mt-4 text-5xl">Six distinct identities</h2>
              </div>
              <Link href="/designs" className="btn-outline">See all designs</Link>
            </div>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {THEME_LIST.map((t) => (
                <Link key={t.key} href={`/designs/${t.key}`} className="group">
                  <ThemeThumb theme={t.key} />
                  <div className="mt-4 flex items-baseline justify-between">
                    <h3 className="font-display text-2xl">{t.name}</h3>
                    <span className="text-[10px] tracking-[0.3em] text-stone">{t.number}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">{t.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-24 sm:px-10">
          <p className="eyebrow">Features</p>
          <h2 className="display mt-4 max-w-2xl text-5xl leading-[1.05]">Everything your guests need. Nothing they don&apos;t.</h2>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(([t, d]) => (
              <div key={t} className="border-t border-ink pt-5">
                <h3 className="font-display text-2xl">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-ink text-ivory">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-10 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-champagne">Why LUXE WED</p>
              <h2 className="display mt-4 text-5xl leading-[1.05]">Designed like stationery. Built like software.</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {[
                ["Editorial design", "Typography and spacing from luxury print, not a template marketplace."],
                ["Made for Indian weddings", "Multiple functions, families, dress codes and travel — the way real celebrations work."],
                ["Private by design", "No accounts and no database. Your website lives in your link; RSVPs come straight to you."],
                ["Free forever", "A static website hosted for free — nothing to install, nothing to renew."],
              ].map(([t, d]) => (
                <div key={t}>
                  <span className="block h-px w-10 bg-champagne" />
                  <h3 className="mt-4 font-display text-2xl">{t}</h3>
                  <p className="mt-2 text-sm text-ivory/70">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-5 py-24 sm:px-10">
          <p className="eyebrow text-center">Frequently asked questions</p>
          <h2 className="display mt-4 text-center text-5xl">Questions, answered</h2>
          <div className="mt-12 divide-y divide-line border-y border-line">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-2xl">
                  {q}
                  <span className="text-gold transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-line bg-sand">
          <svg viewBox="0 0 400 300" className="pointer-events-none absolute left-1/2 top-0 w-[900px] -translate-x-1/2 text-champagne/40" fill="none" stroke="currentColor" aria-hidden>
            <path d="M110 300 V150 A90 90 0 0 1 290 150 V300" />
            <path d="M0 290 H400" />
          </svg>
          <div className="relative mx-auto max-w-3xl px-5 py-28 text-center">
            <p className="eyebrow">Begin today</p>
            <h2 className="display mt-5 text-5xl leading-[1.02] sm:text-7xl">Every love story deserves its own website.</h2>
            <Link href="/create" className="btn-primary mt-10 px-10 py-4">Create your wedding website</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
