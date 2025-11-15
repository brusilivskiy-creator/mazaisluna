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
        <div className="flex items-center justify-between px-4 py-3 md:hidden border-b border-white/10">
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
        <div className="w-full py-6 md:py-8">
          {/* Логотип */}
          <Logo />

          {/* Заголовок и подзаголовок */}
          <div className="text-center mb-4 md:mb-6">
            <h1
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-2 md:mb-2 text-white"
              style={{ fontFamily: "var(--font-proba)", fontVariant: "small-caps" }}
            >
              Урядовий портал Мезайс Луни
            </h1>
            <p
              className="text-sm md:text-base lg:text-lg text-white/90 px-2 md:px-0"
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

