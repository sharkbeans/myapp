// =============================================================================
// Edit Item Page — Phoenix: :edit action + edit.html.heex
// =============================================================================
// Loads the existing item, passes it to ItemForm for editing.
// =============================================================================

import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemForm } from "../../_components/item-form";
import { updateItem } from "../../_lib/actions";
import { getById } from "../../_lib/store";

export default async function EditItemPage({
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
        <h1 className="mt-2 text-2xl font-bold">Edit Item</h1>
      </div>

      <ItemForm action={updateItem} item={item} submitLabel="Save Changes" />
    </main>
  );
}
