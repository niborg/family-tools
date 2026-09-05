import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
      other: {
        "Content-Signal": "search=no, ai-train=no, ai-input=no",
      },
    },
  };
}
