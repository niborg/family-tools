import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoiReview } from "@/app/actions/coi";
import { ReviewStatus } from "./review-status";

export default async function CoiReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCoiReview(id);

  if (!result.ok) {
    if (result.missing) {
      notFound();
    }

    return (
      <main>
        <p className="mb-6 text-sm">
          <Link className="text-(--muted) hover:text-(--ink)" href="/">
            ← Tools
          </Link>
        </p>
        <section className="rounded-2xl border border-(--line) bg-(--card) px-6 py-8">
          <h2 className="text-xl font-semibold tracking-tight">
            This review is unavailable
          </h2>
          <p className="mt-3 text-(--danger)" role="alert">
            {result.error}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <p className="mb-6 text-sm">
        <Link className="text-(--muted) hover:text-(--ink)" href="/">
          ← Tools
        </Link>
      </p>
      <ReviewStatus initial={result.review} />
    </main>
  );
}
