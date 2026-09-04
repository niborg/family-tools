import Link from "next/link";
import { UploadForm } from "./upload-form";

export default function CoiUploadPage() {
  return (
    <main>
      <p className="mb-6 text-sm">
        <Link className="text-(--muted) hover:text-(--ink)" href="/">
          ← Tools
        </Link>
      </p>
      <section className="rounded-2xl border border-(--line) bg-(--card) px-6 py-8">
        <h2 className="text-2xl font-semibold tracking-tight">Upload a COI</h2>
        <p className="mt-2 mb-6 max-w-md text-(--muted)">
          Drop in a certificate of insurance PDF. We will store it and send it
          for review.
        </p>
        <UploadForm />
      </section>
    </main>
  );
}
