"use client";

import { deleteProduct } from "../_lib/actions";

export function DeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    if (confirm("Are you sure?")) {
      await deleteProduct(id);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
    >
      Delete
    </button>
  );
}
