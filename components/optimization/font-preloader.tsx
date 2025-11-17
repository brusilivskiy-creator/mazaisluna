"use client";

import { useEffect } from "react";

export function FontPreloader() {
  useEffect(() => {
    // Preload критичні шрифти для швидшого завантаження
    if (typeof document !== "undefined") {
      const fonts = [
        "/fonts/ProbaPro-Regular.woff2",
        "/fonts/ProbaPro-Medium.woff2",
        "/fonts/ProbaPro-SemiBold.woff2",
        "/fonts/ProbaPro-Bold.woff2",
      ];

      fonts.forEach((font) => {
        // Перевіряємо чи вже не додано
        if (!document.querySelector(`link[href="${font}"]`)) {
          const link = document.createElement("link");
          link.rel = "preload";
          link.href = font;
          link.as = "font";
          link.type = "font/woff2";
          link.crossOrigin = "anonymous";
          document.head.appendChild(link);
        }
      });

      // Preload логотип
      if (!document.querySelector('link[href="/images/logo.svg"]')) {
        const logoLink = document.createElement("link");
        logoLink.rel = "preload";
        logoLink.href = "/images/logo.svg";
        logoLink.as = "image";
        document.head.appendChild(logoLink);
      }
    }
  }, []);

  return null;
}

