"use client";

import ReactMarkdown from "react-markdown";
import { unwrapMarkdownFence } from "@/lib/coi/markdown";

export function ReviewMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className="coi-review">
      <ReactMarkdown>{unwrapMarkdownFence(markdown)}</ReactMarkdown>
    </div>
  );
}
