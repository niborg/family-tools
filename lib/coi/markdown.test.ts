import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { unwrapMarkdownFence } from "./markdown";
import { ReviewMarkdown } from "../../app/(app)/coi/[id]/review-markdown";

describe("unwrapMarkdownFence", () => {
  it("unwraps a whole-reply markdown fence", () => {
    expect(unwrapMarkdownFence("```markdown\n## Sufficient\n\nOK.\n```")).toBe(
      "## Sufficient\n\nOK.",
    );
  });

  it("leaves a reply with an inner email fence alone", () => {
    const source = "## Insufficient\n\n## Email\n\n```\nHi.\n```";
    expect(unwrapMarkdownFence(source)).toBe(source);
  });
});

describe("ReviewMarkdown", () => {
  it("renders headings, lists, emphasis, and the email block", () => {
    const html = renderToStaticMarkup(
      createElement(ReviewMarkdown, {
        markdown: `## Insufficient

This certificate is not sufficient.

- If a crew member **trips** and sues her, this wording does not cover it.

## Email

\`\`\`
Subject: Need a fix before the shoot

Hi — please send an updated certificate.
\`\`\`
`,
      }),
    );

    expect(html).toContain("<h2>");
    expect(html).toContain("Insufficient");
    expect(html).not.toContain("## Insufficient");
    expect(html).toContain("<li>");
    expect(html).toContain("<strong>");
    expect(html).toContain("<pre>");
    expect(html).toContain("Need a fix before the shoot");
    expect(html).not.toContain("```");
  });
});
