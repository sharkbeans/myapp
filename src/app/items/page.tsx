import Link from "next/link";
import { Suspense } from "react";
import { Flash } from "./_components/flash";
import { DeleteButton } from "./_components/delete-button";
import { getAll } from "./_lib/store";

export default function ItemsPage() {
  const items = getAll();

  return (
    <main className="mx-auto max-w-4xl p-8">
      <Suspense>
        <Flash />
      </Suspense>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Items</h1>
        <Link
          href="/items/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + New
        </Link>
      </div>

      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-700">
            <th className="py-2 pr-4 font-semibold">Name</th>
            <th className="py-2 pr-4 font-semibold">Description</th>
            <th className="py-2 pr-4 font-semibold">Status</th>
            <th className="py-2 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 dark:border-gray-800"
            >
              <td className="py-2 pr-4">{item.name}</td>
              <td className="py-2 pr-4">{item.description}</td>
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
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-gray-500">
                No items yet. Click &quot;+ New&quot; to add one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
