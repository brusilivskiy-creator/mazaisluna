import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ParliamentSection } from "@/sections/parliament";

export default function ParliamentPage() {
  return (
    <>
      <Header />
      <div className="page-wrapper">
        <main className="bg-white min-h-screen w-full">
          <section className="py-12 md:py-16">
            <div className="content-wrapper">
              <ParliamentSection />
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

