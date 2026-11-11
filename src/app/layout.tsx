import type { Metadata, Viewport } from "next";
import { fontVars } from "./fonts";
import "./globals.css";
import "./site.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "LUXE WED — Every Love Story Deserves Its Own Website", template: "%s · LUXE WED" },
  description:
    "Create a beautiful personalised wedding website in minutes. Share your events, venue, travel details and collect RSVPs with one elegant link.",
  openGraph: {
    title: "LUXE WED — Every Love Story Deserves Its Own Website",
    description: "Create a beautiful personalised wedding website in minutes.",
    siteName: "LUXE WED",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#f8f4ec" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVars}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
