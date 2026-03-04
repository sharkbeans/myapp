// =============================================================================
// search.ts — Shared search/filter logic
// =============================================================================
// Simple text search across specified fields of any record.
//
// Phoenix equivalent:
//   from i in Item, where: ilike(i.name, ^"%#{query}%") or ilike(i.description, ^"%#{query}%")
//
// USAGE (in any store):
//   import { filterBySearch, parseSearchParam } from "@/app/_lib/search";
//   const filtered = filterBySearch(items, "hello", ["name", "description"]);
// =============================================================================

/**
 * Filter an array of objects by a search query across specified fields.
 *
 * Phoenix equivalent:
 *   Enum.filter(items, fn item ->
 *     Enum.any?(fields, fn field ->
 *       item |> Map.get(field) |> to_string() |> String.contains?(query)
 *     end)
 *   end)
 *
 * Case-insensitive, matches anywhere in the field value.
 */
export function filterBySearch<T extends Record<string, unknown>>(
  items: T[],
  query: string,
  fields: (keyof T)[],
): T[] {
  const trimmed = query.trim().toLowerCase();
  // Empty search = return everything (no filter applied)
  if (!trimmed) return items;

  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      if (value == null) return false;
      return String(value).toLowerCase().includes(trimmed);
    }),
  );
}

/**
 * Parse the search query from URL search params.
 *
 * USAGE (in a page.tsx):
 *   const query = parseSearchParam(searchParams);
 */
export function parseSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
): string {
  const raw = typeof searchParams.q === "string" ? searchParams.q : "";
  return raw.trim();
}
