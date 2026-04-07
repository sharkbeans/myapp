// =============================================================================
// store.ts — Items data layer (like a Phoenix Context: lib/myapp/items.ex)
// =============================================================================
// This template prefers Neon/Postgres when DATABASE_URL is configured, while
// keeping an in-memory fallback so the repo still works before secrets are set.
//
// Phoenix equivalent context module:
//   defmodule Myapp.Items do
//     def list_items, do: Repo.all(Item)
//     def get_item!(id), do: Repo.get!(Item, id)
//     def create_item(attrs), do: %Item{} |> Item.changeset(attrs) |> Repo.insert()
//     def update_item(item, attrs), do: item |> Item.changeset(attrs) |> Repo.update()
//     def delete_item(item), do: Repo.delete(item)
//   end
//
// TO SWAP FOR A REAL DATABASE:
//   1. Replace each function body with your ORM call
//   2. Make them async if needed
//   3. Add await in pages/actions that call them
//   4. Everything else (validation, forms, flash) stays the same
// =============================================================================

import { getSql, hasDatabaseUrl, query, toIsoString } from "@/lib/neon";
import type { Item } from "./types";

// --- In-memory store ---------------------------------------------------------
const items = new Map<string, Item>();

// Seed data — 15 items so pagination is visible with per_page=5 or per_page=10
const seed: Item[] = [
  {
    id: "1",
    name: "Laptop Stand",
    description: "Adjustable aluminum stand",
    status: "active",
    createdAt: "2025-01-15T10:00:00.000Z",
  },
  {
    id: "2",
    name: "USB-C Hub",
    description: "7-port USB-C hub with HDMI",
    status: "active",
    createdAt: "2025-01-20T11:00:00.000Z",
  },
  {
    id: "3",
    name: "Mechanical Keyboard",
    description: "Cherry MX Blue switches",
    status: "active",
    createdAt: "2025-02-01T09:00:00.000Z",
  },
  {
    id: "4",
    name: "Monitor Arm",
    description: "Gas spring single monitor arm",
    status: "inactive",
    createdAt: "2025-02-10T14:00:00.000Z",
  },
  {
    id: "5",
    name: "Webcam",
    description: "1080p HD webcam with mic",
    status: "active",
    createdAt: "2025-02-15T08:00:00.000Z",
  },
  {
    id: "6",
    name: "Desk Mat",
    description: "Large extended mouse pad",
    status: "active",
    createdAt: "2025-03-01T12:00:00.000Z",
  },
  {
    id: "7",
    name: "Cable Organizer",
    description: "Silicone cable clips set of 10",
    status: "inactive",
    createdAt: "2025-03-10T15:00:00.000Z",
  },
  {
    id: "8",
    name: "LED Desk Lamp",
    description: "Dimmable LED with USB charging",
    status: "active",
    createdAt: "2025-03-20T10:00:00.000Z",
  },
  {
    id: "9",
    name: "Noise Canceling Headphones",
    description: "Over-ear ANC headphones",
    status: "active",
    createdAt: "2025-04-01T11:00:00.000Z",
  },
  {
    id: "10",
    name: "Wireless Mouse",
    description: "Ergonomic vertical mouse",
    status: "active",
    createdAt: "2025-04-10T09:00:00.000Z",
  },
  {
    id: "11",
    name: "Laptop Sleeve",
    description: "14-inch neoprene sleeve",
    status: "inactive",
    createdAt: "2025-04-20T13:00:00.000Z",
  },
  {
    id: "12",
    name: "Power Strip",
    description: "6-outlet surge protector",
    status: "active",
    createdAt: "2025-05-01T10:00:00.000Z",
  },
  {
    id: "13",
    name: "Whiteboard",
    description: "Magnetic dry-erase 24x36",
    status: "active",
    createdAt: "2025-05-10T14:00:00.000Z",
  },
  {
    id: "14",
    name: "Footrest",
    description: "Adjustable under-desk footrest",
    status: "inactive",
    createdAt: "2025-05-20T08:00:00.000Z",
  },
  {
    id: "15",
    name: "Desk Shelf Riser",
    description: "Bamboo monitor riser with storage",
    status: "active",
    createdAt: "2025-06-01T12:00:00.000Z",
  },
];

for (const item of seed) {
  items.set(item.id, item);
}

let databaseSetupPromise: Promise<void> | null = null;

// --- CRUD functions ----------------------------------------------------------
// Each function maps 1:1 to a Phoenix context function.

type ItemRow = {
  id: string;
  name: string;
  description: string;
  status: Item["status"];
  created_at: string | Date;
};

function mapItemRow(row: ItemRow): Item {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    createdAt: toIsoString(row.created_at),
  };
}

async function ensureItemsTable(): Promise<void> {
  if (!hasDatabaseUrl()) return;

  if (!databaseSetupPromise) {
    databaseSetupPromise = (async () => {
      const sql = getSql();

      await sql`
        CREATE TABLE IF NOT EXISTS items (
          id text PRIMARY KEY,
          name text NOT NULL,
          description text NOT NULL DEFAULT '',
          status text NOT NULL CHECK (status IN ('active', 'inactive')),
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `;

      const result = await query<{ count: number }>`
        SELECT COUNT(*)::int AS count FROM items
      `;

      if (result[0]?.count === 0) {
        for (const item of seed) {
          await sql`
            INSERT INTO items (id, name, description, status, created_at)
            VALUES (${item.id}, ${item.name}, ${item.description}, ${item.status}, ${item.createdAt}::timestamptz)
          `;
        }
      }
    })();
  }

  await databaseSetupPromise;
}

/** List all items. Phoenix: Items.list_items() */
export async function getAll(): Promise<Item[]> {
  if (hasDatabaseUrl()) {
    await ensureItemsTable();
    const rows = await query<ItemRow>`
      SELECT id, name, description, status, created_at
      FROM items
      ORDER BY created_at DESC, id DESC
    `;

    return rows.map(mapItemRow);
  }

  return Array.from(items.values());
}

/** Get one item by id. Phoenix: Items.get_item!(id) */
export async function getById(id: string): Promise<Item | undefined> {
  if (hasDatabaseUrl()) {
    await ensureItemsTable();
    const rows = await query<ItemRow>`
      SELECT id, name, description, status, created_at
      FROM items
      WHERE id = ${id}
      LIMIT 1
    `;

    return rows[0] ? mapItemRow(rows[0]) : undefined;
  }

  return items.get(id);
}

/** Create a new item. Phoenix: Items.create_item(attrs) */
export async function create(
  data: Omit<Item, "id" | "createdAt">,
): Promise<Item> {
  if (hasDatabaseUrl()) {
    await ensureItemsTable();
    const id = crypto.randomUUID();
    const rows = await query<ItemRow>`
      INSERT INTO items (id, name, description, status)
      VALUES (${id}, ${data.name}, ${data.description}, ${data.status})
      RETURNING id, name, description, status, created_at
    `;

    return mapItemRow(rows[0]);
  }

  const nextId = String(items.size + 1);
  const item: Item = {
    ...data,
    id: nextId,
    createdAt: new Date().toISOString(),
  };
  items.set(item.id, item);
  return item;
}

/** Update an existing item. Phoenix: Items.update_item(item, attrs) */
export async function update(
  id: string,
  data: Partial<Omit<Item, "id" | "createdAt">>,
): Promise<Item | undefined> {
  if (hasDatabaseUrl()) {
    await ensureItemsTable();
    const existing = await getById(id);

    if (!existing) return undefined;

    const rows = await query<ItemRow>`
      UPDATE items
      SET
        name = ${data.name ?? existing.name},
        description = ${data.description ?? existing.description},
        status = ${data.status ?? existing.status}
      WHERE id = ${id}
      RETURNING id, name, description, status, created_at
    `;

    return rows[0] ? mapItemRow(rows[0]) : undefined;
  }

  const existing = items.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...data };
  items.set(id, updated);
  return updated;
}

/** Delete an item. Phoenix: Items.delete_item(item) */
export async function remove(id: string): Promise<boolean> {
  if (hasDatabaseUrl()) {
    await ensureItemsTable();
    const rows = await query<{ id: string }>`
      DELETE FROM items
      WHERE id = ${id}
      RETURNING id
    `;

    return rows.length > 0;
  }

  return items.delete(id);
}
