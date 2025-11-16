import { Globe, Accessibility } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <div className="hidden md:flex items-center justify-between w-full border-b border-white/10 px-4 lg:px-6 xl:px-8 py-1.5">
      <div className="flex items-center gap-2">
        <span
          className="text-white font-bold text-sm"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          GOV.UA
        </span>
        <span
          className="text-white/80 text-xs"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          Державні сайти України
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="text-white/80 hover:text-white transition-colors"
          aria-label="Доступність"
        >
          <Accessibility className="w-5 h-5" />
        </button>
        <Link
          href="/en"
          className="text-white/80 hover:text-[#ffe358] text-sm transition-colors"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          In English
        </Link>
      </div>
    </div>
  );
}

