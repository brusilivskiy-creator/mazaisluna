import Link from "next/link";
import { Search } from "lucide-react";
import { Facebook, Twitter, Youtube } from "lucide-react";

const navLinks = [
  { href: "/government", label: "Керівництво" },
  { href: "/services", label: "Послуги" },
  { href: "/activities", label: "Діяльність" },
  { href: "/decisions", label: "Рішення Уряду" },
  { href: "/public", label: "Для громадськості" },
  { href: "/press", label: "Прес-центр" },
];

export function Navigation() {
  return (
    <nav className="w-full border-t border-white/10 hidden md:block">
      <div>
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
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
            <button
              className="flex items-center gap-2 text-white hover:text-[#ffe358] transition-colors duration-200"
              aria-label="Пошук"
            >
              <Search className="w-6 h-6" />
              <span
                className="text-base md:text-lg font-medium"
                style={{ fontFamily: "var(--font-proba)" }}
              >
                Пошук
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

