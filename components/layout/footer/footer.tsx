"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-[#1a2b4d] text-white relative mt-auto"
      style={{
        background: "radial-gradient(circle, #185990 0%, #234161 100%)",
      }}
    >
      <div className="header-wrapper">
        <div className="w-full py-fluid-md">
          <div className="text-center">
            <p
              className="text-fluid-base text-white/90 text-center mx-auto mb-fluid-sm"
              style={{ fontFamily: "var(--font-proba)" }}
            >
              Сайт є власністю держави Мезайс Луна і створений гравцем Вікторією Коваленко.
            </p>
            <p
              className="text-fluid-sm text-white/70 text-center mx-auto mb-fluid-sm"
              style={{ fontFamily: "var(--font-proba)" }}
            >
              Усі персонажі, партії та події в нашому RP є вигаданими, а будь-які збіги з реальними публічними особами (політиками) чи подіями є випадковими або використовуються виключно заради RP.
            </p>
            <p
              className="text-fluid-sm text-white/70 text-center mx-auto"
              style={{ fontFamily: "var(--font-proba)" }}
            >
              © {currentYear} Мезайс Луна. Всі права захищені.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

