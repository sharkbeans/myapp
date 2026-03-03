import type { Item } from "./types";

const items = new Map<string, Item>();

// Seed data
const seed: Item[] = [
  {
    id: "1",
    name: "First Item",
    description: "This is the first item",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Second Item",
    description: "This is the second item",
    status: "inactive",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Third Item",
    description: "This is the third item",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

for (const item of seed) {
  items.set(item.id, item);
}

let nextId = 4;

export function getAll(): Item[] {
  return Array.from(items.values());
}

export function getById(id: string): Item | undefined {
  return items.get(id);
}

export function create(data: Omit<Item, "id" | "createdAt">): Item {
  const item: Item = {
    ...data,
    id: String(nextId++),
    createdAt: new Date().toISOString(),
  };
  items.set(item.id, item);
  return item;
}

export function update(
  id: string,
  data: Partial<Omit<Item, "id" | "createdAt">>,
): Item | undefined {
  const existing = items.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...data };
  items.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return items.delete(id);
}
