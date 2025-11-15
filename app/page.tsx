import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdvantagesSection } from "@/sections/advantages";
import { ParliamentSection } from "@/sections/parliament";
import { LeadershipSection } from "@/sections/leadership";

export default function Home() {
  return (
    <>
      <Header />
      <div className="page-wrapper">
        <main className="bg-white min-h-screen w-full">
          <AdvantagesSection />
          <div className="content-wrapper">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              <div className="lg:order-1 flex flex-col">
                <LeadershipSection />
              </div>
              <div className="lg:order-2 flex flex-col">
                <ParliamentSection />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
