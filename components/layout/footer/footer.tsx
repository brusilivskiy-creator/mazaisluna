"use client";

import { Logo } from "../header/logo";
import { Facebook, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { href: "/government", label: "Керівництво" },
  { href: "/services", label: "Послуги" },
  { href: "/activities", label: "Діяльність" },
  { href: "/decisions", label: "Рішення Уряду" },
  { href: "/public", label: "Для громадськості" },
  { href: "/press", label: "Прес-центр" },
];

export function Footer() {
  return (
    <footer
      className="w-full bg-[#1a2b4d] text-white relative mt-auto"
      style={{
        background: "radial-gradient(circle, #185990 0%, #234161 100%)",
      }}
    >
      <div className="header-wrapper">
        {/* Основной контент футера */}
        <div className="w-full py-6 md:py-8">
          {/* Логотип */}
          <Logo />

          {/* Заголовок и подзаголовок */}
          <div className="text-center mb-4 md:mb-6">
            <h2
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-2 md:mb-2 text-white"
              style={{ fontFamily: "var(--font-proba)", fontVariant: "small-caps" }}
            >
              Урядовий портал Мезайс Луни
            </h2>
            <p
              className="text-sm md:text-base lg:text-lg text-white/90 px-2 md:px-0"
              style={{ fontFamily: "var(--font-proba)" }}
            >
              Сайт є власністю держави Мезайс Луна і створений гравцем Вікторією Коваленко.
            </p>
          </div>
        </div>

        {/* Навигация */}
        <nav className="w-full border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between h-auto md:h-20 py-4 md:py-0 gap-4 md:gap-0">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 lg:gap-10">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white text-base md:text-lg font-medium hover:text-[#ffe358] transition-colors duration-200 whitespace-nowrap"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </footer>
  );
}

