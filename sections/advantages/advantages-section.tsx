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
    <section className="py-fluid-lg">
      <div className="content-wrapper">
        <h2
          className="font-semibold text-gray-900 mb-fluid-lg text-left pb-fluid-md border-b border-gray-300"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          Переваги держави
        </h2>

        <div className="auto-grid" style={{'--min-column-width': '280px', '--grid-gap': '0'}}>
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;

            return (
              <div
                key={index}
                className="p-fluid-md flex items-start gap-fluid-md"
              >
                <div className="flex-shrink-0">
                  <Icon className="stroke-2" style={{ color: "#23527c", width: 'clamp(2.5rem, 5vw, 3rem)', height: 'clamp(2.5rem, 5vw, 3rem)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-fluid-lg font-bold mb-fluid-sm"
                    style={{ fontFamily: "var(--font-proba)", color: "#23527c" }}
                  >
                    {advantage.title}
                  </h3>
                  <p
                    className="text-fluid-base text-gray-900 leading-relaxed"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    {advantage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

