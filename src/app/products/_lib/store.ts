// =============================================================================
// store.ts — Products data layer (like a Phoenix Context: lib/myapp/products.ex)
// =============================================================================
// This is an IN-MEMORY store for prototyping. In production, swap these
// functions for real database calls (Prisma, Drizzle, etc.).
//
// Phoenix equivalent context module:
//   defmodule Myapp.Products do
//     def list_products, do: Repo.all(Product)
//     def get_product!(id), do: Repo.get!(Product, id)
//     def create_product(attrs), do: %Product{} |> Product.changeset(attrs) |> Repo.insert()
//     ...
//   end
//
// TO SWAP FOR A REAL DATABASE:
//   1. Replace each function body with your ORM call
//   2. Make them async if needed
//   3. Add await in pages/actions that call them
//   4. Everything else (validation, forms, flash) stays the same
// =============================================================================

import type { Product } from "./types";

// --- In-memory store ---------------------------------------------------------
const products = new Map<string, Product>();

// Seed data — 15 products so pagination is visible
const seed: Product[] = [
  {
    id: "1",
    name: "Ergonomic Chair",
    description: "Mesh back with lumbar support",
    status: "active",
    createdAt: "2025-01-10T10:00:00.000Z",
  },
  {
    id: "2",
    name: "Standing Desk",
    description: "Electric sit-stand desk 60x30",
    status: "active",
    createdAt: "2025-01-15T11:00:00.000Z",
  },
  {
    id: "3",
    name: 'Monitor 27"',
    description: "4K IPS 27-inch display",
    status: "active",
    createdAt: "2025-01-20T09:00:00.000Z",
  },
  {
    id: "4",
    name: "Docking Station",
    description: "Thunderbolt 4 dock with 3 displays",
    status: "inactive",
    createdAt: "2025-02-01T14:00:00.000Z",
  },
  {
    id: "5",
    name: "Mesh Wifi Router",
    description: "Tri-band mesh system 3-pack",
    status: "active",
    createdAt: "2025-02-10T08:00:00.000Z",
  },
  {
    id: "6",
    name: "Noise Machine",
    description: "White noise sleep machine",
    status: "active",
    createdAt: "2025-02-20T12:00:00.000Z",
  },
  {
    id: "7",
    name: "Desk Drawer Unit",
    description: "3-drawer mobile pedestal",
    status: "inactive",
    createdAt: "2025-03-01T15:00:00.000Z",
  },
  {
    id: "8",
    name: "Task Light",
    description: "LED architect task lamp",
    status: "active",
    createdAt: "2025-03-10T10:00:00.000Z",
  },
  {
    id: "9",
    name: "Wrist Rest",
    description: "Memory foam keyboard wrist rest",
    status: "active",
    createdAt: "2025-03-20T11:00:00.000Z",
  },
  {
    id: "10",
    name: "Cable Tray",
    description: "Under-desk cable management tray",
    status: "active",
    createdAt: "2025-04-01T09:00:00.000Z",
  },
  {
    id: "11",
    name: "Privacy Screen",
    description: "14-inch laptop privacy filter",
    status: "inactive",
    createdAt: "2025-04-10T13:00:00.000Z",
  },
  {
    id: "12",
    name: "Portable Charger",
    description: "20000mAh USB-C power bank",
    status: "active",
    createdAt: "2025-04-20T10:00:00.000Z",
  },
  {
    id: "13",
    name: "Desk Fan",
    description: "USB-powered quiet desk fan",
    status: "active",
    createdAt: "2025-05-01T14:00:00.000Z",
  },
  {
    id: "14",
    name: "Document Holder",
    description: "Adjustable document/tablet stand",
    status: "inactive",
    createdAt: "2025-05-10T08:00:00.000Z",
  },
  {
    id: "15",
    name: "Anti-Fatigue Mat",
    description: "Standing desk comfort mat",
    status: "active",
    createdAt: "2025-05-20T12:00:00.000Z",
  },
];

for (const product of seed) {
  products.set(product.id, product);
}

let nextId = 16;

// --- CRUD functions ----------------------------------------------------------
// Each function maps 1:1 to a Phoenix context function.

/** List all products. Phoenix: Products.list_products() */
export function getAll(): Product[] {
  return Array.from(products.values());
}

/** Get one product by id. Phoenix: Products.get_product!(id) */
export function getById(id: string): Product | undefined {
  return products.get(id);
}

/** Create a new product. Phoenix: Products.create_product(attrs) */
export function create(data: Omit<Product, "id" | "createdAt">): Product {
  const product: Product = {
    ...data,
    id: String(nextId++),
    createdAt: new Date().toISOString(),
  };
  products.set(product.id, product);
  return product;
}

/** Update an existing product. Phoenix: Products.update_product(product, attrs) */
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

/** Delete a product. Phoenix: Products.delete_product(product) */
export function remove(id: string): boolean {
  return products.delete(id);
}
