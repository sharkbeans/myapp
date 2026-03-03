"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ActionState } from "./types";
import * as store from "./store";
import { validateProduct } from "./validate";

export async function createProduct(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { data, errors } = validateProduct(formData);

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: { name: data.name, description: data.description, status: data.status },
    };
  }

  store.create(data);
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
      values: { name: data.name, description: data.description, status: data.status },
    };
  }

  store.update(id, data);
  revalidatePath("/products");
  redirect("/products?flash=Product+updated+successfully");
}

export async function deleteProduct(id: string): Promise<void> {
  store.remove(id);
  revalidatePath("/products");
  redirect("/products?flash=Product+deleted+successfully");
}
