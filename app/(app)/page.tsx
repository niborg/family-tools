import Link from "next/link";

const tools = [
  {
    href: "/attendance",
    title: "Crew hours",
    description:
      "Days Santos and Blanca worked, plus a photo of Santos's hours sheet.",
    icon: "🐴",
  },
  {
    href: "/coi",
    title: "Upload COI",
    description: "Send a certificate of insurance for review, partner.",
    icon: "📜",
  },
];

export default function HomePage() {
  return (
    <main>
      <p className="mb-5 text-center font-pixel text-xl">
        <span className="spin-slow mr-2" aria-hidden>
          ⭐
        </span>
        <span className="rainbow">welcome, neighbor</span>
        <span className="spin-slow ml-2" aria-hidden>
          ⭐
        </span>
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link
              className="ranch-panel relative block px-5 py-6 no-underline hover:brightness-105"
              href={tool.href}
            >
              <span className="new-burst absolute -top-2 -right-2">NEW!!!</span>
              <h2 className="ranch-title text-2xl text-(--ink)">
                <span className="mr-2" aria-hidden>
                  {tool.icon}
                </span>
                {tool.title}
              </h2>
              <p className="mt-2 font-comic text-(--muted)">{tool.description}</p>
              <p className="mt-3 font-pixel text-lg text-(--accent)">saddle up →</p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center font-comic text-sm font-bold text-[#3d1f0a]">
        <span className="bounce-slow" aria-hidden>
          🌵
        </span>{" "}
        this homestead has been online since the last roundup{" "}
        <span className="bounce-slow" aria-hidden>
          🐴
        </span>
      </p>
    </main>
  );
}
