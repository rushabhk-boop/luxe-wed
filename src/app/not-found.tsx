import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-svh grid place-items-center px-6 text-center">
      <div className="max-w-md">
        <p className="eyebrow">Not available</p>
        <h1 className="display text-5xl mt-4">Page not found</h1>
        <p className="mt-5 text-ink-soft">
          The link may be mistyped or the page has moved.
        </p>
        <Link href="/" className="btn-outline mt-8">Visit LUXE WED</Link>
      </div>
    </main>
  );
}
