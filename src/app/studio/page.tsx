import { WeddingProvider } from "@/components/dashboard/WeddingProvider";
import { Studio } from "./Studio";

export const metadata = { title: "Design Studio" };

export default function Page() {
  return (
    <WeddingProvider>
      <Studio />
    </WeddingProvider>
  );
}
