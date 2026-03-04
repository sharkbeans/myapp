// =============================================================================
// per-page.tsx — Per-page selector dropdown
// =============================================================================
// Lets the user choose how many items to show per page (5, 10, 25, 50).
// This is a CLIENT component because it uses onChange to navigate.
//
// Phoenix equivalent:
//   A <select> in your index template that submits a form or uses JS to change the URL.
//
// USAGE (in any index page):
//   import { PerPage } from "@/app/_components/per-page";
//   <PerPage basePath="/items" searchParams={searchParams} currentPerPage={10} />
//
// COPY-PASTE: Just change basePath.
// =============================================================================

"use client";

import { useRouter } from "next/navigation";
import { buildPaginationUrl, PER_PAGE_OPTIONS } from "../_lib/pagination";

type Props = {
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
  currentPerPage: number;
};

export function PerPage({ basePath, searchParams, currentPerPage }: Props) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newPerPage = Number.parseInt(e.target.value, 10);
    // Reset to page 1 when changing per_page (like Phoenix would)
    const url = buildPaginationUrl(basePath, searchParams, {
      per_page: newPerPage,
      page: 1,
    });
    router.push(url);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      Show
      <select
        value={currentPerPage}
        onChange={handleChange}
        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
      >
        {PER_PAGE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      per page
    </label>
  );
}
