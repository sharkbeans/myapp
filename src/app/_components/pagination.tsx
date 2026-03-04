// =============================================================================
// pagination.tsx — Pagination controls (like Scrivener.HTML in Phoenix)
// =============================================================================
// Renders prev/next buttons and page numbers.
// This is a SERVER component — no client JS needed!
//
// Phoenix equivalent:
//   Scrivener.HTML.pagination_links(conn, page)
//
// USAGE (in any index page):
//   import { Pagination } from "@/app/_components/pagination";
//   <Pagination result={paginatedResult} basePath="/items" searchParams={searchParams} />
//
// COPY-PASTE CHECKLIST:
//   1. Import this component
//   2. Pass the PaginatedResult from your store
//   3. Pass the basePath (e.g. "/items", "/products")
//   4. Pass the current searchParams so other params (search, sort) are preserved
// =============================================================================

import Link from "next/link";
import type { PaginatedResult } from "../_lib/pagination";
import { buildPaginationUrl } from "../_lib/pagination";

type Props = {
  result: PaginatedResult<unknown>; // we only need the metadata, not the data type
  basePath: string; // e.g. "/items"
  searchParams: Record<string, string | string[] | undefined>;
};

export function Pagination({ result, basePath, searchParams }: Props) {
  const { page, total_pages, total, has_prev, has_next } = result;

  // Don't render if there's only one page
  if (total_pages <= 1) return null;

  // Build page number list — show up to 7 pages with ellipsis
  const pageNumbers = buildPageNumbers(page, total_pages);

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      {/* Left side: showing X of Y */}
      <span className="text-gray-500 dark:text-gray-400">
        Page {page} of {total_pages} ({total} total)
      </span>

      {/* Right side: page controls */}
      <div className="flex items-center gap-1">
        {/* Prev button */}
        {has_prev ? (
          <Link
            href={buildPaginationUrl(basePath, searchParams, {
              page: page - 1,
            })}
            className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            &larr; Prev
          </Link>
        ) : (
          <span className="rounded border border-gray-200 px-2 py-1 text-gray-400 dark:border-gray-800 dark:text-gray-600">
            &larr; Prev
          </span>
        )}

        {/* Page numbers */}
        {pageNumbers.map((p, _i) =>
          p === "..." ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis items have no stable key
            <span key={`ellipsis-${_i}`} className="px-1 text-gray-400">
              ...
            </span>
          ) : (
            <Link
              key={p}
              href={buildPaginationUrl(basePath, searchParams, { page: p })}
              className={`rounded border px-2 py-1 ${
                p === page
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              }`}
            >
              {p}
            </Link>
          ),
        )}

        {/* Next button */}
        {has_next ? (
          <Link
            href={buildPaginationUrl(basePath, searchParams, {
              page: page + 1,
            })}
            className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Next &rarr;
          </Link>
        ) : (
          <span className="rounded border border-gray-200 px-2 py-1 text-gray-400 dark:border-gray-800 dark:text-gray-600">
            Next &rarr;
          </span>
        )}
      </div>
    </div>
  );
}

// --- Helper ------------------------------------------------------------------

/**
 * Build an array like [1, 2, 3, "...", 10] for page numbers.
 * Shows first, last, and pages around the current page.
 */
function buildPageNumbers(current: number, total: number): (number | "...")[] {
  // If total pages is small, show all
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  // Always show page 1
  pages.push(1);

  // If current is far from start, add ellipsis
  if (current > 3) {
    pages.push("...");
  }

  // Pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // If current is far from end, add ellipsis
  if (current < total - 2) {
    pages.push("...");
  }

  // Always show last page
  pages.push(total);

  return pages;
}
