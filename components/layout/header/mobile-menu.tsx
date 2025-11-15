"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Головна" },
  { href: "/about", label: "Про нас" },
  { href: "/constitution", label: "Конституція" },
  { href: "/government", label: "Керівництво" },
  { href: "/parliament", label: "Парламент" },
  { href: "/news", label: "Новини" },
  { href: "/decrees", label: "Укази" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:text-[#ffe358] transition-colors duration-200 md:hidden"
        aria-label="Меню"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-64 bg-[#1a2b4d] z-50 shadow-xl md:hidden overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg">Меню</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-[#ffe358] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-white text-base font-medium hover:text-[#ffe358] transition-colors duration-200 py-2 px-4 rounded-md hover:bg-white/10"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}

