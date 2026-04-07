// =============================================================================
// store.ts — Products data layer (like a Phoenix Context: lib/myapp/products.ex)
// =============================================================================
// This template prefers Neon/Postgres when DATABASE_URL is configured, while
// keeping an in-memory fallback so the repo still works before secrets are set.
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

import { getSql, hasDatabaseUrl, query, toIsoString } from "@/lib/neon";
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

let databaseSetupPromise: Promise<void> | null = null;

// --- CRUD functions ----------------------------------------------------------
// Each function maps 1:1 to a Phoenix context function.

type ProductRow = {
  id: string;
  name: string;
  description: string;
  status: Product["status"];
  created_at: string | Date;
};

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    createdAt: toIsoString(row.created_at),
  };
}

async function ensureProductsTable(): Promise<void> {
  if (!hasDatabaseUrl()) return;

  if (!databaseSetupPromise) {
    databaseSetupPromise = (async () => {
      const sql = getSql();

      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id text PRIMARY KEY,
          name text NOT NULL,
          description text NOT NULL DEFAULT '',
          status text NOT NULL CHECK (status IN ('active', 'inactive')),
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `;

      const result = await query<{ count: number }>`
        SELECT COUNT(*)::int AS count FROM products
      `;

      if (result[0]?.count === 0) {
        for (const product of seed) {
          await sql`
            INSERT INTO products (id, name, description, status, created_at)
            VALUES (${product.id}, ${product.name}, ${product.description}, ${product.status}, ${product.createdAt}::timestamptz)
          `;
        }
      }
    })();
  }

  await databaseSetupPromise;
}

/** List all products. Phoenix: Products.list_products() */
export async function getAll(): Promise<Product[]> {
  if (hasDatabaseUrl()) {
    await ensureProductsTable();
    const rows = await query<ProductRow>`
      SELECT id, name, description, status, created_at
      FROM products
      ORDER BY created_at DESC, id DESC
    `;

    return rows.map(mapProductRow);
  }

  return Array.from(products.values());
}

/** Get one product by id. Phoenix: Products.get_product!(id) */
export async function getById(id: string): Promise<Product | undefined> {
  if (hasDatabaseUrl()) {
    await ensureProductsTable();
    const rows = await query<ProductRow>`
      SELECT id, name, description, status, created_at
      FROM products
      WHERE id = ${id}
      LIMIT 1
    `;

    return rows[0] ? mapProductRow(rows[0]) : undefined;
  }

  return products.get(id);
}

/** Create a new product. Phoenix: Products.create_product(attrs) */
export async function create(
  data: Omit<Product, "id" | "createdAt">,
): Promise<Product> {
  if (hasDatabaseUrl()) {
    await ensureProductsTable();
    const id = crypto.randomUUID();
    const rows = await query<ProductRow>`
      INSERT INTO products (id, name, description, status)
      VALUES (${id}, ${data.name}, ${data.description}, ${data.status})
      RETURNING id, name, description, status, created_at
    `;

    return mapProductRow(rows[0]);
  }

  const nextId = String(products.size + 1);
  const product: Product = {
    ...data,
    id: nextId,
    createdAt: new Date().toISOString(),
  };
  products.set(product.id, product);
  return product;
}

/** Update an existing product. Phoenix: Products.update_product(product, attrs) */
export async function update(
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt">>,
): Promise<Product | undefined> {
  if (hasDatabaseUrl()) {
    await ensureProductsTable();
    const existing = await getById(id);

    if (!existing) return undefined;

    const rows = await query<ProductRow>`
      UPDATE products
      SET
        name = ${data.name ?? existing.name},
        description = ${data.description ?? existing.description},
        status = ${data.status ?? existing.status}
      WHERE id = ${id}
      RETURNING id, name, description, status, created_at
    `;

    return rows[0] ? mapProductRow(rows[0]) : undefined;
  }

  const existing = products.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...data };
  products.set(id, updated);
  return updated;
}

/** Delete a product. Phoenix: Products.delete_product(product) */
export async function remove(id: string): Promise<boolean> {
  if (hasDatabaseUrl()) {
    await ensureProductsTable();
    const rows = await query<{ id: string }>`
      DELETE FROM products
      WHERE id = ${id}
      RETURNING id
    `;

    return rows.length > 0;
  }

  return products.delete(id);
}
