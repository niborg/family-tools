import Link from "next/link";

const tools = [
  {
    href: "/coi",
    title: "Upload COI",
    description: "Send a certificate of insurance for review.",
  },
];

export default function HomePage() {
  return (
    <main>
      <ul className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link
              className="block rounded-2xl border border-(--line) bg-(--card) px-5 py-6 transition hover:border-(--accent)/40 hover:bg-white"
              href={tool.href}
            >
              <h2 className="text-lg font-semibold tracking-tight">
                {tool.title}
              </h2>
              <p className="mt-2 text-sm text-(--muted)">{tool.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
