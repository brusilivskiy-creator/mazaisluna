import { Shield, Atom, Scale } from "lucide-react";

const advantages = [
  {
    icon: Shield,
    title: "Безпека і оборона",
    description:
      "Завдяки злагодженій роботі нашого колективу та належності до блоку, держава може вільно почувати від загроз з боку ворогів.",
  },
  {
    icon: Atom,
    title: "Стабільність і розвиток",
    description:
      "Злагоджена робота міністерства економіки гарантує наявність розвідок золота та інших ресурсів, а наявний бюджет гарантує впевненість у завтрішньому дні.",
  },
  {
    icon: Scale,
    title: "Парламентаризм",
    description:
      "Ми робимо ставку на парламентську модель управління, яка передбачає наявність партійного та мажоритарного role-play.",
  },
];

export function AdvantagesSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="content-wrapper">
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-6 md:mb-8 text-left pb-4 border-b border-gray-300"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          Переваги держави
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-300">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            const isLastInRow = (index + 1) % 3 === 0;
            const isInLastRow = index >= advantages.length - 3;

            return (
              <div
                key={index}
                className={`
                  p-6 md:p-8
                  ${!isLastInRow ? "border-r border-gray-300" : ""}
                  ${!isInLastRow ? "border-b border-gray-300" : ""}
                `}
              >
                <div className="mb-4">
                  <Icon className="w-10 h-10 md:w-12 md:h-12 stroke-2" style={{ color: "#23527c" }} />
                </div>
                <h3
                  className="text-base md:text-lg font-bold mb-3"
                  style={{ fontFamily: "var(--font-proba)", color: "#23527c" }}
                >
                  {advantage.title}
                </h3>
                <p
                  className="text-sm md:text-base text-gray-900 leading-relaxed"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {advantage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

