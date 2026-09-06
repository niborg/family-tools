import { getCloudflareContext } from "@opennextjs/cloudflare";

export type RanchBucket = {
  get(key: string): Promise<{
    arrayBuffer(): Promise<ArrayBuffer>;
    text(): Promise<string>;
  } | null>;
  put(
    key: string,
    value: ArrayBuffer | string,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
  list(options?: { prefix?: string }): Promise<{
    objects: { key: string }[];
  }>;
};

function asRanchBucket(value: unknown): RanchBucket | undefined {
  if (
    value &&
    typeof value === "object" &&
    "get" in value &&
    "put" in value &&
    "list" in value &&
    typeof value.get === "function" &&
    typeof value.put === "function" &&
    typeof value.list === "function"
  ) {
    return value as RanchBucket;
  }
  return undefined;
}

async function getBoundBucket(
  name: "COI_BUCKET" | "HOURS_BUCKET",
): Promise<RanchBucket> {
  const { env } = await getCloudflareContext({ async: true });
  const bucket = asRanchBucket((env as Record<string, unknown>)[name]);
  if (!bucket) {
    throw new Error(`${name} binding is missing`);
  }
  return bucket;
}

export async function getCoiBucket(): Promise<RanchBucket> {
  return getBoundBucket("COI_BUCKET");
}

export async function getHoursBucket(): Promise<RanchBucket> {
  return getBoundBucket("HOURS_BUCKET");
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
