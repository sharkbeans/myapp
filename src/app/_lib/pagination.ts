// =============================================================================
// pagination.ts — Shared pagination logic (like Scrivener in Elixir)
// =============================================================================
// This is the equivalent of a pagination library in Elixir (e.g. Scrivener).
// It takes any array and returns a "page" of results plus metadata.
//
// USAGE (in any store):
//   import { paginate, type PaginationParams, type PaginatedResult } from "@/app/_lib/pagination";
//   const result = paginate(allItems, { page: 1, per_page: 10 });
//
// Phoenix equivalent:
//   Repo.paginate(query, page: 1, page_size: 10)
// =============================================================================

// --- Types -------------------------------------------------------------------

/** The params you pass IN to request a page. Think of it like query params. */
export type PaginationParams = {
  page: number; // 1-based page number (like ?page=2)
  per_page: number; // how many items per page (like ?per_page=10)
};

/** The result you get BACK — the page of data plus metadata for rendering controls. */
export type PaginatedResult<T> = {
  data: T[]; // the items on this page
  total: number; // total number of items across all pages
  page: number; // current page number (1-based)
  per_page: number; // items per page
  total_pages: number; // total number of pages
  has_prev: boolean; // is there a previous page?
  has_next: boolean; // is there a next page?
};

// --- Constants ---------------------------------------------------------------

/** Allowed per_page values — shown in the dropdown. */
export const PER_PAGE_OPTIONS = [5, 10, 25, 50] as const;

/** Default per_page if none specified. */
export const DEFAULT_PER_PAGE = 10;

/** Default page if none specified. */
export const DEFAULT_PAGE = 1;

// --- Core function -----------------------------------------------------------

/**
 * Paginate an array of items.
 *
 * Phoenix equivalent:
 *   Repo.all(query) |> Scrivener.paginate(page: 1, page_size: 10)
 *
 * This is a pure function — it doesn't mutate anything, just slices the array.
 */
export function paginate<T>(
  items: T[],
  params: PaginationParams,
): PaginatedResult<T> {
  const total = items.length;
  const per_page = Math.max(1, params.per_page); // guard against 0 or negative
  const total_pages = Math.max(1, Math.ceil(total / per_page));

  // Clamp page to valid range (1..total_pages)
  const page = Math.max(1, Math.min(params.page, total_pages));

  // Slice the array — like Enum.slice(items, offset, per_page) in Elixir
  const offset = (page - 1) * per_page;
  const data = items.slice(offset, offset + per_page);

  return {
    data,
    total,
    page,
    per_page,
    total_pages,
    has_prev: page > 1,
    has_next: page < total_pages,
  };
}

// --- URL helpers -------------------------------------------------------------

/**
 * Parse pagination params from URL search params.
 *
 * Phoenix equivalent:
 *   In a controller, you'd read conn.params["page"] and conn.params["per_page"]
 *
 * USAGE (in a page.tsx server component):
 *   const params = parsePaginationParams(searchParams);
 */
export function parsePaginationParams(
  searchParams: Record<string, string | string[] | undefined>,
): PaginationParams {
  const rawPage =
    typeof searchParams.page === "string" ? searchParams.page : undefined;
  const rawPerPage =
    typeof searchParams.per_page === "string"
      ? searchParams.per_page
      : undefined;

  return {
    page: rawPage
      ? Math.max(1, Number.parseInt(rawPage, 10) || DEFAULT_PAGE)
      : DEFAULT_PAGE,
    per_page: rawPerPage
      ? Math.max(1, Number.parseInt(rawPerPage, 10) || DEFAULT_PER_PAGE)
      : DEFAULT_PER_PAGE,
  };
}

/**
 * Build a query string that preserves existing params but updates page/per_page.
 *
 * Phoenix equivalent:
 *   Routes.item_path(conn, :index, page: 2, per_page: 10)
 *
 * USAGE:
 *   buildPaginationUrl("/items", currentParams, { page: 2 })
 *   // => "/items?page=2&per_page=10"
 */
export function buildPaginationUrl(
  basePath: string,
  currentParams: Record<string, string | string[] | undefined>,
  overrides: Partial<PaginationParams> &
    Record<string, string | number | undefined>,
): string {
  const params = new URLSearchParams();

  // Copy over existing params (search, sort, etc.)
  for (const [key, value] of Object.entries(currentParams)) {
    if (value !== undefined && typeof value === "string") {
      params.set(key, value);
    }
  }

  // Apply overrides
  for (const [key, value] of Object.entries(overrides)) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
