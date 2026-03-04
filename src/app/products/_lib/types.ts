// =============================================================================
// types.ts — Product type definitions (like an Ecto Schema)
// =============================================================================
// TO ADD A FIELD: same steps as items/types.ts — see comments there.
// =============================================================================

/** The main data type — like an Ecto schema struct. */
export type Product = {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
};

export type FieldErrors = {
  [K in keyof Omit<Product, "id" | "createdAt">]?: string;
};

export type ActionState = {
  errors?: FieldErrors;
  values?: { name: string; description: string; status: string };
};
