import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "../_components/delete-button";
import { getById } from "../_lib/store";

export default async function ShowItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getById(id);
  if (!item) notFound();

  return (
    <main className="mx-auto max-w-lg p-8">
      <div className="mb-6">
        <Link
          href="/items"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          &larr; Back to items
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{item.name}</h1>
      </div>

      <dl className="mb-6 space-y-4 text-sm">
        <div>
          <dt className="font-medium text-gray-500 dark:text-gray-400">Name</dt>
          <dd className="mt-1">{item.name}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500 dark:text-gray-400">Description</dt>
          <dd className="mt-1">{item.description || "—"}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500 dark:text-gray-400">Status</dt>
          <dd className="mt-1">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                item.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {item.status}
            </span>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500 dark:text-gray-400">Created</dt>
          <dd className="mt-1">{new Date(item.createdAt).toLocaleString()}</dd>
        </div>
      </dl>

      <div className="flex gap-2">
        <Link
          href={`/items/${item.id}/edit`}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Edit
        </Link>
        <DeleteButton id={item.id} />
      </div>
    </main>
  );
}
