import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ElectionsSection } from "@/sections/elections/elections-section";

export default function ElectionsPage() {
  return (
    <>
      <Header />
      <div className="page-wrapper">
        <main className="bg-white min-h-screen w-full">
          <section className="py-12 md:py-16">
            <div className="content-wrapper">
              <ElectionsSection />
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

