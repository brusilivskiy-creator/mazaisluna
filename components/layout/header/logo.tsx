import Image from "next/image";

export function Logo() {
  return (
    <div className="flex justify-center mb-fluid-sm md:mb-fluid-xs">
      <div className="relative w-20 h-20" style={{ width: 'clamp(4rem, 8vw, 6rem)', height: 'clamp(4rem, 8vw, 6rem)' }}>
        <Image
          src="/images/logo.svg"
          alt="Логотип"
          width={96}
          height={96}
          className="w-full h-full"
          priority
        />
      </div>
    </div>
  );
}

