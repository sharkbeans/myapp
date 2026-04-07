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
      <h1 className="mb-4 text-3xl font-bold">CRUD Template for New Apps</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Clone this repo when you want a clean Next.js starting point with
        working CRUD flows, search, sorting, pagination, and form handling
        already wired up. The example resources are meant to be copied, renamed,
        and replaced with your own domain models.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/items"
          className="rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
        >
          <h2 className="mb-1 text-lg font-semibold">Items &rarr;</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Reference scaffold with shared building blocks and detailed guide
            comments.
          </p>
        </Link>

        <Link
          href="/products"
          className="rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
        >
          <h2 className="mb-1 text-lg font-semibold">Products &rarr;</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A second example showing how the scaffold looks after adapting it to
            a different resource.
          </p>
        </Link>
      </div>
    </main>
  );
}
