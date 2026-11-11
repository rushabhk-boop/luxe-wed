import { WeddingProvider } from "@/components/dashboard/WeddingProvider";
import { ShareView } from "./ShareView";

export const metadata = { title: "Share your wedding website" };

export default function Page() {
  return (
    <WeddingProvider>
      <ShareView />
    </WeddingProvider>
  );
}
