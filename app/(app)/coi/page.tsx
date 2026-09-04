import Link from "next/link";
import { UploadForm } from "./upload-form";

export default function CoiUploadPage() {
  return (
    <main>
      <p className="mb-6">
        <Link className="ranch-link font-comic text-sm" href="/">
          ← back to the shed
        </Link>
      </p>
      <section className="ranch-panel relative px-6 py-8">
        <span className="new-burst absolute -top-2 right-4">HOT!!</span>
        <h2 className="ranch-title text-3xl">Upload a COI</h2>
        <p className="mt-2 mb-6 max-w-md font-comic font-bold text-(--muted)">
          Drop a certificate of insurance PDF on the hay wagon. We store it and
          send it for review.
        </p>
        <UploadForm />
      </section>
    </main>
  );
}
