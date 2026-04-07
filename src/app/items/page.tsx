// =============================================================================
// Items Index Page — Lists all items with pagination, search, sort, per_page
// =============================================================================
// This is a SERVER component (no "use client"). It reads URL search params
// and passes them to the shared building blocks.
//
// Phoenix equivalent:
//   def index(conn, params) do
//     items = Items.list_items()
//     |> filter_by_search(params["q"])
//     |> sort_by(params["sort_by"], params["sort_dir"])
//     |> Repo.paginate(page: params["page"], page_size: params["per_page"])
//     render(conn, :index, items: items)
//   end
//
// URL params supported:
//   ?page=2&per_page=10&q=keyboard&sort_by=name&sort_dir=asc
// =============================================================================

import Link from "next/link";
import { Suspense } from "react";
import { Pagination } from "../_components/pagination";
import { PerPage } from "../_components/per-page";
import { SearchBox } from "../_components/search-box";
import { SortHeader } from "../_components/sort-header";
import { paginate, parsePaginationParams } from "../_lib/pagination";
import { filterBySearch, parseSearchParam } from "../_lib/search";
import { parseSortParams, sortItems } from "../_lib/sorting";
import { DeleteButton } from "./_components/delete-button";
// --- Shared building-block components (copy-paste friendly) ------------------
import { Flash } from "./_components/flash";
// --- Shared logic (the "backend" pipeline) -----------------------------------
import { getAll } from "./_lib/store";
import type { Item } from "./_lib/types";

// --- Sortable fields for this resource ---------------------------------------
// Add or remove fields here to control which columns are sortable.
// Phoenix equivalent: the allowed sort fields in your controller.
const SORTABLE_FIELDS = ["name", "description", "status", "createdAt"];

// --- Searchable fields for this resource -------------------------------------
// Which fields to search when the user types in the search box.
// Phoenix equivalent: the fields in your WHERE ilike() clause.
const SEARCHABLE_FIELDS: (keyof Item)[] = ["name", "description"];

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // In Next.js 15+, searchParams is a Promise — await it.
  const params = await searchParams;

  // --- 1. Get all items from the store (Phoenix: Items.list_items()) ---------
  const allItems = await getAll();

  // --- 2. Filter by search query (Phoenix: WHERE ilike(...)) -----------------
  const query = parseSearchParam(params);
  const filtered = filterBySearch(allItems, query, SEARCHABLE_FIELDS);

  // --- 3. Sort (Phoenix: ORDER BY) -------------------------------------------
  const sortParams = parseSortParams(params, "name", SORTABLE_FIELDS);
  const sorted = sortItems(filtered, sortParams);

  // --- 4. Paginate (Phoenix: Repo.paginate()) --------------------------------
  const paginationParams = parsePaginationParams(params);
  const result = paginate(sorted, paginationParams);

  return (
    <main className="mx-auto max-w-5xl p-8">
      {/* Flash messages — like Phoenix's put_flash(:info, "...") */}
      <Suspense>
        <Flash />
      </Suspense>

      {/* Page header + "New" button */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Items</h1>
        <Link
          href="/items/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + New
        </Link>
      </div>

      {/* Toolbar: search + per_page selector */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <SearchBox basePath="/items" searchParams={params} />
        <PerPage
          basePath="/items"
          searchParams={params}
          currentPerPage={result.per_page}
        />
      </div>

      {/* Data table with sortable headers */}
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-700">
            {/* Each SortHeader is clickable — toggles sort on that column */}
            <SortHeader
              field="name"
              label="Name"
              currentSortBy={sortParams.sort_by}
              currentSortDir={sortParams.sort_dir}
              basePath="/items"
              searchParams={params}
            />
            <SortHeader
              field="description"
              label="Description"
              currentSortBy={sortParams.sort_by}
              currentSortDir={sortParams.sort_dir}
              basePath="/items"
              searchParams={params}
            />
            <SortHeader
              field="status"
              label="Status"
              currentSortBy={sortParams.sort_by}
              currentSortDir={sortParams.sort_dir}
              basePath="/items"
              searchParams={params}
            />
            <SortHeader
              field="createdAt"
              label="Created"
              currentSortBy={sortParams.sort_by}
              currentSortDir={sortParams.sort_dir}
              basePath="/items"
              searchParams={params}
            />
            <th className="py-2 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Loop over paginated items — like :for={item <- @items} in HEEx */}
          {result.data.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 dark:border-gray-800"
            >
              <td className="py-2 pr-4">{item.name}</td>
              <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">
                {item.description}
              </td>
              <td className="py-2 pr-4">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="py-2 pr-4 text-gray-500 dark:text-gray-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
              <td className="py-2">
                <div className="flex gap-2">
                  <Link
                    href={`/items/${item.id}`}
                    className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    Show
                  </Link>
                  <Link
                    href={`/items/${item.id}/edit`}
                    className="rounded border border-blue-300 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={item.id} />
                </div>
              </td>
            </tr>
          ))}
          {/* Empty state */}
          {result.data.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-gray-500">
                {query
                  ? `No items matching "${query}".`
                  : 'No items yet. Click "+ New" to add one.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      <Pagination result={result} basePath="/items" searchParams={params} />
    </main>
  );
}
