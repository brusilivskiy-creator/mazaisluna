import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdvantagesSection } from "@/sections/advantages";
import { ParliamentSection } from "@/sections/parliament";
import { LeadershipSection } from "@/sections/leadership";
import { NewsSection } from "@/sections/news/news-section";

export default function Home() {
  return (
    <>
      <Header />
      <div className="page-wrapper">
        <main className="bg-white min-h-screen w-full">
          <NewsSection />
          <AdvantagesSection />
          <section className="py-fluid-lg">
            <div className="content-wrapper">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-fluid-lg items-stretch">
                <div className="lg:order-1 flex flex-col h-full">
                  <LeadershipSection />
                </div>
                <div className="lg:order-2 flex flex-col h-full">
                  <ParliamentSection />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
