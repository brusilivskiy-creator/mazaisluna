"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Перевіряємо, чи вже залогінений
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push("/admin");
        }
      })
      .catch(() => {
        // Не залогінений, залишаємо на сторінці логіну
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Невірний логін або пароль");
      }
    } catch (error) {
      setError("Помилка при вході. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="page-wrapper">
        <main className="bg-white min-h-screen w-full">
          <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
            <div className="content-wrapper max-w-md w-full">
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-300">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-[#23527c] w-16 h-16 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1
                  className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 text-center"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  Вхід до адмін-панелі
                </h1>
                <p
                  className="text-gray-600 text-center mb-6"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  Введіть логін і пароль для доступу
                </p>

                {error && (
                  <div
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-2"
                      style={{ fontFamily: "var(--font-proba)" }}
                    >
                      Логін
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                      style={{ fontFamily: "var(--font-proba)" }}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                      style={{ fontFamily: "var(--font-proba)" }}
                    >
                      Пароль
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                      style={{ fontFamily: "var(--font-proba)" }}
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-[#23527c] text-white rounded-lg hover:bg-[#1a3d5c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    {loading ? "Вхід..." : "Увійти"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

