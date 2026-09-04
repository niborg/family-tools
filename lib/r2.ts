import { getCloudflareContext } from "@opennextjs/cloudflare";

type CoiBucket = {
  get(key: string): Promise<{
    arrayBuffer(): Promise<ArrayBuffer>;
    text(): Promise<string>;
  } | null>;
  put(
    key: string,
    value: ArrayBuffer | string,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
};

function asCoiBucket(value: unknown): CoiBucket | undefined {
  if (
    value &&
    typeof value === "object" &&
    "get" in value &&
    "put" in value &&
    typeof value.get === "function" &&
    typeof value.put === "function"
  ) {
    return value as CoiBucket;
  }
  return undefined;
}

export async function getCoiBucket(): Promise<CoiBucket> {
  const { env } = await getCloudflareContext({ async: true });
  const bucket = asCoiBucket(
    (env as { COI_BUCKET?: unknown }).COI_BUCKET,
  );
  if (!bucket) {
    throw new Error("COI_BUCKET binding is missing");
  }
  return bucket;
}

export async function scheduleBackground(task: Promise<unknown>): Promise<void> {
  try {
    const { ctx } = await getCloudflareContext({ async: true });
    if (ctx && typeof ctx.waitUntil === "function") {
      ctx.waitUntil(task);
      return;
    }
  } catch {
    // `next dev` can run without a Worker execution context.
  }
  void task;
}
