// =============================================================================
// validate.ts — Product validation (like changeset validations in Phoenix)
// =============================================================================
// Same pattern as items/validate.ts — see comments there for details.
// =============================================================================

import type { FieldErrors } from "./types";

const VALID_STATUSES = ["active", "inactive"] as const;

export function validateProduct(formData: FormData): {
  data: { name: string; description: string; status: "active" | "inactive" };
  errors: FieldErrors;
} {
  const name = (formData.get("name") as string)?.trim() ?? "";
  const description = (formData.get("description") as string)?.trim() ?? "";
  const status = formData.get("status") as string;

  const errors: FieldErrors = {};

  if (!name) {
    errors.name = "can't be blank";
  }

  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    errors.status = "is invalid";
  }

  return {
    data: {
      name,
      description,
      status: (status as "active" | "inactive") ?? "active",
    },
    errors,
  };
}
