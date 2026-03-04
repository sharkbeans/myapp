// =============================================================================
// validate.ts — Item validation (like changeset validations in Phoenix)
// =============================================================================
// Phoenix equivalent:
//   def changeset(item, attrs) do
//     item
//     |> cast(attrs, [:name, :description, :status])
//     |> validate_required([:name])
//     |> validate_inclusion(:status, ["active", "inactive"])
//   end
//
// TO ADD A VALIDATION:
//   1. Extract the field from formData
//   2. Add your if/else check
//   3. Set errors.fieldName = "error message"
//   4. Add the field to the returned data object
// =============================================================================

import type { FieldErrors } from "./types";

const VALID_STATUSES = ["active", "inactive"] as const;

export function validateItem(formData: FormData): {
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
