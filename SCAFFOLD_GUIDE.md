# CRUD Scaffold Template Guide

This project includes a copy-paste CRUD scaffold modeled after Phoenix LiveView's `mix phx.gen.live`. The `src/app/items/` directory is the reference implementation — copy it and adapt it for any new resource.

## What You Get

Equivalent to running `mix phx.gen.live` in Phoenix:

| Route | File | Purpose |
|---|---|---|
| `/items` | `page.tsx` | Index — lists all records in a table |
| `/items/new` | `new/page.tsx` | New — form to create a record |
| `/items/:id` | `[id]/page.tsx` | Show — read-only detail view |
| `/items/:id/edit` | `[id]/edit/page.tsx` | Edit — form to update a record |

Features included:
- Server-side validation with inline field errors (like Phoenix changesets)
- Flash messages on create/update/delete (auto-dismiss)
- Delete with confirmation dialog
- 404 handling for missing records
- Dark mode support
- Shared form component between new and edit

## File Structure

```
src/app/items/
├── page.tsx                    # Index page (server component)
├── new/page.tsx                # New form page
├── [id]/page.tsx               # Show detail page
├── [id]/edit/page.tsx          # Edit form page
├── _components/
│   ├── item-form.tsx           # Shared form (new + edit)
│   ├── delete-button.tsx       # Delete with confirm
│   └── flash.tsx               # Flash message banner
└── _lib/
    ├── types.ts                # Type definitions + ActionState
    ├── store.ts                # Data layer (in-memory, swap for DB)
    ├── actions.ts              # Server actions (create, update, delete)
    └── validate.ts             # Validation rules
```

## How to Scaffold a New Resource

Example: creating a `Product` resource with fields `title`, `price`, `category`.

### Step 1: Copy the directory

```bash
cp -r src/app/items src/app/products
```

### Step 2: Define your type

Edit `_lib/types.ts`:

```ts
export type Product = {
  id: string;
  title: string;
  price: number;
  category: "electronics" | "clothing" | "food";
  createdAt: string;
};

export type FieldErrors = {
  [K in keyof Omit<Product, "id" | "createdAt">]?: string;
};

export type ActionState = {
  errors?: FieldErrors;
  values?: { title: string; price: string; category: string };
};
```

### Step 3: Update validation

Edit `_lib/validate.ts`:

```ts
import type { FieldErrors } from "./types";

const VALID_CATEGORIES = ["electronics", "clothing", "food"] as const;

export function validateProduct(formData: FormData) {
  const title = (formData.get("title") as string)?.trim() ?? "";
  const priceRaw = formData.get("price") as string;
  const price = Number.parseFloat(priceRaw);
  const category = formData.get("category") as string;

  const errors: FieldErrors = {};

  if (!title) errors.title = "can't be blank";
  if (Number.isNaN(price) || price < 0) errors.price = "must be a valid positive number";
  if (!VALID_CATEGORIES.includes(category as any)) errors.category = "is invalid";

  return {
    data: { title, price, category: category as "electronics" | "clothing" | "food" },
    errors,
  };
}
```

### Step 4: Update the store

Edit `_lib/store.ts` — rename `Item` to `Product`, update the seed data and field names. If using a real database (Prisma, Drizzle, etc.), replace the Map-based store with your ORM calls.

### Step 5: Update server actions

Edit `_lib/actions.ts` — change the import from `validateItem` to `validateProduct`, update `revalidatePath` calls from `/items` to `/products`, and update redirect paths + flash messages:

```ts
redirect("/products?flash=Product+created+successfully");
```

### Step 6: Update the form component

Edit `_components/item-form.tsx` — replace the form fields with your resource's fields:

```tsx
<label className="mb-3 block">
  <span className="mb-1 block text-sm font-medium">Title</span>
  <input name="title" defaultValue={title} className="..." />
  {state.errors?.title && <p className="mt-1 text-sm text-red-600">{state.errors.title}</p>}
</label>

<label className="mb-3 block">
  <span className="mb-1 block text-sm font-medium">Price</span>
  <input name="price" type="number" step="0.01" defaultValue={price} className="..." />
  {state.errors?.price && <p className="mt-1 text-sm text-red-600">{state.errors.price}</p>}
</label>

<label className="mb-4 block">
  <span className="mb-1 block text-sm font-medium">Category</span>
  <select name="category" defaultValue={category} className="...">
    <option value="electronics">Electronics</option>
    <option value="clothing">Clothing</option>
    <option value="food">Food</option>
  </select>
</label>
```

### Step 7: Update the index page table columns

Edit `page.tsx` — update the `<th>` headers and `<td>` cells to show your fields. Update links from `/items/` to `/products/`.

### Step 8: Update the show page

Edit `[id]/page.tsx` — update the `<dl>` fields to display your resource's data.

### Step 9: Update the pages

Do a find-and-replace across all page files:
- `Item` → `Product` (type imports)
- `/items` → `/products` (links and paths)
- `item` → `product` (variable names)
- Update page titles ("New Item" → "New Product", etc.)

### Step 10: Verify

```bash
npm run build
```

All four routes should appear in the build output:
```
├ ○ /products
├ ƒ /products/[id]
├ ƒ /products/[id]/edit
└ ○ /products/new
```

## Files You Don't Need to Touch

These components are generic and work as-is after copying:

- **`_components/flash.tsx`** — reads `?flash=` from the URL, no resource-specific logic
- **`_components/delete-button.tsx`** — just calls `deleteItem` (rename the import)

## Swapping the Data Layer

The `_lib/store.ts` uses an in-memory Map for prototyping. To use a real database:

1. Replace the store functions (`getAll`, `getById`, `create`, `update`, `remove`) with your ORM calls
2. Make them `async` if needed
3. Add `await` in the pages and actions that call them
4. The rest of the scaffold (validation, forms, flash) stays the same

## Phoenix Comparison

| Phoenix (LiveView) | This Scaffold (Next.js) |
|---|---|
| `mix phx.gen.live` | Copy `src/app/items/` |
| Router pipelines | App Router file conventions |
| LiveView modules | Server components (pages) |
| Changeset validation | `validate.ts` + `ActionState` |
| `Phoenix.Flash` | `flash.tsx` component |
| `core_components` form | `item-form.tsx` with `useActionState` |
| Ecto schema | `types.ts` |
| Context module | `store.ts` / your ORM layer |
| `handle_event` | Server actions (`actions.ts`) |
