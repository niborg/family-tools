import { loadCoiSkill } from "./skill";
import { readCoiMeta, readCoiPdf, writeCoiMeta } from "./storage";
import { canStartReview } from "./types";

const DEFAULT_MODEL = "claude-sonnet-4-6";
const inFlight = new Set<string>();

type AnthropicContent = {
  type?: string;
  text?: string;
};

type AnthropicResponse = {
  content?: AnthropicContent[];
  error?: { message?: string; type?: string };
};

export function userFacingReviewError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("ANTHROPIC_API_KEY")) {
    return "Reviews aren't configured yet.";
  }
  if (message.includes("429")) {
    return "The reviewer is busy. Try again in a minute.";
  }
  return "The review did not finish. Try uploading again.";
}

export function textFromAnthropicResponse(data: AnthropicResponse): string {
  if (data.error?.message) {
    throw new Error(data.error.message);
  }

  const text = data.content
    ?.filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("\n\n")
    .trim();

  if (!text) {
    throw new Error("empty anthropic response");
  }

  return text;
}

function requireAnthropicKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  return key;
}

export async function reviewCoiWithAnthropic(
  pdf: ArrayBuffer,
  skill: string,
): Promise<string> {
  const key = requireAnthropicKey();
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  const body = {
    model,
    max_tokens: 4096,
    system: skill,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: Buffer.from(pdf).toString("base64"),
            },
          },
          {
            type: "text",
            text: "Review this Certificate of Insurance.",
          },
        ],
      },
    ],
  };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "pdfs-2024-09-25",
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as AnthropicResponse;
  if (!response.ok) {
    const detail = data.error?.message || `Anthropic request failed (${response.status})`;
    throw new Error(detail);
  }

  return textFromAnthropicResponse(data);
}

export async function runCoiReview(id: string): Promise<void> {
  if (inFlight.has(id)) {
    return;
  }
  inFlight.add(id);

  try {
    const meta = await readCoiMeta(id);
    if (!meta || !canStartReview(meta.status)) {
      return;
    }

    await writeCoiMeta(id, { ...meta, status: "processing" });

    const pdf = await readCoiPdf(id);
    if (!pdf) {
      await writeCoiMeta(id, {
        ...meta,
        status: "error",
        error: "The uploaded file could not be read.",
      });
      return;
    }

    const result = await reviewCoiWithAnthropic(pdf, loadCoiSkill());
    await writeCoiMeta(id, { ...meta, status: "done", result });
  } catch (error) {
    const meta = await readCoiMeta(id);
    if (meta) {
      await writeCoiMeta(id, {
        ...meta,
        status: "error",
        error: userFacingReviewError(error),
      });
    }
    console.error("COI review failed", id, error);
  } finally {
    inFlight.delete(id);
  }
}
