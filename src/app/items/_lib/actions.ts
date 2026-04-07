// =============================================================================
// actions.ts — Item server actions (like Phoenix controller actions)
// =============================================================================
// "use server" means these run on the server (like controller actions).
//
// Phoenix equivalent mapping:
//   createItem  → ItemController.create/2
//   updateItem  → ItemController.update/2
//   deleteItem  → ItemController.delete/2
//
// PATTERN:
//   1. Validate (like changeset)
//   2. If errors → return { errors, values } (re-renders form)
//   3. If valid → store.create/update/remove + redirect with flash
// =============================================================================

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as store from "./store";
import type { ActionState } from "./types";
import { validateItem } from "./validate";

export async function createItem(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { data, errors } = validateItem(formData);

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: {
        name: data.name,
        description: data.description,
        status: data.status,
      },
    };
  }

  await store.create(data);
  revalidatePath("/items");
  redirect("/items?flash=Item+created+successfully");
}

export async function updateItem(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id") as string;
  const { data, errors } = validateItem(formData);

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: {
        name: data.name,
        description: data.description,
        status: data.status,
      },
    };
  }

  await store.update(id, data);
  revalidatePath("/items");
  redirect("/items?flash=Item+updated+successfully");
}

export async function deleteItem(id: string): Promise<void> {
  await store.remove(id);
  revalidatePath("/items");
  redirect("/items?flash=Item+deleted+successfully");
}
