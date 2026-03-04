// =============================================================================
// Home Page — The root "/" route
// =============================================================================
// Phoenix equivalent: PageController :home action + home.html.heex
//
// This is a simple landing page. The topbar (in layout.tsx) provides
// navigation to /items and /products.
// =============================================================================

import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-4 text-3xl font-bold">Welcome to MyApp</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        A Next.js CRUD scaffold modeled after Phoenix&apos;s{" "}
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">
          mix phx.gen.html
        </code>
        . Each resource has full CRUD with pagination, search, sorting, and
        per-page controls.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/items"
          className="rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
        >
          <h2 className="mb-1 text-lg font-semibold">Items &rarr;</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage items with full CRUD, pagination, search, and sorting.
          </p>
        </Link>

        <Link
          href="/products"
          className="rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
        >
          <h2 className="mb-1 text-lg font-semibold">Products &rarr;</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage products with full CRUD, pagination, search, and sorting.
          </p>
        </Link>
      </div>
    </main>
  );
}
