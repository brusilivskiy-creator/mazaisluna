"use client";

import { Logo } from "./logo";
import { Navigation } from "./navigation";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  return (
    <header
      className="w-full bg-[#1a2b4d] text-white relative"
      style={{
        background: "radial-gradient(circle, #185990 0%, #234161 100%)",
      }}
    >
      <div className="header-wrapper">
        {/* Мобильная верхняя панель */}
        <div className="flex items-center justify-start px-fluid-sm py-fluid-sm md:hidden border-b border-white/10">
          <MobileMenu />
        </div>

        {/* Основной контент хедера */}
        <div className="w-full pt-fluid-md pb-fluid-sm md:pt-fluid-md md:pb-fluid-sm">
          {/* Логотип */}
          <Logo />

          {/* Заголовок и подзаголовок */}
          <div className="text-center mb-fluid-md md:mb-fluid-sm">
            <h1
              className="font-semibold mb-fluid-sm md:mb-fluid-xs text-white"
              style={{ fontFamily: "var(--font-proba)", fontVariant: "small-caps" }}
            >
              Урядовий портал Мезайс Луни
            </h1>
            <p
              className="text-white/90 text-center mx-auto"
              style={{ fontFamily: "var(--font-proba)" }}
            >
              Єдиний веб-портал держави
            </p>
          </div>
        </div>

        {/* Десктопная навигация */}
        <Navigation />
      </div>
    </header>
  );
}

