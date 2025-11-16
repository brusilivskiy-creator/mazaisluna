import Link from "next/link";
import { Search } from "lucide-react";
import { Facebook, Twitter, Youtube } from "lucide-react";

const navLinks = [
  { href: "/", label: "Головна" },
  { href: "/constitution", label: "Конституція" },
  { href: "/government", label: "Керівництво" },
  { href: "/parliament", label: "Парламент" },
  { href: "/elections", label: "Вибори" },
];

export function Navigation() {
  return (
    <nav className="w-full border-t border-white/10 hidden md:block">
      <div>
        <div className="flex items-center justify-between" style={{ height: 'clamp(3.5rem, 7vw, 4.5rem)' }}>
          <div className="flex items-center gap-fluid-md">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white font-medium hover:text-[#ffe358] transition-colors duration-200 whitespace-nowrap"
                style={{ fontFamily: "var(--font-proba)", fontSize: "var(--fs-p)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-fluid-sm">
            <div className="flex items-center gap-fluid-xs">
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
              className="flex items-center gap-fluid-xs text-white hover:text-[#ffe358] transition-colors duration-200"
              aria-label="Пошук"
            >
              <Search className="w-6 h-6" />
              <span
                className="font-medium"
                style={{ fontFamily: "var(--font-proba)", fontSize: "var(--fs-p)" }}
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

