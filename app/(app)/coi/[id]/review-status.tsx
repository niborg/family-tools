"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCoiReview } from "@/app/actions/coi";
import type { CoiReviewPublic } from "@/lib/coi/types";
import { ReviewMarkdown } from "./review-markdown";

export function ReviewStatus({ initial }: { initial: CoiReviewPublic }) {
  const [review, setReview] = useState(initial);
  const [pollError, setPollError] = useState<string | null>(null);
  const waiting = review.status === "queued" || review.status === "processing";

  useEffect(() => {
    if (!waiting) {
      return;
    }

    let cancelled = false;

    async function loop() {
      while (!cancelled) {
        try {
          const next = await getCoiReview(review.id, true);
          if (cancelled) {
            return;
          }
          if (!next.ok) {
            setPollError(next.error);
          } else {
            setPollError(null);
            setReview(next.review);
            if (
              next.review.status !== "queued" &&
              next.review.status !== "processing"
            ) {
              return;
            }
          }
        } catch {
          if (!cancelled) {
            setPollError("The review is still running. Retrying…");
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    void loop();

    return () => {
      cancelled = true;
    };
  }, [review.id, waiting]);

  return (
    <section className="ranch-panel px-6 py-8">
      <p className="font-pixel text-lg text-(--muted)">{review.filename}</p>
      {waiting ? (
        <div className="mt-4 flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block size-5 animate-spin rounded-full border-2 border-(--line) border-t-(--accent)"
          />
          <div>
            <h2 className="ranch-title text-2xl">
              Reviewing your certificate…
            </h2>
            <p className="mt-1 font-comic text-sm font-bold text-(--muted)">
              This usually takes a minute. Leave this page open and watch the
              tumbleweeds.
            </p>
          </div>
        </div>
      ) : null}
      {review.status === "done" ? (
        <>
          <h2 className="ranch-title mt-2 text-2xl">Review</h2>
          {review.result ? <ReviewMarkdown markdown={review.result} /> : null}
        </>
      ) : null}
      {review.status === "error" ? (
        <>
          <h2 className="ranch-title mt-2 text-2xl">The review did not finish</h2>
          <p className="mt-3 font-comic font-bold text-(--danger)" role="alert">
            {review.error}
          </p>
          <p className="mt-6">
            <Link className="ranch-btn inline-block px-4 py-2.5 no-underline" href="/coi">
              Try again
            </Link>
          </p>
        </>
      ) : null}
      {pollError ? (
        <p className="mt-4 font-comic text-sm font-bold text-(--danger)" role="alert">
          {pollError}
        </p>
      ) : null}
    </section>
  );
}
