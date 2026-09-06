import Link from "next/link";

export default function AttendanceSheetNotFound() {
  return (
    <main>
      <p className="mb-6">
        <Link className="ranch-link font-comic text-sm" href="/attendance">
          ← back to crew hours
        </Link>
      </p>
      <section className="ranch-panel px-6 py-8">
        <h2 className="ranch-title text-2xl">We couldn&apos;t find that sheet</h2>
        <p className="mt-3 font-comic font-bold text-(--muted)">
          It may have been a bad link. Try crew hours again.
        </p>
      </section>
    </main>
  );
}
