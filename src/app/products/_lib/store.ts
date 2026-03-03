import type { Product } from "./types";

const products = new Map<string, Product>();

// Seed data
const seed: Product[] = [
  {
    id: "1",
    name: "First Product",
    description: "This is the first product",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Second Product",
    description: "This is the second product",
    status: "inactive",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Third Product",
    description: "This is the third product",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

for (const product of seed) {
  products.set(product.id, product);
}

let nextId = 4;

export function getAll(): Product[] {
  return Array.from(products.values());
}

export function getById(id: string): Product | undefined {
  return products.get(id);
}

export function create(data: Omit<Product, "id" | "createdAt">): Product {
  const product: Product = {
    ...data,
    id: String(nextId++),
    createdAt: new Date().toISOString(),
  };
  products.set(product.id, product);
  return product;
}

export function update(
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt">>,
): Product | undefined {
  const existing = products.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...data };
  products.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return products.delete(id);
}
