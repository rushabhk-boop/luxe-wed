import { WeddingProvider } from "@/components/dashboard/WeddingProvider";
import { SetupWizard } from "./SetupWizard";

export const metadata = { title: "Create your wedding website" };

export default function Page() {
  return (
    <WeddingProvider>
      <SetupWizard />
    </WeddingProvider>
  );
}
