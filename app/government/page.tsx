import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LeadershipCardsSection } from "@/sections/leadership-cards/leadership-cards-section";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function GovernmentPage() {
  return (
    <>
      <Header />
      <div className="page-wrapper">
        <main className="bg-white min-h-screen w-full">
          <Suspense fallback={<LoadingSpinner />}>
            <LeadershipCardsSection />
          </Suspense>
        </main>
      </div>
      <Footer />
    </>
  );
}

