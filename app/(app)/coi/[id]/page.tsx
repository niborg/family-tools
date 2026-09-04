import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoiReview } from "@/app/actions/coi";
import { ReviewStatus } from "./review-status";

function BackLink() {
  return (
    <p className="mb-6">
      <Link className="ranch-link font-comic text-sm" href="/">
        ← back to the shed
      </Link>
    </p>
  );
}

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
        <BackLink />
        <section className="ranch-panel px-6 py-8">
          <h2 className="ranch-title text-2xl">This review is unavailable</h2>
          <p className="mt-3 font-comic font-bold text-(--danger)" role="alert">
            {result.error}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <BackLink />
      <ReviewStatus initial={result.review} />
    </main>
  );
}
