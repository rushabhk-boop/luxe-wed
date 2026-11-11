import { Viewer } from "./Viewer";

export const metadata = {
  title: { absolute: "Wedding Invitation" },
  description: "You're invited to celebrate our special day.",
  robots: { index: false, follow: false },
  openGraph: { title: "You're invited — Wedding Invitation", description: "Open to see the events, venue and RSVP." },
};

export default function Page() {
  return <Viewer />;
}
