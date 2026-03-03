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
