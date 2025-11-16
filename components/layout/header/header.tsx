"use client";

import { Logo } from "./logo";
import { Navigation } from "./navigation";
import { MobileMenu } from "./mobile-menu";
import { Search } from "lucide-react";

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
        <div className="flex items-center justify-between px-fluid-sm py-fluid-xs md:hidden border-b border-white/10">
          <MobileMenu />
          <button
            className="flex items-center gap-2 text-white hover:text-[#ffe358] transition-colors duration-200"
            aria-label="Пошук"
          >
            <Search className="w-5 h-5" />
            <span
              className="text-sm font-medium"
              style={{ fontFamily: "var(--font-proba)" }}
            >
              Пошук
            </span>
          </button>
        </div>

        {/* Основной контент хедера */}
        <div className="w-full py-fluid-sm">
          {/* Логотип */}
          <Logo />

          {/* Заголовок и подзаголовок */}
          <div className="text-center mb-fluid-sm">
            <h1
              className="font-semibold mb-fluid-xs text-white"
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

