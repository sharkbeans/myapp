// =============================================================================
// item-form.tsx — Shared form component (like Phoenix's form_component.ex)
// =============================================================================
// Used by BOTH new/page.tsx and [id]/edit/page.tsx.
// This is a CLIENT component because it uses useActionState for form state.
//
// Phoenix equivalent:
//   defmodule MyappWeb.ItemLive.FormComponent do
//     use MyappWeb, :live_component
//     ...renders a form with changeset-driven errors
//   end
//
// HOW IT WORKS:
//   - Takes an "action" (server action function) and optional "item" (for editing)
//   - useActionState handles the form submission + error state cycle
//   - On validation error, the server action returns { errors, values }
//   - The form re-renders with error messages and the user's input preserved
//
// TO ADD A FIELD:
//   1. Add the field to types.ts
//   2. Add validation in validate.ts
//   3. Add the form field below (copy an existing <label> block)
// =============================================================================

"use client";

import { useActionState } from "react";
import type { ActionState, Item } from "../_lib/types";

type Props = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  item?: Item; // passed when editing, undefined when creating
  submitLabel: string; // "Create Item" or "Save Changes"
};

const initialState: ActionState = {};

export function ItemForm({ action, item, submitLabel }: Props) {
  // useActionState manages the form state cycle:
  //   submit → server action → returns new state → re-render
  // Phoenix equivalent: the assign/changeset cycle in a LiveView form
  const [state, formAction, pending] = useActionState(action, initialState);

  // Use returned values (from validation failure) or fall back to item defaults
  const name = state.values?.name ?? item?.name ?? "";
  const description = state.values?.description ?? item?.description ?? "";
  const status = state.values?.status ?? item?.status ?? "active";

  return (
    <form action={formAction}>
      {/* Hidden ID field for edits — like a hidden_input in Phoenix forms */}
      {item && <input type="hidden" name="id" value={item.id} />}

      {/* Name field */}
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
        {/* Inline error — like <.error> in Phoenix core_components */}
        {state.errors?.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {state.errors.name}
          </p>
        )}
      </label>

      {/* Description field */}
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

      {/* Status field */}
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

      {/* Submit button */}
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
