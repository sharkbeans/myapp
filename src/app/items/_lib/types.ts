// =============================================================================
// types.ts — Item type definitions (like an Ecto Schema: lib/myapp/item.ex)
// =============================================================================
// Phoenix equivalent:
//   schema "items" do
//     field :name, :string
//     field :description, :string
//     field :status, :string, default: "active"
//     timestamps()
//   end
//
// TO ADD A FIELD:
//   1. Add it to the Item type
//   2. Add it to FieldErrors (if user-editable)
//   3. Add it to ActionState.values
//   4. Add validation in validate.ts
//   5. Add the form field in item-form.tsx
// =============================================================================

/** The main data type — like an Ecto schema struct. */
export type Item = {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
};

/** Field-level errors — like changeset.errors in Phoenix. */
export type FieldErrors = {
  [K in keyof Omit<Item, "id" | "createdAt">]?: string;
};

/** Form state passed between submissions — like changeset assigns in LiveView. */
export type ActionState = {
  errors?: FieldErrors;
  values?: { name: string; description: string; status: string };
};
