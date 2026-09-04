export default function HomePage() {
  return (
    <main>
      <section className="rounded-2xl border border-dashed border-(--line) bg-(--card) px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">No tools yet</h2>
        <p className="mx-auto mt-3 max-w-md text-(--muted)">
          This is the shared home base. Tools will show up here as we add them —
          nothing lives in a database, and each visit just needs the shared
          password.
        </p>
      </section>
    </main>
  );
}
