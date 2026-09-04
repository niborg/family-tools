import Link from "next/link";

export default function CoiNotFound() {
  return (
    <main>
      <p className="mb-6 text-sm">
        <Link className="text-(--muted) hover:text-(--ink)" href="/">
          ← Tools
        </Link>
      </p>
      <section className="rounded-2xl border border-(--line) bg-(--card) px-6 py-8">
        <h2 className="text-xl font-semibold tracking-tight">
          We couldn&apos;t find that upload
        </h2>
        <p className="mt-3 text-(--muted)">
          It may have been a bad link. You can start a new review.
        </p>
        <p className="mt-6">
          <Link
            className="rounded-lg bg-(--accent) px-4 py-2.5 text-sm font-semibold text-white hover:bg-(--accent-hover)"
            href="/coi"
          >
            Upload a COI
          </Link>
        </p>
      </section>
    </main>
  );
}
