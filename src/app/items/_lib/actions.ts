"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ActionState } from "./types";
import * as store from "./store";
import { validateItem } from "./validate";

export async function createItem(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { data, errors } = validateItem(formData);

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: { name: data.name, description: data.description, status: data.status },
    };
  }

  store.create(data);
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
      values: { name: data.name, description: data.description, status: data.status },
    };
  }

  store.update(id, data);
  revalidatePath("/items");
  redirect("/items?flash=Item+updated+successfully");
}

export async function deleteItem(id: string): Promise<void> {
  store.remove(id);
  revalidatePath("/items");
  redirect("/items?flash=Item+deleted+successfully");
}
