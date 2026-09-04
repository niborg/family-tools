export function unwrapMarkdownFence(source: string): string {
  const trimmed = source.trim();
  const match = /^```(?:markdown|md)?\r?\n([\s\S]*)\r?\n```$/.exec(trimmed);
  if (!match) {
    return trimmed;
  }

  const inner = match[1];
  if (/^```/m.test(inner)) {
    return trimmed;
  }

  return inner.trim();
}
