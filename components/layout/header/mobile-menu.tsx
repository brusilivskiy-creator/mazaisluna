"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Головна" },
  { href: "/constitution", label: "Конституція" },
  { href: "/government", label: "Керівництво" },
  { href: "/parliament", label: "Парламент" },
  { href: "/elections", label: "Вибори" },
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
          <div className="fixed top-0 left-0 h-full bg-[#304d7c] z-50 shadow-xl md:hidden overflow-y-auto" style={{ width: 'clamp(280px, 80vw, 320px)' }}>
            <div className="p-fluid-md">
              <div className="flex items-center justify-between mb-fluid-lg">
                <h2 className="text-white font-bold text-fluid-lg">Меню</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-[#ffe358] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-fluid-sm">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-white text-fluid-base font-medium hover:text-[#ffe358] transition-colors duration-200 py-fluid-sm px-fluid-md rounded-md hover:bg-white/10"
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

