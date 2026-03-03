"use client";

import { useActionState } from "react";
import type { ActionState, Product } from "../_lib/types";

type Props = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  product?: Product;
  submitLabel: string;
};

const initialState: ActionState = {};

export function ProductForm({ action, product, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  // Use returned values (from validation failure) or fall back to product defaults
  const name = state.values?.name ?? product?.name ?? "";
  const description = state.values?.description ?? product?.description ?? "";
  const status = state.values?.status ?? product?.status ?? "active";

  return (
    <form action={formAction}>
      {product && <input type="hidden" name="id" value={product.id} />}

      <label className="mb-3 block">
        <span className="mb-1 block text-sm font-medium">Name</span>
        <input
          name="name"
          defaultValue={name}
          className={`w-full rounded border px-3 py-2 text-sm dark:bg-gray-800 ${
            state.errors?.name
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-gray-700"
          }`}
        />
        {state.errors?.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {state.errors.name}
          </p>
        )}
      </label>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm font-medium">Description</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={description}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
        {state.errors?.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {state.errors.description}
          </p>
        )}
      </label>

      <label className="mb-4 block">
        <span className="mb-1 block text-sm font-medium">Status</span>
        <select
          name="status"
          defaultValue={status}
          className={`w-full rounded border px-3 py-2 text-sm dark:bg-gray-800 ${
            state.errors?.status
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-gray-700"
          }`}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {state.errors?.status && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {state.errors.status}
          </p>
        )}
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
