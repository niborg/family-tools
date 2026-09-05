const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;

export function safeInternalPath(
  value: unknown,
  fallback = "/",
): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }
  if (trimmed.includes("://") || trimmed.includes("\\")) {
    return fallback;
  }
  if (CONTROL_CHARS.test(trimmed) || trimmed.length > 200) {
    return fallback;
  }

  const path = trimmed.split("?")[0] ?? trimmed;
  if (path === "/login" || path.startsWith("/login/")) {
    return fallback;
  }

  return trimmed;
}
