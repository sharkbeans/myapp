// =============================================================================
// sort-header.tsx — Clickable column header for sorting
// =============================================================================
// Renders a <th> that links to the current page with sort params.
// Click once = asc, click again = desc, click a different column = asc.
//
// Phoenix equivalent:
//   A <.link> in a <th> that sets sort params:
//   <th><.link patch={~p"/items?sort_by=name&sort_dir=asc"}>Name</.link></th>
//
// USAGE (in any index page's <thead>):
//   import { SortHeader } from "@/app/_components/sort-header";
//   <SortHeader
//     field="name"
//     label="Name"
//     currentSortBy={sortParams.sort_by}
//     currentSortDir={sortParams.sort_dir}
//     basePath="/items"
//     searchParams={searchParams}
//   />
//
// COPY-PASTE: Just change field, label, basePath.
// =============================================================================

import Link from "next/link";
import { buildPaginationUrl } from "../_lib/pagination";
import { nextSortDir, type SortDir } from "../_lib/sorting";

type Props = {
  field: string; // the field key to sort by (e.g. "name")
  label: string; // display text (e.g. "Name")
  currentSortBy: string; // currently active sort field
  currentSortDir: SortDir; // currently active sort direction
  basePath: string; // e.g. "/items"
  searchParams: Record<string, string | string[] | undefined>;
  className?: string;
};

export function SortHeader({
  field,
  label,
  currentSortBy,
  currentSortDir,
  basePath,
  searchParams,
  className = "",
}: Props) {
  const isActive = currentSortBy === field;
  const newDir = nextSortDir(currentSortBy, currentSortDir, field);

  const url = buildPaginationUrl(basePath, searchParams, {
    sort_by: field,
    sort_dir: newDir,
    page: 1, // reset to page 1 when changing sort
  });

  // Arrow indicator: ▲ for asc, ▼ for desc, nothing if not active
  const arrow = isActive ? (currentSortDir === "asc" ? " ▲" : " ▼") : "";

  return (
    <th className={`py-2 pr-4 font-semibold ${className}`}>
      <Link href={url} className="hover:text-blue-600 dark:hover:text-blue-400">
        {label}
        {arrow && (
          <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">
            {arrow}
          </span>
        )}
      </Link>
    </th>
  );
}
