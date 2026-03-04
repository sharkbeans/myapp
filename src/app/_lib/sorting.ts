// =============================================================================
// sorting.ts — Shared sorting logic
// =============================================================================
// Provides generic sorting for any list of records.
//
// Phoenix equivalent:
//   Repo.all(from i in Item, order_by: [{:asc, :name}])
//
// USAGE (in any store):
//   import { sortItems, parseSortParams, type SortParams } from "@/app/_lib/sorting";
//   const sorted = sortItems(items, { sort_by: "name", sort_dir: "asc" });
// =============================================================================

// --- Types -------------------------------------------------------------------

/** Sort direction — ascending or descending. */
export type SortDir = "asc" | "desc";

/** The params you pass IN to sort a list. Read from URL ?sort_by=name&sort_dir=asc */
export type SortParams = {
  sort_by: string; // which field to sort by (e.g. "name", "createdAt")
  sort_dir: SortDir; // which direction
};

// --- Core function -----------------------------------------------------------

/**
 * Sort an array of objects by a given key.
 *
 * Phoenix equivalent:
 *   Enum.sort_by(items, &Map.get(&1, field), sorter)
 *
 * This is a pure function — returns a NEW sorted array, doesn't mutate the input.
 */
export function sortItems<T extends Record<string, unknown>>(
  items: T[],
  params: SortParams,
): T[] {
  const { sort_by, sort_dir } = params;
  // Make a copy so we don't mutate the original (like Enum.sort, not List.sort!)
  return [...items].sort((a, b) => {
    const aVal = a[sort_by];
    const bVal = b[sort_by];

    // Handle nullish values — push them to the end
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    // String comparison
    if (typeof aVal === "string" && typeof bVal === "string") {
      const cmp = aVal.localeCompare(bVal);
      return sort_dir === "asc" ? cmp : -cmp;
    }

    // Number comparison
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sort_dir === "asc" ? aVal - bVal : bVal - aVal;
    }

    // Fallback: coerce to string
    const cmp = String(aVal).localeCompare(String(bVal));
    return sort_dir === "asc" ? cmp : -cmp;
  });
}

// --- URL helpers -------------------------------------------------------------

/**
 * Parse sort params from URL search params.
 *
 * USAGE (in a page.tsx):
 *   const sortParams = parseSortParams(searchParams, "name", ["name", "status", "createdAt"]);
 */
export function parseSortParams(
  searchParams: Record<string, string | string[] | undefined>,
  defaultField: string,
  allowedFields: string[],
): SortParams {
  const rawSortBy =
    typeof searchParams.sort_by === "string" ? searchParams.sort_by : undefined;
  const rawSortDir =
    typeof searchParams.sort_dir === "string"
      ? searchParams.sort_dir
      : undefined;

  return {
    // Only allow known field names (prevent arbitrary property access)
    sort_by:
      rawSortBy && allowedFields.includes(rawSortBy) ? rawSortBy : defaultField,
    sort_dir: rawSortDir === "desc" ? "desc" : "asc",
  };
}

/**
 * Get the "next" sort direction when clicking a column header.
 *
 * If clicking the same column: toggle direction.
 * If clicking a different column: start with "asc".
 */
export function nextSortDir(
  currentSortBy: string,
  currentSortDir: SortDir,
  clickedField: string,
): SortDir {
  if (clickedField === currentSortBy) {
    return currentSortDir === "asc" ? "desc" : "asc";
  }
  return "asc";
}
