export const COI_STATUSES = ["queued", "processing", "done", "error"] as const;

export type CoiStatus = (typeof COI_STATUSES)[number];

export type CoiMeta = {
  status: CoiStatus;
  filename: string;
  createdAt: string;
  error?: string;
  result?: string;
};

export type CoiReviewPublic = {
  id: string;
  status: CoiStatus;
  filename: string;
  error?: string;
  result?: string;
};

const REVIEW_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isReviewId(id: string): boolean {
  return REVIEW_ID.test(id);
}

export function canStartReview(status: CoiStatus): boolean {
  return status === "queued" || status === "processing";
}

export function toPublicReview(id: string, meta: CoiMeta): CoiReviewPublic {
  return {
    id,
    status: meta.status,
    filename: meta.filename,
    error: meta.error,
    result: meta.result,
  };
}

export function parseCoiMeta(value: unknown): CoiMeta | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  if (!COI_STATUSES.includes(record.status as CoiStatus)) {
    return null;
  }
  if (typeof record.filename !== "string" || record.filename.length === 0) {
    return null;
  }
  if (typeof record.createdAt !== "string" || record.createdAt.length === 0) {
    return null;
  }

  return {
    status: record.status as CoiStatus,
    filename: record.filename,
    createdAt: record.createdAt,
    error: typeof record.error === "string" ? record.error : undefined,
    result: typeof record.result === "string" ? record.result : undefined,
  };
}
