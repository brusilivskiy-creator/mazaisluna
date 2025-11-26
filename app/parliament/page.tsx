import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ParliamentSection } from "@/sections/parliament";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ParliamentPage() {
  return (
    <>
      <Header />
      <div className="page-wrapper">
        <main className="bg-white min-h-screen w-full">
          <section className="py-fluid-lg">
            <div className="content-wrapper">
              <Suspense fallback={<LoadingSpinner />}>
                <ParliamentSection />
              </Suspense>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

