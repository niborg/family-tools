import Link from "next/link";

export default function CoiNotFound() {
  return (
    <main>
      <p className="mb-6">
        <Link className="ranch-link font-comic text-sm" href="/">
          ← back to the shed
        </Link>
      </p>
      <section className="ranch-panel px-6 py-8">
        <h2 className="ranch-title text-2xl">
          We couldn&apos;t find that upload
        </h2>
        <p className="mt-3 font-comic font-bold text-(--muted)">
          That trail went cold. Might&apos;ve been a bad link. You can start a
          new review.
        </p>
        <p className="mt-6">
          <Link className="ranch-btn inline-block px-4 py-2.5 no-underline" href="/coi">
            Upload a COI
          </Link>
        </p>
      </section>
    </main>
  );
}
