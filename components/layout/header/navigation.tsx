import Link from "next/link";

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
        </div>
      </div>
    </nav>
  );
}

