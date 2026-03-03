import Link from "next/link";
import { ItemForm } from "../_components/item-form";
import { createItem } from "../_lib/actions";

export default function NewItemPage() {
  return (
    <main className="mx-auto max-w-lg p-8">
      <div className="mb-6">
        <Link
          href="/items"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          &larr; Back to items
        </Link>
        <h1 className="mt-2 text-2xl font-bold">New Item</h1>
      </div>

      <ItemForm action={createItem} submitLabel="Create Item" />
    </main>
  );
}
