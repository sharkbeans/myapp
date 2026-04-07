// =============================================================================
// actions.ts — Product server actions (like Phoenix controller actions)
// =============================================================================
// Same pattern as items/actions.ts — see comments there for details.
// createProduct → ProductController.create/2
// updateProduct → ProductController.update/2
// deleteProduct → ProductController.delete/2
// =============================================================================

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as store from "./store";
import type { ActionState } from "./types";
import { validateProduct } from "./validate";

export async function createProduct(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { data, errors } = validateProduct(formData);

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
  revalidatePath("/products");
  redirect("/products?flash=Product+created+successfully");
}

export async function updateProduct(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id") as string;
  const { data, errors } = validateProduct(formData);

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
  revalidatePath("/products");
  redirect("/products?flash=Product+updated+successfully");
}

export async function deleteProduct(id: string): Promise<void> {
  await store.remove(id);
  revalidatePath("/products");
  redirect("/products?flash=Product+deleted+successfully");
}
