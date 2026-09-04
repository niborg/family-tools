"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCoiReview } from "@/app/actions/coi";
import type { CoiReviewPublic } from "@/lib/coi/types";

export function ReviewStatus({ initial }: { initial: CoiReviewPublic }) {
  const [review, setReview] = useState(initial);
  const [pollError, setPollError] = useState<string | null>(null);
  const waiting = review.status === "queued" || review.status === "processing";

  useEffect(() => {
    if (!waiting) {
      return;
    }

    let cancelled = false;

    async function tick() {
      const next = await getCoiReview(review.id);
      if (cancelled) {
        return;
      }
      if (!next.ok) {
        setPollError(next.error);
        return;
      }
      setPollError(null);
      setReview(next.review);
    }

    const timer = setInterval(() => {
      void tick();
    }, 2000);
    void tick();

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [review.id, waiting]);

  return (
    <section className="rounded-2xl border border-(--line) bg-(--card) px-6 py-8">
      <p className="text-sm text-(--muted)">{review.filename}</p>
      {waiting ? (
        <div className="mt-4 flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block size-5 animate-spin rounded-full border-2 border-(--line) border-t-(--accent)"
          />
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Reviewing your certificate…
            </h2>
            <p className="mt-1 text-sm text-(--muted)">
              This usually takes a minute. You can leave this page open.
            </p>
          </div>
        </div>
      ) : null}
      {review.status === "done" ? (
        <>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Review</h2>
          <div className="mt-4 whitespace-pre-wrap text-[15px] leading-7">
            {review.result}
          </div>
        </>
      ) : null}
      {review.status === "error" ? (
        <>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            The review did not finish
          </h2>
          <p className="mt-3 text-(--danger)" role="alert">
            {review.error}
          </p>
          <p className="mt-6">
            <Link
              className="rounded-lg bg-(--accent) px-4 py-2.5 text-sm font-semibold text-white hover:bg-(--accent-hover)"
              href="/coi"
            >
              Try again
            </Link>
          </p>
        </>
      ) : null}
      {pollError ? (
        <p className="mt-4 text-sm text-(--danger)" role="alert">
          {pollError}
        </p>
      ) : null}
    </section>
  );
}
