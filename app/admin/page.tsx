"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Users, Settings, FileText, Building2 } from "lucide-react";

const adminSections = [
  {
    href: "/admin/politicians",
    label: "Політики",
    description: "Управління картками політиків",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    href: "/admin/positions",
    label: "Посади",
    description: "Управління списком посад",
    icon: Users,
    color: "bg-cyan-500",
  },
  {
    href: "/admin/leadership",
    label: "Керівництво",
    description: "Призначення політиків на посади",
    icon: Users,
    color: "bg-indigo-500",
  },
  {
    href: "/admin/parliament",
    label: "Склад парламенту",
    description: "Управління складом парламенту та мандатами",
    icon: Building2,
    color: "bg-green-500",
  },
  {
    href: "/admin/parties",
    label: "Партії",
    description: "Управління політичними партіями",
    icon: Building2,
    color: "bg-purple-500",
  },
  {
    href: "/admin/news",
    label: "Новини",
    description: "Управління новинами та публікаціями",
    icon: FileText,
    color: "bg-orange-500",
  },
  {
    href: "/admin/settings",
    label: "Налаштування",
    description: "Загальні налаштування сайту",
    icon: Settings,
    color: "bg-gray-500",
  },
];

export default function AdminPage() {
  return (
    <>
      <Header />
      <div className="page-wrapper">
        <main className="bg-white min-h-screen w-full">
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="content-wrapper">
              <div className="mb-8">
                <h1
                  className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  Адмін-панель
                </h1>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  Управління контентом сайту
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Link
                      key={section.href}
                      href={section.href}
                      className="bg-white p-6 rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition-shadow flex flex-col group"
                    >
                      <div className={`${section.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h2
                        className="text-xl font-semibold text-gray-900 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        {section.label}
                      </h2>
                      <p
                        className="text-sm text-gray-600"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        {section.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

