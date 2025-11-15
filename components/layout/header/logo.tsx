import Image from "next/image";

export function Logo() {
  return (
    <div className="flex justify-center mb-4 md:mb-6">
      <div className="relative w-16 h-16 md:w-24 md:h-24">
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

