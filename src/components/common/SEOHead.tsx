/**
 * SEO helper for this stack.
 *
 * TanStack Start renders head tags server-side through each route's `head()`
 * option, so no client-side head library is used. `pageMeta()` builds a
 * consistent, unique meta set per route.
 */
export function pageMeta({
  title,
  description,
  type = "website",
}: {
  title: string;
  description: string;
  type?: string;
}) {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
